import { signIn } from "@/auth";

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
          Enter your email. We'll send a one-click sign-in link.
        </p>

        <form
          action={async (formData) => {
            "use server";
            await signIn("nodemailer", {
              email: String(formData.get("email") ?? ""),
              redirectTo: next,
            });
          }}
          className="space-y-4"
        >
          <label className="block">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-muted">
              Email
            </span>
            <input
              type="email"
              name="email"
              autoFocus
              autoComplete="email"
              required
              className="mt-2 w-full bg-white border border-rule px-3 py-2 text-base text-ink rounded-sm focus:outline-none focus:border-ink"
            />
          </label>

          {err === "forbidden" ? (
            <p className="text-sm text-[#c8261c]">You don't have access to this area.</p>
          ) : err === "user_missing" ? (
            <p className="text-sm text-[#c8261c]">Session expired. Sign in again.</p>
          ) : err === "no_org" ? (
            <p className="text-sm text-[#c8261c]">Your account has no organisations yet.</p>
          ) : err === "config" ? (
            <p className="text-sm text-[#c8261c]">
              Auth not configured (EMAIL_SERVER_* or DATABASE_URL missing).
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full px-4 py-2.5 text-sm font-medium bg-ink text-white rounded-sm hover:bg-ink-deep transition-colors"
          >
            Send sign-in link
          </button>
        </form>
      </div>
    </main>
  );
}
