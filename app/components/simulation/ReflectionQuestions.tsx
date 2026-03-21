"use client";


import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ReflectionQuestion } from "@/app/types/simulation";

interface Props {
  questions: ReflectionQuestion[];
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
}

export function ReflectionQuestions({
  questions,
  answers,
  onAnswerChange,
}: Props) {
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <div
          key={question.id}
          className="rounded-2xl border bg-card p-4 shadow-sm"
        >
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <p className="font-medium">{question.text}</p>
            <Badge variant="outline">{question.theme}</Badge>
          </div>
          <Textarea
            value={answers[question.id] ?? ""}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder ?? "Type your response here..."}
            className="min-h-[110px]"
          />
        </div>
      ))}
    </div>
  );
}