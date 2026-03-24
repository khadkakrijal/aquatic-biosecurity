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
          text: "Immediate reporting to relevant biosecurity authority",
          consequence:
            "Delays in formal reporting may hinder coordination and slow escalation of the response.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: ["report", "notify", "authority", "biosecurity unit"],
        },
        {
          id: "p1c2",
          text: "Activate incident management arrangements",
          consequence:
            "Failure to establish coordinated incident management may result in fragmented response activity.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: [
            "incident management",
            "BIMS",
            "coordination",
            "activate response",
          ],
        },
        {
          id: "p1c3",
          text: "Begin delimiting surveillance planning",
          consequence:
            "Insufficient early surveillance may allow spread to go undetected and increase later operational complexity.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: ["surveillance", "delimiting", "sampling", "inspection"],
        },
        {
          id: "p1c4",
          text: "Engage key stakeholders such as marina operators and industry",
          consequence:
            "Limited stakeholder engagement may reduce cooperation and increase operational pressure.",
          theme: "Stakeholders",
          required: false,
          weight: 1,
          keywords: [
            "stakeholders",
            "marina",
            "operators",
            "industry",
            "fishers",
          ],
        },
        {
          id: "p1c5",
          text: "Implement immediate containment measures",
          consequence:
            "Delays in containment may increase the likelihood of local or regional spread.",
          theme: "Constraints",
          required: true,
          weight: 2,
          keywords: [
            "containment",
            "movement control",
            "restrict access",
            "quarantine",
          ],
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
          keywords: [
            "report",
            "notify",
            "coordination",
            "incident management",
          ],
        },
        {
          id: "p1r2",
          text: "Expand immediate surveillance and containment",
          consequence:
            "If surveillance and containment remain insufficient, spread may continue unnoticed.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "surveillance",
            "containment",
            "sampling",
            "movement control",
          ],
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
          keywords: [
            "containment",
            "surveillance",
            "urgent",
            "movement control",
          ],
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
        "Expanded surveillance has now identified suspect fouling on marina infrastructure, adjacent vessels, and nearby jetties. Multiple suspect locations have emerged within the surrounding area, suggesting the organism may have been present longer than initially assumed and that spread pathways require urgent investigation.",
      criteria: [],
      questions: [],
      passingRules: {
        minScore: 0,
        requiredCriteriaIds: [],
      },
    },
  ],
};