// "use client";


// import { DecisionOption } from "@/app/types/simulation";
// import { Badge } from "@/components/ui/badge";

// interface Props {
//   options: DecisionOption[];
//   selectedDecisionId: string;
//   onSelect: (decisionId: string) => void;
// }

// const impactTone: Record<string, string> = {
//   strong: "border-emerald-200 bg-emerald-50",
//   moderate: "border-amber-200 bg-amber-50",
//   weak: "border-rose-200 bg-rose-50",
// };

// export function DecisionPanel({
//   options,
//   selectedDecisionId,
//   onSelect,
// }: Props) {
//   return (
//     <div className="space-y-3">
//       {options.map((option) => {
//         const isActive = option.id === selectedDecisionId;
//         return (
//           <button
//             key={option.id}
//             type="button"
//             onClick={() => onSelect(option.id)}
//             className={`w-full rounded-2xl border p-4 text-left transition ${
//               isActive
//                 ? "border-primary ring-2 ring-primary/20"
//                 : impactTone[option.impact]
//             }`}
//           >
//             <div className="flex items-start justify-between gap-4">
//               <p className="font-medium leading-6">{option.text}</p>
//               <Badge variant={isActive ? "default" : "outline"}>
//                 {option.impact}
//               </Badge>
//             </div>
//           </button>
//         );
//       })}
//     </div>
//   );
// }