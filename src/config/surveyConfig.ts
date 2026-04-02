export const surveyConfig = {
  pipelineStages: [
    {
      id: "not_started",
      label: "I haven't started the process yet",
      subtitle: "The starting line",
      drilldownQuestion: "What's been the main reason you haven't started?",
      drilldownOptions: [
        { id: "overwhelmed", label: "It feels overwhelming and I don't know where to begin" },
        { id: "timing_unaware", label: "I didn't think I needed to start this early" },
        { id: "academic_priority", label: "I've been focused on academics and haven't made time" },
        { id: "qualification_doubt", label: "I don't think I'm qualified for internships yet" },
      ],
      resourceNudge: "No judgment. You're here now. Start with one step: upload your resume to Handshake this week.",
    },
    {
      id: "career_clarity",
      label: "I don't know what kind of role or industry I want",
      subtitle: "Finding direction",
      drilldownQuestion: "What's making career direction hard to figure out?",
      drilldownOptions: [
        { id: "too_many_interests", label: "I have too many interests and can't narrow down" },
        { id: "low_awareness", label: "I have no idea what's even out there" },
        { id: "field_not_roles", label: "I know the field but not specific roles or companies" },
        { id: "major_mismatch", label: "I'm not sure my major aligns with what I actually want to do" },
      ],
      resourceNudge: "The Center for Career Exploration has 1-on-1 sessions that can help. Book one this week.",
    },
    {
      id: "finding_opportunities",
      label: "I don't know where to find internships or which companies to target",
      subtitle: "Searching for opportunities",
      drilldownQuestion: "What's the hardest part of finding the right opportunities?",
      drilldownOptions: [
        { id: "platform_unaware", label: "I don't know which job boards or platforms to use" },
        { id: "relevance_gap", label: "I can't find postings relevant to my major" },
        { id: "experience_gap", label: "I see postings but they all require experience I don't have" },
        { id: "no_network", label: "I don't have a professional network to tap into yet" },
      ],
      resourceNudge: "Check Handshake's curated lists filtered by your major. They're updated weekly.",
    },
    {
      id: "application_materials",
      label: "My resume or application materials aren't ready",
      subtitle: "Getting your materials ready",
      drilldownQuestion: "What specifically feels off about your application materials?",
      drilldownOptions: [
        { id: "thin_resume", label: "I don't have enough experience to put on my resume" },
        { id: "low_confidence", label: "I have a resume but I'm not confident it's competitive" },
        { id: "no_cover_letter", label: "I haven't written a cover letter and don't know how" },
        { id: "no_tailoring", label: "I don't know how to tailor my materials for different companies" },
      ],
      resourceNudge: "Drop into a resume clinic or book a 15-minute review. No appointment needed.",
    },
    {
      id: "getting_responses",
      label: "I'm applying but not hearing back",
      drilldownQuestion: "How would you describe your application situation?",
      drilldownOptions: [
        { id: "low_volume", label: "I've applied to fewer than 5 places. I need to apply more" },
        { id: "high_volume_no_response", label: "I've applied to 10+ places and haven't heard from any" },
        { id: "auto_rejected", label: "I keep getting automated rejections immediately" },
        { id: "visibility_unknown", label: "I don't know if my applications are even being seen" },
      ],
      resourceNudge: "A career advisor can review your application strategy. Book a quick session.",
    },
    {
      id: "interview_performance",
      label: "I'm getting interviews but not advancing or getting offers",
      drilldownQuestion: "Where in the interview process are things breaking down?",
      drilldownOptions: [
        { id: "nerves", label: "I get nervous and don't perform well under pressure" },
        { id: "behavioral_weak", label: "I can't answer behavioral or 'tell me about a time' questions well" },
        { id: "stalls_at_finals", label: "I do fine in first rounds but don't advance to finals" },
        { id: "prep_unclear", label: "I don't know how to prepare. What do they actually want?" },
      ],
      resourceNudge: "Mock interviews run every week. Sign up through Handshake.",
    },
    {
      id: "evaluating_offers",
      label: "I have an offer (or multiple) but I'm unsure what to accept",
      drilldownQuestion: "What's making the decision difficult?",
      drilldownOptions: [
        { id: "tradeoff_unclear", label: "I'm comparing offers and don't know how to weigh salary vs. learning" },
        { id: "lukewarm_offer", label: "I got an offer but I'm not excited about it. Should I hold out?" },
        { id: "time_pressure", label: "I need to decide quickly and don't have enough information" },
        { id: "regret_aversion", label: "I'm worried about accepting and then regretting it" },
      ],
      resourceNudge: "A career advisor can walk you through offer evaluation. Book a meeting.",
    },
  ],

  followUpQuestions: [
    {
      id: "follow_up_1",
      question: "How many internships or jobs have you applied to so far?",
      options: [
        { id: "applied_0", label: "None yet" },
        { id: "applied_1_5", label: "1–5" },
        { id: "applied_6_15", label: "6–15" },
        { id: "applied_15_plus", label: "More than 15" },
      ],
    },
    {
      id: "follow_up_2",
      question: "Have you used any FSB career center resources this year?",
      options: [
        { id: "used_multiple", label: "Yes, multiple times" },
        { id: "used_once", label: "Once or twice" },
        { id: "aware_not_used", label: "I know about them but haven't gone" },
        { id: "unaware", label: "I didn't know they existed" },
      ],
    },
    {
      id: "follow_up_3",
      question: "What would make you most likely to use career center resources?",
      options: [
        { id: "wants_matching", label: "If I knew exactly which resource matched my situation" },
        { id: "wants_speed", label: "If it was faster / less time commitment" },
        { id: "wants_online", label: "If I could do it online instead of in person" },
        { id: "wants_social_proof", label: "If my friends were doing it too" },
      ],
    },
    {
      id: "follow_up_4",
      question: "What's your biggest concern about your career right now?",
      options: [
        { id: "time_running_out", label: "I won't find anything before graduation" },
        { id: "wrong_fit", label: "I'll end up in a job I don't actually want" },
        { id: "peer_comparison", label: "I'm behind compared to my peers" },
        { id: "no_long_term_vision", label: "I don't know what I want long-term" },
      ],
    },
    {
      id: "follow_up_5",
      question: "One last one. What's your major?",
      options: [
        { id: "finance", label: "Finance" },
        { id: "marketing", label: "Marketing" },
        { id: "accountancy", label: "Accountancy" },
        { id: "other", label: "Other" },
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
