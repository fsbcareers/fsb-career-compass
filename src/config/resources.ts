export type ResourceType = "workshop" | "one_on_one" | "online_tool" | "event" | "guide";
export type ResourceCategory = "Getting Started" | "Applying" | "Interviewing" | "Offers" | "General";

export interface Resource {
  id: string;
  name: string;
  description: string;
  type: ResourceType;
  link: string;
  link_label: string;
  bottleneck_tags: string[];
  year_tags: string[]; // "all" | "freshman" | "sophomore" | "junior" | "senior"
  category: ResourceCategory;
  priority: number;
  active: boolean;
}

/**
 * Starter resource library.
 * All bottleneck_tags are audited against actual stage / bucket / drilldown IDs
 * in surveyConfig.ts so matching works out of the box.
 *
 * Valid bottleneck_tag IDs:
 *  - Bucket IDs: getting_started, applying, interviewing, getting_offer, already_done
 *  - Stage IDs: awareness, direction, search, materials, applying, screening,
 *               live_interviews, offers, waiting, already_secured
 *  - Drilldown option IDs: see surveyConfig.pipelineStages[*].drilldownOptions[*].id
 */
export const starterResources: Resource[] = [
  // === GETTING STARTED ===
  {
    id: "career-exploration-session",
    name: "Career Exploration 1-on-1",
    description:
      "Meet with a career advisor to talk through your interests, strengths, and what career paths might fit. No preparation needed.",
    type: "one_on_one",
    link: "https://miamioh.joinhandshake.com",
    link_label: "Book on Handshake",
    bottleneck_tags: [
      "getting_started",
      "awareness",
      "direction",
      "didnt_know_important",
      "too_early",
      "too_many_options",
      "no_exposure",
    ],
    year_tags: ["all"],
    category: "Getting Started",
    priority: 9,
    active: true,
  },
  {
    id: "major-to-career-map",
    name: "Major-to-Career Pathway Maps",
    description:
      "Visual guides showing what roles, industries, and employers FSB graduates from your major typically go into.",
    type: "guide",
    link: "https://miamioh.edu/fsb/careers",
    link_label: "View maps",
    bottleneck_tags: [
      "getting_started",
      "direction",
      "dont_know_roles",
      "interests_dont_match",
      "nothing_for_major",
    ],
    year_tags: ["all"],
    category: "Getting Started",
    priority: 8,
    active: true,
  },
  {
    id: "industry-panels",
    name: "Industry Exploration Panels",
    description:
      "Hear from professionals across industries about what their work actually looks like day to day. Held monthly during the semester.",
    type: "event",
    link: "https://miamioh.joinhandshake.com/events",
    link_label: "See upcoming events",
    bottleneck_tags: [
      "getting_started",
      "direction",
      "awareness",
      "no_exposure",
      "dont_know_roles",
      "focused_grades",
      "no_pressure",
    ],
    year_tags: ["freshman", "sophomore"],
    category: "Getting Started",
    priority: 7,
    active: true,
  },

  // === APPLYING: SEARCH ===
  {
    id: "handshake-curated-lists",
    name: "Handshake Curated Job Lists",
    description:
      "Pre-filtered internship and job lists organized by FSB major. Updated weekly by the career center.",
    type: "online_tool",
    link: "https://miamioh.joinhandshake.com/jobs",
    link_label: "Open Handshake",
    bottleneck_tags: ["applying", "search", "dont_know_where", "nothing_for_major"],
    year_tags: ["all"],
    category: "Applying",
    priority: 9,
    active: true,
  },
  {
    id: "employer-database",
    name: "FSB Employer Database",
    description:
      "List of 200+ employers who actively recruit from FSB, organized by major and industry. Includes contact info and recruiting timelines.",
    type: "guide",
    link: "https://miamioh.edu/fsb/careers",
    link_label: "View database",
    bottleneck_tags: [
      "applying",
      "search",
      "dont_know_where",
      "no_connections",
      "nothing_for_major",
    ],
    year_tags: ["all"],
    category: "Applying",
    priority: 8,
    active: true,
  },
  {
    id: "networking-workshop",
    name: "Networking Skills Workshop",
    description:
      "Learn how to build professional connections even if you don't know anyone in the industry. Includes LinkedIn strategies and informational interview scripts.",
    type: "workshop",
    link: "https://miamioh.joinhandshake.com/events",
    link_label: "See schedule",
    bottleneck_tags: ["applying", "search", "no_connections", "all_require_experience"],
    year_tags: ["all"],
    category: "Applying",
    priority: 7,
    active: true,
  },

  // === APPLYING: MATERIALS ===
  {
    id: "resume-dropin",
    name: "Resume Drop-In Clinic",
    description:
      "Walk in with your resume (or without one) and get live feedback from a career advisor. No appointment needed. Held weekly.",
    type: "workshop",
    link: "https://miamioh.joinhandshake.com/events",
    link_label: "See drop-in hours",
    bottleneck_tags: ["applying", "materials", "empty_resume", "weak_resume"],
    year_tags: ["all"],
    category: "Applying",
    priority: 10,
    active: true,
  },
  {
    id: "cover-letter-guide",
    name: "Cover Letter Writing Guide",
    description:
      "Step-by-step guide to writing a cover letter that doesn't sound generic. Includes templates and before/after examples by major.",
    type: "guide",
    link: "https://miamioh.edu/fsb/careers",
    link_label: "View guide",
    bottleneck_tags: ["applying", "materials", "cover_letter", "cant_tailor"],
    year_tags: ["all"],
    category: "Applying",
    priority: 7,
    active: true,
  },
  {
    id: "resume-15min-review",
    name: "15-Minute Resume Review",
    description:
      "Book a quick 1-on-1 session to get targeted feedback on your resume from a career advisor. Come with a draft.",
    type: "one_on_one",
    link: "https://miamioh.joinhandshake.com",
    link_label: "Book on Handshake",
    bottleneck_tags: ["applying", "materials", "weak_resume", "cant_tailor"],
    year_tags: ["all"],
    category: "Applying",
    priority: 8,
    active: true,
  },

  // === APPLYING: RESPONSES ===
  {
    id: "application-strategy-session",
    name: "Application Strategy Session",
    description:
      "A 1-on-1 meeting to review where you're applying, how you're applying, and what might be going wrong. Bring your list.",
    type: "one_on_one",
    link: "https://miamioh.joinhandshake.com",
    link_label: "Book on Handshake",
    bottleneck_tags: [
      "applying",
      "many_apps_silence",
      "auto_rejections",
      "few_apps",
      "missing_deadlines",
    ],
    year_tags: ["all"],
    category: "Applying",
    priority: 9,
    active: true,
  },
  {
    id: "recruiting-timeline",
    name: "FSB Recruiting Timeline by Major",
    description:
      "When do employers start recruiting for your major? A visual calendar so you never miss a deadline again.",
    type: "guide",
    link: "https://miamioh.edu/fsb/careers",
    link_label: "View timeline",
    bottleneck_tags: ["applying", "missing_deadlines", "awareness", "too_early"],
    year_tags: ["all"],
    category: "Applying",
    priority: 7,
    active: true,
  },

  // === INTERVIEWING ===
  {
    id: "mock-interviews",
    name: "Mock Interview Program",
    description:
      "Practice with a real interviewer in a low-stakes setting. Get specific feedback on what to improve. Available weekly.",
    type: "workshop",
    link: "https://miamioh.joinhandshake.com/events",
    link_label: "Sign up",
    bottleneck_tags: [
      "interviewing",
      "screening",
      "live_interviews",
      "nerves",
      "behavioral_weak",
      "technical_weak",
      "final_round_rejected",
      "phone_screen_stuck",
    ],
    year_tags: ["all"],
    category: "Interviewing",
    priority: 10,
    active: true,
  },
  {
    id: "hirevue-practice",
    name: "HireVue / Video Interview Practice",
    description:
      "Practice recorded video interviews using the same format employers use. Review your performance and get tips.",
    type: "online_tool",
    link: "https://miamioh.edu/fsb/careers",
    link_label: "Access practice tool",
    bottleneck_tags: [
      "interviewing",
      "screening",
      "hirevue_ghosted",
      "hirevue_prep",
      "assessment_filtered",
    ],
    year_tags: ["all"],
    category: "Interviewing",
    priority: 9,
    active: true,
  },
  {
    id: "behavioral-question-bank",
    name: "Behavioral Interview Question Bank",
    description:
      "50+ common behavioral questions with a framework for answering them. Organized by skill area (leadership, teamwork, problem-solving).",
    type: "guide",
    link: "https://miamioh.edu/fsb/careers",
    link_label: "View questions",
    bottleneck_tags: ["interviewing", "live_interviews", "behavioral_weak", "nerves"],
    year_tags: ["all"],
    category: "Interviewing",
    priority: 8,
    active: true,
  },
  {
    id: "case-interview-prep",
    name: "Case Interview Prep Workshop",
    description:
      "For students interviewing at consulting firms or finance roles that use case studies. Learn frameworks and practice live.",
    type: "workshop",
    link: "https://miamioh.joinhandshake.com/events",
    link_label: "See schedule",
    bottleneck_tags: ["interviewing", "live_interviews", "technical_weak"],
    year_tags: ["junior", "senior"],
    category: "Interviewing",
    priority: 7,
    active: true,
  },

  // === OFFERS ===
  {
    id: "offer-evaluation-session",
    name: "Offer Evaluation 1-on-1",
    description:
      "Walk through your offer(s) with a career advisor. Compare compensation, benefits, growth potential, and fit.",
    type: "one_on_one",
    link: "https://miamioh.joinhandshake.com",
    link_label: "Book on Handshake",
    bottleneck_tags: [
      "getting_offer",
      "offers",
      "comparing",
      "not_excited",
      "pressure_to_decide",
      "location_comp",
    ],
    year_tags: ["all"],
    category: "Offers",
    priority: 9,
    active: true,
  },
  {
    id: "salary-negotiation-guide",
    name: "Salary Negotiation Guide",
    description:
      "A step-by-step guide to negotiating your offer. Includes scripts, timing advice, and what's negotiable beyond base salary.",
    type: "guide",
    link: "https://miamioh.edu/fsb/careers",
    link_label: "View guide",
    bottleneck_tags: ["getting_offer", "offers", "location_comp", "comparing"],
    year_tags: ["junior", "senior"],
    category: "Offers",
    priority: 7,
    active: true,
  },
  {
    id: "waiting-strategy-session",
    name: "While You Wait: Strategy Session",
    description:
      "Stuck waiting after an interview? Get a 1-on-1 plan for staying active in your search and managing the anxiety of the unknown.",
    type: "one_on_one",
    link: "https://miamioh.joinhandshake.com",
    link_label: "Book on Handshake",
    bottleneck_tags: [
      "getting_offer",
      "waiting",
      "ghosted_after_interview",
      "stalled_process",
      "unsure_keep_applying",
      "anxiety",
    ],
    year_tags: ["all"],
    category: "Offers",
    priority: 8,
    active: true,
  },

  // === GENERAL ===
  {
    id: "career-advising-appt",
    name: "General Career Advising Appointment",
    description:
      "Not sure what you need? Start here. A 30-minute session with a career advisor to talk through whatever is on your mind.",
    type: "one_on_one",
    link: "https://miamioh.joinhandshake.com",
    link_label: "Book on Handshake",
    bottleneck_tags: [
      "awareness",
      "direction",
      "search",
      "materials",
      "applying",
      "screening",
      "live_interviews",
      "offers",
      "waiting",
    ],
    year_tags: ["all"],
    category: "General",
    priority: 5,
    active: true,
  },
  {
    id: "career-fair-prep",
    name: "Career Fair Preparation Workshop",
    description:
      "Get ready for the next career fair: what to wear, what to say, which employers to target, and how to follow up.",
    type: "workshop",
    link: "https://miamioh.joinhandshake.com/events",
    link_label: "See upcoming fairs",
    bottleneck_tags: ["applying", "search", "no_connections"],
    year_tags: ["all"],
    category: "General",
    priority: 6,
    active: true,
  },
];

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  "Getting Started",
  "Applying",
  "Interviewing",
  "Offers",
  "General",
];

export const RESOURCE_TYPES: { value: ResourceType; label: string }[] = [
  { value: "workshop", label: "Workshop" },
  { value: "one_on_one", label: "1-on-1 advising" },
  { value: "online_tool", label: "Online tool" },
  { value: "event", label: "Event" },
  { value: "guide", label: "Guide / resource" },
];

export const RESOURCE_TYPE_LABEL: Record<ResourceType, string> = {
  workshop: "Workshop",
  one_on_one: "1-on-1",
  online_tool: "Online tool",
  event: "Event",
  guide: "Guide",
};

/**
 * Tailwind classes for type pills. All colors HSL via Tailwind palette tokens.
 * Kept inline (not semantic) because these are fixed type-coded swatches per spec.
 */
export const RESOURCE_TYPE_BADGE: Record<ResourceType, string> = {
  workshop: "bg-teal-100 text-teal-800 border-teal-200",
  one_on_one: "bg-blue-100 text-blue-800 border-blue-200",
  online_tool: "bg-purple-100 text-purple-800 border-purple-200",
  event: "bg-amber-100 text-amber-800 border-amber-200",
  guide: "bg-gray-100 text-gray-700 border-gray-200",
};