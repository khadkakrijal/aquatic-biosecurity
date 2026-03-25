import { Scenario } from "@/app/types/simulation";

export const invasiveMusselScenario: Scenario = {
  id: "invasive-mussel",
  title: "Invasive Mussel Incursion — Response and Preparedness Exercise",
  slug: "invasive-mussel",
  overview:
    "An aquatic biosecurity simulation designed to assess operational decision-making during a suspected invasive mussel incursion in a high-risk marina environment.",
  nodes: [
    {
      id: "p1-main",
      phaseNumber: 1,
      kind: "main",
      title: "Detection and Immediate Response",
      timeframe: "0–24 Hours",
      scenarioText:
        "A local boater has reported dense clusters of small bivalve shells attached to vessel hulls, marina pylons, ropes, and mooring lines. Images submitted to the aquatic biosecurity unit indicate a suspected exotic mussel species. Although laboratory confirmation is still pending, the organism displays high-risk invasive characteristics, including rapid colonisation potential and planktonic larval dispersal. The site is an active marina with frequent recreational and commercial vessel movement, creating an immediate risk of spread.",
      criteria: [
        {
          id: "p1c1",
          text: "Immediate reporting to the relevant aquatic biosecurity authority and escalation through formal channels",
          consequence:
            "Delays in formal reporting may hinder coordination and slow escalation of the response.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: ["report", "notify", "authority", "biosecurity"],
        },
        {
          id: "p1c2",
          text: "Activate incident management arrangements and response coordination",
          consequence:
            "Failure to establish coordinated incident management may result in fragmented response activity.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: ["incident management", "BIMS", "coordination"],
        },
        {
          id: "p1c3",
          text: "Begin delimiting surveillance planning around the suspect site",
          consequence:
            "Insufficient early surveillance may allow spread to go undetected and increase later operational complexity.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: ["surveillance", "delimiting", "sampling", "inspection"],
        },
        {
          id: "p1c4",
          text: "Engage key stakeholders including marina operators, industry, and councils",
          consequence:
            "Limited stakeholder engagement may reduce cooperation and increase operational pressure.",
          theme: "Stakeholders",
          required: false,
          weight: 1,
          keywords: ["stakeholders", "marina", "industry", "council", "fishers"],
        },
        {
          id: "p1c5",
          text: "Introduce immediate containment measures to reduce spread risk",
          consequence:
            "Delays in containment may increase the likelihood of local or regional spread.",
          theme: "Constraints",
          required: true,
          weight: 2,
          keywords: ["containment", "movement control", "restrict", "quarantine"],
        },
      ],
      questions: [
        {
          id: "p1q1",
          text: "What immediate actions would you take in response to this suspected detection?",
          theme: "Protocols",
          placeholder:
            "Describe the immediate operational steps you would initiate...",
        },
        {
          id: "p1q2",
          text: "Who would you notify and what early measures would you take to reduce spread while confirmation is pending?",
          theme: "Communication",
          placeholder:
            "Explain reporting, coordination, surveillance, containment, and stakeholder actions...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p1c1", "p1c2", "p1c3"],
      },
      nextOnPass: "p2-main",
      nextOnPartial: "p1-remedial",
      nextOnFail: "p1-failure",
    },

    {
      id: "p1-remedial",
      phaseNumber: 1,
      kind: "remedial",
      title: "Response Review and Recovery",
      timeframe: "0–24 Hours",
      scenarioText:
        "Initial actions have addressed some aspects of the suspected incursion; however, important elements of the early response remain incomplete. There is increasing concern that delays in coordination, surveillance, or containment may reduce confidence in the current response posture and increase the risk of undetected spread.",
      criteria: [
        {
          id: "p1r1",
          text: "Strengthen reporting and coordination immediately",
          consequence:
            "Ongoing gaps in coordination may further reduce response effectiveness.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: ["report", "notify", "coordination", "incident management"],
        },
        {
          id: "p1r2",
          text: "Expand immediate surveillance and containment",
          consequence:
            "If surveillance and containment remain insufficient, spread may continue unnoticed.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: ["surveillance", "containment", "sampling", "movement control"],
        },
        {
          id: "p1r3",
          text: "Improve stakeholder and community communication",
          consequence:
            "Poor communication may reduce compliance and increase operational pressure.",
          theme: "Communication",
          required: false,
          weight: 1,
          keywords: ["community", "stakeholders", "communication", "awareness"],
        },
      ],
      questions: [
        {
          id: "p1rq1",
          text: "Given the gaps identified in the initial response, what actions would you now take to strengthen the operation?",
          theme: "Protocols",
          placeholder:
            "Explain how you would improve and stabilise the response...",
        },
        {
          id: "p1rq2",
          text: "How would you recover confidence in the response while reducing the chance of further spread?",
          theme: "Expectations",
          placeholder:
            "Describe how you would correct earlier gaps and reinforce control measures...",
        },
      ],
      passingRules: {
        minScore: 4,
        requiredCriteriaIds: ["p1r1", "p1r2"],
      },
      nextOnPass: "p2-main",
      nextOnPartial: "p1-remedial",
      nextOnFail: "p1-failure",
    },

    {
      id: "p1-failure",
      phaseNumber: 1,
      kind: "failure",
      title: "Escalation Following Delayed Response",
      timeframe: "24–48 Hours",
      scenarioText:
        "Due to delays in critical early response actions, further suspect fouling has now been identified on nearby vessels and marina infrastructure, indicating an increased likelihood of local spread. Operational pressure is increasing, and the situation now requires urgent corrective action to restore control and reduce further transmission risk.",
      criteria: [
        {
          id: "p1f1",
          text: "Recognise that delayed action has worsened the situation",
          consequence:
            "Failure to recognise escalation may lead to an inadequate operational response.",
          theme: "Expectations",
          required: true,
          weight: 2,
          keywords: ["spread", "escalation", "worsened", "additional sites"],
        },
        {
          id: "p1f2",
          text: "Take urgent corrective action through containment and surveillance",
          consequence:
            "Without urgent corrective measures, spread may continue across connected sites and vessels.",
          theme: "Constraints",
          required: true,
          weight: 3,
          keywords: ["containment", "surveillance", "urgent", "movement control"],
        },
        {
          id: "p1f3",
          text: "Re-establish coordination and stakeholder communication under pressure",
          consequence:
            "Weak coordination may increase confusion, criticism, and loss of control.",
          theme: "Communication",
          required: false,
          weight: 1,
          keywords: ["coordination", "stakeholders", "communication", "briefing"],
        },
      ],
      questions: [
        {
          id: "p1fq1",
          text: "The situation has now escalated. What urgent actions would you take to regain control of the response?",
          theme: "Communication",
          placeholder:
            "Describe the immediate corrective actions you would now implement...",
        },
        {
          id: "p1fq2",
          text: "How would you prevent further spread now that additional suspect fouling has been detected nearby?",
          theme: "Constraints",
          placeholder:
            "Explain the urgent surveillance, containment, and coordination actions you would take...",
        },
      ],
      passingRules: {
        minScore: 4,
        requiredCriteriaIds: ["p1f1", "p1f2"],
      },
      nextOnPass: "p2-main",
      nextOnPartial: "p1-failure",
      nextOnFail: "p1-failure",
    },

    {
      id: "p2-main",
      phaseNumber: 2,
      kind: "main",
      title: "Structured Investigation",
      timeframe: "24–72 Hours",
      scenarioText:
        "Expanded surveillance has now identified suspect fouling on marina infrastructure, adjacent vessels, and nearby jetties. Four suspect locations have emerged within a 10 km radius, and environmental sampling indicates possible larval presence in surrounding waters. Tracing is complicated by incomplete vessel movement and hull cleaning records, while community concern is increasing.",
      criteria: [
        {
          id: "p2c1",
          text: "Implement a structured surveillance program using appropriate methods",
          consequence:
            "Delayed or insufficient surveillance may miss cryptic spread and allow rapid expansion.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: ["surveillance", "settlement plates", "visual", "larval sampling", "eDNA"],
        },
        {
          id: "p2c2",
          text: "Trace likely spread pathways including vessels, gear, and events",
          consequence:
            "If tracing is incomplete, infected locations may be missed and the response may be misdirected.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: ["tracing", "pathways", "boats", "gear", "events", "vessel movement"],
        },
        {
          id: "p2c3",
          text: "Strengthen containment measures around infected and suspect sites",
          consequence:
            "Weak containment may allow further movement-based spread.",
          theme: "Constraints",
          required: true,
          weight: 2,
          keywords: ["containment", "infected sites", "movement control"],
        },
        {
          id: "p2c4",
          text: "Maintain community communication and industry engagement",
          consequence:
            "Poor communication may reduce awareness, reporting, and compliance.",
          theme: "Communication",
          required: false,
          weight: 1,
          keywords: ["community", "industry", "communication", "awareness"],
        },
      ],
      questions: [
        {
          id: "p2q1",
          text: "What actions would you take to investigate the extent of spread and better understand transmission pathways at this stage?",
          theme: "Data",
          placeholder:
            "Describe your surveillance, tracing, and investigation approach...",
        },
        {
          id: "p2q2",
          text: "How would you manage containment and communication while the investigation is expanding?",
          theme: "Communication",
          placeholder:
            "Explain how you would reduce spread and keep stakeholders informed...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p2c1", "p2c2", "p2c3"],
      },
      nextOnPass: "p3-main",
      nextOnPartial: "p2-remedial",
      nextOnFail: "p2-failure",
    },

    {
      id: "p2-remedial",
      phaseNumber: 2,
      kind: "remedial",
      title: "Investigation Review and Refinement",
      timeframe: "24–72 Hours",
      scenarioText:
        "Some investigation actions have commenced, but the current approach remains incomplete. There is concern that surveillance design, tracing activity, or site-level containment may not yet be sufficient to detect the full extent of spread or prevent further dispersal.",
      criteria: [
        {
          id: "p2r1",
          text: "Refine surveillance design and improve detection confidence",
          consequence:
            "Weak surveillance design may leave spread undetected.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: ["refine surveillance", "sampling", "detection", "confidence"],
        },
        {
          id: "p2r2",
          text: "Improve tracing and infected-site controls",
          consequence:
            "Poor tracing and control may allow spread pathways to remain active.",
          theme: "Constraints",
          required: true,
          weight: 3,
          keywords: ["tracing", "controls", "infected sites", "movement"],
        },
        {
          id: "p2r3",
          text: "Strengthen external communication with affected groups",
          consequence:
            "Reduced communication may increase confusion and distrust.",
          theme: "Communication",
          required: false,
          weight: 1,
          keywords: ["community", "industry", "briefings", "communication"],
        },
      ],
      questions: [
        {
          id: "p2rq1",
          text: "How would you improve the investigation if surveillance and tracing are not yet providing enough confidence?",
          theme: "Data",
          placeholder:
            "Describe how you would strengthen detection, tracing, and control measures...",
        },
        {
          id: "p2rq2",
          text: "What would you do to maintain cooperation from the community and affected industries during this uncertain stage?",
          theme: "Stakeholders",
          placeholder:
            "Explain your communication and engagement approach...",
        },
      ],
      passingRules: {
        minScore: 4,
        requiredCriteriaIds: ["p2r1", "p2r2"],
      },
      nextOnPass: "p3-main",
      nextOnPartial: "p2-remedial",
      nextOnFail: "p2-failure",
    },

    {
      id: "p2-failure",
      phaseNumber: 2,
      kind: "failure",
      title: "Escalation During Investigation",
      timeframe: "48–72 Hours",
      scenarioText:
        "The investigation has not kept pace with the spread risk. Additional suspect locations are emerging, environmental indicators suggest wider larval dispersal, and confidence in the current tracing and containment effort is declining. Stakeholder concern is now intensifying.",
      criteria: [
        {
          id: "p2f1",
          text: "Recognise that the investigation and tracing effort is insufficient",
          consequence:
            "Failure to recognise the gap may delay corrective action.",
          theme: "Expectations",
          required: true,
          weight: 2,
          keywords: ["insufficient", "investigation gap", "spread widening"],
        },
        {
          id: "p2f2",
          text: "Take urgent action to strengthen surveillance, tracing, and infected-site controls",
          consequence:
            "Without stronger action, additional sites may continue to emerge.",
          theme: "Constraints",
          required: true,
          weight: 3,
          keywords: ["urgent", "surveillance", "tracing", "containment"],
        },
        {
          id: "p2f3",
          text: "Stabilise communication with community and industry under pressure",
          consequence:
            "Poor communication may increase criticism and reduce compliance.",
          theme: "Communication",
          required: false,
          weight: 1,
          keywords: ["communication", "community", "industry", "pressure"],
        },
      ],
      questions: [
        {
          id: "p2fq1",
          text: "The investigation is falling behind the spread risk. What urgent steps would you now take?",
          theme: "Constraints",
          placeholder:
            "Describe the corrective surveillance, tracing, containment, and communication actions...",
        },
        {
          id: "p2fq2",
          text: "How would you prevent the response from becoming misdirected as detections increase?",
          theme: "Expectations",
          placeholder:
            "Explain how you would restore control and improve operational focus...",
        },
      ],
      passingRules: {
        minScore: 4,
        requiredCriteriaIds: ["p2f1", "p2f2"],
      },
      nextOnPass: "p3-main",
      nextOnPartial: "p2-failure",
      nextOnFail: "p2-failure",
    },

    {
      id: "p3-main",
      phaseNumber: 3,
      kind: "main",
      title: "Confirmation and Escalation",
      timeframe: "72 Hours–5 Days",
      scenarioText:
        "Laboratory assessment now indicates the mussel species is likely exotic, while a second laboratory is completing formal confirmation. Expanded surveillance has identified six infected sites along the recreational coastline, with evidence of larval dispersal beyond visible infestations. Spread pathways are linked to charter boats, fishing tournaments, and holiday boat ramps. Industry, tourism, and environmental groups are demanding clarity, while eradication feasibility remains uncertain.",
      criteria: [
        {
          id: "p3c1",
          text: "Assess relevant cost-sharing and response support arrangements",
          consequence:
            "Without financial and governance clarity, the response may slow and staff fatigue may increase.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: ["NEBRA", "cost-sharing", "funding", "response support"],
        },
        {
          id: "p3c2",
          text: "Intensify industry and stakeholder engagement",
          consequence:
            "Poor engagement may lead to criticism, escalation, and reduced cooperation.",
          theme: "Stakeholders",
          required: true,
          weight: 2,
          keywords: ["industry", "tourism", "environmental groups", "stakeholders"],
        },
        {
          id: "p3c3",
          text: "Strengthen containment and movement controls around infected sites and vectors",
          consequence:
            "Without strong controls, new sites may continue to emerge.",
          theme: "Constraints",
          required: true,
          weight: 3,
          keywords: ["containment", "movement controls", "vectors", "infected sites"],
        },
        {
          id: "p3c4",
          text: "Maintain clear community communication as the incident escalates",
          consequence:
            "Poor public communication may leave recreational vectors unmanaged.",
          theme: "Communication",
          required: false,
          weight: 1,
          keywords: ["community communication", "public", "awareness"],
        },
      ],
      questions: [
        {
          id: "p3q1",
          text: "Now that the incursion is likely confirmed and multiple infected sites have been identified, what would you prioritise next?",
          theme: "Protocols",
          placeholder:
            "Describe your escalation, containment, stakeholder, and funding-related actions...",
        },
        {
          id: "p3q2",
          text: "How would you reduce further spread through high-risk vessels, ramps, and recreational activity?",
          theme: "Constraints",
          placeholder:
            "Explain the movement controls and public communication actions you would take...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p3c1", "p3c2", "p3c3"],
      },
      nextOnPass: "p4-main",
      nextOnPartial: "p3-remedial",
      nextOnFail: "p3-failure",
    },

    {
      id: "p3-remedial",
      phaseNumber: 3,
      kind: "remedial",
      title: "Escalation Review and Adjustment",
      timeframe: "72 Hours–5 Days",
      scenarioText:
        "The incident has escalated, but the current response does not yet fully address the increasing operational and stakeholder pressures. There are concerns that movement controls, funding arrangements, or external engagement may not be strong enough to support sustained response effectiveness.",
      criteria: [
        {
          id: "p3r1",
          text: "Clarify escalation, governance, and support arrangements",
          consequence:
            "Governance uncertainty may slow operations and reduce confidence.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: ["governance", "cost-sharing", "support arrangements", "escalation"],
        },
        {
          id: "p3r2",
          text: "Tighten movement controls and containment around infected sites",
          consequence:
            "Weak controls may allow continuing spread through high-risk pathways.",
          theme: "Constraints",
          required: true,
          weight: 3,
          keywords: ["movement controls", "containment", "infected sites"],
        },
        {
          id: "p3r3",
          text: "Improve engagement with external stakeholders and the public",
          consequence:
            "Poor engagement may intensify criticism and reduce compliance.",
          theme: "Communication",
          required: false,
          weight: 1,
          keywords: ["stakeholders", "public", "communication", "briefings"],
        },
      ],
      questions: [
        {
          id: "p3rq1",
          text: "What adjustments would you make if the current escalation response is not yet strong enough?",
          theme: "Protocols",
          placeholder:
            "Describe how you would strengthen governance, containment, and stakeholder coordination...",
        },
        {
          id: "p3rq2",
          text: "How would you maintain stakeholder confidence while the incident continues to expand?",
          theme: "Stakeholders",
          placeholder:
            "Explain your communication and engagement strategy at this point...",
        },
      ],
      passingRules: {
        minScore: 4,
        requiredCriteriaIds: ["p3r1", "p3r2"],
      },
      nextOnPass: "p4-main",
      nextOnPartial: "p3-remedial",
      nextOnFail: "p3-failure",
    },

    {
      id: "p3-failure",
      phaseNumber: 3,
      kind: "failure",
      title: "Escalating Spread and External Pressure",
      timeframe: "4–5 Days",
      scenarioText:
        "Containment and movement controls have not been strong enough, and new detections are continuing to emerge. Stakeholder criticism is intensifying, public confidence is weakening, and the response is at risk of losing operational momentum unless urgent corrective action is taken.",
      criteria: [
        {
          id: "p3f1",
          text: "Recognise that the response is losing control of spread and stakeholder confidence",
          consequence:
            "Failure to recognise the seriousness of the situation may delay urgent correction.",
          theme: "Expectations",
          required: true,
          weight: 2,
          keywords: ["losing control", "new detections", "confidence weakening"],
        },
        {
          id: "p3f2",
          text: "Take urgent action to strengthen vector controls, containment, and operational support",
          consequence:
            "Without urgent corrective action, the spread may continue unchecked.",
          theme: "Constraints",
          required: true,
          weight: 3,
          keywords: ["urgent", "vector controls", "containment", "support"],
        },
        {
          id: "p3f3",
          text: "Stabilise external communication and stakeholder management",
          consequence:
            "Unmanaged criticism may further damage cooperation and response performance.",
          theme: "Communication",
          required: false,
          weight: 1,
          keywords: ["stakeholder management", "communication", "confidence"],
        },
      ],
      questions: [
        {
          id: "p3fq1",
          text: "The incident is continuing to expand and criticism is increasing. What urgent steps would you take now?",
          theme: "Constraints",
          placeholder:
            "Describe the corrective actions you would implement to restore control...",
        },
        {
          id: "p3fq2",
          text: "How would you prevent further spread while maintaining confidence in the response?",
          theme: "Communication",
          placeholder:
            "Explain how you would combine control measures with stakeholder communication...",
        },
      ],
      passingRules: {
        minScore: 4,
        requiredCriteriaIds: ["p3f1", "p3f2"],
      },
      nextOnPass: "p4-main",
      nextOnPartial: "p3-failure",
      nextOnFail: "p3-failure",
    },

    {
      id: "p4-main",
      phaseNumber: 4,
      kind: "main",
      title: "Operational Response",
      timeframe: "5–14 Days",
      scenarioText:
        "A second laboratory has now confirmed the mussel as an exotic species. National coordination has been engaged and the incident has formally escalated. Fourteen infected sites have been identified, larval stages are present in surrounding waters, and response teams are balancing expanded surveillance, containment, and early control trials under growing industry and environmental pressure.",
      criteria: [
        {
          id: "p4c1",
          text: "Develop a staged operational response plan with clear direction",
          consequence:
            "Without a coherent response strategy, operations may become fragmented and inconsistent.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: ["response planning", "interim response strategy", "staged plan"],
        },
        {
          id: "p4c2",
          text: "Assess technical feasibility of eradication versus containment",
          consequence:
            "Failure to assess feasibility may lead to wasted effort and delayed realistic management.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: ["feasibility", "eradication", "containment"],
        },
        {
          id: "p4c3",
          text: "Strengthen vector movement controls and environmental safeguards",
          consequence:
            "Weak controls may increase spread or create unsafe interventions.",
          theme: "Constraints",
          required: true,
          weight: 2,
          keywords: ["vector movement", "environmental impact", "controls"],
        },
        {
          id: "p4c4",
          text: "Maintain stakeholder engagement and operational coordination under pressure",
          consequence:
            "Poor coordination may create gaps, fatigue, and stakeholder confusion.",
          theme: "Stakeholders",
          required: false,
          weight: 1,
          keywords: ["stakeholder engagement", "coordination", "pressure", "fatigue"],
        },
      ],
      questions: [
        {
          id: "p4q1",
          text: "With the species now confirmed and the incident escalated, how would you structure the operational response from this point?",
          theme: "Protocols",
          placeholder:
            "Describe your planning, feasibility, containment, and coordination approach...",
        },
        {
          id: "p4q2",
          text: "How would you balance technical control efforts, environmental risk, and stakeholder pressure during this stage?",
          theme: "Constraints",
          placeholder:
            "Explain how you would manage control trials, safeguards, and operational priorities...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p4c1", "p4c2", "p4c3"],
      },
      nextOnPass: "p5-main",
      nextOnPartial: "p4-remedial",
      nextOnFail: "p4-failure",
    },

    {
      id: "p4-remedial",
      phaseNumber: 4,
      kind: "remedial",
      title: "Operational Strategy Review",
      timeframe: "5–14 Days",
      scenarioText:
        "The incident response is underway, but the operational strategy remains incomplete or insufficiently coordinated. There is concern that feasibility decisions, control priorities, or environmental safeguards are not yet strong enough to support an effective medium-term response.",
      criteria: [
        {
          id: "p4r1",
          text: "Improve operational planning and decision-making structure",
          consequence:
            "Weak planning may leave teams misaligned and reduce effectiveness.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: ["planning", "structure", "interim strategy", "coordination"],
        },
        {
          id: "p4r2",
          text: "Refine feasibility assessment and control priorities",
          consequence:
            "Unclear priorities may waste resources and delay realistic management.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: ["feasibility", "control priorities", "eradication", "containment"],
        },
        {
          id: "p4r3",
          text: "Strengthen safeguards, stakeholder communication, and workforce coordination",
          consequence:
            "Gaps in safeguards or coordination may increase operational risk.",
          theme: "Communication",
          required: false,
          weight: 1,
          keywords: ["safeguards", "stakeholders", "workforce", "coordination"],
        },
      ],
      questions: [
        {
          id: "p4rq1",
          text: "How would you improve the operational strategy if the current plan is not yet delivering enough control or clarity?",
          theme: "Protocols",
          placeholder:
            "Explain how you would refine planning, feasibility assessment, and operational priorities...",
        },
        {
          id: "p4rq2",
          text: "What would you do to reduce operational strain while keeping stakeholders informed?",
          theme: "Stakeholders",
          placeholder:
            "Describe how you would manage coordination, fatigue, and external engagement...",
        },
      ],
      passingRules: {
        minScore: 4,
        requiredCriteriaIds: ["p4r1", "p4r2"],
      },
      nextOnPass: "p5-main",
      nextOnPartial: "p4-remedial",
      nextOnFail: "p4-failure",
    },

    {
      id: "p4-failure",
      phaseNumber: 4,
      kind: "failure",
      title: "Operational Strain and Control Gaps",
      timeframe: "7–14 Days",
      scenarioText:
        "Operational pressure is now exposing gaps in planning, coordination, and control delivery. Surveillance, vector restrictions, and technical activities are becoming inconsistent, while stakeholder demands are increasing and workforce fatigue is beginning to affect performance.",
      criteria: [
        {
          id: "p4f1",
          text: "Recognise that operational strain is reducing response effectiveness",
          consequence:
            "Failure to identify the strain may allow fragmentation and fatigue to worsen.",
          theme: "Expectations",
          required: true,
          weight: 2,
          keywords: ["strain", "fatigue", "gaps", "inconsistent operations"],
        },
        {
          id: "p4f2",
          text: "Take urgent action to restore coordination, control delivery, and prioritisation",
          consequence:
            "Without urgent correction, the response may lose operational effectiveness.",
          theme: "Constraints",
          required: true,
          weight: 3,
          keywords: ["urgent", "restore coordination", "prioritisation", "control delivery"],
        },
        {
          id: "p4f3",
          text: "Manage stakeholder expectations while stabilising the workforce",
          consequence:
            "Poor management may increase criticism and reduce staff resilience.",
          theme: "Communication",
          required: false,
          weight: 1,
          keywords: ["stakeholders", "expectations", "workforce", "fatigue"],
        },
      ],
      questions: [
        {
          id: "p4fq1",
          text: "The operational response is showing signs of strain. What urgent steps would you take to stabilise it?",
          theme: "Constraints",
          placeholder:
            "Describe the corrective planning, prioritisation, and coordination actions you would take...",
        },
        {
          id: "p4fq2",
          text: "How would you restore control without further increasing stakeholder pressure or workforce fatigue?",
          theme: "Communication",
          placeholder:
            "Explain how you would stabilise both operations and external confidence...",
        },
      ],
      passingRules: {
        minScore: 4,
        requiredCriteriaIds: ["p4f1", "p4f2"],
      },
      nextOnPass: "p5-main",
      nextOnPartial: "p4-failure",
      nextOnFail: "p4-failure",
    },

    {
      id: "p5-main",
      phaseNumber: 5,
      kind: "main",
      title: "Full Operational Control",
      timeframe: "14–28 Days",
      scenarioText:
        "The interim response strategy is now active and a full response plan is still being finalised. Surveillance is continuing across high-risk locations, control activities include diver-assisted removal, vessel and infrastructure cleaning, and antifouling measures, while larval presence continues to pose a spread risk. Workforce fatigue and limited cleaning capacity are constraining operations, and area freedom and market access discussions are beginning.",
      criteria: [
        {
          id: "p5c1",
          text: "Refine surveillance using confidence- and risk-based approaches",
          consequence:
            "Without refined surveillance, undetected sites may remain and later resurgence may occur.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: ["surveillance refinement", "confidence", "risk-based", "broader regions"],
        },
        {
          id: "p5c2",
          text: "Manage workforce safety, wellbeing, and operational sustainability",
          consequence:
            "If fatigue is not managed, absenteeism and operational delays may increase.",
          theme: "Constraints",
          required: true,
          weight: 2,
          keywords: ["workforce", "safety", "wellbeing", "fatigue"],
        },
        {
          id: "p5c3",
          text: "Maintain stakeholder and community communication while tracking budget and procurement",
          consequence:
            "Weak communication or poor cost control may create criticism, non-compliance, and delays.",
          theme: "Communication",
          required: true,
          weight: 2,
          keywords: ["stakeholders", "community", "budget", "procurement"],
        },
      ],
      questions: [
        {
          id: "p5q1",
          text: "How would you manage full operational control while surveillance, cleaning capacity, and workforce constraints remain ongoing?",
          theme: "Constraints",
          placeholder:
            "Describe your surveillance refinement, workforce management, and operational control approach...",
        },
        {
          id: "p5q2",
          text: "What would you do to maintain confidence and accountability as area freedom and market access discussions begin?",
          theme: "Communication",
          placeholder:
            "Explain your stakeholder, community, budgeting, and reporting approach...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p5c1", "p5c2", "p5c3"],
      },
      nextOnPass: "p6-main",
      nextOnPartial: "p5-remedial",
      nextOnFail: "p5-failure",
    },

    {
      id: "p5-remedial",
      phaseNumber: 5,
      kind: "remedial",
      title: "Operational Control Review",
      timeframe: "14–28 Days",
      scenarioText:
        "Control operations continue, but concerns remain about whether surveillance, workforce management, communication, and cost tracking are strong enough to support a credible transition toward longer-term management and area freedom considerations.",
      criteria: [
        {
          id: "p5r1",
          text: "Strengthen surveillance confidence and operational sustainability",
          consequence:
            "Weak surveillance and fatigue management may reduce long-term response confidence.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: ["surveillance confidence", "sustainability", "fatigue"],
        },
        {
          id: "p5r2",
          text: "Improve stakeholder communication and financial tracking",
          consequence:
            "Poor communication or cost visibility may create criticism and reduce credibility.",
          theme: "Communication",
          required: true,
          weight: 3,
          keywords: ["stakeholder communication", "community", "budget", "tracking"],
        },
      ],
      questions: [
        {
          id: "p5rq1",
          text: "What would you do if operational control is continuing but confidence in sustainability and surveillance remains limited?",
          theme: "Data",
          placeholder:
            "Describe how you would strengthen surveillance, workforce management, and planning confidence...",
        },
        {
          id: "p5rq2",
          text: "How would you improve accountability and cooperation during this stage?",
          theme: "Communication",
          placeholder:
            "Explain how you would improve communication, procurement, and stakeholder engagement...",
        },
      ],
      passingRules: {
        minScore: 4,
        requiredCriteriaIds: ["p5r1", "p5r2"],
      },
      nextOnPass: "p6-main",
      nextOnPartial: "p5-remedial",
      nextOnFail: "p5-failure",
    },

    {
      id: "p5-failure",
      phaseNumber: 5,
      kind: "failure",
      title: "Control Fatigue and Confidence Loss",
      timeframe: "21–28 Days",
      scenarioText:
        "Although operations are ongoing, fatigue, limited cleaning capacity, and inconsistent communication are beginning to undermine confidence in the response. There is concern that undetected sites may remain and that poor accountability could weaken support from stakeholders and other jurisdictions.",
      criteria: [
        {
          id: "p5f1",
          text: "Recognise that sustainability, confidence, and accountability are at risk",
          consequence:
            "Failure to recognise this may allow operational decline and reduced external support.",
          theme: "Expectations",
          required: true,
          weight: 2,
          keywords: ["fatigue", "confidence loss", "accountability", "undetected sites"],
        },
        {
          id: "p5f2",
          text: "Take urgent action to stabilise surveillance, workforce, and reporting systems",
          consequence:
            "Without corrective action, operational resilience may continue to weaken.",
          theme: "Constraints",
          required: true,
          weight: 3,
          keywords: ["urgent", "stabilise", "surveillance", "workforce", "reporting"],
        },
        {
          id: "p5f3",
          text: "Rebuild stakeholder confidence through clear communication and tracking",
          consequence:
            "Weak trust may reduce cooperation and damage credibility.",
          theme: "Communication",
          required: false,
          weight: 1,
          keywords: ["confidence", "communication", "tracking", "cooperation"],
        },
      ],
      questions: [
        {
          id: "p5fq1",
          text: "The control phase is becoming harder to sustain. What urgent steps would you take to restore confidence and stability?",
          theme: "Constraints",
          placeholder:
            "Describe how you would stabilise surveillance, workforce capacity, and accountability...",
        },
        {
          id: "p5fq2",
          text: "How would you respond if external confidence is beginning to weaken during this stage?",
          theme: "Communication",
          placeholder:
            "Explain how you would improve transparency, communication, and credibility...",
        },
      ],
      passingRules: {
        minScore: 4,
        requiredCriteriaIds: ["p5f1", "p5f2"],
      },
      nextOnPass: "p6-main",
      nextOnPartial: "p5-failure",
      nextOnFail: "p5-failure",
    },

    {
      id: "p6-main",
      phaseNumber: 6,
      kind: "main",
      title: "Long-Term Monitoring and Transition",
      timeframe: "28 Days+",
      scenarioText:
        "Spread appears to be constrained but not fully eradicated. Surveillance is transitioning toward long-term monitoring to support future proof-of-freedom claims, while low-level larval presence is still being detected. Stakeholders are now discussing lifting movement restrictions, restoring confidence, and transitioning from incident response into longer-term management and vigilance arrangements.",
      criteria: [
        {
          id: "p6c1",
          text: "Develop a proof-of-freedom framework based on confidence and evidence",
          consequence:
            "Without robust proof-of-freedom planning, controls may be lifted too early and reinfestation risk may increase.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: ["proof of freedom", "statistical confidence", "monitoring", "evidence"],
        },
        {
          id: "p6c2",
          text: "Plan transition to longer-term management and retain institutional knowledge",
          consequence:
            "Poor transition planning may lead to lost lessons and weaker long-term mitigation.",
          theme: "Protocols",
          required: true,
          weight: 2,
          keywords: ["transition", "management strategies", "institutional knowledge"],
        },
        {
          id: "p6c3",
          text: "Undertake post-incident evaluation, ecosystem considerations, and legacy documentation",
          consequence:
            "If lessons and systems are not captured, preparedness may remain weak.",
          theme: "Expectations",
          required: true,
          weight: 2,
          keywords: ["post-incident evaluation", "rehabilitation", "documentation", "legacy systems"],
        },
      ],
      questions: [
        {
          id: "p6q1",
          text: "How would you manage the transition from active incident response into long-term monitoring and management?",
          theme: "Protocols",
          placeholder:
            "Describe your approach to proof of freedom, transition planning, and long-term mitigation...",
        },
        {
          id: "p6q2",
          text: "What would you do before lifting restrictions or reducing response intensity?",
          theme: "Data",
          placeholder:
            "Explain the evidence, confidence, evaluation, and documentation requirements you would apply...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p6c1", "p6c2", "p6c3"],
      },
      nextOnPass: "p6-complete",
      nextOnPartial: "p6-remedial",
      nextOnFail: "p6-failure",
    },

    {
      id: "p6-remedial",
      phaseNumber: 6,
      kind: "remedial",
      title: "Transition Review and Assurance",
      timeframe: "28 Days+",
      scenarioText:
        "The response is shifting into longer-term management, but there are still concerns about whether proof-of-freedom requirements, transition planning, and post-incident learning processes are strong enough to support a confident reduction in controls.",
      criteria: [
        {
          id: "p6r1",
          text: "Strengthen proof-of-freedom planning and evidence thresholds",
          consequence:
            "Weak assurance may result in premature transition decisions.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: ["proof of freedom", "evidence thresholds", "assurance"],
        },
        {
          id: "p6r2",
          text: "Improve long-term management, learning capture, and documentation",
          consequence:
            "Poor long-term planning may reduce future preparedness and resilience.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: ["long-term management", "learning", "documentation", "preparedness"],
        },
      ],
      questions: [
        {
          id: "p6rq1",
          text: "What would you do if the transition to long-term management is not yet supported by enough confidence or evidence?",
          theme: "Data",
          placeholder:
            "Describe how you would strengthen assurance, monitoring, and transition planning...",
        },
        {
          id: "p6rq2",
          text: "How would you make sure the response leaves a strong legacy for future preparedness?",
          theme: "Expectations",
          placeholder:
            "Explain how you would capture lessons, systems, and long-term actions...",
        },
      ],
      passingRules: {
        minScore: 4,
        requiredCriteriaIds: ["p6r1", "p6r2"],
      },
      nextOnPass: "p6-complete",
      nextOnPartial: "p6-remedial",
      nextOnFail: "p6-failure",
    },

    {
      id: "p6-failure",
      phaseNumber: 6,
      kind: "failure",
      title: "Premature Transition Risk",
      timeframe: "28 Days+",
      scenarioText:
        "Pressure is increasing to relax controls and restore normal operations, but surveillance evidence remains incomplete and low-level risk indicators are still present. A premature transition now could reduce confidence, increase reinfestation risk, and weaken the long-term legacy of the response.",
      criteria: [
        {
          id: "p6f1",
          text: "Recognise that confidence remains insufficient for a safe transition",
          consequence:
            "Failure to recognise this risk may lead to premature lifting of controls.",
          theme: "Expectations",
          required: true,
          weight: 2,
          keywords: ["premature", "insufficient confidence", "risk remains"],
        },
        {
          id: "p6f2",
          text: "Take corrective action to strengthen assurance, transition planning, and learning capture",
          consequence:
            "Without correction, long-term resilience and confidence may be undermined.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: ["corrective action", "assurance", "transition", "learning capture"],
        },
        {
          id: "p6f3",
          text: "Communicate clearly with stakeholders about why controls cannot yet be relaxed",
          consequence:
            "Poor communication may increase pressure, confusion, and loss of trust.",
          theme: "Communication",
          required: false,
          weight: 1,
          keywords: ["stakeholders", "controls", "communication", "trust"],
        },
      ],
      questions: [
        {
          id: "p6fq1",
          text: "There is pressure to reduce controls before confidence is high enough. What would you do now?",
          theme: "Protocols",
          placeholder:
            "Describe how you would protect assurance, maintain controls, and manage expectations...",
        },
        {
          id: "p6fq2",
          text: "How would you reduce reinfestation risk while preparing for a credible long-term transition?",
          theme: "Data",
          placeholder:
            "Explain the monitoring, management, and communication actions you would take...",
        },
      ],
      passingRules: {
        minScore: 4,
        requiredCriteriaIds: ["p6f1", "p6f2"],
      },
      nextOnPass: "p6-complete",
      nextOnPartial: "p6-failure",
      nextOnFail: "p6-failure",
    },

    {
      id: "p6-complete",
      phaseNumber: 6,
      kind: "main",
      title: "Simulation Complete",
      timeframe: "End State",
      scenarioText:
        "You have reached the completion point of the simulation. Your responses across the scenario can now be summarised to assess strengths, gaps, and overall preparedness.",
      criteria: [],
      questions: [
        {
          id: "p6cq1",
          text: "Before viewing the final summary, briefly reflect on what you believe were the most important priorities across the incident.",
          theme: "Expectations",
          placeholder:
            "Write a short reflection on the major operational priorities across the response...",
        },
      ],
      passingRules: {
        minScore: 0,
        requiredCriteriaIds: [],
      },
    },
  ],
};