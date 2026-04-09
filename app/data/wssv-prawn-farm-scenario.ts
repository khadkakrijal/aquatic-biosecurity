import { Scenario, ScenarioStage } from "@/app/types/simulation";

export const wssvPrawnFarmScenario: Scenario = {
  id: "wssv-prawn-farm",
  title: "WSSV Prawn Farm Outbreak — Response and Recovery Exercise",
  slug: "wssv-prawn-farm",
  overview:
    "An aquatic biosecurity simulation focused on a suspected and then confirmed White Spot Syndrome Virus outbreak affecting a high-value prawn farm and linked aquatic environments. The exercise tests national reporting, containment, industry communication, surveillance, tracing, incident coordination, workforce sustainability, and recovery decision-making across escalating response phases.",
  version: 1,
  isActive: true,
  category: "aquatic-biosecurity",
  adminMeta: {
    isPublished: true,
    version: 1,
  },
  stages: [
    {
      id: "p1",
      phaseNumber: 1,
      title: "Initial Detection — Suspect Diagnosis",
      timeframe: "0–48 Hours",
      branchFamily: "main",
      baseScenarioText:
        "A high-value prawn farm reports sudden mortalities across multiple ponds over a 48-hour period. Affected prawns show lethargy, reduced feeding, and visible white discolouration on the carapace. Field staff collect samples and laboratory testing is pending, but White Spot Syndrome Virus is suspected based on clinical signs. The property has recently moved stock off-site, uses water exchange from a nearby estuarine system, and sits near wild crustacean habitat, increasing the risk of broader spread.",
      criteria: [
        {
          id: "p1c1",
          text: "Escalate the suspect detection through national and jurisdictional reporting pathways without waiting for final laboratory confirmation",
          consequence:
            "If reporting is delayed, coordination and preparedness across jurisdictions may lag while spread risk grows.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: [
            "national reporting",
            "notify",
            "escalate",
            "report",
            "coordination",
            "suspected disease",
          ],
        },
        {
          id: "p1c2",
          text: "Apply immediate containment measures at the property, including movement controls, on-farm biosecurity, and discharge risk management",
          consequence:
            "If containment is weak during the suspect phase, stock, equipment, personnel, or water pathways may spread infection before confirmation.",
          theme: "Constraints",
          required: true,
          weight: 3,
          keywords: [
            "containment",
            "movement controls",
            "biosecurity",
            "visitor controls",
            "water discharge",
            "effluent",
          ],
        },
        {
          id: "p1c3",
          text: "Provide early communication and guidance to industry stakeholders while lab results are pending",
          consequence:
            "If industry is not informed early, misinformation, weak reporting, and inconsistent biosecurity practices may increase.",
          theme: "Communication",
          required: true,
          weight: 2,
          keywords: [
            "industry communication",
            "guidance",
            "stakeholders",
            "awareness",
            "misinformation",
            "reporting mortalities",
          ],
        },
      ],
      questions: [
        {
          id: "p1q1",
          text: "What would you do immediately after receiving this suspected WSSV detection at a prawn farm?",
          theme: "Protocols",
          placeholder:
            "Describe your reporting, containment, and immediate communication actions...",
        },
        {
          id: "p1q2",
          text: "How would you reduce spread risk while diagnosis is still only suspected?",
          theme: "Constraints",
          placeholder:
            "Explain your movement controls, farm biosecurity, water-risk management, and guidance to industry...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p1c1", "p1c2", "p1c3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p1c1", "p1c2", "p1c3"],
        byMissingRequired: {
          p1c1: "p2a-reporting-pressure",
          p1c2: "p2b-containment-pressure",
          p1c3: "p2c-industry-awareness-pressure",
        },
        strong: "p2-main",
        mixed: "p2-main",
        limited: "p2c-industry-awareness-pressure",
        fallback: "p2-main",
      },
    },

    {
      id: "p2-main",
      phaseNumber: 2,
      title: "Confirmed Diagnosis — Early Coordinated Response",
      timeframe: "48 Hours–4 Days",
      branchFamily: "main",
      baseScenarioText:
        "Laboratory testing confirms White Spot Syndrome Virus at the index farm, and a second nearby farm also reports unusual mortalities. Containment measures are in place, tracing has begun, several high-risk farms are being inspected, and environmental sampling has started. Industry peak bodies have been notified, a hotline is active, and early situational reporting is underway. The response is progressing, but expanded surveillance, expanded tracing, and incident coordination still need to be strengthened.",
      criteria: [
        {
          id: "p2m1",
          text: "Establish and operationalise an effective Incident Coordination Centre across teams and jurisdictions",
          consequence:
            "If incident coordination remains partial, delays and fragmented decision-making may reduce response effectiveness.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: [
            "ICC",
            "incident coordination",
            "operations",
            "staffing",
            "sitreps",
            "jurisdictions",
          ],
        },
        {
          id: "p2m2",
          text: "Expand surveillance to all high-risk farms and relevant environmental pathways",
          consequence:
            "If surveillance remains narrow, undetected spread and environmental exposure may not be identified in time.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "surveillance",
            "high-risk farms",
            "environmental sampling",
            "monitoring",
            "inspection",
            "estuarine",
          ],
        },
        {
          id: "p2m3",
          text: "Expand tracing of stock, equipment, vehicles, and personnel movements linked to the infected properties",
          consequence:
            "If tracing remains incomplete, linked farms and risk pathways may continue to be missed.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "tracing",
            "stock movements",
            "equipment",
            "vehicles",
            "personnel",
            "pathways",
          ],
        },
      ],
      questions: [
        {
          id: "p2mq1",
          text: "How would you strengthen the early confirmed response once WSSV has been detected at more than one farm?",
          theme: "Protocols",
          placeholder:
            "Describe your ICC, surveillance, tracing, and multi-site coordination approach...",
        },
      ],
      passingRules: {
        minScore: 7,
        requiredCriteriaIds: ["p2m1", "p2m2", "p2m3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p2m1", "p2m2", "p2m3"],
        byMissingRequired: {
          p2m1: "p3a-icc-pressure",
          p2m2: "p3b-surveillance-pressure",
          p2m3: "p3c-tracing-pressure",
        },
        strong: "p3-main",
        mixed: "p3-main",
        limited: "p3b-surveillance-pressure",
        fallback: "p3-main",
      },
    },

    {
      id: "p2a-reporting-pressure",
      phaseNumber: 2,
      title: "Confirmed Diagnosis — Reporting and Coordination Pressure",
      timeframe: "48 Hours–4 Days",
      branchFamily: "reporting",
      baseScenarioText:
        "WSSV is confirmed, but national escalation and cross-jurisdiction coordination have lagged. States and territories are requesting updates, business-as-usual staff have been diverted, and decision-making is slowing under pressure. Containment has started at known sites, but strategic coordination is still catching up.",
      criteria: [
        {
          id: "p2a1",
          text: "Stabilise national coordination and formal cross-jurisdiction communication",
          consequence:
            "If strategic coordination remains weak, response priorities and messaging may diverge.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: [
            "national coordination",
            "jurisdictions",
            "escalation",
            "committee",
            "briefings",
          ],
        },
        {
          id: "p2a2",
          text: "Expand surveillance and tracing despite reporting-related coordination delays",
          consequence:
            "If operational expansion stalls while governance catches up, spread may outpace the response.",
          theme: "Data",
          required: true,
          weight: 2,
          keywords: [
            "surveillance",
            "tracing",
            "operational expansion",
            "high-risk farms",
          ],
        },
        {
          id: "p2a3",
          text: "Manage industry and ministerial information demands without losing operational focus",
          consequence:
            "If communication demands are unmanaged, senior staff attention may be pulled away from core response delivery.",
          theme: "Communication",
          required: true,
          weight: 2,
          keywords: [
            "minister briefings",
            "industry enquiries",
            "updates",
            "communications",
            "operational focus",
          ],
        },
      ],
      questions: [
        {
          id: "p2aq1",
          text: "How would you stabilise the response when confirmed disease is driving coordination and reporting pressure?",
          theme: "Protocols",
          placeholder:
            "Explain your escalation, governance, communication, and operational-priority actions...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p2a1", "p2a2", "p2a3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p2a1", "p2a2", "p2a3"],
        byMissingRequired: {
          p2a1: "p3a-icc-pressure",
          p2a2: "p3b-surveillance-pressure",
          p2a3: "p3a-icc-pressure",
        },
        strong: "p3a-icc-pressure",
        mixed: "p3a-icc-pressure",
        limited: "p3a-icc-pressure",
        fallback: "p3a-icc-pressure",
      },
    },

    {
      id: "p2b-containment-pressure",
      phaseNumber: 2,
      title: "Confirmed Diagnosis — Containment and Equipment-Sharing Pressure",
      timeframe: "48 Hours–4 Days",
      branchFamily: "containment",
      baseScenarioText:
        "WSSV has been confirmed and core controls are in place at the suspect farm, but equipment sharing and linked-farm exposure have already created wider spread concerns. Environmental and non-target monitoring is incomplete, and rapid risk assessment is still underdeveloped.",
      criteria: [
        {
          id: "p2b1",
          text: "Broaden containment to linked farms and operational pathways, including shared equipment and site access controls",
          consequence:
            "If linked-farm containment stays weak, infection pressure may continue across connected properties.",
          theme: "Constraints",
          required: true,
          weight: 3,
          keywords: [
            "containment",
            "linked farms",
            "equipment sharing",
            "movement restrictions",
            "site access",
          ],
        },
        {
          id: "p2b2",
          text: "Complete rapid risk assessment to prioritise neighbouring farms and response effort",
          consequence:
            "If high-risk farms are not prioritised properly, surveillance and containment may be misdirected.",
          theme: "Data",
          required: true,
          weight: 2,
          keywords: [
            "rapid risk assessment",
            "prioritisation",
            "neighbouring farms",
            "spread risk",
          ],
        },
        {
          id: "p2b3",
          text: "Strengthen surveillance, including environmental and non-target monitoring",
          consequence:
            "If surveillance remains incomplete, environmental spread and non-target exposure may go undetected.",
          theme: "Data",
          required: true,
          weight: 2,
          keywords: [
            "environmental monitoring",
            "non-target monitoring",
            "surveillance",
            "sampling",
          ],
        },
      ],
      questions: [
        {
          id: "p2bq1",
          text: "How would you recover from weak early containment where equipment and linked-farm exposure are already concerns?",
          theme: "Constraints",
          placeholder:
            "Describe your containment, risk assessment, surveillance, and pathway-control actions...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p2b1", "p2b2", "p2b3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p2b1", "p2b2", "p2b3"],
        byMissingRequired: {
          p2b1: "p3c-tracing-pressure",
          p2b2: "p3b-surveillance-pressure",
          p2b3: "p3b-surveillance-pressure",
        },
        strong: "p3-main",
        mixed: "p3c-tracing-pressure",
        limited: "p3c-tracing-pressure",
        fallback: "p3c-tracing-pressure",
      },
    },

    {
      id: "p2c-industry-awareness-pressure",
      phaseNumber: 2,
      title: "Confirmed Diagnosis — Compliance and Industry Awareness Pressure",
      timeframe: "48 Hours–4 Days",
      branchFamily: "communication",
      baseScenarioText:
        "WSSV is confirmed and incident coordination has begun, but surrounding farms still show limited awareness and inconsistent biosecurity uptake. The suspect farm has isolated high-risk ponds, but equipment movement continues and surveillance is still too narrow. Industry has been notified formally, but compliance and practical understanding remain weak.",
      criteria: [
        {
          id: "p2c1",
          text: "Enforce movement restrictions and compliance expectations across surrounding farms",
          consequence:
            "If compliance remains weak, surrounding properties may continue high-risk practices during a critical response window.",
          theme: "Constraints",
          required: true,
          weight: 3,
          keywords: [
            "enforcement",
            "compliance",
            "movement restrictions",
            "surrounding farms",
          ],
        },
        {
          id: "p2c2",
          text: "Strengthen practical industry guidance and on-farm biosecurity awareness at high-risk farms",
          consequence:
            "If producers do not understand expectations, biosecurity behaviour may remain inconsistent.",
          theme: "Stakeholders",
          required: true,
          weight: 2,
          keywords: [
            "industry guidance",
            "biosecurity awareness",
            "high-risk farms",
            "producers",
          ],
        },
        {
          id: "p2c3",
          text: "Expand surveillance beyond the suspect farm to validate compliance risk and spread",
          consequence:
            "If surveillance stays narrow, compliance failures and wider spread may remain hidden.",
          theme: "Data",
          required: true,
          weight: 2,
          keywords: [
            "surveillance",
            "surrounding farms",
            "spread",
            "inspection",
          ],
        },
      ],
      questions: [
        {
          id: "p2cq1",
          text: "How would you improve compliance and industry awareness once confirmed disease is creating concern among surrounding farms?",
          theme: "Stakeholders",
          placeholder:
            "Explain your enforcement, producer guidance, surveillance, and coordination approach...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p2c1", "p2c2", "p2c3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p2c1", "p2c2", "p2c3"],
        byMissingRequired: {
          p2c1: "p3c-tracing-pressure",
          p2c2: "p3a-icc-pressure",
          p2c3: "p3b-surveillance-pressure",
        },
        strong: "p3-main",
        mixed: "p3-main",
        limited: "p3b-surveillance-pressure",
        fallback: "p3-main",
      },
    },

    {
      id: "p3-main",
      phaseNumber: 3,
      title: "Escalation and Coordination — Controlled Progression",
      timeframe: "4–7 Days",
      branchFamily: "main",
      baseScenarioText:
        "WSSV has now been confirmed at multiple farms. Surveillance and tracing are expanding, response planning is progressing, and industry engagement is active. The incident remains serious but still potentially controllable if coordination, surveillance coverage, and tracing accuracy are maintained under rising pressure.",
      criteria: [
        {
          id: "p3m1",
          text: "Maintain effective ICC capability, staffing alignment, and operational reporting",
          consequence:
            "If the ICC weakens under scale, field coordination and decision-making may slow significantly.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: [
            "ICC",
            "staffing",
            "sitreps",
            "coordination",
            "operations",
          ],
        },
        {
          id: "p3m2",
          text: "Strengthen surveillance coverage across affected farms, high-risk sites, and environmental pathways",
          consequence:
            "If surveillance is uneven, the spread picture may remain incomplete while the response escalates.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "surveillance",
            "coverage",
            "environmental pathways",
            "high-risk sites",
          ],
        },
        {
          id: "p3m3",
          text: "Complete tracing and integrate movement data to prioritise operations and response planning",
          consequence:
            "If tracing and data integration stay incomplete, response priorities may be based on weak assumptions.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "tracing",
            "data integration",
            "movement data",
            "prioritise",
            "pathways",
          ],
        },
      ],
      questions: [
        {
          id: "p3mq1",
          text: "What would you prioritise to keep a multi-farm WSSV response under control as operational pressure rises?",
          theme: "Protocols",
          placeholder:
            "Describe your ICC, surveillance, tracing, and operational-alignment actions...",
        },
      ],
      passingRules: {
        minScore: 7,
        requiredCriteriaIds: ["p3m1", "p3m2", "p3m3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p3m1", "p3m2", "p3m3"],
        byMissingRequired: {
          p3m1: "p4a-icc-workforce-pressure",
          p3m2: "p4b-surveillance-rapid-risk-pressure",
          p3m3: "p4c-tracing-implementation-pressure",
        },
        strong: "p4-main",
        mixed: "p4-main",
        limited: "p4b-surveillance-rapid-risk-pressure",
        fallback: "p4-main",
      },
    },

    {
      id: "p3a-icc-pressure",
      phaseNumber: 3,
      title: "Escalation — ICC and Coordination Pressure",
      timeframe: "4–7 Days",
      branchFamily: "coordination",
      baseScenarioText:
        "WSSV is confirmed at several farms, but the Incident Coordination Centre is still not fully operational. Staffing shortfalls, delayed situational reporting, and frequent ministerial information demands are slowing coordination across jurisdictions and field teams.",
      criteria: [
        {
          id: "p3a1",
          text: "Fully establish ICC capability with staffing, reporting rhythm, and clearer operational coordination",
          consequence:
            "If ICC capability remains partial, a multi-site response may become fragmented and delayed.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: [
            "ICC",
            "staffing shortfalls",
            "reporting rhythm",
            "coordination",
          ],
        },
        {
          id: "p3a2",
          text: "Keep surveillance and tracing moving while governance pressure is being stabilised",
          consequence:
            "If operational momentum is lost, spread may continue while coordination structures are still being fixed.",
          theme: "Data",
          required: true,
          weight: 2,
          keywords: [
            "surveillance",
            "tracing",
            "operational momentum",
            "field teams",
          ],
        },
        {
          id: "p3a3",
          text: "Manage external briefing demands without overwhelming the response workforce",
          consequence:
            "If briefing pressure is unmanaged, leadership attention may be drained away from response delivery.",
          theme: "Communication",
          required: true,
          weight: 2,
          keywords: [
            "briefings",
            "minister",
            "updates",
            "workforce",
            "pressure",
          ],
        },
      ],
      questions: [
        {
          id: "p3aq1",
          text: "How would you stabilise a WSSV response where ICC capability is still lagging behind field needs?",
          theme: "Protocols",
          placeholder:
            "Explain your staffing, reporting, operational coordination, and demand-management actions...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p3a1", "p3a2", "p3a3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p3a1", "p3a2", "p3a3"],
        byMissingRequired: {
          p3a1: "p4a-icc-workforce-pressure",
          p3a2: "p4b-surveillance-rapid-risk-pressure",
          p3a3: "p4a-icc-workforce-pressure",
        },
        strong: "p4a-icc-workforce-pressure",
        mixed: "p4a-icc-workforce-pressure",
        limited: "p4a-icc-workforce-pressure",
        fallback: "p4a-icc-workforce-pressure",
      },
    },

    {
      id: "p3b-surveillance-pressure",
      phaseNumber: 3,
      title: "Escalation — Surveillance Coverage Pressure",
      timeframe: "4–7 Days",
      branchFamily: "surveillance",
      baseScenarioText:
        "WSSV is confirmed at multiple farms, but surveillance remains incomplete. Environmental and non-target monitoring are limited, surrounding farms have not all been inspected, and tracing is being constrained by weak surveillance coverage.",
      criteria: [
        {
          id: "p3b1",
          text: "Expand surveillance beyond known suspect farms, including environmental and high-risk external sites",
          consequence:
            "If surveillance stays narrow, the response may continue to miss linked spread and environmental exposure.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "expand surveillance",
            "environmental monitoring",
            "high-risk farms",
            "coverage",
          ],
        },
        {
          id: "p3b2",
          text: "Use improved surveillance results to sharpen tracing and prioritisation",
          consequence:
            "If surveillance findings are not integrated well, tracing and site prioritisation may remain weak.",
          theme: "Data",
          required: true,
          weight: 2,
          keywords: [
            "tracing",
            "prioritisation",
            "surveillance results",
            "integration",
          ],
        },
        {
          id: "p3b3",
          text: "Keep coordination arrangements strong enough to support rapid surveillance expansion",
          consequence:
            "If coordination cannot support surveillance growth, operational bottlenecks may persist.",
          theme: "Protocols",
          required: true,
          weight: 2,
          keywords: [
            "coordination",
            "surveillance expansion",
            "operations",
            "ICC",
          ],
        },
      ],
      questions: [
        {
          id: "p3bq1",
          text: "How would you close major surveillance gaps during an escalating WSSV response?",
          theme: "Data",
          placeholder:
            "Describe your surveillance expansion, environmental monitoring, prioritisation, and coordination approach...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p3b1", "p3b2", "p3b3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p3b1", "p3b2", "p3b3"],
        byMissingRequired: {
          p3b1: "p4b-surveillance-rapid-risk-pressure",
          p3b2: "p4c-tracing-implementation-pressure",
          p3b3: "p4a-icc-workforce-pressure",
        },
        strong: "p4b-surveillance-rapid-risk-pressure",
        mixed: "p4b-surveillance-rapid-risk-pressure",
        limited: "p4b-surveillance-rapid-risk-pressure",
        fallback: "p4b-surveillance-rapid-risk-pressure",
      },
    },

    {
      id: "p3c-tracing-pressure",
      phaseNumber: 3,
      title: "Escalation — Tracing and Pathway Uncertainty Pressure",
      timeframe: "4–7 Days",
      branchFamily: "tracing",
      baseScenarioText:
        "WSSV has been detected across multiple farms, but tracing remains incomplete. Recent stock movements, equipment sharing, and personnel pathways are not yet fully mapped, which is limiting surveillance prioritisation and increasing producer concern about unknown spread.",
      criteria: [
        {
          id: "p3c1",
          text: "Complete tracing of stock, equipment, vehicles, and personnel movements to clarify spread pathways",
          consequence:
            "If tracing gaps remain, surveillance and containment priorities may continue to rest on uncertain assumptions.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "complete tracing",
            "movements",
            "equipment sharing",
            "personnel",
            "pathways",
          ],
        },
        {
          id: "p3c2",
          text: "Expand surveillance based on traced pathways and risk-linked sites",
          consequence:
            "If surveillance is not shaped by tracing, high-risk spread routes may continue to be missed.",
          theme: "Data",
          required: true,
          weight: 2,
          keywords: [
            "surveillance based on tracing",
            "linked sites",
            "risk pathways",
          ],
        },
        {
          id: "p3c3",
          text: "Use ICC structures to coordinate data flow and multi-site decisions under uncertainty",
          consequence:
            "If data flow is poorly coordinated, response teams may interpret risk differently and act inconsistently.",
          theme: "Protocols",
          required: true,
          weight: 2,
          keywords: [
            "ICC",
            "data flow",
            "multi-site decisions",
            "uncertainty",
            "coordination",
          ],
        },
      ],
      questions: [
        {
          id: "p3cq1",
          text: "How would you improve confidence in the spread picture when tracing remains incomplete?",
          theme: "Data",
          placeholder:
            "Explain your tracing, surveillance, coordination, and prioritisation actions...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p3c1", "p3c2", "p3c3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p3c1", "p3c2", "p3c3"],
        byMissingRequired: {
          p3c1: "p4c-tracing-implementation-pressure",
          p3c2: "p4b-surveillance-rapid-risk-pressure",
          p3c3: "p4a-icc-workforce-pressure",
        },
        strong: "p4c-tracing-implementation-pressure",
        mixed: "p4c-tracing-implementation-pressure",
        limited: "p4c-tracing-implementation-pressure",
        fallback: "p4c-tracing-implementation-pressure",
      },
    },

    {
      id: "p4-main",
      phaseNumber: 4,
      title: "Implementation and Escalation — Controlled Delivery",
      timeframe: "1–2 Weeks",
      branchFamily: "main",
      baseScenarioText:
        "The response is now moving into broader implementation. Multiple farms are confirmed, disposal and destruction are beginning, surveillance continues across high-risk sites, tracing gaps are being closed, and response planning is transitioning into sustained operations. Workforce fatigue is emerging as a real constraint.",
      criteria: [
        {
          id: "p4m1",
          text: "Manage workforce sustainability while keeping field operations, sitreps, and coordination functioning",
          consequence:
            "If fatigue is not managed early, implementation quality and response discipline may begin to fall.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: [
            "workforce fatigue",
            "staff rotations",
            "operations",
            "sitrep",
            "coordination",
          ],
        },
        {
          id: "p4m2",
          text: "Continue surveillance and tracing strongly enough to support implementation decisions",
          consequence:
            "If surveillance and tracing lose momentum, implementation may proceed on an unstable spread picture.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "surveillance",
            "tracing",
            "implementation decisions",
            "spread picture",
          ],
        },
        {
          id: "p4m3",
          text: "Keep disposal, destruction, and decontamination progressing in a safe and coordinated way",
          consequence:
            "If implementation of control measures is delayed or inconsistent, infected material and residual risk may persist longer.",
          theme: "Constraints",
          required: true,
          weight: 2,
          keywords: [
            "disposal",
            "destruction",
            "decontamination",
            "control measures",
          ],
        },
      ],
      questions: [
        {
          id: "p4mq1",
          text: "How would you maintain a controlled WSSV response during broader implementation and increasing fatigue pressure?",
          theme: "Protocols",
          placeholder:
            "Describe your workforce, surveillance, tracing, disposal, and implementation coordination approach...",
        },
      ],
      passingRules: {
        minScore: 7,
        requiredCriteriaIds: ["p4m1", "p4m2", "p4m3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p4m1", "p4m2", "p4m3"],
        byMissingRequired: {
          p4m1: "p5a-workforce-sustainability",
          p4m2: "p5b-surveillance-assurance",
          p4m3: "p5c-recovery-planning-pressure",
        },
        strong: "p5-main",
        mixed: "p5-main",
        limited: "p5a-workforce-sustainability",
        fallback: "p5-main",
      },
    },

    {
      id: "p4a-icc-workforce-pressure",
      phaseNumber: 4,
      title: "Implementation — ICC Capability and Workforce Pressure",
      timeframe: "1–2 Weeks",
      branchFamily: "workforce",
      baseScenarioText:
        "The response is operational, but ICC capability and staffing pressure are now becoming the main constraints. National call-outs have improved numbers, but fatigue, competing reporting demands, and prolonged multi-site coordination are reducing efficiency.",
      criteria: [
        {
          id: "p4a1",
          text: "Stabilise staffing structure, workforce sustainability, and ICC operating rhythm",
          consequence:
            "If fatigue and coordination drift continue, the response may slow across every major workstream.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: [
            "staffing structure",
            "fatigue",
            "ICC rhythm",
            "workforce sustainability",
          ],
        },
        {
          id: "p4a2",
          text: "Protect tracing and surveillance performance while workforce pressure is rising",
          consequence:
            "If critical operational work slips during fatigue pressure, spread risk and decision uncertainty may increase again.",
          theme: "Data",
          required: true,
          weight: 2,
          keywords: [
            "tracing",
            "surveillance",
            "fatigue",
            "operational performance",
          ],
        },
      ],
      questions: [
        {
          id: "p4aq1",
          text: "How would you keep response delivery reliable when ICC staffing and workforce fatigue are under strain?",
          theme: "Protocols",
          placeholder:
            "Explain your staffing, rotations, coordination, and priority-protection actions...",
        },
      ],
      passingRules: {
        minScore: 4,
        requiredCriteriaIds: ["p4a1", "p4a2"],
      },
      nextStageMap: {
        byMissingRequired: {
          p4a1: "p5a-workforce-sustainability",
          p4a2: "p5a-workforce-sustainability",
        },
        strong: "p5a-workforce-sustainability",
        mixed: "p5a-workforce-sustainability",
        limited: "p5a-workforce-sustainability",
        fallback: "p5a-workforce-sustainability",
      },
    },

    {
      id: "p4b-surveillance-rapid-risk-pressure",
      phaseNumber: 4,
      title: "Implementation — Surveillance and Rapid Risk Assessment Pressure",
      timeframe: "1–2 Weeks",
      branchFamily: "surveillance",
      baseScenarioText:
        "The response is active, but surveillance and rapid risk assessment still need strengthening. Some high-risk sites and environmental pathways remain under-sampled, and prioritisation differs across teams. This is making it harder to focus effort consistently.",
      criteria: [
        {
          id: "p4b1",
          text: "Close major surveillance and environmental monitoring gaps across high-risk farms and waterways",
          consequence:
            "If surveillance remains incomplete, the response may carry unresolved spread uncertainty deeper into operations.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "close surveillance gaps",
            "environmental monitoring",
            "high-risk farms",
            "waterways",
          ],
        },
        {
          id: "p4b2",
          text: "Use rapid risk assessment to align prioritisation, containment, and implementation decisions",
          consequence:
            "If risk prioritisation remains inconsistent, teams may spread effort too thinly across competing sites.",
          theme: "Data",
          required: true,
          weight: 2,
          keywords: [
            "rapid risk assessment",
            "prioritisation",
            "containment",
            "implementation",
          ],
        },
      ],
      questions: [
        {
          id: "p4bq1",
          text: "How would you tighten surveillance and risk prioritisation while broader implementation is underway?",
          theme: "Data",
          placeholder:
            "Explain your surveillance, environmental monitoring, rapid risk assessment, and prioritisation actions...",
        },
      ],
      passingRules: {
        minScore: 4,
        requiredCriteriaIds: ["p4b1", "p4b2"],
      },
      nextStageMap: {
        byMissingRequired: {
          p4b1: "p5b-surveillance-assurance",
          p4b2: "p5b-surveillance-assurance",
        },
        strong: "p5b-surveillance-assurance",
        mixed: "p5b-surveillance-assurance",
        limited: "p5b-surveillance-assurance",
        fallback: "p5b-surveillance-assurance",
      },
    },

    {
      id: "p4c-tracing-implementation-pressure",
      phaseNumber: 4,
      title: "Implementation — Tracing and Operational Delivery Pressure",
      timeframe: "1–2 Weeks",
      branchFamily: "tracing",
      baseScenarioText:
        "Implementation is progressing, but historic movement uncertainty, producer anxiety, and incomplete pathway clarity are still affecting confidence. Disposal and decontamination are underway, yet operational prioritisation remains sensitive to tracing quality and stakeholder trust.",
      criteria: [
        {
          id: "p4c1",
          text: "Use stronger tracing and data integration to support targeted implementation and containment",
          consequence:
            "If tracing remains patchy, the response may implement broad controls without enough pathway precision.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "tracing",
            "data integration",
            "targeted implementation",
            "containment",
          ],
        },
        {
          id: "p4c2",
          text: "Maintain producer confidence and workable communication during implementation and compensation concern",
          consequence:
            "If trust weakens further, cooperation with controls, tracing, and recovery preparation may decline.",
          theme: "Communication",
          required: true,
          weight: 2,
          keywords: [
            "producer confidence",
            "compensation concern",
            "communication",
            "cooperation",
          ],
        },
      ],
      questions: [
        {
          id: "p4cq1",
          text: "How would you keep implementation credible when tracing uncertainty and producer concern are still affecting operations?",
          theme: "Communication",
          placeholder:
            "Describe your tracing, operational prioritisation, communication, and confidence-building approach...",
        },
      ],
      passingRules: {
        minScore: 4,
        requiredCriteriaIds: ["p4c1", "p4c2"],
      },
      nextStageMap: {
        byMissingRequired: {
          p4c1: "p5b-surveillance-assurance",
          p4c2: "p5c-recovery-planning-pressure",
        },
        strong: "p5-main",
        mixed: "p5c-recovery-planning-pressure",
        limited: "p5c-recovery-planning-pressure",
        fallback: "p5c-recovery-planning-pressure",
      },
    },

    {
      id: "p5-main",
      phaseNumber: 5,
      title: "Sustained Response and Recovery Planning",
      timeframe: "2–4 Weeks",
      branchFamily: "main",
      baseScenarioText:
        "Major response controls are established. Disposal and decontamination are underway, surveillance continues across high-risk farms and environmental pathways, and compensation and recovery planning are now active. The remaining challenge is to sustain workforce performance, retain confidence in the spread picture, and prepare for structured recovery transition.",
      criteria: [
        {
          id: "p5m1",
          text: "Manage workforce sustainability and keep late-stage response delivery stable",
          consequence:
            "If workforce sustainability is neglected, final-stage execution quality may begin to decline.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: [
            "workforce sustainability",
            "fatigue",
            "late-stage response",
            "rotations",
          ],
        },
        {
          id: "p5m2",
          text: "Maintain surveillance and verification confidence so unresolved spread risk does not carry into recovery",
          consequence:
            "If verification weakens too early, recovery decisions may be based on incomplete confidence.",
          theme: "Data",
          required: true,
          weight: 2,
          keywords: [
            "verification",
            "surveillance",
            "spread risk",
            "recovery",
            "confidence",
          ],
        },
        {
          id: "p5m3",
          text: "Start disciplined recovery planning, compensation alignment, and communication for transition",
          consequence:
            "If recovery planning is weak, the transition out of response mode may become fragmented or disputed.",
          theme: "Communication",
          required: true,
          weight: 2,
          keywords: [
            "recovery planning",
            "compensation",
            "transition",
            "communication",
            "alignment",
          ],
        },
      ],
      questions: [
        {
          id: "p5mq1",
          text: "How would you sustain the WSSV response while preparing for recovery and transition?",
          theme: "Communication",
          placeholder:
            "Describe your workforce, verification, recovery planning, and stakeholder communication approach...",
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
      id: "p5a-workforce-sustainability",
      phaseNumber: 5,
      title: "Sustained Response — Workforce Sustainability Pressure",
      timeframe: "2–4 Weeks",
      branchFamily: "workforce",
      baseScenarioText:
        "The response remains active, but staffing fatigue and prolonged operational pressure are now the dominant risk. Surveillance, disposal, reporting, and multi-site coordination are all continuing, and workforce sustainability is the key factor shaping final performance.",
      criteria: [
        {
          id: "p5a1",
          text: "Stabilise staffing, fatigue management, and execution discipline for the late-stage response",
          consequence:
            "If fatigue is not managed, the response may end with slower delivery, weaker consistency, and greater error risk.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: [
            "staffing",
            "fatigue management",
            "execution discipline",
            "late-stage response",
          ],
        },
      ],
      questions: [
        {
          id: "p5aq1",
          text: "How would you keep late-stage operations reliable when workforce fatigue is the main challenge?",
          theme: "Protocols",
          placeholder:
            "Explain your staffing, rotation, supervision, and operational-discipline actions...",
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
      id: "p5b-surveillance-assurance",
      phaseNumber: 5,
      title: "Sustained Response — Surveillance and Verification Assurance",
      timeframe: "2–4 Weeks",
      branchFamily: "surveillance",
      baseScenarioText:
        "The response is stable, but confidence in complete spread detection still depends on strong verification. Some residual risk remains across farms and environmental pathways, and surveillance assurance is the central issue before recovery decisions can be trusted.",
      criteria: [
        {
          id: "p5b1",
          text: "Prioritise final targeted surveillance and verification to reduce residual spread uncertainty",
          consequence:
            "If verification remains incomplete, the response may move into recovery with unresolved disease risk.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "targeted surveillance",
            "verification",
            "residual risk",
            "uncertainty",
          ],
        },
      ],
      questions: [
        {
          id: "p5bq1",
          text: "What would you do if residual spread uncertainty is still affecting confidence late in the response?",
          theme: "Data",
          placeholder:
            "Explain your final surveillance, verification, and residual-risk control approach...",
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
      id: "p5c-recovery-planning-pressure",
      phaseNumber: 5,
      title: "Sustained Response — Recovery Planning and Confidence Pressure",
      timeframe: "2–4 Weeks",
      branchFamily: "recovery",
      baseScenarioText:
        "Recovery is becoming possible, but confidence, compensation expectations, and phased transition arrangements still need careful coordination. The response now depends on disciplined planning for recovery, movement restriction changes, and communication with affected producers and stakeholders.",
      criteria: [
        {
          id: "p5c1",
          text: "Keep recovery planning, compensation expectations, and stakeholder communication aligned through transition planning",
          consequence:
            "If alignment weakens, the shift into close-out may become uncertain or contested.",
          theme: "Communication",
          required: true,
          weight: 3,
          keywords: [
            "recovery planning",
            "compensation expectations",
            "stakeholders",
            "transition planning",
            "communication",
          ],
        },
      ],
      questions: [
        {
          id: "p5cq1",
          text: "How would you maintain confidence while preparing for recovery and phased transition out of active response?",
          theme: "Communication",
          placeholder:
            "Explain your recovery planning, transition communication, and stakeholder-confidence actions...",
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
      title: "Final Recovery and Consolidation",
      timeframe: "Final Phase",
      branchFamily: "main",
      isTerminal: true,
      summaryCategory: "controlled-closeout",
      baseScenarioText:
        "The response has reached a controlled end stage. Disease management actions are established, recovery planning is active, phased lifting of restrictions is being considered for low-risk operations, and final priorities focus on disciplined close-out, verification, and coordinated transition.",
      criteria: [
        {
          id: "p6m1",
          text: "Explain how you would maintain a disciplined final close-out with verification, controlled transition, and coordinated recovery oversight",
          consequence:
            "If close-out is poorly managed, the final transition may introduce confusion or undermine confidence in the response outcome.",
          theme: "Expectations",
          required: true,
          weight: 2,
          keywords: [
            "close-out",
            "verification",
            "transition",
            "recovery oversight",
            "restrictions",
          ],
        },
      ],
      questions: [
        {
          id: "p6mq1",
          text: "How would you bring the WSSV response to a disciplined and credible close?",
          theme: "Expectations",
          placeholder:
            "Explain your final verification, transition, recovery, and restriction-management approach...",
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
        "The response is nearing conclusion, but workforce fatigue and execution pressure still shape the final phase. The key challenge is to keep late-stage operations stable enough to conclude credibly while protecting staff and delivery quality.",
      criteria: [
        {
          id: "p6a1",
          text: "Explain how you would stabilise final operations and preserve execution discipline under fatigue pressure",
          consequence:
            "If late-stage execution weakens, close-out credibility and final recovery readiness may suffer.",
          theme: "Protocols",
          required: true,
          weight: 2,
          keywords: [
            "stabilise final operations",
            "fatigue",
            "execution discipline",
            "staff",
            "close-out",
          ],
        },
      ],
      questions: [
        {
          id: "p6aq1",
          text: "How would you maintain credibility if final operations are still under workforce pressure?",
          theme: "Protocols",
          placeholder:
            "Explain your stabilisation, staffing, supervision, and close-out actions...",
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
      title: "Final Phase — Surveillance and Residual Risk Close-Out",
      timeframe: "Final Phase",
      branchFamily: "surveillance",
      isTerminal: true,
      summaryCategory: "surveillance-closeout",
      baseScenarioText:
        "The final phase is shaped by the need to resolve remaining uncertainty about residual disease risk across farms and aquatic pathways. Final verification and cautious close-out decisions remain central.",
      criteria: [
        {
          id: "p6b1",
          text: "Explain how you would manage final verification and residual-risk decisions before lifting controls further",
          consequence:
            "If residual-risk decisions are weak, the response may conclude with unresolved uncertainty and preventable vulnerability.",
          theme: "Data",
          required: true,
          weight: 2,
          keywords: [
            "final verification",
            "residual risk",
            "monitoring",
            "controls",
            "uncertainty",
          ],
        },
      ],
      questions: [
        {
          id: "p6bq1",
          text: "How would you manage close-out if residual detection uncertainty is still present?",
          theme: "Data",
          placeholder:
            "Explain your final surveillance, verification, and residual-risk management approach...",
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
        "The final phase is focused on maintaining confidence, communicating clearly, and concluding the response in a coordinated way while preparing recovery, phased restriction changes, and future production decisions.",
      criteria: [
        {
          id: "p6c1",
          text: "Explain how you would maintain confidence, communication, and coordinated recovery close-out under pressure",
          consequence:
            "If recovery close-out is poorly coordinated, confidence and transition discipline may weaken at the final step.",
          theme: "Communication",
          required: true,
          weight: 2,
          keywords: [
            "confidence",
            "communication",
            "recovery close-out",
            "restrictions",
            "transition",
          ],
        },
      ],
      questions: [
        {
          id: "p6cq1",
          text: "How would you manage final close-out where recovery expectations and stakeholder confidence still need active support?",
          theme: "Communication",
          placeholder:
            "Explain your recovery communication, stakeholder alignment, and final transition approach...",
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
        "You have reached the end of the simulation. Before viewing the final summary, reflect on how early reporting, containment, surveillance, tracing, and coordination decisions shaped later consequences across farms, waterways, workforce, and recovery planning.",
      criteria: [],
      questions: [
        {
          id: "complete-q1",
          text: "Before viewing the final summary, briefly reflect on the major priorities across the WSSV response and which gaps most increased later consequence.",
          theme: "Expectations",
          placeholder:
            "Write a short reflection on the major priorities, risks, lessons, and transition issues across the simulation...",
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

export function getWssvPrawnFarmStageById(
  stageId: string,
): ScenarioStage | undefined {
  return wssvPrawnFarmScenario.stages.find((stage) => stage.id === stageId);
}