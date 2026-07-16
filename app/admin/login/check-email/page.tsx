export const metadata = {
  title: "Check your email — EHC",
  robots: { index: false, follow: false },
};

export default function CheckEmail() {
  return (
    <main className="min-h-[80vh] bg-paper-green flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm text-center">
        <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-muted mb-3">
          European Heat Council · Admin
        </p>
        <h1 className="text-2xl font-semibold text-ink mb-3">Check your email</h1>
        <p className="text-sm text-muted leading-relaxed">
          A one-click sign-in link is on its way. It works for 24 hours.
          If it doesn't arrive in a couple of minutes, check spam or try again.
        </p>
      </div>
    </main>
  );
}
