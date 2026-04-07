import { Suspense } from "react";
import LoginContent from "./login-content";


export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
          <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
            <h1 className="mb-4 text-2xl font-semibold text-slate-900">
              Login
            </h1>
            <p className="text-sm text-slate-600">Loading...</p>
          </div>
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}