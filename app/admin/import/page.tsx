import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ImportScenarioForm from "./import-form";

export default async function AdminImportPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <Badge className="bg-cyan-600 text-white">Import Scenario</Badge>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900">
          Import Scenario from Excel
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Upload the prepared Excel workbook and the system will create the
          scenario, stages, questions, criteria, branching, and publish it automatically.
        </p>
      </div>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Upload Workbook</CardTitle>
        </CardHeader>

        <CardContent>
          <ImportScenarioForm />
        </CardContent>
      </Card>
    </div>
  );
}