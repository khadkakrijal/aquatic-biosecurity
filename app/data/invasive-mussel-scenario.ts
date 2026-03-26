import { Scenario } from "@/app/types/simulation";

export const invasiveMusselScenario: Scenario = {
  id: "invasive-mussel",
  title: "Invasive Mussel Incursion — Response and Preparedness Exercise",
  slug: "invasive-mussel",
  overview:
    "An aquatic biosecurity simulation designed to assess operational decision-making during a suspected invasive mussel incursion in a high-risk marina environment.",
  stages: [
    {
      id: "p1",
      phaseNumber: 1,
      title: "Detection and Immediate Response",
      timeframe: "0–24 Hours",
      baseScenarioText:
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
    },

    {
      id: "p2",
      phaseNumber: 2,
      title: "Structured Investigation",
      timeframe: "24–72 Hours",
      baseScenarioText:
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
          keywords: [
            "surveillance",
            "settlement plates",
            "visual",
            "larval sampling",
            "eDNA",
          ],
        },
        {
          id: "p2c2",
          text: "Trace likely spread pathways including vessels, gear, and events",
          consequence:
            "If tracing is incomplete, infected locations may be missed and the response may be misdirected.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "tracing",
            "pathways",
            "boats",
            "gear",
            "events",
            "vessel movement",
          ],
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
    },

    {
      id: "p3",
      phaseNumber: 3,
      title: "Confirmation and Escalation",
      timeframe: "72 Hours–5 Days",
      baseScenarioText:
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
          keywords: ["cost-sharing", "funding", "response support", "governance"],
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
    },

    {
      id: "p4",
      phaseNumber: 4,
      title: "Operational Response",
      timeframe: "5–14 Days",
      baseScenarioText:
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
          keywords: ["response planning", "strategy", "staged plan", "coordination"],
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
    },

    {
      id: "p5",
      phaseNumber: 5,
      title: "Full Operational Control",
      timeframe: "14–28 Days",
      baseScenarioText:
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
          keywords: ["surveillance refinement", "confidence", "risk-based"],
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
    },

    {
      id: "p6",
      phaseNumber: 6,
      title: "Long-Term Monitoring and Transition",
      timeframe: "28 Days+",
      baseScenarioText:
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
          keywords: ["proof of freedom", "confidence", "monitoring", "evidence"],
        },
        {
          id: "p6c2",
          text: "Plan transition to longer-term management and retain institutional knowledge",
          consequence:
            "Poor transition planning may lead to lost lessons and weaker long-term mitigation.",
          theme: "Protocols",
          required: true,
          weight: 2,
          keywords: ["transition", "management", "institutional knowledge"],
        },
        {
          id: "p6c3",
          text: "Undertake post-incident evaluation, ecosystem considerations, and legacy documentation",
          consequence:
            "If lessons and systems are not captured, preparedness may remain weak.",
          theme: "Expectations",
          required: true,
          weight: 2,
          keywords: ["post-incident evaluation", "rehabilitation", "documentation"],
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
    },

    {
      id: "complete",
      phaseNumber: 7,
      title: "Simulation Complete",
      timeframe: "End State",
      baseScenarioText:
        "You have reached the end of the simulation. Before viewing the overall report, provide a short reflection on the most important priorities across the incident.",
      criteria: [],
      questions: [
        {
          id: "complete-q1",
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