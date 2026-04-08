import { Scenario, ScenarioStage } from "@/app/types/simulation";

export const invasiveMusselScenario: Scenario = {
  id: "invasive-mussel",
  title: "Invasive Mussel Incursion — Response and Preparedness Exercise",
  slug: "invasive-mussel",
  overview:
    "An aquatic biosecurity simulation designed to assess operational decision-making during a suspected invasive mussel incursion in a high-risk marina and coastal movement environment. The scenario uses forward-only branching, stage-by-stage feedback, and a final summary focused on strengths, recurring gaps, and operational consequences.",
  version: 3,
  isActive: true,
  category: "aquatic-biosecurity",
  adminMeta: {
    isPublished: true,
    version: 3,
  },
  stages: [
    {
      id: "p1",
      phaseNumber: 1,
      title: "Detection and Immediate Response",
      timeframe: "0–24 Hours",
      branchFamily: "main",
      baseScenarioText:
        "A local boater reports dense clusters of small bivalves attached to vessel hulls, marina pylons, ropes, mooring lines, and submerged infrastructure within a busy marina. Images suggest a suspected exotic mussel species with high invasive potential. Laboratory confirmation is pending, but the organism appears capable of rapid establishment, heavy fouling, and dispersal through planktonic larvae. The marina has frequent vessel movement, contractor activity, and shared equipment use, creating an immediate risk of spread.",
      criteria: [
        {
          id: "p1c1",
          text: "Report the suspect detection immediately through the relevant aquatic biosecurity authority and escalation pathway",
          consequence:
            "Delayed reporting reduces early coordination and increases the chance of spread before broader controls are established.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: [
            "report",
            "notify",
            "authority",
            "biosecurity",
            "escalate",
            "incident notification",
            "formal reporting",
          ],
        },
        {
          id: "p1c2",
          text: "Apply immediate containment and movement restrictions around the suspect site while confirmation is pending",
          consequence:
            "If vessels, equipment, and infrastructure continue moving unmanaged, the likelihood of linked infestations rises quickly.",
          theme: "Constraints",
          required: true,
          weight: 3,
          keywords: [
            "containment",
            "movement restriction",
            "movement control",
            "restrict access",
            "quarantine",
            "stop movement",
          ],
        },
        {
          id: "p1c3",
          text: "Commence early surveillance and delimiting planning at and around the suspect location",
          consequence:
            "If surveillance planning is delayed, the true spread footprint may be underestimated.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "surveillance",
            "sampling",
            "inspection",
            "delimiting",
            "monitoring",
            "survey",
          ],
        },
        {
          id: "p1c4",
          text: "Engage immediate stakeholders and provide practical early guidance",
          consequence:
            "If stakeholders are not informed early, awareness, cooperation, and compliance may weaken.",
          theme: "Stakeholders",
          required: false,
          weight: 1,
          keywords: [
            "stakeholders",
            "marina operator",
            "boaters",
            "contractors",
            "industry",
            "guidance",
          ],
        },
      ],
      questions: [
        {
          id: "p1q1",
          text: "What immediate actions would you take in the first 24 hours after this suspected aquatic pest detection?",
          theme: "Protocols",
          placeholder:
            "Describe your reporting, containment, surveillance, and immediate coordination actions...",
        },
        {
          id: "p1q2",
          text: "Who would you notify, and what urgent measures would you use to reduce spread while confirmation is still pending?",
          theme: "Communication",
          placeholder:
            "Explain how you would manage communication, movement controls, and practical guidance...",
        },
      ],
      passingRules: {
        minScore: 7,
        requiredCriteriaIds: ["p1c1", "p1c2", "p1c3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p1c1", "p1c2", "p1c3"],
        byMissingRequired: {
          p1c1: "p2a-reporting-pressure",
          p1c2: "p2b-containment-pressure",
          p1c3: "p2c-surveillance-pressure",
        },
        strong: "p2-main",
        mixed: "p2-main",
        limited: "p2c-surveillance-pressure",
        fallback: "p2-main",
      },
    },

    {
      id: "p2-main",
      phaseNumber: 2,
      title: "Early Response — Controlled Progression",
      timeframe: "24–72 Hours",
      branchFamily: "main",
      baseScenarioText:
        "Early reporting, containment, and initial surveillance have occurred. Diagnostic confirmation is still pending, but the incident remains potentially manageable. Linked sites, vessel histories, and shared equipment routes have been identified. The response now needs structured coordination, wider surveillance, and sustained stakeholder engagement before the spread picture worsens.",
      criteria: [
        {
          id: "p2m1",
          text: "Establish and operationalise early incident coordination arrangements",
          consequence:
            "If coordination remains weak, field, surveillance, and communication actions may become fragmented.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: [
            "incident coordination",
            "incident management",
            "ICC",
            "coordination",
            "governance",
            "control centre",
          ],
        },
        {
          id: "p2m2",
          text: "Expand surveillance to linked sites and likely spread pathways",
          consequence:
            "If linked sites are not checked early, additional infestations may remain unidentified during a critical window.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "expand surveillance",
            "linked sites",
            "inspection",
            "sampling",
            "delimiting",
            "pathways",
          ],
        },
        {
          id: "p2m3",
          text: "Provide practical guidance to affected stakeholders and maintain cooperation",
          consequence:
            "If messaging is incomplete, confusion and inconsistent compliance may emerge.",
          theme: "Stakeholders",
          required: true,
          weight: 2,
          keywords: [
            "guidance",
            "stakeholders",
            "operators",
            "communication",
            "industry engagement",
            "cooperation",
          ],
        },
      ],
      questions: [
        {
          id: "p2mq1",
          text: "How would you organise the early response once the incident remains potentially manageable but linked risks are growing?",
          theme: "Protocols",
          placeholder:
            "Explain your coordination, surveillance expansion, and stakeholder approach...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p2m1", "p2m2", "p2m3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p2m2", "p2m1", "p2m3"],
        byMissingRequired: {
          p2m1: "p3c-icc-coordination-pressure",
          p2m2: "p3a-surveillance-tracing-pressure",
          p2m3: "p3d-industry-trust-pressure",
        },
        strong: "p3-main",
        mixed: "p3-main",
        limited: "p3a-surveillance-tracing-pressure",
        fallback: "p3-main",
      },
    },

    {
      id: "p2a-reporting-pressure",
      phaseNumber: 2,
      title: "Early Response — Consequence of Delayed Reporting",
      timeframe: "24–72 Hours",
      branchFamily: "reporting",
      baseScenarioText:
        "Formal reporting and escalation were delayed while waiting for greater certainty. During that time, the situation expanded across linked vessel movements and marina activity. Cross-jurisdiction concerns are now emerging, coordination pressure is increasing, and industry confidence is beginning to decline.",
      criteria: [
        {
          id: "p2a1",
          text: "Stabilise strategic coordination and formalise multi-agency engagement",
          consequence:
            "If coordination remains weak, delays and conflicting actions may worsen the incident.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: [
            "coordination",
            "interagency",
            "jurisdiction",
            "governance",
            "escalation",
          ],
        },
        {
          id: "p2a2",
          text: "Intensify tracing and pathway analysis quickly",
          consequence:
            "If tracing is not intensified, hidden spread pathways may continue to drive expansion.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "tracing",
            "pathways",
            "movement analysis",
            "mapping",
            "history",
          ],
        },
        {
          id: "p2a3",
          text: "Rebuild confidence through practical stakeholder communication",
          consequence:
            "If confidence is not repaired, non-compliance and criticism may worsen.",
          theme: "Communication",
          required: true,
          weight: 2,
          keywords: [
            "confidence",
            "communication",
            "stakeholder updates",
            "guidance",
            "trust",
          ],
        },
      ],
      questions: [
        {
          id: "p2aq1",
          text: "How would you stabilise the response after delayed escalation and rising spread concerns?",
          theme: "Protocols",
          placeholder:
            "Describe your coordination, tracing, and confidence-restoring actions...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p2a1", "p2a2", "p2a3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p2a2", "p2a1", "p2a3"],
        byMissingRequired: {
          p2a1: "p3c-icc-coordination-pressure",
          p2a2: "p3a-surveillance-tracing-pressure",
          p2a3: "p3d-industry-trust-pressure",
        },
        strong: "p3c-icc-coordination-pressure",
        mixed: "p3c-icc-coordination-pressure",
        limited: "p3c-icc-coordination-pressure",
        fallback: "p3c-icc-coordination-pressure",
      },
    },

    {
      id: "p2b-containment-pressure",
      phaseNumber: 2,
      title: "Early Response — Consequence of Weak Containment",
      timeframe: "24–72 Hours",
      branchFamily: "containment",
      baseScenarioText:
        "Initial detection and escalation occurred, but containment remained too limited. Controls were not broadened early enough beyond the suspect site, and movement continued through linked vessels, equipment, and contractor activity. Multiple suspect sites are now emerging and the response is under greater scrutiny.",
      criteria: [
        {
          id: "p2b1",
          text: "Apply broader and more enforceable movement controls across linked sites and vectors",
          consequence:
            "If containment remains inconsistent, new infestations may continue to emerge.",
          theme: "Constraints",
          required: true,
          weight: 3,
          keywords: [
            "movement controls",
            "enforcement",
            "containment",
            "quarantine",
            "restrictions",
          ],
        },
        {
          id: "p2b2",
          text: "Improve stakeholder guidance and compliance expectations",
          consequence:
            "If communication remains inconsistent, reporting and cooperation may weaken further.",
          theme: "Stakeholders",
          required: true,
          weight: 2,
          keywords: [
            "guidance",
            "stakeholders",
            "expectations",
            "compliance",
            "communication",
          ],
        },
        {
          id: "p2b3",
          text: "Continue tracing and surveillance to identify where movement before controls caused spread",
          consequence:
            "If tracing and surveillance do not catch up, the true footprint may continue expanding.",
          theme: "Data",
          required: true,
          weight: 2,
          keywords: [
            "tracing",
            "surveillance",
            "movement history",
            "spread footprint",
          ],
        },
      ],
      questions: [
        {
          id: "p2bq1",
          text: "How would you recover from weak initial containment and reduce the risk of continued spread?",
          theme: "Constraints",
          placeholder:
            "Describe your movement-control, enforcement, tracing, and communication actions...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p2b1", "p2b2", "p2b3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p2b1", "p2b3", "p2b2"],
        byMissingRequired: {
          p2b1: "p3b-containment-compliance-pressure",
          p2b2: "p3d-industry-trust-pressure",
          p2b3: "p3a-surveillance-tracing-pressure",
        },
        strong: "p3b-containment-compliance-pressure",
        mixed: "p3b-containment-compliance-pressure",
        limited: "p3b-containment-compliance-pressure",
        fallback: "p3b-containment-compliance-pressure",
      },
    },

    {
      id: "p2c-surveillance-pressure",
      phaseNumber: 2,
      title: "Early Response — Consequence of Weak Surveillance",
      timeframe: "24–72 Hours",
      branchFamily: "surveillance",
      baseScenarioText:
        "Early surveillance was not prioritised strongly enough. Several linked locations went unchecked during the critical early window, and suspect infestations are now being identified reactively rather than proactively. Situational awareness is fragmented and prioritisation is becoming more reactive.",
      criteria: [
        {
          id: "p2c1",
          text: "Rapidly scale structured surveillance across high-risk linked sites",
          consequence:
            "If surveillance remains delayed, more infested sites may stay undetected.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "surveillance",
            "inspection",
            "sampling",
            "high-risk",
            "scale up",
            "linked sites",
          ],
        },
        {
          id: "p2c2",
          text: "Improve coordination and information sharing to restore situational awareness",
          consequence:
            "If coordination remains fragmented, inspection and containment decisions may continue to lag.",
          theme: "Protocols",
          required: true,
          weight: 2,
          keywords: [
            "coordination",
            "ICC",
            "situational awareness",
            "information sharing",
          ],
        },
        {
          id: "p2c3",
          text: "Reinforce containment and stakeholder guidance to reduce unmanaged movement",
          consequence:
            "If controls and communication remain weak, non-compliance and continued spread may increase.",
          theme: "Communication",
          required: true,
          weight: 2,
          keywords: [
            "containment",
            "communication",
            "guidance",
            "movement",
            "compliance",
          ],
        },
      ],
      questions: [
        {
          id: "p2cq1",
          text: "How would you recover from delayed surveillance and restore control of the situation?",
          theme: "Data",
          placeholder:
            "Describe your surveillance, coordination, and risk-prioritisation actions...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p2c1", "p2c2", "p2c3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p2c1", "p2c2", "p2c3"],
        byMissingRequired: {
          p2c1: "p3a-surveillance-tracing-pressure",
          p2c2: "p3c-icc-coordination-pressure",
          p2c3: "p3d-industry-trust-pressure",
        },
        strong: "p3a-surveillance-tracing-pressure",
        mixed: "p3a-surveillance-tracing-pressure",
        limited: "p3a-surveillance-tracing-pressure",
        fallback: "p3a-surveillance-tracing-pressure",
      },
    },

    {
      id: "p3-main",
      phaseNumber: 3,
      title: "Escalation with Controlled Response",
      timeframe: "72 Hours–5 Days",
      branchFamily: "main",
      baseScenarioText:
        "The mussel is now likely confirmed as exotic and a sustained response is taking shape. Surveillance and tracing have progressed well, linked pathways are becoming clearer, containment measures are being applied more consistently, and a draft response plan is being prepared. The incident remains serious, but operational control is still realistic if momentum is maintained.",
      criteria: [
        {
          id: "p3m1",
          text: "Complete surveillance and trace mapping to define the spread picture more confidently",
          consequence:
            "If surveillance and tracing remain incomplete, confidence in the true extent of spread may weaken.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "surveillance",
            "tracing",
            "mapping",
            "pathways",
            "spread picture",
          ],
        },
        {
          id: "p3m2",
          text: "Prepare approvals, disposal, and operational scale-up planning",
          consequence:
            "If planning lags, later response actions may become delayed and fragmented.",
          theme: "Constraints",
          required: true,
          weight: 2,
          keywords: [
            "approvals",
            "disposal",
            "planning",
            "operational scale-up",
            "logistics",
          ],
        },
        {
          id: "p3m3",
          text: "Stabilise incident coordination and keep stakeholders aligned under pressure",
          consequence:
            "If alignment weakens, confidence and operational momentum may fall.",
          theme: "Protocols",
          required: true,
          weight: 2,
          keywords: [
            "coordination",
            "alignment",
            "stakeholders",
            "response plan",
            "governance",
          ],
        },
      ],
      questions: [
        {
          id: "p3mq1",
          text: "What would you prioritise to keep the response controlled as the incident escalates?",
          theme: "Protocols",
          placeholder:
            "Describe your surveillance, planning, approvals, and coordination actions...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p3m1", "p3m2", "p3m3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p3m1", "p3m2", "p3m3"],
        byMissingRequired: {
          p3m1: "p4b-surveillance-pressure",
          p3m2: "p4a-disposal-pressure",
          p3m3: "p4c-approval-orc-pressure",
        },
        strong: "p4-main",
        mixed: "p4-main",
        limited: "p4b-surveillance-pressure",
        fallback: "p4-main",
      },
    },

    {
      id: "p3a-surveillance-tracing-pressure",
      phaseNumber: 3,
      title: "Escalation — Surveillance and Tracing Pressure",
      timeframe: "72 Hours–5 Days",
      branchFamily: "surveillance",
      baseScenarioText:
        "Weak earlier detection and incomplete pathway mapping have allowed additional suspect or infected sites to emerge under pressure. The response now has less confidence in the defined spread footprint, and some linked sites may have remained active longer than intended before controls were applied.",
      criteria: [
        {
          id: "p3a1",
          text: "Accelerate targeted inspections and sampling to close detection gaps",
          consequence:
            "If surveillance gaps remain open, more late detections may occur.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "inspection",
            "sampling",
            "targeted surveillance",
            "detection gaps",
            "high-risk",
          ],
        },
        {
          id: "p3a2",
          text: "Improve prioritisation and containment where delayed detection has increased risk",
          consequence:
            "If prioritisation remains weak, resources may be misallocated and spread may continue.",
          theme: "Constraints",
          required: true,
          weight: 2,
          keywords: [
            "prioritisation",
            "containment",
            "movement controls",
            "high-risk",
            "risk",
          ],
        },
        {
          id: "p3a3",
          text: "Explain uncertainty clearly to stakeholders while maintaining cooperation",
          consequence:
            "If uncertainty is not explained well, trust and cooperation may decline.",
          theme: "Communication",
          required: true,
          weight: 2,
          keywords: [
            "uncertainty",
            "communication",
            "stakeholders",
            "priorities",
            "guidance",
          ],
        },
      ],
      questions: [
        {
          id: "p3aq1",
          text: "How would you recover from late detections and improve confidence in the spread picture?",
          theme: "Data",
          placeholder:
            "Describe your surveillance, prioritisation, containment, and communication response...",
        },
      ],
      passingRules: {
        minScore: 5,
        requiredCriteriaIds: ["p3a1", "p3a2", "p3a3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p3a1", "p3a2", "p3a3"],
        byMissingRequired: {
          p3a1: "p4b-surveillance-pressure",
          p3a2: "p4a-disposal-pressure",
          p3a3: "p4c-approval-orc-pressure",
        },
        strong: "p4b-surveillance-pressure",
        mixed: "p4b-surveillance-pressure",
        limited: "p4b-surveillance-pressure",
        fallback: "p4b-surveillance-pressure",
      },
    },

    {
      id: "p3b-containment-compliance-pressure",
      phaseNumber: 3,
      title: "Escalation — Containment and Compliance Pressure",
      timeframe: "72 Hours–5 Days",
      branchFamily: "containment",
      baseScenarioText:
        "Earlier containment weaknesses have contributed to ongoing spread concerns across linked vessels, equipment, and operational activity. The response now faces greater pressure to enforce movement controls, rebuild compliance, and manage the consequences of inconsistent earlier restrictions.",
      criteria: [
        {
          id: "p3b1",
          text: "Strengthen enforceable containment and movement controls",
          consequence:
            "If containment remains inconsistent, spread may keep expanding through operational pathways.",
          theme: "Constraints",
          required: true,
          weight: 3,
          keywords: [
            "enforcement",
            "containment",
            "movement controls",
            "restrictions",
            "compliance",
          ],
        },
        {
          id: "p3b2",
          text: "Improve tracing and surveillance to understand where movement before controls created risk",
          consequence:
            "If tracing remains incomplete, the extent of spread may stay uncertain.",
          theme: "Data",
          required: true,
          weight: 2,
          keywords: [
            "tracing",
            "surveillance",
            "movement history",
            "pathways",
            "risk",
          ],
        },
        {
          id: "p3b3",
          text: "Repair stakeholder confidence through clearer and more consistent guidance",
          consequence:
            "If communication remains patchy, cooperation and reporting may weaken.",
          theme: "Stakeholders",
          required: true,
          weight: 2,
          keywords: [
            "guidance",
            "confidence",
            "stakeholders",
            "communication",
            "consistency",
          ],
        },
      ],
      questions: [
        {
          id: "p3bq1",
          text: "How would you regain control after weak early containment increased the complexity of the response?",
          theme: "Constraints",
          placeholder:
            "Describe your enforcement, tracing, surveillance, and stakeholder actions...",
        },
      ],
      passingRules: {
        minScore: 5,
        requiredCriteriaIds: ["p3b1", "p3b2", "p3b3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p3b1", "p3b2", "p3b3"],
        byMissingRequired: {
          p3b1: "p4a-disposal-pressure",
          p3b2: "p4b-surveillance-pressure",
          p3b3: "p4c-approval-orc-pressure",
        },
        strong: "p4a-disposal-pressure",
        mixed: "p4a-disposal-pressure",
        limited: "p4a-disposal-pressure",
        fallback: "p4a-disposal-pressure",
      },
    },

    {
      id: "p3c-icc-coordination-pressure",
      phaseNumber: 3,
      title: "Escalation — ICC and Coordination Pressure",
      timeframe: "72 Hours–5 Days",
      branchFamily: "coordination",
      baseScenarioText:
        "Strategic and operational coordination are under strain. Multiple linked sites are now involved, updates are pulling staff away from operations, and decision-making is slower than intended. Tracing, containment, and stakeholder management are all competing for attention.",
      criteria: [
        {
          id: "p3c1",
          text: "Strengthen coordination, staffing structure, and decision-making alignment",
          consequence:
            "If alignment is not restored, delays and mixed messaging may continue.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: [
            "ICC",
            "coordination",
            "staffing",
            "decision-making",
            "alignment",
            "governance",
          ],
        },
        {
          id: "p3c2",
          text: "Protect operational flow while maintaining surveillance and containment priorities",
          consequence:
            "If operational focus drifts, important field actions may lag behind planning pressure.",
          theme: "Constraints",
          required: true,
          weight: 2,
          keywords: [
            "operational flow",
            "priorities",
            "surveillance",
            "containment",
            "focus",
          ],
        },
        {
          id: "p3c3",
          text: "Provide clear updates that maintain confidence without overloading the response",
          consequence:
            "If updates are poorly managed, staff time and stakeholder trust may both suffer.",
          theme: "Communication",
          required: true,
          weight: 2,
          keywords: [
            "updates",
            "communication",
            "confidence",
            "briefings",
            "stakeholder trust",
          ],
        },
      ],
      questions: [
        {
          id: "p3cq1",
          text: "How would you stabilise coordination where strategic pressure is slowing operational delivery?",
          theme: "Protocols",
          placeholder:
            "Explain your staffing, coordination, prioritisation, and update-management actions...",
        },
      ],
      passingRules: {
        minScore: 5,
        requiredCriteriaIds: ["p3c1", "p3c2", "p3c3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p3c1", "p3c2", "p3c3"],
        byMissingRequired: {
          p3c1: "p4c-approval-orc-pressure",
          p3c2: "p4a-disposal-pressure",
          p3c3: "p4c-approval-orc-pressure",
        },
        strong: "p4c-approval-orc-pressure",
        mixed: "p4c-approval-orc-pressure",
        limited: "p4c-approval-orc-pressure",
        fallback: "p4c-approval-orc-pressure",
      },
    },

    {
      id: "p3d-industry-trust-pressure",
      phaseNumber: 3,
      title: "Escalation — Industry Trust and Stakeholder Pressure",
      timeframe: "72 Hours–5 Days",
      branchFamily: "trust",
      baseScenarioText:
        "Operational work is continuing, but stakeholder engagement has not kept pace. Confusion is growing among marina operators, vessel owners, contractors, and related industries. Reporting and compliance are becoming less consistent as expectations are not being managed clearly.",
      criteria: [
        {
          id: "p3d1",
          text: "Rebuild stakeholder confidence through practical guidance and regular communication",
          consequence:
            "If expectations remain unclear, compliance and reporting may continue to weaken.",
          theme: "Stakeholders",
          required: true,
          weight: 3,
          keywords: [
            "guidance",
            "stakeholders",
            "confidence",
            "communication",
            "regular updates",
          ],
        },
        {
          id: "p3d2",
          text: "Support operational compliance with clearer expectations and follow-up",
          consequence:
            "If compliance support remains weak, control measures may be undermined.",
          theme: "Communication",
          required: true,
          weight: 2,
          keywords: [
            "compliance",
            "expectations",
            "follow-up",
            "communication",
          ],
        },
        {
          id: "p3d3",
          text: "Keep surveillance and containment priorities aligned with emerging concerns",
          consequence:
            "If operational priorities drift, the response may lose focus while criticism grows.",
          theme: "Protocols",
          required: true,
          weight: 2,
          keywords: [
            "priorities",
            "surveillance",
            "containment",
            "alignment",
          ],
        },
      ],
      questions: [
        {
          id: "p3dq1",
          text: "How would you restore confidence and improve cooperation where guidance and expectations have become unclear?",
          theme: "Stakeholders",
          placeholder:
            "Describe your engagement, compliance, and operational alignment actions...",
        },
      ],
      passingRules: {
        minScore: 5,
        requiredCriteriaIds: ["p3d1", "p3d2", "p3d3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p3d1", "p3d2", "p3d3"],
        byMissingRequired: {
          p3d1: "p4c-approval-orc-pressure",
          p3d2: "p4c-approval-orc-pressure",
          p3d3: "p4b-surveillance-pressure",
        },
        strong: "p4c-approval-orc-pressure",
        mixed: "p4c-approval-orc-pressure",
        limited: "p4c-approval-orc-pressure",
        fallback: "p4c-approval-orc-pressure",
      },
    },

    {
      id: "p4-main",
      phaseNumber: 4,
      title: "Implementation and Operational Scaling",
      timeframe: "5–14 Days",
      branchFamily: "main",
      baseScenarioText:
        "The mussel has now been formally confirmed as exotic, and the response is scaling operationally. Surveillance and tracing have progressed, containment measures are active, and the incident structure is functioning. However, approvals, disposal pathways, environmental safeguards, workforce strain, and stakeholder expectations are now placing pressure on the operation at the same time.",
      criteria: [
        {
          id: "p4m1",
          text: "Finalise approvals and practical arrangements for safe removal and disposal",
          consequence:
            "If approvals and logistics remain unresolved, destruction and decontamination may be delayed.",
          theme: "Constraints",
          required: true,
          weight: 3,
          keywords: [
            "approvals",
            "removal",
            "disposal",
            "logistics",
            "decontamination",
          ],
        },
        {
          id: "p4m2",
          text: "Maintain surveillance and verification so operational scaling is based on a stable spread picture",
          consequence:
            "If surveillance weakens now, later decisions may be based on unstable assumptions.",
          theme: "Data",
          required: true,
          weight: 2,
          keywords: [
            "surveillance",
            "verification",
            "spread picture",
            "monitoring",
            "sampling",
          ],
        },
        {
          id: "p4m3",
          text: "Keep coordination, response planning, and stakeholder messaging aligned under pressure",
          consequence:
            "If planning and communication become misaligned, confidence and momentum may drop.",
          theme: "Protocols",
          required: true,
          weight: 2,
          keywords: [
            "coordination",
            "response plan",
            "messaging",
            "alignment",
            "stakeholders",
          ],
        },
      ],
      questions: [
        {
          id: "p4mq1",
          text: "How would you move from investigation into safe operational scaling at this stage?",
          theme: "Protocols",
          placeholder:
            "Describe your approvals, disposal planning, surveillance, and coordination approach...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p4m1", "p4m2", "p4m3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p4m1", "p4m2", "p4m3"],
        byMissingRequired: {
          p4m1: "p5a-workforce-disposal-pressure",
          p4m2: "p5b-surveillance-residual-risk",
          p4m3: "p5c-recovery-alignment-pressure",
        },
        strong: "p5-main",
        mixed: "p5-main",
        limited: "p5b-surveillance-residual-risk",
        fallback: "p5-main",
      },
    },

    {
      id: "p4a-disposal-pressure",
      phaseNumber: 4,
      title: "Implementation — Removal and Disposal Pressure",
      timeframe: "5–14 Days",
      branchFamily: "disposal",
      baseScenarioText:
        "Removal, disposal, and decontamination planning are under pressure. Infected material may remain in the system longer than intended if approvals, logistics, and environmental safeguards are not finalised quickly and consistently.",
      criteria: [
        {
          id: "p4a1",
          text: "Stabilise practical removal, disposal, and decontamination arrangements",
          consequence:
            "If execution remains delayed, infected material may stay in circulation longer than intended.",
          theme: "Constraints",
          required: true,
          weight: 3,
          keywords: [
            "removal",
            "disposal",
            "decontamination",
            "logistics",
            "environmental safeguards",
          ],
        },
        {
          id: "p4a2",
          text: "Protect workforce and operational flow while disposal pressure increases",
          consequence:
            "If operational flow breaks down, delays and mistakes may become more likely.",
          theme: "Protocols",
          required: true,
          weight: 2,
          keywords: [
            "workforce",
            "operational flow",
            "coordination",
            "staffing",
            "pressure",
          ],
        },
      ],
      questions: [
        {
          id: "p4aq1",
          text: "How would you keep removal and disposal credible where execution pressure is increasing?",
          theme: "Constraints",
          placeholder:
            "Explain your disposal, approvals, logistics, and workforce approach...",
        },
      ],
      passingRules: {
        minScore: 4,
        requiredCriteriaIds: ["p4a1", "p4a2"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p4a1", "p4a2"],
        byMissingRequired: {
          p4a1: "p5a-workforce-disposal-pressure",
          p4a2: "p5a-workforce-disposal-pressure",
        },
        strong: "p5a-workforce-disposal-pressure",
        mixed: "p5a-workforce-disposal-pressure",
        limited: "p5a-workforce-disposal-pressure",
        fallback: "p5a-workforce-disposal-pressure",
      },
    },

    {
      id: "p4b-surveillance-pressure",
      phaseNumber: 4,
      title: "Implementation — Surveillance and Residual Detection Pressure",
      timeframe: "5–14 Days",
      branchFamily: "surveillance",
      baseScenarioText:
        "Because surveillance and trace closure were not completed strongly enough, additional linked risk locations are still emerging under pressure. The response remains active, but late detections and incomplete pathway mapping are increasing uncertainty and making prioritisation harder.",
      criteria: [
        {
          id: "p4b1",
          text: "Close major surveillance and tracing gaps across the linked network",
          consequence:
            "If surveillance and tracing remain incomplete, new detections may continue to emerge late.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "surveillance",
            "tracing",
            "linked network",
            "inspection",
            "sampling",
            "closure",
          ],
        },
        {
          id: "p4b2",
          text: "Re-prioritise high-risk controls while uncertainty remains",
          consequence:
            "If prioritisation is weak, scarce resources may be spread too thin.",
          theme: "Constraints",
          required: true,
          weight: 2,
          keywords: [
            "prioritise",
            "high-risk",
            "controls",
            "containment",
            "uncertainty",
          ],
        },
      ],
      questions: [
        {
          id: "p4bq1",
          text: "How would you close surveillance gaps while still controlling the highest-risk pathways?",
          theme: "Data",
          placeholder:
            "Explain your surveillance, trace closure, and risk-prioritisation actions...",
        },
      ],
      passingRules: {
        minScore: 4,
        requiredCriteriaIds: ["p4b1", "p4b2"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p4b1", "p4b2"],
        byMissingRequired: {
          p4b1: "p5b-surveillance-residual-risk",
          p4b2: "p5b-surveillance-residual-risk",
        },
        strong: "p5b-surveillance-residual-risk",
        mixed: "p5b-surveillance-residual-risk",
        limited: "p5b-surveillance-residual-risk",
        fallback: "p5b-surveillance-residual-risk",
      },
    },

    {
      id: "p4c-approval-orc-pressure",
      phaseNumber: 4,
      title: "Implementation — Approval, ORC, and Stakeholder Pressure",
      timeframe: "5–14 Days",
      branchFamily: "alignment",
      baseScenarioText:
        "Approvals, coordination expectations, and stakeholder confidence are now all under strain. Operational work is continuing, but delays in formal alignment are slowing implementation and placing pressure on confidence, workforce attention, and response momentum.",
      criteria: [
        {
          id: "p4c1",
          text: "Restore alignment between approvals, operational coordination, and response planning",
          consequence:
            "If approvals and coordination remain misaligned, implementation may continue to lag.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: [
            "approvals",
            "alignment",
            "response plan",
            "coordination",
            "ORC",
          ],
        },
        {
          id: "p4c2",
          text: "Maintain stakeholder confidence with clear and realistic communication",
          consequence:
            "If confidence weakens further, cooperation and compliance may deteriorate.",
          theme: "Communication",
          required: true,
          weight: 2,
          keywords: [
            "confidence",
            "communication",
            "realistic updates",
            "stakeholders",
            "trust",
          ],
        },
      ],
      questions: [
        {
          id: "p4cq1",
          text: "How would you stabilise implementation where approvals, coordination, and confidence are all under pressure?",
          theme: "Protocols",
          placeholder:
            "Describe your approvals, alignment, update-management, and confidence-maintenance actions...",
        },
      ],
      passingRules: {
        minScore: 4,
        requiredCriteriaIds: ["p4c1", "p4c2"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p4c1", "p4c2"],
        byMissingRequired: {
          p4c1: "p5c-recovery-alignment-pressure",
          p4c2: "p5c-recovery-alignment-pressure",
        },
        strong: "p5c-recovery-alignment-pressure",
        mixed: "p5c-recovery-alignment-pressure",
        limited: "p5c-recovery-alignment-pressure",
        fallback: "p5c-recovery-alignment-pressure",
      },
    },

    {
      id: "p5-main",
      phaseNumber: 5,
      title: "Sustained Response and Recovery Planning",
      timeframe: "10–21 Days",
      branchFamily: "main",
      baseScenarioText:
        "Major operational controls are now established. Destruction and decontamination are underway or prepared, surveillance is continuing, linked pathways are being verified, and recovery planning is beginning. The main remaining challenge is to sustain workforce capacity, maintain surveillance confidence, and prepare a disciplined recovery transition.",
      criteria: [
        {
          id: "p5m1",
          text: "Manage workforce sustainability and maintain operational capacity",
          consequence:
            "If staffing fatigue is not managed well, response quality may decline during the final stretch.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: [
            "workforce",
            "fatigue",
            "rotations",
            "staffing",
            "capacity",
            "sustainability",
          ],
        },
        {
          id: "p5m2",
          text: "Maintain surveillance and verification so confidence in containment remains strong",
          consequence:
            "If surveillance weakens now, unresolved spread risk may carry into close-out.",
          theme: "Data",
          required: true,
          weight: 2,
          keywords: [
            "surveillance",
            "verification",
            "containment confidence",
            "monitoring",
            "residual risk",
          ],
        },
        {
          id: "p5m3",
          text: "Start disciplined recovery planning and clear expectations for the transition out of response mode",
          consequence:
            "If recovery planning is weak, the final transition may become confused or inconsistent.",
          theme: "Communication",
          required: true,
          weight: 2,
          keywords: [
            "recovery planning",
            "transition",
            "expectations",
            "close-out",
            "restrictions",
          ],
        },
      ],
      questions: [
        {
          id: "p5mq1",
          text: "How would you sustain the response and prepare for recovery while keeping the operation credible through the final phase?",
          theme: "Communication",
          placeholder:
            "Describe your workforce, surveillance, and recovery-planning approach...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p5m1", "p5m2", "p5m3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p5m1", "p5m2", "p5m3"],
        byMissingRequired: {
          p5m1: "p6a-workforce-closeout",
          p5m2: "p6b-surveillance-closeout",
          p5m3: "p6c-recovery-closeout",
        },
        strong: "p6-main",
        mixed: "p6-main",
        limited: "p6a-workforce-closeout",
        fallback: "p6-main",
      },
    },

    {
      id: "p5a-workforce-disposal-pressure",
      phaseNumber: 5,
      title: "Sustained Response — Workforce and Disposal Pressure",
      timeframe: "10–21 Days",
      branchFamily: "workforce",
      baseScenarioText:
        "Disposal, decontamination, and related operational tasks are continuing under pressure. Workforce fatigue, task coordination, and execution consistency are becoming the main challenges as the response enters the late stage.",
      criteria: [
        {
          id: "p5a1",
          text: "Stabilise workforce capacity and execution discipline through the late-stage response",
          consequence:
            "If fatigue and coordination are not managed, final operations may become less reliable and slower.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: [
            "workforce",
            "fatigue",
            "rotations",
            "capacity",
            "late-stage",
            "discipline",
          ],
        },
      ],
      questions: [
        {
          id: "p5aq1",
          text: "How would you keep late-stage operations reliable where workforce and disposal pressure remain high?",
          theme: "Protocols",
          placeholder:
            "Explain your staffing, rotation, coordination, and operational-discipline approach...",
        },
      ],
      passingRules: {
        minScore: 3,
        requiredCriteriaIds: ["p5a1"],
      },
      nextStageMap: {
        byMissingRequired: {
          p5a1: "p6a-workforce-closeout",
        },
        strong: "p6a-workforce-closeout",
        mixed: "p6a-workforce-closeout",
        limited: "p6a-workforce-closeout",
        fallback: "p6a-workforce-closeout",
      },
    },

    {
      id: "p5b-surveillance-residual-risk",
      phaseNumber: 5,
      title: "Sustained Response — Residual Surveillance Risk",
      timeframe: "10–21 Days",
      branchFamily: "surveillance",
      baseScenarioText:
        "Because surveillance and trace closure remained incomplete earlier, the response is still carrying late-detection risk into the final stage. Confidence in the true spread picture is reduced and additional infected locations may still emerge if verification is not maintained.",
      criteria: [
        {
          id: "p5b1",
          text: "Prioritise final targeted surveillance and residual-risk controls",
          consequence:
            "If final surveillance still does not close the main gaps, the response may end with unresolved spread risk.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "targeted surveillance",
            "residual risk",
            "final inspections",
            "verification",
            "monitoring",
          ],
        },
      ],
      questions: [
        {
          id: "p5bq1",
          text: "What would you do now that residual detection risk is still active going into the final stage?",
          theme: "Data",
          placeholder:
            "Explain your last-round surveillance and residual-risk-control actions...",
        },
      ],
      passingRules: {
        minScore: 3,
        requiredCriteriaIds: ["p5b1"],
      },
      nextStageMap: {
        byMissingRequired: {
          p5b1: "p6b-surveillance-closeout",
        },
        strong: "p6b-surveillance-closeout",
        mixed: "p6b-surveillance-closeout",
        limited: "p6b-surveillance-closeout",
        fallback: "p6b-surveillance-closeout",
      },
    },

    {
      id: "p5c-recovery-alignment-pressure",
      phaseNumber: 5,
      title: "Sustained Response — Recovery and Alignment Pressure",
      timeframe: "10–21 Days",
      branchFamily: "recovery",
      baseScenarioText:
        "The response now depends on approval follow-through, coordination alignment, and maintaining stakeholder confidence while the operation remains disruptive. Recovery planning is possible, but confidence and expectations still need careful management.",
      criteria: [
        {
          id: "p5c1",
          text: "Keep recovery planning, stakeholder expectations, and coordination aligned through the late-stage response",
          consequence:
            "If alignment weakens now, the transition into close-out may become fragile and confused.",
          theme: "Communication",
          required: true,
          weight: 3,
          keywords: [
            "recovery planning",
            "alignment",
            "stakeholders",
            "expectations",
            "coordination",
            "close-out",
          ],
        },
      ],
      questions: [
        {
          id: "p5cq1",
          text: "How would you maintain confidence and alignment while preparing for close-out and recovery?",
          theme: "Communication",
          placeholder:
            "Explain your recovery planning, communication, and final alignment approach...",
        },
      ],
      passingRules: {
        minScore: 3,
        requiredCriteriaIds: ["p5c1"],
      },
      nextStageMap: {
        byMissingRequired: {
          p5c1: "p6c-recovery-closeout",
        },
        strong: "p6c-recovery-closeout",
        mixed: "p6c-recovery-closeout",
        limited: "p6c-recovery-closeout",
        fallback: "p6c-recovery-closeout",
      },
    },

    {
      id: "p6-main",
      phaseNumber: 6,
      title: "Final Phase — Controlled Close-Out",
      timeframe: "Final Phase",
      branchFamily: "main",
      isTerminal: true,
      summaryCategory: "controlled-closeout",
      baseScenarioText:
        "The response reaches the final phase with operational control largely maintained. Remaining priorities focus on disciplined close-out, verification, and clear recovery transition arrangements.",
      criteria: [
        {
          id: "p6m1",
          text: "Explain how you would maintain disciplined close-out, final verification, and a clear recovery transition",
          consequence:
            "If close-out is poorly managed, avoidable confusion may still emerge at the final stage.",
          theme: "Expectations",
          required: true,
          weight: 2,
          keywords: [
            "close-out",
            "verification",
            "recovery transition",
            "discipline",
            "final priorities",
          ],
        },
      ],
      questions: [
        {
          id: "p6mq1",
          text: "How would you bring the response to a disciplined and credible close while preparing the recovery transition?",
          theme: "Expectations",
          placeholder:
            "Explain your final close-out, verification, and transition approach...",
        },
      ],
      passingRules: {
        minScore: 2,
        requiredCriteriaIds: ["p6m1"],
      },
      nextStageMap: {
        strong: "complete",
        mixed: "complete",
        limited: "complete",
        fallback: "complete",
      },
    },

    {
      id: "p6a-workforce-closeout",
      phaseNumber: 6,
      title: "Final Phase — Workforce and Execution Close-Out",
      timeframe: "Final Phase",
      branchFamily: "workforce",
      isTerminal: true,
      summaryCategory: "workforce-closeout",
      baseScenarioText:
        "The final phase is shaped by workforce pressure, operational fatigue, and the need to keep late-stage execution stable enough to conclude the response credibly.",
      criteria: [
        {
          id: "p6a1",
          text: "Explain how you would stabilise final operations and maintain execution discipline under fatigue pressure",
          consequence:
            "If late-stage execution remains unstable, the final transition may be less credible and harder to sustain.",
          theme: "Protocols",
          required: true,
          weight: 2,
          keywords: [
            "stabilise",
            "operations",
            "fatigue",
            "discipline",
            "late-stage",
            "workforce",
          ],
        },
      ],
      questions: [
        {
          id: "p6aq1",
          text: "How would you maintain credibility where final operations are still under workforce pressure?",
          theme: "Protocols",
          placeholder:
            "Explain your stabilisation, staffing, and close-out actions...",
        },
      ],
      passingRules: {
        minScore: 2,
        requiredCriteriaIds: ["p6a1"],
      },
      nextStageMap: {
        strong: "complete",
        mixed: "complete",
        limited: "complete",
        fallback: "complete",
      },
    },

    {
      id: "p6b-surveillance-closeout",
      phaseNumber: 6,
      title: "Final Phase — Residual Surveillance Close-Out",
      timeframe: "Final Phase",
      branchFamily: "surveillance",
      isTerminal: true,
      summaryCategory: "surveillance-closeout",
      baseScenarioText:
        "The final phase is now shaped by lingering uncertainty about residual detection risk. Operational success depends on disciplined final verification, targeted monitoring, and cautious close-out decisions.",
      criteria: [
        {
          id: "p6b1",
          text: "Explain how you would manage final verification and residual-risk decisions before close-out",
          consequence:
            "If residual-risk decisions are weak, the response may end with unresolved uncertainty.",
          theme: "Data",
          required: true,
          weight: 2,
          keywords: [
            "verification",
            "residual risk",
            "final surveillance",
            "monitoring",
            "close-out",
          ],
        },
      ],
      questions: [
        {
          id: "p6bq1",
          text: "How would you manage close-out where residual detection uncertainty is still present?",
          theme: "Data",
          placeholder:
            "Explain your final verification and residual-risk approach...",
        },
      ],
      passingRules: {
        minScore: 2,
        requiredCriteriaIds: ["p6b1"],
      },
      nextStageMap: {
        strong: "complete",
        mixed: "complete",
        limited: "complete",
        fallback: "complete",
      },
    },

    {
      id: "p6c-recovery-closeout",
      phaseNumber: 6,
      title: "Final Phase — Recovery and Confidence Close-Out",
      timeframe: "Final Phase",
      branchFamily: "recovery",
      isTerminal: true,
      summaryCategory: "recovery-closeout",
      baseScenarioText:
        "The final phase is shaped by the need to maintain confidence, communicate clearly, and conclude the response in a coordinated way while preparing for recovery and lifting of restrictions.",
      criteria: [
        {
          id: "p6c1",
          text: "Explain how you would maintain confidence, communication, and coordinated recovery close-out under pressure",
          consequence:
            "If coordination and confidence are not maintained, the final phase may become disorderly and harder to conclude well.",
          theme: "Communication",
          required: true,
          weight: 2,
          keywords: [
            "confidence",
            "communication",
            "coordinated close-out",
            "recovery",
            "pressure",
          ],
        },
      ],
      questions: [
        {
          id: "p6cq1",
          text: "How would you manage final close-out where confidence and recovery expectations are under strain?",
          theme: "Communication",
          placeholder:
            "Explain your confidence, communication, and close-out actions...",
        },
      ],
      passingRules: {
        minScore: 2,
        requiredCriteriaIds: ["p6c1"],
      },
      nextStageMap: {
        strong: "complete",
        mixed: "complete",
        limited: "complete",
        fallback: "complete",
      },
    },

    {
      id: "complete",
      phaseNumber: 7,
      title: "Simulation Complete",
      timeframe: "End State",
      branchFamily: "complete",
      isTerminal: true,
      summaryCategory: "reflection",
      baseScenarioText:
        "You have reached the end of the simulation. Before viewing the final summary, briefly reflect on the most important operational priorities across the response and how missed actions early in the incident can worsen later consequences.",
      criteria: [],
      questions: [
        {
          id: "complete-q1",
          text: "Before viewing the final summary, briefly reflect on the major priorities across the incident and what gaps most increased consequence over time.",
          theme: "Expectations",
          placeholder:
            "Write a short reflection on the major priorities, risks, and lessons across the simulation...",
        },
      ],
      passingRules: {
        minScore: 0,
        requiredCriteriaIds: [],
      },
      nextStageMap: {
        fallback: "",
      },
    },
  ],
};

export function getScenarioStageById(stageId: string): ScenarioStage | undefined {
  return invasiveMusselScenario.stages.find((stage) => stage.id === stageId);
}