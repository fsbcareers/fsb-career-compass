import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink, AlertCircle } from "lucide-react";
import {
  RESOURCE_CATEGORIES,
  RESOURCE_TYPES,
  type Resource,
  type ResourceCategory,
  type ResourceType,
} from "@/config/resources";
import { surveyConfig } from "@/config/surveyConfig";

const YEAR_VALUES = ["all", "freshman", "sophomore", "junior", "senior"] as const;
const YEAR_LABELS: Record<string, string> = {
  all: "All years",
  freshman: "Freshman",
  sophomore: "Sophomore",
  junior: "Junior",
  senior: "Senior",
};

const resourceSchema = z.object({
  id: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1, "Name is required").max(120, "Keep names under 120 chars"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(400, "Keep descriptions under 400 chars"),
  type: z.enum(["workshop", "one_on_one", "online_tool", "event", "guide"]),
  link: z
    .string()
    .trim()
    .min(1, "Link is required")
    .url("Must be a valid URL (https://...)")
    .max(500),
  link_label: z.string().trim().max(60).default("Learn more"),
  bottleneck_tags: z.array(z.string()).min(1, "Select at least one bottleneck tag"),
  year_tags: z.array(z.string()).min(1, "Select at least one class year (or 'All years')"),
  category: z.enum(["Getting Started", "Applying", "Interviewing", "Offers", "General"]),
  priority: z.number().int().min(1).max(10),
  active: z.boolean(),
});

type Errors = Partial<Record<keyof Resource, string>>;

function emptyResource(): Resource {
  return {
    id: `resource-${Date.now()}`,
    name: "",
    description: "",
    type: "workshop",
    link: "",
    link_label: "Learn more",
    bottleneck_tags: [],
    year_tags: ["all"],
    category: "General",
    priority: 5,
    active: true,
  };
}

interface ResourceEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Resource | null;
  onSave: (resource: Resource) => void;
}

