import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useResources } from "@/hooks/useResources";
import {
  RESOURCE_CATEGORIES,
  RESOURCE_TYPES,
  RESOURCE_TYPE_LABEL,
  RESOURCE_TYPE_BADGE,
  type Resource,
} from "@/config/resources";
import { getLabel } from "@/utils/labelMap";
import ResourceEditor from "./ResourceEditor";
import { toast } from "sonner";

type SortKey = "name" | "category" | "priority";

const ResourceManager = () => {
  const { resources, addResource, updateResource, removeResource, resetToDefaults } =
    useResources();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("priority");
  const [editing, setEditing] = useState<Resource | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Resource | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return resources
      .filter((r) => categoryFilter === "all" || r.category === categoryFilter)
      .filter((r) => typeFilter === "all" || r.type === typeFilter)
      .filter(
        (r) =>
          !q ||
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        if (sortKey === "name") return a.name.localeCompare(b.name);
        if (sortKey === "category") return a.category.localeCompare(b.category);
        return b.priority - a.priority;
      });
  }, [resources, search, categoryFilter, typeFilter, sortKey]);

  const handleSave = (resource: Resource) => {
    const exists = resources.some((r) => r.id === resource.id);
    if (exists) {
      updateResource(resource.id, resource);
      toast.success("Resource updated");
    } else {
      addResource(resource);
      toast.success("Resource created");
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(resources, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fsb-resources-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Resources exported as JSON");
  };

  return (
    <div>
      {/* Notice */}
      <div className="mb-5 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm font-medium text-foreground">Local preview mode</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Changes save to your browser only. To make them shared and permanent, export the JSON
          and update the resource source. (Future sprint will sync directly to Google Sheets.)
        </p>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 max-w-xs"
        />

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-9 w-[170px]">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {RESOURCE_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {RESOURCE_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="priority">Sort: priority</SelectItem>
            <SelectItem value="name">Sort: name</SelectItem>
            <SelectItem value="category">Sort: category</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1" />

        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-1 h-3.5 w-3.5" /> Export JSON
        </Button>
        <Button variant="outline" size="sm" onClick={() => setConfirmReset(true)}>
          <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reset
        </Button>
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setEditorOpen(true);
          }}
        >
          <Plus className="mr-1 h-3.5 w-3.5" /> Add resource
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Name</th>
              <th className="px-3 py-2 text-left font-medium">Type</th>
              <th className="px-3 py-2 text-left font-medium">Category</th>
              <th className="px-3 py-2 text-left font-medium">Bottleneck tags</th>
              <th className="px-3 py-2 text-center font-medium">Priority</th>
              <th className="px-3 py-2 text-center font-medium">Active</th>
              <th className="px-3 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                  No resources match those filters.
                </td>
              </tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-border align-top hover:bg-secondary/30">
                <td className="px-3 py-3">
                  <div className="font-medium text-foreground">{r.name}</div>
                  <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {r.description}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${RESOURCE_TYPE_BADGE[r.type]}`}
                  >
                    {RESOURCE_TYPE_LABEL[r.type]}
                  </span>
                </td>
                <td className="px-3 py-3 text-xs text-foreground">{r.category}</td>
                <td className="px-3 py-3">
                  <div className="flex max-w-xs flex-wrap gap-1">
                    {r.bottleneck_tags.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                        title={getLabel(t)}
                      >
                        {getLabel(t).length > 24
                          ? getLabel(t).slice(0, 24) + "…"
                          : getLabel(t)}
                      </span>
                    ))}
                    {r.bottleneck_tags.length > 4 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{r.bottleneck_tags.length - 4}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 text-center text-foreground">{r.priority}</td>
                <td className="px-3 py-3 text-center">
                  <Switch
                    checked={r.active}
                    onCheckedChange={(v) => updateResource(r.id, { active: v })}
                  />
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="inline-flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => {
                        setEditing(r);
                        setEditorOpen(true);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-destructive hover:text-destructive"
                      onClick={() => setConfirmDelete(r)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Editor */}
      <ResourceEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        initial={editing}
        onSave={handleSave}
      />

      {/* Delete confirm */}
      <AlertDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this resource?</AlertDialogTitle>
            <AlertDialogDescription>
              "{confirmDelete?.name}" will be removed from your local resource library. You can
              restore the starter set with the Reset button.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmDelete) {
                  removeResource(confirmDelete.id);
                  toast.success("Resource deleted");
                  setConfirmDelete(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset confirm */}
      <AlertDialog open={confirmReset} onOpenChange={setConfirmReset}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset to starter resources?</AlertDialogTitle>
            <AlertDialogDescription>
              This replaces your current local list with the original starter library. Any custom
              resources you added will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                resetToDefaults();
                toast.success("Resources reset to defaults");
                setConfirmReset(false);
              }}
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ResourceManager;