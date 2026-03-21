import { Scenario } from "../types/simulation";


export const invasiveMusselScenario: Scenario = {
  id: "scenario-invasive-mussel-001",
  title: "Invasive Mussel Incursion — Response and Preparedness Exercise",
  slug: "invasive-mussel",
  overview:
    "A six-phase aquatic biosecurity exercise focused on detection, coordination, containment, operational control, and long-term monitoring following a suspected exotic mussel incursion in a busy marina and coastal environment.",
  phases: [
    {
      phaseNumber: 1,
      title: "Detection and Immediate Response",
      timeframe: "0–24 Hours",
      scenarioText:
        "A local boater reports dense clusters of small bivalve shells encrusting hulls, marina pylons, ropes, and mooring lines. Photos are sent to the state aquatic biosecurity unit and flagged as a suspect exotic mussel species. Samples are collected and sent under chain-of-custody. The marina remains busy, and larval spread may already be occurring.",
      criteria: [
        {
          id: "p1c1",
          text: "Immediate reporting to Australian Chief Environmental Biosecurity Officer",
          consequence:
            "Delays in national coordination, distrust from other jurisdictions, and cost-sharing delays.",
          theme: "Protocols",
        },
        {
          id: "p1c2",
          text: "State/territory coordination initiated",
          consequence:
            "Late convening, confusion in national response, and slow approvals.",
          theme: "Stakeholders",
        },
        {
          id: "p1c3",
          text: "Activate incident management under BIMS",
          consequence:
            "Fragmented coordination and delays in tracing, surveillance, and early containment.",
          theme: "Protocols",
        },
        {
          id: "p1c4",
          text: "Delimiting surveillance planning commenced",
          consequence:
            "Early spread is missed and detections surge later.",
          theme: "Data",
        },
        {
          id: "p1c5",
          text: "Stakeholder engagement with marina operators, fishers, aquaculture, and councils",
          consequence:
            "Industry escalates directly to leadership and staff are diverted from operations.",
          theme: "Stakeholders",
        },
        {
          id: "p1c6",
          text: "Community engagement started",
          consequence:
            "Recreational vessel and gear vectors remain unmanaged and local spread increases rapidly.",
          theme: "Communication",
        },
        {
          id: "p1c7",
          text: "Containment measures considered immediately",
          consequence:
            "More sites become infected in later phases and regional spread risk increases.",
          theme: "Protocols",
        },
      ],
      questions: [
        {
          id: "p1q1",
          text: "What should be the first operational action in the first 24 hours?",
          theme: "Protocols",
          placeholder: "Explain the first action and why it matters.",
        },
        {
          id: "p1q2",
          text: "Which agencies and stakeholders must be notified immediately?",
          theme: "Stakeholders",
          placeholder: "List key authorities and external stakeholders.",
        },
      ],
      decisionOptions: [
        {
          id: "p1d1",
          text: "Activate BIMS, notify key authorities, and begin containment planning immediately",
          impact: "strong",
          consequenceFlag: "early-coordination-activated",
        },
        {
          id: "p1d2",
          text: "Wait for stronger diagnostic certainty before broad escalation",
          impact: "moderate",
          consequenceFlag: "escalation-delayed",
        },
        {
          id: "p1d3",
          text: "Keep response quiet to avoid disruption while monitoring informally",
          impact: "weak",
          consequenceFlag: "containment-delayed",
        },
      ],
    },
    {
      phaseNumber: 2,
      title: "Structured Investigation",
      timeframe: "24–72 Hours",
      scenarioText:
        "Surveillance identifies fouling on infrastructure, nearby vessels, and jetties. Four suspect locations are identified within 10 km. Environmental sampling detects larvae in surrounding waters. Vessel movement and cleaning records are incomplete, and community concern is growing.",
      criteria: [
        {
          id: "p2c1",
          text: "Structured surveillance program established",
          consequence:
            "Delayed detection and missed cryptic spread.",
          theme: "Data",
        },
        {
          id: "p2c2",
          text: "Tracing pathways for boats, gear, charter vessels, and events",
          consequence:
            "Spread pattern remains unclear and response is misdirected.",
          theme: "Data",
        },
        {
          id: "p2c3",
          text: "Containment measures around infected sites",
          consequence:
            "Additional sites become infected and larvae spread further.",
          theme: "Protocols",
        },
        {
          id: "p2c4",
          text: "Community communication on cleaning and reporting responsibilities",
          consequence:
            "Residents remain unaware of responsibilities and recreational spread increases.",
          theme: "Communication",
        },
        {
          id: "p2c5",
          text: "Industry engagement with aquaculture, marinas, and tourism",
          consequence:
            "Distrust rises and ministerial pressure increases.",
          theme: "Stakeholders",
        },
      ],
      questions: [
        {
          id: "p2q1",
          text: "What surveillance methods should be prioritized now?",
          theme: "Data",
          placeholder: "Settlement plates, visual checks, larval sampling, eDNA, etc.",
        },
        {
          id: "p2q2",
          text: "What tracing data is most important to collect quickly?",
          theme: "Data",
          placeholder: "Describe vessel, gear, and movement records needed.",
        },
      ],
      decisionOptions: [
        {
          id: "p2d1",
          text: "Expand structured surveillance, tracing, and infected-site controls immediately",
          impact: "strong",
          consequenceFlag: "surveillance-expanded",
        },
        {
          id: "p2d2",
          text: "Prioritize only visible infestation sites first and delay broader tracing",
          impact: "moderate",
          consequenceFlag: "tracing-partial",
        },
        {
          id: "p2d3",
          text: "Focus on messaging first and postpone operational controls",
          impact: "weak",
          consequenceFlag: "spread-underestimated",
        },
      ],
    },
    {
      phaseNumber: 3,
      title: "Confirmation and Escalation",
      timeframe: "72 Hours–5 Days",
      scenarioText:
        "Lab results indicate the mussel is likely exotic, and a second lab is confirming. Six infected sites are identified along the recreational coastline. Evidence suggests larval dispersal beyond visible infestations. Industry and tourism groups demand clarity, and eradication feasibility is uncertain.",
      criteria: [
        {
          id: "p3c1",
          text: "Assess NEBRA or other cost-sharing arrangements",
          consequence:
            "Funding uncertainty, staff fatigue, and operational delays.",
          theme: "Constraints",
        },
        {
          id: "p3c2",
          text: "Industry engagement intensified",
          consequence:
            "Public criticism and communication breakdown.",
          theme: "Stakeholders",
        },
        {
          id: "p3c3",
          text: "Containment of infected sites maintained",
          consequence:
            "New sites emerge and spread continues unchecked.",
          theme: "Protocols",
        },
        {
          id: "p3c4",
          text: "Community communication maintained",
          consequence:
            "Recreational vectors remain unmanaged and new infestations occur.",
          theme: "Communication",
        },
        {
          id: "p3c5",
          text: "Vector movement controls introduced",
          consequence:
            "High-risk vessels spread larvae and detections rise next phase.",
          theme: "Protocols",
        },
      ],
      questions: [
        {
          id: "p3q1",
          text: "How should the response team balance urgency with uncertain eradication feasibility?",
          theme: "Constraints",
          placeholder: "Explain how you would manage escalation under uncertainty.",
        },
        {
          id: "p3q2",
          text: "How should industry and tourism stakeholders be briefed at this point?",
          theme: "Communication",
          placeholder: "Describe what should be communicated and to whom.",
        },
      ],
      decisionOptions: [
        {
          id: "p3d1",
          text: "Escalate with movement controls, stronger engagement, and funding assessment",
          impact: "strong",
          consequenceFlag: "escalation-managed",
        },
        {
          id: "p3d2",
          text: "Delay movement controls until formal second-lab confirmation is received",
          impact: "moderate",
          consequenceFlag: "vector-risk-high",
        },
        {
          id: "p3d3",
          text: "Continue observation while avoiding major restrictions",
          impact: "weak",
          consequenceFlag: "spread-escalates",
        },
      ],
    },
    {
      phaseNumber: 4,
      title: "Operational Response",
      timeframe: "5–14 Days",
      scenarioText:
        "The second lab confirms the exotic mussel species. National coordination is engaged. Fourteen infected sites are confirmed, larval stages are detected in surrounding waters, and vessel cleaning capacity is limited. Field teams are balancing competing priorities.",
      criteria: [
        {
          id: "p4c1",
          text: "Iterative response planning and interim strategy",
          consequence:
            "Fragmented operations, inconsistent direction, and stakeholder confusion.",
          theme: "Protocols",
        },
        {
          id: "p4c2",
          text: "Technical feasibility assessment of eradication vs containment",
          consequence:
            "Resources wasted on unviable eradication and realistic management is delayed.",
          theme: "Constraints",
        },
        {
          id: "p4c3",
          text: "Vector movement controls maintained",
          consequence:
            "Spread increases and new sites are infested.",
          theme: "Protocols",
        },
        {
          id: "p4c4",
          text: "Environmental impact assessment considered",
          consequence:
            "Unsafe intervention, media scrutiny, and environmental criticism.",
          theme: "Expectations",
        },
        {
          id: "p4c5",
          text: "Stakeholder engagement maintained under pressure",
          consequence:
            "Ministerial escalation and operational distraction.",
          theme: "Stakeholders",
        },
        {
          id: "p4c6",
          text: "Operational coordination under pressure",
          consequence:
            "Gaps in surveillance and reduced operational effectiveness.",
          theme: "Constraints",
        },
      ],
      questions: [
        {
          id: "p4q1",
          text: "How would you decide between eradication and containment at this point?",
          theme: "Constraints",
          placeholder: "Describe the technical and operational considerations.",
        },
        {
          id: "p4q2",
          text: "What is the biggest operational bottleneck right now?",
          theme: "Constraints",
          placeholder: "Cleaning capacity, workforce, communication, data, etc.",
        },
      ],
      decisionOptions: [
        {
          id: "p4d1",
          text: "Adopt a staged operational plan with containment-first feasibility testing",
          impact: "strong",
          consequenceFlag: "operations-coordinated",
        },
        {
          id: "p4d2",
          text: "Attempt broad eradication immediately despite limited evidence and capacity",
          impact: "moderate",
          consequenceFlag: "resource-pressure",
        },
        {
          id: "p4d3",
          text: "Reduce controls temporarily to ease workforce and stakeholder pressure",
          impact: "weak",
          consequenceFlag: "containment-weakened",
        },
      ],
    },
    {
      phaseNumber: 5,
      title: "Full Operational Control",
      timeframe: "14–28 Days",
      scenarioText:
        "An interim response strategy is operational and high-risk surveillance continues. Control work includes diver-assisted removal, vessel and infrastructure cleaning, and antifouling. Larval presence still poses spread risk, and workforce fatigue and cleaning capacity continue to constrain operations.",
      criteria: [
        {
          id: "p5c1",
          text: "Surveillance refinement based on confidence and broader region coverage",
          consequence:
            "Undetected sites remain and later resurgence damages credibility.",
          theme: "Data",
        },
        {
          id: "p5c2",
          text: "Workforce safety and wellbeing managed",
          consequence:
            "Absenteeism, delays, and morale decline.",
          theme: "Constraints",
        },
        {
          id: "p5c3",
          text: "Stakeholder engagement sustained",
          consequence:
            "Open criticism and reduced cooperation.",
          theme: "Stakeholders",
        },
        {
          id: "p5c4",
          text: "Community communication maintained",
          consequence:
            "Non-compliance and spread via recreational vessels.",
          theme: "Communication",
        },
        {
          id: "p5c5",
          text: "Budgeting and procurement tracking maintained",
          consequence:
            "Cost overruns and operational delays.",
          theme: "Constraints",
        },
      ],
      questions: [
        {
          id: "p5q1",
          text: "What support measures are needed to sustain the workforce safely?",
          theme: "Constraints",
          placeholder: "Rest cycles, role clarity, safety controls, contractor support, etc.",
        },
        {
          id: "p5q2",
          text: "How should surveillance be refined while maintaining confidence in area control?",
          theme: "Data",
          placeholder: "Describe how risk-based refinement should work.",
        },
      ],
      decisionOptions: [
        {
          id: "p5d1",
          text: "Maintain refined surveillance, workforce safeguards, and budget tracking",
          impact: "strong",
          consequenceFlag: "control-sustained",
        },
        {
          id: "p5d2",
          text: "Prioritize control activity speed over workforce and procurement discipline",
          impact: "moderate",
          consequenceFlag: "fatigue-risk",
        },
        {
          id: "p5d3",
          text: "Scale down communication and stakeholder contact to free up field time",
          impact: "weak",
          consequenceFlag: "compliance-risk",
        },
      ],
    },
    {
      phaseNumber: 6,
      title: "Long-Term Monitoring and Transition",
      timeframe: "28 Days+",
      scenarioText:
        "Spread is constrained but not fully eradicated. Surveillance shifts toward long-term monitoring and supporting area freedom claims. Low-level larval presence is still detected. Stakeholders are discussing proof of freedom, lifting controls, restoring confidence, and strengthening vigilance networks.",
      criteria: [
        {
          id: "p6c1",
          text: "Proof of freedom framework developed with statistical confidence",
          consequence:
            "Controls are lifted too early and reinfestation risk rises.",
          theme: "Data",
        },
        {
          id: "p6c2",
          text: "Transition to long-term management strategies planned",
          consequence:
            "Institutional knowledge is lost and mitigation opportunities are missed.",
          theme: "Expectations",
        },
        {
          id: "p6c3",
          text: "Post-incident evaluation completed",
          consequence:
            "Lessons are not captured and future mistakes are repeated.",
          theme: "Expectations",
        },
        {
          id: "p6c4",
          text: "Ecosystem rehabilitation considered",
          consequence:
            "Habitat degradation continues and recovery is delayed.",
          theme: "Communication",
        },
        {
          id: "p6c5",
          text: "Legacy documentation and systems maintained",
          consequence:
            "Future preparedness is weakened and surveillance gaps persist.",
          theme: "Protocols",
        },
      ],
      questions: [
        {
          id: "p6q1",
          text: "What evidence would be needed before lifting restrictions?",
          theme: "Data",
          placeholder: "Describe the framework for proof of freedom.",
        },
        {
          id: "p6q2",
          text: "What should be captured in the post-incident review?",
          theme: "Expectations",
          placeholder: "List critical lessons, systems, and documentation outcomes.",
        },
      ],
      decisionOptions: [
        {
          id: "p6d1",
          text: "Transition carefully with proof-of-freedom criteria, review, and long-term management",
          impact: "strong",
          consequenceFlag: "recovery-structured",
        },
        {
          id: "p6d2",
          text: "Lift controls gradually while post-incident systems are still being prepared",
          impact: "moderate",
          consequenceFlag: "recovery-risk",
        },
        {
          id: "p6d3",
          text: "Remove restrictions quickly to reduce pressure and move on",
          impact: "weak",
          consequenceFlag: "premature-lifting-risk",
        },
      ],
    },
  ],
};