const ResourceEditor = ({ open, onOpenChange, initial, onSave }: ResourceEditorProps) => {
  const [draft, setDraft] = useState<Resource>(() => initial ?? emptyResource());
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setDraft(initial ?? emptyResource());
    setErrors({});
    setTouched(false);
  }, [initial, open]);

  const update = <K extends keyof Resource>(key: K, value: Resource[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const toggleTag = (tag: string) => {
    setDraft((d) => ({
      ...d,
      bottleneck_tags: d.bottleneck_tags.includes(tag)
        ? d.bottleneck_tags.filter((t) => t !== tag)
        : [...d.bottleneck_tags, tag],
    }));
  };

  const toggleYear = (year: string) => {
    setDraft((d) => {
      let next: string[];
      if (year === "all") {
        next = d.year_tags.includes("all") ? [] : ["all"];
      } else {
        const without = d.year_tags.filter((y) => y !== "all");
        next = without.includes(year)
          ? without.filter((y) => y !== year)
          : [...without, year];
      }
      return { ...d, year_tags: next };
    });
  };

  const validate = (): boolean => {
    const result = resourceSchema.safeParse(draft);
    if (result.success) {
      setErrors({});
      return true;
    }
    const next: Errors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof Resource;
      if (!next[key]) next[key] = issue.message;
    }
    setErrors(next);
    return false;
  };

  const handleSave = () => {
    setTouched(true);
    if (!validate()) return;
    onSave(draft);
    onOpenChange(false);
  };

  // Live validation after first save attempt
  useEffect(() => {
    if (touched) validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, touched]);

  const tagSelectionCount = draft.bottleneck_tags.length;

  // Group all selectable tags by bucket: bucket id + each stage + each drilldown option in that bucket.
  const tagGroups = useMemo(
    () =>
      surveyConfig.buckets.map((bucket) => ({
        bucket,
        stages: bucket.stages
          .map((sid) => surveyConfig.pipelineStages.find((s) => s.id === sid))
          .filter(Boolean) as typeof surveyConfig.pipelineStages,
      })),
    []
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit resource" : "Add resource"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Name */}
          <div>
            <Label htmlFor="r-name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="r-name"
              value={draft.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g., Resume Drop-In Clinic"
              maxLength={120}
              className="mt-1"
            />
            {errors.name && <FieldError msg={errors.name} />}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="r-desc">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="r-desc"
              value={draft.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="1–2 sentences describing what students will get from this resource."
              rows={3}
              maxLength={400}
              className="mt-1"
            />
            {errors.description && <FieldError msg={errors.description} />}
          </div>

          {/* Type & Category */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>
                Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={draft.type}
                onValueChange={(v) => update("type", v as ResourceType)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESOURCE_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={draft.category}
                onValueChange={(v) => update("category", v as ResourceCategory)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESOURCE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Link */}
          <div>
            <Label htmlFor="r-link">
              Link <span className="text-destructive">*</span>
            </Label>
            <div className="mt-1 flex gap-2">
              <Input
                id="r-link"
                type="url"
                inputMode="url"
                value={draft.link}
                onChange={(e) => update("link", e.target.value)}
                placeholder="https://miamioh.joinhandshake.com"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!draft.link}
                onClick={() => {
                  try {
                    const url = new URL(draft.link);
                    window.open(url.toString(), "_blank", "noopener,noreferrer");
                  } catch {
                    /* invalid URL */
                  }
                }}
              >
                <ExternalLink className="mr-1 h-3.5 w-3.5" /> Test
              </Button>
            </div>
            {errors.link && <FieldError msg={errors.link} />}
          </div>

          {/* Link label */}
          <div>
            <Label htmlFor="r-link-label">Button label</Label>
            <Input
              id="r-link-label"
              value={draft.link_label}
              onChange={(e) => update("link_label", e.target.value)}
              placeholder="Book on Handshake"
              maxLength={60}
              className="mt-1"
            />
          </div>

          {/* Year tags */}
          <div>
            <Label>
              Class years <span className="text-destructive">*</span>
            </Label>
            <div className="mt-2 flex flex-wrap gap-3">
              {YEAR_VALUES.map((y) => (
                <label key={y} className="inline-flex cursor-pointer items-center gap-2">
                  <Checkbox
                    checked={draft.year_tags.includes(y)}
                    onCheckedChange={() => toggleYear(y)}
                  />
                  <span className="text-sm text-foreground">{YEAR_LABELS[y]}</span>
                </label>
              ))}
            </div>
            {errors.year_tags && <FieldError msg={errors.year_tags} />}
          </div>

          {/* Bottleneck tags — grouped by bucket */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <Label>
                Bottleneck tags <span className="text-destructive">*</span>
              </Label>
              <span className="text-xs text-muted-foreground">
                {tagSelectionCount} selected
              </span>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">
              Check every bottleneck this resource helps with. Bucket-level tags match broadly; specific
              drill-down tags get the highest match score.
            </p>
            <div className="space-y-3 rounded-lg border border-border bg-secondary/30 p-3">
              {tagGroups.map(({ bucket, stages }) => (
                <fieldset key={bucket.id} className="rounded-md border border-border bg-card p-3">
                  <legend className="px-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                    {bucket.label}
                  </legend>

                  {/* Bucket-level tag */}
                  <label className="mb-2 flex cursor-pointer items-start gap-2 rounded-md border border-dashed border-border bg-background p-2">
                    <Checkbox
                      checked={draft.bottleneck_tags.includes(bucket.id)}
                      onCheckedChange={() => toggleTag(bucket.id)}
                      className="mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-medium text-foreground">
                        Whole bucket: {bucket.label}
                      </span>
                      <span className="block text-[11px] text-muted-foreground">
                        Match anyone in this category
                      </span>
                    </div>
                  </label>

                  {/* Stages and their drilldown options */}
                  <div className="space-y-3">
                    {stages.map((stage) => (
                      <div key={stage.id}>
                        <label className="flex cursor-pointer items-start gap-2 py-1">
                          <Checkbox
                            checked={draft.bottleneck_tags.includes(stage.id)}
                            onCheckedChange={() => toggleTag(stage.id)}
                            className="mt-0.5"
                          />
                          <span className="text-sm font-medium text-foreground">
                            {stage.label}
                          </span>
                        </label>
                        <div className="ml-6 space-y-1 border-l-2 border-border pl-3">
                          {stage.drilldownOptions.map((opt) => (
                            <label
                              key={opt.id}
                              className="flex cursor-pointer items-start gap-2 py-0.5"
                            >
                              <Checkbox
                                checked={draft.bottleneck_tags.includes(opt.id)}
                                onCheckedChange={() => toggleTag(opt.id)}
                                className="mt-0.5"
                              />
                              <span className="text-[13px] leading-snug text-muted-foreground">
                                {opt.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
            {errors.bottleneck_tags && <FieldError msg={errors.bottleneck_tags} />}
          </div>

          {/* Priority + Active */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="r-priority">Priority (1–10)</Label>
              <Input
                id="r-priority"
                type="number"
                min={1}
                max={10}
                value={draft.priority}
                onChange={(e) =>
                  update(
                    "priority",
                    Math.max(1, Math.min(10, Number(e.target.value) || 1))
                  )
                }
                className="mt-1"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Higher numbers shown first when scores tie.
              </p>
            </div>
            <div>
              <Label className="block">Active</Label>
              <div className="mt-2 flex items-center gap-2">
                <Switch
                  checked={draft.active}
                  onCheckedChange={(v) => update("active", v)}
                />
                <span className="text-sm text-muted-foreground">
                  {draft.active ? "Visible to students" : "Hidden"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>{initial ? "Save changes" : "Create resource"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const FieldError = ({ msg }: { msg: string }) => (
  <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
    <AlertCircle className="h-3 w-3" /> {msg}
  </p>
);

export default ResourceEditor;