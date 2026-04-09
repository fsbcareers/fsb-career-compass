export const surveyConfig = {
  pipelineStages: [
    {
      id: "awareness",
      label: "I didn't realize I needed to be thinking about internships yet",
      shortLabel: "Awareness",
      icon: "Lightbulb",
      drilldownQuestion: "What's closest to your situation?",
      drilldownOptions: [
        { id: "didnt_know_important", label: "Nobody told me internships were this important for getting hired after graduation", icon: "AlertCircle" },
        { id: "too_early", label: "I figured internships were a junior or senior year thing", icon: "Clock" },
        { id: "focused_grades", label: "I've been focused on getting good grades and assumed that would be enough", icon: "BookOpen" },
        { id: "no_pressure", label: "No one around me is doing internships yet so I didn't feel the urgency", icon: "Users" },
      ],
      resourceNudge: "You're not behind. But starting now gives you a real edge. The career center can help you figure out the first step in a 15-minute meeting.",
    },
    {
      id: "direction",
      label: "I want an internship but I have no idea what kind",
      shortLabel: "Direction",
      icon: "Compass",
      drilldownQuestion: "What makes picking a direction hard?",
      drilldownOptions: [
        { id: "too_many_options", label: "There are so many options I feel paralyzed trying to choose", icon: "GitBranch" },
        { id: "dont_know_roles", label: "I know my major but I don't know what actual job roles exist for it", icon: "Map" },
        { id: "interests_dont_match", label: "What I'm interested in doesn't seem to connect to available internships", icon: "Unlink" },
        { id: "no_exposure", label: "I haven't had enough real-world exposure to know what I'd actually enjoy", icon: "Eye" },
      ],
      resourceNudge: "This is more common than you think. The career center runs industry exploration sessions that take 30 minutes and help you narrow it down fast.",
    },
    {
      id: "search",
      label: "I know what I want but I can't find the right opportunities",
      shortLabel: "Search",
      icon: "Search",
      drilldownQuestion: "What's making the search hard?",
      drilldownOptions: [
        { id: "dont_know_where", label: "I don't know where to look beyond Handshake and LinkedIn", icon: "Globe" },
        { id: "nothing_for_major", label: "I search but the results don't match my major or interests", icon: "FilterX" },
        { id: "all_require_experience", label: "Every posting I find wants prior experience I don't have", icon: "Lock" },
        { id: "no_connections", label: "I don't have any professional connections or know anyone in the industry", icon: "UserX" },
      ],
      resourceNudge: "The career center maintains employer lists by major that aren't on Handshake. Book a quick meeting to get access.",
    },
    {
      id: "materials",
      label: "I'm trying to apply but my resume and materials aren't there yet",
      shortLabel: "Materials",
      icon: "FileText",
      drilldownQuestion: "What specifically isn't ready?",
      drilldownOptions: [
        { id: "empty_resume", label: "I don't have relevant experience to put on my resume", icon: "FileX" },
        { id: "weak_resume", label: "I have a resume but I don't think it stands out", icon: "FileMinus" },
        { id: "cover_letter", label: "I don't know how to write a cover letter that doesn't sound generic", icon: "PenLine" },
        { id: "cant_tailor", label: "I struggle to customize my application for each company", icon: "Copy" },
      ],
      resourceNudge: "Resume clinics run weekly with no appointment needed. Bring what you have and walk out with something stronger.",
    },
    {
      id: "applying",
      label: "I'm sending out applications but not getting any responses",
      shortLabel: "Applying",
      icon: "Send",
      drilldownQuestion: "What best describes your situation?",
      drilldownOptions: [
        { id: "few_apps", label: "I've only applied to a handful of places and need to do more", icon: "ArrowUp" },
        { id: "many_apps_silence", label: "I've applied to 10+ internships and heard nothing back", icon: "Inbox" },
        { id: "auto_rejections", label: "I keep getting instant rejections before anyone even looks at my application", icon: "XCircle" },
        { id: "missing_deadlines", label: "By the time I find postings, the deadlines have already passed", icon: "CalendarX" },
      ],
      resourceNudge: "If you're applying and not hearing back, it's usually a targeting or materials issue, not a you issue. A 15-minute application review can diagnose it.",
    },
    {
      id: "interviewing",
      label: "I'm getting interviews but not landing offers",
      shortLabel: "Interviews",
      icon: "MessageSquare",
      drilldownQuestion: "Where in the interview process does it break down?",
      drilldownOptions: [
        { id: "nerves", label: "I get so nervous that I can't think clearly or communicate well", icon: "HeartPulse" },
        { id: "behavioral_qs", label: "I freeze on behavioral questions like 'tell me about a time when...'", icon: "MessageCircle" },
        { id: "technical_qs", label: "I struggle with case studies, technical questions, or skills assessments", icon: "Code" },
        { id: "video_interviews", label: "I submit video or HireVue interviews and never hear back", icon: "Video" },
        { id: "final_rounds", label: "I do well in early rounds but get cut in final interviews", icon: "ArrowRight" },
      ],
      resourceNudge: "Mock interviews happen every week. Students who do even one mock before a real interview perform significantly better.",
    },
    {
      id: "offers",
      label: "I have an offer but I'm not sure it's the right one",
      shortLabel: "Offers",
      icon: "CheckCircle",
      drilldownQuestion: "What's making the decision hard?",
      drilldownOptions: [
        { id: "comparing", label: "I'm comparing multiple offers and don't know how to evaluate the tradeoffs", icon: "Scale" },
        { id: "not_excited", label: "I have one offer but it's not what I was hoping for", icon: "Meh" },
        { id: "pressure_to_decide", label: "They're pressuring me to decide fast and I need more time", icon: "Timer" },
        { id: "location_comp", label: "The location or compensation isn't what I expected", icon: "MapPin" },
      ],
      resourceNudge: "Don't decide alone. A career advisor can walk you through an offer evaluation in one meeting. Book one before your deadline.",
    },
  ],

  followUpQuestions: [
    {
      id: "follow_up_1",
      question: "How many internships have you applied to this year?",
      options: [
        { id: "applied_0", label: "None yet", icon: "Circle" },
        { id: "applied_1_5", label: "1 to 5", icon: "ArrowUp" },
        { id: "applied_6_15", label: "6 to 15", icon: "ArrowUpRight" },
        { id: "applied_15_plus", label: "More than 15", icon: "ChevronsUp" },
      ],
    },
    {
      id: "follow_up_2",
      question: "When did you start actively looking for an internship?",
      options: [
        { id: "this_semester", label: "This semester", icon: "Calendar" },
        { id: "last_semester", label: "Last semester", icon: "CalendarDays" },
        { id: "over_a_year", label: "Over a year ago", icon: "History" },
        { id: "havent_started", label: "I haven't really started yet", icon: "Pause" },
      ],
    },
    {
      id: "follow_up_3",
      question: "What's been your biggest source of internship leads so far?",
      options: [
        { id: "handshake", label: "Handshake", icon: "Monitor" },
        { id: "linkedin", label: "LinkedIn", icon: "Linkedin" },
        { id: "personal_network", label: "Family, friends, or personal connections", icon: "Users" },
        { id: "company_sites", label: "Company websites directly", icon: "Globe" },
        { id: "havent_looked", label: "I haven't started looking yet", icon: "Search" },
      ],
    },
    {
      id: "follow_up_4",
      question: "What would make the biggest difference for you right now?",
      options: [
        { id: "know_where_to_apply", label: "Knowing exactly which companies to apply to for my major", icon: "Target" },
        { id: "stronger_resume", label: "Having a stronger resume or application", icon: "FileCheck" },
        { id: "interview_practice", label: "Getting real practice before interviews", icon: "Mic" },
        { id: "someone_to_talk_to", label: "Having someone walk me through the whole process", icon: "MessageSquare" },
      ],
    },
    {
      id: "follow_up_5",
      question: "What's your major?",
      options: [
        { id: "finance", label: "Finance", icon: "TrendingUp" },
        { id: "marketing", label: "Marketing", icon: "Megaphone" },
        { id: "accountancy", label: "Accountancy", icon: "Calculator" },
        { id: "supply_chain", label: "Supply Chain and Operations", icon: "Truck" },
        { id: "business_analytics", label: "Business Analytics", icon: "BarChart3" },
        { id: "other_major", label: "Other FSB major", icon: "GraduationCap" },
      ],
    },
  ],

  continuePrompts: [
    "That helps! Got one more in you?",
    "You're helping a lot! One more quick one?",
    "Almost done! One more?",
    "Last one, promise?",
  ],
};

export type PipelineStage = (typeof surveyConfig.pipelineStages)[number];
export type FollowUpQuestion = (typeof surveyConfig.followUpQuestions)[number];
