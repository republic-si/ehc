import { loginAction } from "./actions";

export const metadata = {
  title: "Admin login — EHC",
  robots: { index: false, follow: false },
};

type SP = Promise<{ next?: string; err?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const next = sp.next ?? "/admin/events";
  const err = sp.err;

  return (
    <main className="min-h-[80vh] bg-paper-green flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-muted mb-3">
          European Heat Council · Admin
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-ink mb-2">
          Sign in
        </h1>
        <p className="text-sm text-muted mb-8 leading-relaxed">
          Enter the admin password to access the events pipeline.
        </p>

        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="next" value={next} />
          <label className="block">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-muted">
              Password
            </span>
            <input
              type="password"
              name="password"
              autoFocus
              autoComplete="current-password"
              className="mt-2 w-full bg-white border border-rule px-3 py-2 text-base text-ink rounded-sm focus:outline-none focus:border-ink"
            />
          </label>

          {err === "wrong" ? (
            <p className="text-sm text-[#c8261c]">Wrong password.</p>
          ) : err === "config" ? (
            <p className="text-sm text-[#c8261c]">
              Auth not configured (ADMIN_PASS env var missing).
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full px-4 py-2.5 text-sm font-medium bg-ink text-white rounded-sm hover:bg-ink-deep transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
