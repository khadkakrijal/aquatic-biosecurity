"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReportsChartsProps {
  statusData: { name: string; value: number }[];
  severityData: { name: string; value: number }[];
  completionData: { name: string; completion: number }[];
  decisionData: { name: string; value: number }[];
  missedThemesData: { theme: string; count: number }[];
}

const STATUS_COLORS = ["#10b981", "#f59e0b"];
const SEVERITY_COLORS = ["#06b6d4", "#f97316", "#ef4444"];
const DECISION_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-[280px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
      {message}
    </div>
  );
}

export default function ReportsCharts({
  statusData,
  severityData,
  completionData,
  decisionData,
  missedThemesData,
}: ReportsChartsProps) {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Attempt Status</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <div className="flex justify-center overflow-x-auto">
                <PieChart width={420} height={280}>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`status-${entry.name}`}
                        fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            ) : (
              <EmptyState message="No status data available yet." />
            )}
            <p className="mt-3 text-sm text-slate-600">
              Shows how many simulation attempts are completed or still in
              progress.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Severity Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {severityData.length > 0 ? (
              <div className="flex justify-center overflow-x-auto">
                <PieChart width={420} height={280}>
                  <Pie
                    data={severityData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {severityData.map((entry, index) => (
                      <Cell
                        key={`severity-${entry.name}`}
                        fill={SEVERITY_COLORS[index % SEVERITY_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            ) : (
              <EmptyState message="No severity data available yet." />
            )}
            <p className="mt-3 text-sm text-slate-600">
              Shows the overall severity reached across participant attempts.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Decision Breakdown Across Stages</CardTitle>
          </CardHeader>
          <CardContent>
            {decisionData.length > 0 ? (
              <div className="flex justify-center overflow-x-auto">
                <PieChart width={420} height={280}>
                  <Pie
                    data={decisionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {decisionData.map((entry, index) => (
                      <Cell
                        key={`decision-${entry.name}`}
                        fill={DECISION_COLORS[index % DECISION_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            ) : (
              <EmptyState message="No decision data available yet." />
            )}
            <p className="mt-3 text-sm text-slate-600">
              Shows how often stage responses were classified as strong, mixed,
              or limited.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Most Missed Themes</CardTitle>
          </CardHeader>
          <CardContent>
            {missedThemesData.length > 0 ? (
              <div className="flex justify-center overflow-x-auto">
                <BarChart
                  width={500}
                  height={280}
                  data={missedThemesData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="theme" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </div>
            ) : (
              <EmptyState message="No missed theme data available yet." />
            )}
            <p className="mt-3 text-sm text-slate-600">
              Highlights the themes that participants missed most often.
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="rounded-3xl lg:col-span-2">
        <CardHeader>
          <CardTitle>Completion by Participant</CardTitle>
        </CardHeader>
        <CardContent>
          {completionData.length > 0 ? (
            <div className="overflow-x-auto">
              <BarChart
                width={Math.max(900, completionData.length * 120)}
                height={320}
                data={completionData}
                margin={{ top: 10, right: 20, left: 0, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={70}
                  tickFormatter={(value) =>
                    typeof value === "string" && value.length > 18
                      ? `${value.slice(0, 18)}…`
                      : value
                  }
                />
                <YAxis allowDecimals={false} domain={[0, 100]} />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Completion %"]}
                  labelFormatter={(label) => `Participant: ${label}`}
                />
                <Bar
                  dataKey="completion"
                  name="Completion %"
                  fill="#2563eb"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </div>
          ) : (
            <EmptyState message="No completion data available yet." />
          )}
          <p className="mt-3 text-sm text-slate-600">
            Shows the completion percentage for recent participant attempts.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
