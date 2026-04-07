import { Scenario } from "@/app/types/simulation";

export const invasiveMusselScenario: Scenario = {
  id: "invasive-mussel",
  title: "Invasive Mussel Incursion — Response and Preparedness Exercise",
  slug: "invasive-mussel",
  overview:
    "An aquatic biosecurity simulation designed to assess operational decision-making during a suspected invasive mussel incursion in a high-risk marina and coastal movement environment. The scenario supports quiet AI evaluation, consequence-based branching, stage-by-stage feedback, and an end summary focused on strengths, recurring gaps, and operational consequences.",
  version: 2,
  isActive: true,
  category: "aquatic-biosecurity",

  stages: [
    {
      id: "p1",
      phaseNumber: 1,
      title: "Detection and Immediate Response",
      timeframe: "0–24 Hours",
      baseScenarioText:
        "A local boater has reported dense clusters of small bivalves attached to vessel hulls, marina pylons, ropes, mooring lines, and submerged infrastructure within a busy recreational marina. Images suggest a suspected exotic mussel species with high invasive potential. Laboratory confirmation is pending, but the organism appears capable of rapid establishment, heavy fouling, and dispersal through planktonic larvae. The marina supports frequent vessel movement, contractor activity, and shared equipment use, creating an immediate risk of spread to nearby facilities and waterways. At this stage, the incident is still potentially containable, but only if early action is prompt, coordinated, and practical.",
      criteria: [
        {
          id: "p1c1",
          text: "Immediately report the suspect detection through the relevant aquatic biosecurity authority and formal escalation pathway",
          consequence:
            "Delayed reporting may reduce early coordination, slow decision-making, and increase the risk of spread before broader controls are established.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: [
            "report",
            "notify",
            "authority",
            "biosecurity",
            "escalate",
            "formal reporting",
            "incident notification",
          ],
        },
        {
          id: "p1c2",
          text: "Activate incident coordination arrangements and establish early response governance",
          consequence:
            "Without early coordination, response actions may become fragmented, inconsistent, and slower to scale.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: [
            "incident management",
            "incident control",
            "coordination",
            "ICC",
            "BIMS",
            "governance",
          ],
        },
        {
          id: "p1c3",
          text: "Implement immediate containment and movement restrictions around the suspect site while confirmation is pending",
          consequence:
            "If vessels, equipment, and infrastructure continue to move unmanaged, the likelihood of linked infestations increases rapidly.",
          theme: "Constraints",
          required: true,
          weight: 3,
          keywords: [
            "containment",
            "movement restriction",
            "movement control",
            "quarantine",
            "restrict access",
            "control zone",
            "stop movement",
          ],
        },
        {
          id: "p1c4",
          text: "Commence delimiting surveillance planning at and around the suspect location",
          consequence:
            "If early surveillance planning is delayed, the real spread footprint may be underestimated and later response phases may become more complex.",
          theme: "Data",
          required: true,
          weight: 2,
          keywords: [
            "surveillance",
            "delimiting",
            "inspection",
            "sampling",
            "survey",
            "site assessment",
            "monitoring",
          ],
        },
        {
          id: "p1c5",
          text: "Notify and engage immediate stakeholders such as marina operators, vessel owners, contractors, and local authorities",
          consequence:
            "If stakeholders are not engaged early, awareness, cooperation, and compliance may weaken.",
          theme: "Stakeholders",
          required: false,
          weight: 1,
          keywords: [
            "stakeholders",
            "marina operator",
            "industry",
            "council",
            "boaters",
            "vessel owners",
            "contractors",
          ],
        },
      ],
      questions: [
        {
          id: "p1q1",
          text: "What immediate actions would you take in the first 24 hours after this suspected aquatic pest detection?",
          theme: "Protocols",
          placeholder:
            "Describe the immediate reporting, containment, coordination, and surveillance actions you would initiate...",
        },
        {
          id: "p1q2",
          text: "Who would you notify, and what urgent measures would you take to reduce spread while species confirmation is still pending?",
          theme: "Communication",
          placeholder:
            "Explain how you would manage reporting, stakeholder communication, and early movement controls...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p1c1", "p1c2", "p1c3", "p1c4"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p1c1", "p1c3", "p1c4"],
        byMissingRequired: {
          p1c1: "p2-reporting-failure",
          p1c3: "p2-containment-failure",
          p1c4: "p2-surveillance-failure",
        },
        strong: "p2-controlled",
        mixed: "p2-controlled",
        limited: "p2-surveillance-failure",
        fallback: "p2-controlled",
      },
      adminMeta: {
        isPublished: true,
        version: 2,
      },
    },

    {
      id: "p2-controlled",
      phaseNumber: 2,
      title: "Early Response — Controlled Progression",
      timeframe: "24–72 Hours",
      baseScenarioText:
        "Early reporting and escalation have occurred, preliminary coordination is in place, and the incident remains potentially manageable. Diagnostic results are still pending. Ten high-risk linked locations have been identified through vessel movement, contractor activity, hull-cleaning histories, and shared marina infrastructure. Five lower-risk linked locations have also been noted. Containment is active at the suspect site, but inspections and structured surveillance at linked sites now need to accelerate before the spread picture worsens.",
      criteria: [
        {
          id: "p2cc1",
          text: "Implement structured surveillance of high-risk and lower-risk linked sites",
          consequence:
            "If inspections are delayed, additional infested sites may remain unidentified during a critical early window.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "surveillance",
            "inspection",
            "linked sites",
            "high-risk",
            "delimiting",
            "sampling",
          ],
        },
        {
          id: "p2cc2",
          text: "Strengthen containment and movement controls beyond the index site where justified by risk",
          consequence:
            "If controls remain too narrow, spread may continue through linked vessels, infrastructure, and equipment.",
          theme: "Constraints",
          required: true,
          weight: 3,
          keywords: [
            "containment",
            "movement controls",
            "linked sites",
            "quarantine",
            "restricted access",
          ],
        },
        {
          id: "p2cc3",
          text: "Engage industry and local stakeholders with practical guidance and expectations",
          consequence:
            "If communication is incomplete, confusion and inconsistent compliance may emerge.",
          theme: "Stakeholders",
          required: true,
          weight: 2,
          keywords: [
            "industry engagement",
            "guidance",
            "stakeholders",
            "operators",
            "communication",
          ],
        },
      ],
      questions: [
        {
          id: "p2ccq1",
          text: "How would you organise surveillance and prioritise linked sites at this stage?",
          theme: "Data",
          placeholder:
            "Explain your inspection, sampling, and prioritisation approach...",
        },
        {
          id: "p2ccq2",
          text: "How would you expand controls and guidance while maintaining cooperation?",
          theme: "Communication",
          placeholder:
            "Explain your containment, movement-control, and stakeholder approach...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p2cc1", "p2cc2", "p2cc3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p2cc1", "p2cc2", "p2cc3"],
        byMissingRequired: {
          p2cc1: "p3-surveillance-escalation",
          p2cc2: "p3-containment-escalation",
          p2cc3: "p3-stakeholder-escalation",
        },
        strong: "p3-controlled",
        mixed: "p3-controlled",
        limited: "p3-surveillance-escalation",
        fallback: "p3-controlled",
      },
    },

    {
      id: "p2-reporting-failure",
      phaseNumber: 2,
      title: "Early Response — Consequence of Delayed Reporting",
      timeframe: "24–72 Hours",
      baseScenarioText:
        "Formal reporting and escalation were delayed while waiting for greater certainty. During that time, the situation expanded. Multiple suspect or infected sites are now emerging across the boating network, including linked activity beyond the immediate marina. Interstate or cross-jurisdictional concerns are now being raised through vessel and equipment movements. Coordination pressure is increasing, national-level scrutiny is growing, and industry confidence is beginning to decline.",
      criteria: [
        {
          id: "p2rf1",
          text: "Stabilise coordination and formalise interagency or cross-jurisdictional engagement",
          consequence:
            "If coordination remains weak, delays and conflicting actions may worsen the incident.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: [
            "coordination",
            "interagency",
            "jurisdiction",
            "escalation",
            "governance",
          ],
        },
        {
          id: "p2rf2",
          text: "Escalate tracing and movement analysis to identify linked pathways quickly",
          consequence:
            "If tracing is not intensified, hidden spread pathways may continue to drive expansion.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "tracing",
            "movement analysis",
            "pathways",
            "mapping",
            "history",
          ],
        },
        {
          id: "p2rf3",
          text: "Apply stronger containment and movement controls to reduce further expansion",
          consequence:
            "If movement restrictions remain too weak, the spread may accelerate.",
          theme: "Constraints",
          required: true,
          weight: 2,
          keywords: [
            "containment",
            "movement controls",
            "restrictions",
            "enforcement",
          ],
        },
      ],
      questions: [
        {
          id: "p2rfq1",
          text: "How would you stabilise the response after delayed escalation and growing spread concerns?",
          theme: "Protocols",
          placeholder:
            "Describe your coordination, tracing, and control priorities...",
        },
        {
          id: "p2rfq2",
          text: "What practical actions would you take to restore confidence and reduce further spread?",
          theme: "Communication",
          placeholder:
            "Explain your containment, communication, and stakeholder approach...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p2rf1", "p2rf2", "p2rf3"],
      },
      nextStageMap: {
        strong: "p3-reporting-escalation",
        mixed: "p3-reporting-escalation",
        limited: "p3-reporting-escalation",
        fallback: "p3-reporting-escalation",
      },
    },

    {
      id: "p2-surveillance-failure",
      phaseNumber: 2,
      title: "Early Response — Consequence of Weak Surveillance",
      timeframe: "24–72 Hours",
      baseScenarioText:
        "Early surveillance was not prioritised strongly enough. As a result, several linked locations went unchecked during the critical early window, and suspect infestations are now being identified reactively rather than proactively. Some infected sites may have remained active for longer than expected, and the extent of spread is becoming less clear. The incident control function is under pressure because situational awareness is fragmented and prioritisation is becoming more reactive.",
      criteria: [
        {
          id: "p2sf1",
          text: "Rapidly scale structured surveillance across high-risk linked sites",
          consequence:
            "If surveillance remains delayed, more infested sites may stay undetected and continue operating.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "surveillance",
            "inspection",
            "high-risk",
            "rapid scale-up",
            "sampling",
          ],
        },
        {
          id: "p2sf2",
          text: "Improve incident coordination and information sharing to restore situational awareness",
          consequence:
            "If coordination remains fragmented, inspection and containment decisions may continue to lag.",
          theme: "Protocols",
          required: true,
          weight: 2,
          keywords: [
            "coordination",
            "ICC",
            "situation awareness",
            "information sharing",
          ],
        },
        {
          id: "p2sf3",
          text: "Reinforce containment and stakeholder guidance to reduce further unmanaged movement",
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
          id: "p2sfq1",
          text: "How would you recover from delayed surveillance and restore control of the situation?",
          theme: "Data",
          placeholder:
            "Describe your surveillance, coordination, and risk-prioritisation actions...",
        },
        {
          id: "p2sfq2",
          text: "How would you reduce further spread while confidence in the spread picture is still low?",
          theme: "Communication",
          placeholder:
            "Explain your containment, compliance, and stakeholder actions...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p2sf1", "p2sf2", "p2sf3"],
      },
      nextStageMap: {
        strong: "p3-surveillance-escalation",
        mixed: "p3-surveillance-escalation",
        limited: "p3-surveillance-escalation",
        fallback: "p3-surveillance-escalation",
      },
    },

    {
      id: "p2-containment-failure",
      phaseNumber: 2,
      title: "Early Response — Consequence of Weak Containment",
      timeframe: "24–72 Hours",
      baseScenarioText:
        "Initial detection and escalation occurred, but containment remained too limited. Controls were not broadened early enough beyond the suspect site, and movement continued through linked vessels, equipment, and support activity. Multiple suspect sites are now emerging, including potential spread beyond the local marina network. Stakeholder frustration is increasing because restrictions appear inconsistent, and the response is now operating under greater scrutiny.",
      criteria: [
        {
          id: "p2cf1",
          text: "Apply broader and more enforceable movement controls across linked sites and vectors",
          consequence:
            "If containment remains inconsistent, new infestations may continue to emerge.",
          theme: "Constraints",
          required: true,
          weight: 3,
          keywords: [
            "movement controls",
            "containment",
            "linked sites",
            "enforcement",
            "quarantine",
          ],
        },
        {
          id: "p2cf2",
          text: "Improve stakeholder guidance and expectations to reduce confusion and poor compliance",
          consequence:
            "If communication remains inconsistent, reporting and cooperation may weaken further.",
          theme: "Stakeholders",
          required: true,
          weight: 2,
          keywords: [
            "stakeholders",
            "guidance",
            "communication",
            "expectations",
            "compliance",
          ],
        },
        {
          id: "p2cf3",
          text: "Continue tracing and surveillance to identify where movement before controls may have caused spread",
          consequence:
            "If tracing and surveillance do not catch up, the real footprint may continue to expand.",
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
          id: "p2cfq1",
          text: "How would you recover from weak initial containment and reduce the risk of continued spread?",
          theme: "Constraints",
          placeholder:
            "Describe your movement-control, enforcement, tracing, and coordination actions...",
        },
        {
          id: "p2cfq2",
          text: "How would you improve stakeholder cooperation where restrictions have already been seen as inconsistent?",
          theme: "Stakeholders",
          placeholder:
            "Explain your communication, compliance, and engagement approach...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p2cf1", "p2cf2", "p2cf3"],
      },
      nextStageMap: {
        strong: "p3-containment-escalation",
        mixed: "p3-containment-escalation",
        limited: "p3-containment-escalation",
        fallback: "p3-containment-escalation",
      },
    },

    {
      id: "p3-controlled",
      phaseNumber: 3,
      title: "Escalation with Controlled Response",
      timeframe: "72 Hours–5 Days",
      baseScenarioText:
        "The mussel is now likely confirmed as exotic and a formal sustained response is taking shape. Surveillance and tracing have progressed strongly across the high-risk network, linked pathways are becoming clearer, and containment measures are being applied more consistently. An incident coordination structure is active, and a draft response plan is being developed. The incident remains serious, but operational control is still realistic if momentum is maintained.",
      criteria: [
        {
          id: "p3c1",
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
            "linked sites",
          ],
        },
        {
          id: "p3c2",
          text: "Ensure compliance and enforcement around movement restrictions and biosecurity controls",
          consequence:
            "If compliance weakens, the incident may expand despite earlier progress.",
          theme: "Constraints",
          required: true,
          weight: 2,
          keywords: [
            "compliance",
            "enforcement",
            "movement restrictions",
            "controls",
          ],
        },
        {
          id: "p3c3",
          text: "Advance response planning for removal, disposal, approvals, and operational scale-up",
          consequence:
            "If planning lags, later response actions may become delayed and fragmented.",
          theme: "Protocols",
          required: true,
          weight: 2,
          keywords: [
            "response plan",
            "removal",
            "disposal",
            "approvals",
            "operations",
          ],
        },
      ],
      questions: [
        {
          id: "p3cq1",
          text: "What would you prioritise to keep the response controlled as the incident escalates?",
          theme: "Protocols",
          placeholder:
            "Describe your surveillance, enforcement, planning, and coordination actions...",
        },
        {
          id: "p3cq2",
          text: "How would you prepare the response for safe removal, disposal, and sustained operational pressure?",
          theme: "Constraints",
          placeholder:
            "Explain your approvals, logistics, and risk-management approach...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p3c1", "p3c2", "p3c3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p3c3", "p3c2", "p3c1"],
        byMissingRequired: {
          p3c1: "p4a-surveillance-tracing-pressure",
          p3c2: "p4b-removal-disposal-pressure",
          p3c3: "p4c-approval-orc-pressure",
        },
        strong: "p4-controlled",
        mixed: "p4-controlled",
        limited: "p4a-surveillance-tracing-pressure",
        fallback: "p4-controlled",
      },
    },

    {
      id: "p3-reporting-escalation",
      phaseNumber: 3,
      title: "Escalation — Consequence of Delayed National-Level Coordination",
      timeframe: "72 Hours–5 Days",
      baseScenarioText:
        "Earlier delays in formal escalation have created ongoing coordination strain. Multiple linked sites are now involved, cross-jurisdictional questions are slowing decisions, and confidence in the response is under pressure. Tracing, containment, and stakeholder management are all competing for attention, while national-level scrutiny is increasing.",
      criteria: [
        {
          id: "p3re1",
          text: "Strengthen strategic coordination and decision-making alignment",
          consequence:
            "If alignment is not restored, delays and mixed messaging may continue.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: [
            "coordination",
            "alignment",
            "decision-making",
            "governance",
          ],
        },
        {
          id: "p3re2",
          text: "Accelerate tracing and containment around spread pathways",
          consequence:
            "If tracing and containment remain weak, additional spread may continue.",
          theme: "Data",
          required: true,
          weight: 2,
          keywords: ["tracing", "containment", "pathways", "mapping"],
        },
        {
          id: "p3re3",
          text: "Rebuild stakeholder confidence through clearer engagement and communication",
          consequence:
            "If confidence continues to fall, non-compliance and criticism may worsen.",
          theme: "Stakeholders",
          required: true,
          weight: 2,
          keywords: [
            "confidence",
            "stakeholders",
            "communication",
            "engagement",
          ],
        },
      ],
      questions: [
        {
          id: "p3req1",
          text: "How would you restore coordination and stabilise the response after earlier escalation delays?",
          theme: "Protocols",
          placeholder:
            "Describe your coordination, containment, and stakeholder actions...",
        },
      ],
      passingRules: {
        minScore: 5,
        requiredCriteriaIds: ["p3re1", "p3re2", "p3re3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p3re1", "p3re2", "p3re3"],
        byMissingRequired: {
          p3re1: "p4c-approval-orc-pressure",
          p3re2: "p4a-surveillance-tracing-pressure",
          p3re3: "p4c-approval-orc-pressure",
        },
        strong: "p4c-approval-orc-pressure",
        mixed: "p4c-approval-orc-pressure",
        limited: "p4c-approval-orc-pressure",
        fallback: "p4c-approval-orc-pressure",
      },
    },

    {
      id: "p3-surveillance-escalation",
      phaseNumber: 3,
      title: "Escalation — Consequence of Delayed Detection",
      timeframe: "72 Hours–5 Days",
      baseScenarioText:
        "Weak early surveillance has allowed additional suspect or infected sites to emerge through delayed discovery. The response now has less confidence in the defined spread footprint, and some linked sites may have operated longer than intended before controls were applied. The situation is more reactive, and operational pressure is growing.",
      criteria: [
        {
          id: "p3se1",
          text: "Accelerate targeted inspections and sampling to close detection gaps",
          consequence:
            "If surveillance gaps remain open, more late detections may occur.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "inspections",
            "sampling",
            "surveillance",
            "detection gaps",
          ],
        },
        {
          id: "p3se2",
          text: "Improve containment and prioritisation where delayed detection has increased risk",
          consequence:
            "If prioritisation remains weak, resources may be misallocated and spread may continue.",
          theme: "Constraints",
          required: true,
          weight: 2,
          keywords: [
            "containment",
            "prioritisation",
            "risk",
            "movement controls",
          ],
        },
        {
          id: "p3se3",
          text: "Keep stakeholders informed about uncertainty and operational priorities",
          consequence:
            "If uncertainty is not explained clearly, trust and cooperation may decline.",
          theme: "Communication",
          required: true,
          weight: 2,
          keywords: [
            "uncertainty",
            "communication",
            "priorities",
            "stakeholders",
          ],
        },
      ],
      questions: [
        {
          id: "p3seq1",
          text: "How would you recover from late detections and improve confidence in the spread picture?",
          theme: "Data",
          placeholder:
            "Describe your surveillance, prioritisation, and communication response...",
        },
      ],
      passingRules: {
        minScore: 5,
        requiredCriteriaIds: ["p3se1", "p3se2", "p3se3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p3se1", "p3se2", "p3se3"],
        byMissingRequired: {
          p3se1: "p4a-surveillance-tracing-pressure",
          p3se2: "p4a-surveillance-tracing-pressure",
          p3se3: "p4c-approval-orc-pressure",
        },
        strong: "p4a-surveillance-tracing-pressure",
        mixed: "p4a-surveillance-tracing-pressure",
        limited: "p4a-surveillance-tracing-pressure",
        fallback: "p4a-surveillance-tracing-pressure",
      },
    },

    {
      id: "p3-containment-escalation",
      phaseNumber: 3,
      title: "Escalation — Consequence of Weak Early Containment",
      timeframe: "72 Hours–5 Days",
      baseScenarioText:
        "Earlier containment weaknesses have contributed to ongoing spread concerns across linked vessels, equipment, and operational activity. The response now faces greater pressure to enforce movement controls, rebuild confidence, and manage the consequences of inconsistent earlier restrictions.",
      criteria: [
        {
          id: "p3ce1",
          text: "Strengthen enforceable containment and movement controls",
          consequence:
            "If containment remains inconsistent, the spread may keep expanding through operational pathways.",
          theme: "Constraints",
          required: true,
          weight: 3,
          keywords: [
            "enforcement",
            "containment",
            "movement controls",
            "restrictions",
          ],
        },
        {
          id: "p3ce2",
          text: "Improve tracing and surveillance to understand where movement before controls caused risk",
          consequence:
            "If tracing remains incomplete, the extent of spread may stay uncertain.",
          theme: "Data",
          required: true,
          weight: 2,
          keywords: ["tracing", "surveillance", "movement history", "risk"],
        },
        {
          id: "p3ce3",
          text: "Repair stakeholder confidence through clearer and more consistent guidance",
          consequence:
            "If communication remains patchy, cooperation and reporting may weaken.",
          theme: "Stakeholders",
          required: true,
          weight: 2,
          keywords: [
            "confidence",
            "guidance",
            "stakeholders",
            "communication",
          ],
        },
      ],
      questions: [
        {
          id: "p3ceq1",
          text: "How would you regain control after weak early containment increased the complexity of the response?",
          theme: "Constraints",
          placeholder:
            "Describe your containment, tracing, and stakeholder actions...",
        },
      ],
      passingRules: {
        minScore: 5,
        requiredCriteriaIds: ["p3ce1", "p3ce2", "p3ce3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p3ce1", "p3ce2", "p3ce3"],
        byMissingRequired: {
          p3ce1: "p4b-removal-disposal-pressure",
          p3ce2: "p4a-surveillance-tracing-pressure",
          p3ce3: "p4c-approval-orc-pressure",
        },
        strong: "p4b-removal-disposal-pressure",
        mixed: "p4b-removal-disposal-pressure",
        limited: "p4b-removal-disposal-pressure",
        fallback: "p4b-removal-disposal-pressure",
      },
    },

    {
      id: "p3-stakeholder-escalation",
      phaseNumber: 3,
      title: "Escalation — Consequence of Weak Stakeholder Engagement",
      timeframe: "72 Hours–5 Days",
      baseScenarioText:
        "Operational coordination is progressing, but stakeholder engagement has not kept pace. Confusion is growing among marina operators, vessel owners, contractors, and affected industries. Reporting and compliance are becoming less consistent, and criticism is increasing as expectations are not being managed clearly.",
      criteria: [
        {
          id: "p3ste1",
          text: "Rebuild stakeholder confidence through practical guidance and regular communication",
          consequence:
            "If expectations remain unclear, compliance and reporting may continue to weaken.",
          theme: "Stakeholders",
          required: true,
          weight: 3,
          keywords: ["stakeholders", "guidance", "communication", "confidence"],
        },
        {
          id: "p3ste2",
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
          id: "p3ste3",
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
          id: "p3steq1",
          text: "How would you restore confidence and improve cooperation where guidance and expectations have become unclear?",
          theme: "Stakeholders",
          placeholder:
            "Describe your engagement, compliance, and operational alignment actions...",
        },
      ],
      passingRules: {
        minScore: 5,
        requiredCriteriaIds: ["p3ste1", "p3ste2", "p3ste3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p3ste1", "p3ste2", "p3ste3"],
        byMissingRequired: {
          p3ste1: "p4c-approval-orc-pressure",
          p3ste2: "p4c-approval-orc-pressure",
          p3ste3: "p4a-surveillance-tracing-pressure",
        },
        strong: "p4c-approval-orc-pressure",
        mixed: "p4c-approval-orc-pressure",
        limited: "p4c-approval-orc-pressure",
        fallback: "p4c-approval-orc-pressure",
      },
    },

    {
      id: "p4-controlled",
      phaseNumber: 4,
      title: "Operational Scaling with Emerging Challenges",
      timeframe: "5–14 Days",
      baseScenarioText:
        "The mussel has now been formally confirmed as exotic, and the response is scaling operationally. Surveillance and trace mapping have progressed, but some uncertainty remains. Containment measures are active, the incident control structure is functioning, and a response plan is being refined. However, approvals, removal planning, disposal pathways, environmental safeguards, workforce strain, and stakeholder expectations are all placing pressure on the operation at the same time.",
      criteria: [
        {
          id: "p4c1",
          text: "Complete surveillance and tracing to close remaining operational gaps",
          consequence:
            "If surveillance and tracing remain incomplete, later operational actions may be based on an unstable spread picture.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: ["surveillance", "tracing", "gaps", "mapping"],
        },
        {
          id: "p4c2",
          text: "Finalise approvals and operational arrangements for safe removal and disposal",
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
          id: "p4c3",
          text: "Stabilise the response plan and stakeholder messaging under pressure",
          consequence:
            "If planning and communication remain uncertain, confidence and operational momentum may drop.",
          theme: "Protocols",
          required: true,
          weight: 2,
          keywords: ["response plan", "planning", "messaging", "stakeholders"],
        },
      ],
      questions: [
        {
          id: "p4q1",
          text: "How would you move from investigation into safe operational scaling at this stage?",
          theme: "Protocols",
          placeholder:
            "Describe your operational planning, approvals, and coordination approach...",
        },
        {
          id: "p4q2",
          text: "How would you manage removal, disposal, environmental safeguards, and stakeholder pressure at the same time?",
          theme: "Constraints",
          placeholder:
            "Explain your logistics, approvals, communications, and risk-management approach...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p4c1", "p4c2", "p4c3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p4c1", "p4c2", "p4c3"],
        byMissingRequired: {
          p4c1: "p5a-surveillance-failure",
          p4c2: "p5b-removal-failure",
          p4c3: "p5c-plan-orc-failure",
        },
        strong: "p5-controlled",
        mixed: "p5-controlled",
        limited: "p5a-surveillance-failure",
        fallback: "p5-controlled",
      },
    },

    {
      id: "p4a-surveillance-tracing-pressure",
      phaseNumber: 4,
      title: "Operational Scaling — Surveillance and Tracing Pressure",
      timeframe: "5–10 Days",
      baseScenarioText:
        "Because surveillance and trace mapping were not completed strongly enough in the previous phase, additional linked risk locations are now emerging under pressure. The response is still active, but late detections and incomplete pathway mapping are increasing uncertainty and making prioritisation harder.",
      criteria: [
        {
          id: "p4a1",
          text: "Complete targeted surveillance and close major tracing gaps across the linked network",
          consequence:
            "If surveillance and tracing remain incomplete, new detections may continue to emerge late and expand the operational footprint.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "targeted surveillance",
            "trace mapping",
            "linked sites",
            "inspection",
            "sampling",
            "pathways",
          ],
        },
        {
          id: "p4a2",
          text: "Re-prioritise containment and compliance at the highest-risk sites first",
          consequence:
            "If prioritisation is weak, scarce resources may be spread too thin and higher-risk pathways may remain active.",
          theme: "Constraints",
          required: true,
          weight: 2,
          keywords: [
            "prioritise",
            "high-risk",
            "containment",
            "compliance",
            "movement controls",
          ],
        },
        {
          id: "p4a3",
          text: "Keep stakeholders informed about uncertainty, priorities, and likely next actions",
          consequence:
            "If communication remains weak, trust may fall and reporting or cooperation may deteriorate.",
          theme: "Communication",
          required: true,
          weight: 2,
          keywords: [
            "stakeholders",
            "communication",
            "uncertainty",
            "priorities",
            "guidance",
          ],
        },
      ],
      questions: [
        {
          id: "p4aq1",
          text: "How would you close surveillance and tracing gaps while still controlling the highest-risk pathways?",
          theme: "Data",
          placeholder:
            "Explain your surveillance, prioritisation, containment, and communication actions...",
        },
      ],
      passingRules: {
        minScore: 5,
        requiredCriteriaIds: ["p4a1", "p4a2", "p4a3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p4a1", "p4a2", "p4a3"],
        byMissingRequired: {
          p4a1: "p5a-surveillance-failure",
          p4a2: "p5a-surveillance-failure",
          p4a3: "p5c-plan-orc-failure",
        },
        strong: "p5a-controlled",
        mixed: "p5a-controlled",
        limited: "p5a-surveillance-failure",
        fallback: "p5a-controlled",
      },
    },

    {
      id: "p4b-removal-disposal-pressure",
      phaseNumber: 4,
      title: "Operational Scaling — Removal and Disposal Pressure",
      timeframe: "5–10 Days",
      baseScenarioText:
        "The response is now under stronger operational pressure around removal, transport, disposal approvals, and safe destruction logistics. Delays in these areas are increasing the time infected material remains in the system and are creating further strain on containment credibility.",
      criteria: [
        {
          id: "p4b1",
          text: "Advance practical removal, transport, and disposal arrangements for infected material",
          consequence:
            "If removal and disposal planning is weak, infected material may remain in place longer and prolong the response.",
          theme: "Constraints",
          required: true,
          weight: 3,
          keywords: [
            "removal",
            "transport",
            "disposal",
            "infected material",
            "logistics",
          ],
        },
        {
          id: "p4b2",
          text: "Secure approvals and operational coordination needed to implement destruction safely",
          consequence:
            "If approvals lag, response momentum may stall and operational confidence may weaken.",
          theme: "Protocols",
          required: true,
          weight: 2,
          keywords: [
            "approvals",
            "coordination",
            "destruction",
            "implementation",
            "operational",
          ],
        },
        {
          id: "p4b3",
          text: "Maintain stakeholder compliance during disruptive operational controls",
          consequence:
            "If stakeholder cooperation weakens, access, timing, and containment effectiveness may all suffer.",
          theme: "Stakeholders",
          required: true,
          weight: 2,
          keywords: [
            "stakeholders",
            "compliance",
            "access",
            "guidance",
            "cooperation",
          ],
        },
      ],
      questions: [
        {
          id: "p4bq1",
          text: "How would you manage safe removal and disposal while keeping the response operationally credible?",
          theme: "Constraints",
          placeholder:
            "Explain your logistics, approvals, coordination, and stakeholder actions...",
        },
      ],
      passingRules: {
        minScore: 5,
        requiredCriteriaIds: ["p4b1", "p4b2", "p4b3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p4b1", "p4b2", "p4b3"],
        byMissingRequired: {
          p4b1: "p5b-removal-failure",
          p4b2: "p5b-removal-failure",
          p4b3: "p5c-plan-orc-failure",
        },
        strong: "p5b-controlled",
        mixed: "p5b-controlled",
        limited: "p5b-removal-failure",
        fallback: "p5b-controlled",
      },
    },

    {
      id: "p4c-approval-orc-pressure",
      phaseNumber: 4,
      title: "Operational Scaling — Approval, ORC, and Stakeholder Pressure",
      timeframe: "5–10 Days",
      baseScenarioText:
        "Approval timelines, ORC expectations, and stakeholder confidence are now under strain. Industry frustration is rising, and the response must manage not only the pest threat itself but the consequences of delayed decisions, unclear expectations, and mounting external scrutiny.",
      criteria: [
        {
          id: "p4cp1",
          text: "Progress the response plan and key approvals so the operation can move decisively",
          consequence:
            "If approval pathways stall, implementation delays will increase and operational confidence may erode.",
          theme: "Protocols",
          required: true,
          weight: 3,
          keywords: [
            "response plan",
            "approvals",
            "decision-making",
            "implementation",
            "plan",
          ],
        },
        {
          id: "p4cp2",
          text: "Manage ORC and stakeholder expectations with practical and consistent communication",
          consequence:
            "If expectations are not managed, frustration, criticism, and non-compliance may increase.",
          theme: "Communication",
          required: true,
          weight: 2,
          keywords: ["ORC", "expectations", "communication", "guidance", "stakeholders"],
        },
        {
          id: "p4cp3",
          text: "Maintain operational alignment between policy, coordination, and field response",
          consequence:
            "If alignment weakens, the response may become slower, inconsistent, and harder to sustain.",
          theme: "Protocols",
          required: true,
          weight: 2,
          keywords: ["alignment", "coordination", "field response", "policy", "operations"],
        },
      ],
      questions: [
        {
          id: "p4cq1",
          text: "How would you keep the response moving where approvals, ORC pressure, and stakeholder frustration are all increasing?",
          theme: "Communication",
          placeholder:
            "Explain your approval, communication, coordination, and alignment actions...",
        },
      ],
      passingRules: {
        minScore: 5,
        requiredCriteriaIds: ["p4cp1", "p4cp2", "p4cp3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p4cp1", "p4cp2", "p4cp3"],
        byMissingRequired: {
          p4cp1: "p5c-plan-orc-failure",
          p4cp2: "p5c-plan-orc-failure",
          p4cp3: "p5c-plan-orc-failure",
        },
        strong: "p5c-controlled",
        mixed: "p5c-controlled",
        limited: "p5c-plan-orc-failure",
        fallback: "p5c-controlled",
      },
    },

    {
      id: "p5-controlled",
      phaseNumber: 5,
      title: "Branching from Phase 4 — Sustained Operations Under Pressure",
      timeframe: "14–28 Days",
      baseScenarioText:
        "Operations are now moving under sustained pressure. Surveillance is near completion, disposal and decontamination pathways are active or close to activation, and operational decisions must balance spread risk, contractor capacity, disposal logistics, environmental controls, communications, and stakeholder confidence. Response pressure is now less about discovery and more about execution, sequencing, fatigue, and accountability.",
      criteria: [
        {
          id: "p5c1",
          text: "Maintain refined surveillance and tracing confidence while operations are underway",
          consequence:
            "If surveillance confidence weakens, operations may proceed with unresolved risk.",
          theme: "Data",
          required: true,
          weight: 2,
          keywords: ["surveillance", "tracing", "confidence", "monitoring"],
        },
        {
          id: "p5c2",
          text: "Manage disposal, transport, decontamination, and sequencing risks carefully",
          consequence:
            "If operational sequencing is weak, delays and secondary spread risks may increase.",
          theme: "Constraints",
          required: true,
          weight: 3,
          keywords: [
            "disposal",
            "transport",
            "decontamination",
            "sequencing",
            "logistics",
          ],
        },
        {
          id: "p5c3",
          text: "Maintain stakeholder confidence and practical communication during visible operations",
          consequence:
            "If communication is weak, criticism and fatigue may intensify as operations become more visible.",
          theme: "Communication",
          required: true,
          weight: 2,
          keywords: ["stakeholders", "communication", "confidence", "media", "fatigue"],
        },
      ],
      questions: [
        {
          id: "p5q1",
          text: "How would you manage sustained removal, disposal, and operational pressure without losing control of risk?",
          theme: "Constraints",
          placeholder:
            "Describe your logistics, sequencing, coordination, and workforce approach...",
        },
        {
          id: "p5q2",
          text: "How would you maintain confidence and cooperation while operations are highly visible and pressure is increasing?",
          theme: "Communication",
          placeholder:
            "Explain your communication, industry engagement, and expectation-management approach...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p5c1", "p5c2", "p5c3"],
      },
      nextStageMap: {
        byMissingRequiredPriority: ["p5c1", "p5c2", "p5c3"],
        byMissingRequired: {
          p5c1: "p6a-worsening",
          p5c2: "p6b-worsening",
          p5c3: "p6c-worsening",
        },
        strong: "p6-controlled",
        mixed: "p6-controlled",
        limited: "p6a-worsening",
        fallback: "p6-controlled",
      },
    },

    {
      id: "p5a-controlled",
      phaseNumber: 5,
      title: "Sustained Response — Surveillance and Tracing Completion",
      timeframe: "10–21 Days",
      baseScenarioText:
        "The response is still pressured, but surveillance and tracing are being completed more effectively. The main challenge is whether the spread picture can now be closed with enough confidence to support decisive action.",
      criteria: [
        {
          id: "p5a1",
          text: "Finalise high-risk surveillance and confirm the spread picture",
          consequence:
            "If the spread picture remains incomplete, the response may carry hidden residual risk into the final phase.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "finalise surveillance",
            "spread picture",
            "high-risk",
            "confirm",
            "trace",
          ],
        },
      ],
      questions: [
        {
          id: "p5aq1",
          text: "How would you complete surveillance and close out the main residual detection risks?",
          theme: "Data",
          placeholder:
            "Explain how you would finish surveillance, tracing, and prioritisation...",
        },
      ],
      passingRules: {
        minScore: 3,
        requiredCriteriaIds: ["p5a1"],
      },
      nextStageMap: {
        byMissingRequired: {
          p5a1: "p6a-worsening",
        },
        strong: "p6-controlled",
        mixed: "p6a-worsening",
        limited: "p6a-worsening",
        fallback: "p6a-worsening",
      },
    },

    {
      id: "p5b-controlled",
      phaseNumber: 5,
      title: "Sustained Response — Removal and Disposal Mobilisation",
      timeframe: "10–21 Days",
      baseScenarioText:
        "Operational focus is now on safe removal, transport, and disposal. The response is still viable, but execution quality now matters more than planning alone.",
      criteria: [
        {
          id: "p5b1",
          text: "Execute removal and disposal with strong operational control",
          consequence:
            "If execution weakens, biosecurity risk and delay may re-emerge late in the response.",
          theme: "Constraints",
          required: true,
          weight: 3,
          keywords: [
            "execute",
            "removal",
            "disposal",
            "operational control",
            "transport",
          ],
        },
      ],
      questions: [
        {
          id: "p5bq1",
          text: "How would you ensure removal and disposal are completed safely and credibly?",
          theme: "Constraints",
          placeholder:
            "Explain your execution, logistics, and control approach...",
        },
      ],
      passingRules: {
        minScore: 3,
        requiredCriteriaIds: ["p5b1"],
      },
      nextStageMap: {
        byMissingRequired: {
          p5b1: "p6b-worsening",
        },
        strong: "p6-controlled",
        mixed: "p6b-worsening",
        limited: "p6b-worsening",
        fallback: "p6b-worsening",
      },
    },

    {
      id: "p5c-controlled",
      phaseNumber: 5,
      title: "Sustained Response — Response Plan Finalisation and ORC Alignment",
      timeframe: "10–21 Days",
      baseScenarioText:
        "The response now depends on approval follow-through, ORC alignment, and maintaining stakeholder confidence while the operation remains disruptive.",
      criteria: [
        {
          id: "p5cp1",
          text: "Keep approvals, ORC expectations, and stakeholder communication aligned through the final operating period",
          consequence:
            "If alignment weakens now, late-stage compliance and confidence may still break down.",
          theme: "Communication",
          required: true,
          weight: 3,
          keywords: ["approvals", "ORC", "expectations", "alignment", "stakeholders"],
        },
      ],
      questions: [
        {
          id: "p5cq2",
          text: "How would you maintain confidence and alignment while final decisions are still under pressure?",
          theme: "Communication",
          placeholder:
            "Explain your communication, approvals, and stakeholder approach...",
        },
      ],
      passingRules: {
        minScore: 3,
        requiredCriteriaIds: ["p5cp1"],
      },
      nextStageMap: {
        byMissingRequired: {
          p5cp1: "p6c-worsening",
        },
        strong: "p6-controlled",
        mixed: "p6c-worsening",
        limited: "p6c-worsening",
        fallback: "p6c-worsening",
      },
    },

    {
      id: "p5a-surveillance-failure",
      phaseNumber: 5,
      title: "Sustained Response — Consequence of Incomplete Surveillance",
      timeframe: "10–21 Days",
      baseScenarioText:
        "Because surveillance and trace closure remained incomplete, the response is now carrying late-detection risk into the final stage. Confidence in the true spread picture is reduced and additional infected locations may still emerge.",
      criteria: [
        {
          id: "p5af1",
          text: "Prioritise final targeted surveillance and residual risk controls",
          consequence:
            "If final surveillance still does not close the main gaps, the response may end with unresolved spread risk.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "targeted surveillance",
            "residual risk",
            "late detection",
            "final inspections",
          ],
        },
      ],
      questions: [
        {
          id: "p5afq1",
          text: "What would you do now that late detection risk is still active going into the final stage?",
          theme: "Data",
          placeholder:
            "Explain your last-round surveillance and risk-control actions...",
        },
      ],
      passingRules: {
        minScore: 3,
        requiredCriteriaIds: ["p5af1"],
      },
      nextStageMap: {
        strong: "p6a-worsening",
        mixed: "p6a-worsening",
        limited: "p6a-worsening",
        fallback: "p6a-worsening",
      },
    },

    {
      id: "p5b-removal-failure",
      phaseNumber: 5,
      title: "Sustained Response — Consequence of Removal and Disposal Delays",
      timeframe: "10–21 Days",
      baseScenarioText:
        "Removal and disposal have not progressed strongly enough. Infected material remains in the system longer than intended, and operational pressure is now shifting into the final phase with higher consequence risk.",
      criteria: [
        {
          id: "p5bf1",
          text: "Stabilise late-stage removal and disposal execution under pressure",
          consequence:
            "If execution remains delayed, final containment credibility may weaken further.",
          theme: "Constraints",
          required: true,
          weight: 3,
          keywords: [
            "stabilise",
            "removal",
            "disposal",
            "late-stage",
            "execution",
          ],
        },
      ],
      questions: [
        {
          id: "p5bfq1",
          text: "How would you recover operational control where removal and disposal are still lagging?",
          theme: "Constraints",
          placeholder: "Explain your recovery and execution actions...",
        },
      ],
      passingRules: {
        minScore: 3,
        requiredCriteriaIds: ["p5bf1"],
      },
      nextStageMap: {
        strong: "p6b-worsening",
        mixed: "p6b-worsening",
        limited: "p6b-worsening",
        fallback: "p6b-worsening",
      },
    },

    {
      id: "p5c-plan-orc-failure",
      phaseNumber: 5,
      title: "Sustained Response — Consequence of Approval, ORC, and Confidence Strain",
      timeframe: "10–21 Days",
      baseScenarioText:
        "Delays in approvals, ORC uncertainty, and weakening stakeholder confidence are now carrying directly into the final phase. The response remains active, but confidence and cooperation are more fragile than they should be.",
      criteria: [
        {
          id: "p5cf1",
          text: "Stabilise stakeholder confidence and operational alignment despite delayed decisions",
          consequence:
            "If confidence continues to weaken, the final phase may become harder to coordinate and sustain.",
          theme: "Stakeholders",
          required: true,
          weight: 3,
          keywords: [
            "stabilise",
            "confidence",
            "alignment",
            "delayed decisions",
            "stakeholders",
          ],
        },
      ],
      questions: [
        {
          id: "p5cfq1",
          text: "How would you maintain cooperation where approvals and ORC issues are still unresolved late in the response?",
          theme: "Stakeholders",
          placeholder:
            "Explain your alignment, communication, and confidence actions...",
        },
      ],
      passingRules: {
        minScore: 3,
        requiredCriteriaIds: ["p5cf1"],
      },
      nextStageMap: {
        strong: "p6c-worsening",
        mixed: "p6c-worsening",
        limited: "p6c-worsening",
        fallback: "p6c-worsening",
      },
    },

    {
      id: "p6-controlled",
      phaseNumber: 6,
      title: "Coordinated Execution Under Sustained Pressure",
      timeframe: "28 Days+",
      baseScenarioText:
        "Surveillance and tracing activities are now largely complete, with confidence in the known spread picture high but not absolute. The confirmed footprint includes the index site and multiple linked infested locations. Most transmission pathways are now understood, though some indirect or lower-confidence links remain unresolved, particularly around contractor movement, shared equipment histories, and incomplete operational records. Containment zones have been refined and movement restrictions are generally well understood, but compliance fatigue is emerging in outer control areas where no infestation has been detected. Removal, disposal, and decontamination activities are now underway under approved environmental controls. However, disposal-site capacity is tighter than expected, transport logistics are complex, weather and scheduling pressures are affecting timing, and administrative pressure is increasing around reimbursement, documentation, and response milestones. The incident control function remains active and capable, but sustained operational tempo is placing pressure on personnel, prioritisation, communications, and decisions about stand-down. At this stage, teams must balance confidence-building, residual risk, lessons learned, and the pathway toward safe transition.",
      criteria: [
        {
          id: "p6c1",
          text: "Confirm the eradication pathway and residual risk before easing restrictions or standing down",
          consequence:
            "If residual risk is underestimated, the response may stand down too early and lose control of re-emergence risk.",
          theme: "Data",
          required: true,
          weight: 3,
          keywords: [
            "eradication pathway",
            "residual risk",
            "confidence",
            "verification",
            "proof of freedom",
          ],
        },
        {
          id: "p6c2",
          text: "Plan the transition toward stand-down while retaining lessons learned and operational knowledge",
          consequence:
            "If stand-down is poorly managed, critical lessons and readiness improvements may be lost.",
          theme: "Protocols",
          required: true,
          weight: 2,
          keywords: [
            "stand down",
            "transition",
            "lessons learned",
            "institutional knowledge",
          ],
        },
        {
          id: "p6c3",
          text: "Maintain safe and coordinated removal, disposal, and decontamination activity through completion",
          consequence:
            "If final operational controls weaken, disposal, transport, or decontamination risks may undermine the response.",
          theme: "Constraints",
          required: true,
          weight: 2,
          keywords: [
            "removal",
            "disposal",
            "decontamination",
            "transport",
            "coordination",
          ],
        },
        {
          id: "p6c4",
          text: "Manage communications and stakeholder expectations around fatigue, costs, duration, and transition",
          consequence:
            "If expectations are not managed clearly, confidence may erode even during a technically successful response.",
          theme: "Communication",
          required: false,
          weight: 1,
          keywords: [
            "communications",
            "stakeholders",
            "fatigue",
            "cost",
            "duration",
            "transition",
          ],
        },
      ],
      questions: [
        {
          id: "p6q1",
          text: "How would you manage the move toward stand-down while still controlling residual risk and maintaining operational discipline?",
          theme: "Protocols",
          placeholder:
            "Describe your stand-down, lessons learned, residual-risk, and operational-completion approach...",
        },
        {
          id: "p6q2",
          text: "What would you need to see before you were confident enough to reduce restrictions or close out major response activities?",
          theme: "Data",
          placeholder:
            "Explain your verification, confidence, disposal-completion, and transition requirements...",
        },
      ],
      passingRules: {
        minScore: 6,
        requiredCriteriaIds: ["p6c1", "p6c2", "p6c3"],
      },
      nextStageMap: {
        strong: "complete",
        mixed: "complete",
        limited: "complete",
        fallback: "complete",
      },
    },

    {
      id: "p6a-worsening",
      phaseNumber: 6,
      title: "Final Phase — Consequence of Residual Detection Risk",
      timeframe: "Final Phase",
      baseScenarioText:
        "Residual surveillance and trace uncertainty remain active in the final phase. The response is still moving, but confidence in the true spread picture is weaker and final assurance is harder to achieve.",
      criteria: [
        {
          id: "p6a1",
          text: "Explain how you would manage final residual detection risk and close-out decisions",
          consequence:
            "If residual detection risk is not managed clearly, confidence in final outcomes may remain fragile.",
          theme: "Data",
          required: true,
          weight: 2,
          keywords: [
            "residual risk",
            "detection",
            "close-out",
            "final surveillance",
          ],
        },
      ],
      questions: [
        {
          id: "p6aq1",
          text: "How would you manage close-out where residual detection uncertainty is still present?",
          theme: "Data",
          placeholder: "Explain your final residual-risk approach...",
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
      id: "p6b-worsening",
      phaseNumber: 6,
      title: "Final Phase — Consequence of Operational Execution Delays",
      timeframe: "Final Phase",
      baseScenarioText:
        "Removal, disposal, or late-stage operational execution remained under strain. The response reaches the final phase with greater operational fatigue and reduced flexibility than intended.",
      criteria: [
        {
          id: "p6b1",
          text: "Explain how you would stabilise final operations and maintain containment confidence",
          consequence:
            "If late-stage execution remains unstable, the final transition may be less credible and harder to sustain.",
          theme: "Constraints",
          required: true,
          weight: 2,
          keywords: [
            "stabilise",
            "operations",
            "containment confidence",
            "late-stage",
          ],
        },
      ],
      questions: [
        {
          id: "p6bq1",
          text: "How would you maintain credibility where final operations are still under pressure?",
          theme: "Constraints",
          placeholder: "Explain your stabilisation and close-out actions...",
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
      id: "p6c-worsening",
      phaseNumber: 6,
      title: "Final Phase — Consequence of Stakeholder and Confidence Strain",
      timeframe: "Final Phase",
      baseScenarioText:
        "The final phase is now shaped by weakened confidence, approval strain, ORC pressure, and more fragile cooperation than expected. Operational success now depends heavily on clear communication and disciplined coordination.",
      criteria: [
        {
          id: "p6d1",
          text: "Explain how you would maintain confidence, communication, and coordinated close-out under pressure",
          consequence:
            "If coordination and confidence are not maintained, the final phase may become disorderly and harder to conclude well.",
          theme: "Communication",
          required: true,
          weight: 2,
          keywords: [
            "confidence",
            "communication",
            "coordinated close-out",
            "pressure",
          ],
        },
      ],
      questions: [
        {
          id: "p6cq2",
          text: "How would you manage final close-out where confidence and cooperation are under strain?",
          theme: "Communication",
          placeholder:
            "Explain your confidence, communication, and close-out actions...",
        },
      ],
      passingRules: {
        minScore: 2,
        requiredCriteriaIds: ["p6d1"],
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
      baseScenarioText:
        "You have reached the end of the simulation. Before viewing the final summary, briefly reflect on the most important operational priorities across the response and how missed actions early in the incident can worsen later consequences.",
      criteria: [],
      questions: [
        {
          id: "complete-q1",
          text: "Before viewing the final summary, briefly reflect on the most important operational priorities across the incident and what gaps most increased consequence over time.",
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

export function getScenarioStageById(stageId: string) {
  return invasiveMusselScenario.stages.find((stage) => stage.id === stageId);
}