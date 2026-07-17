// The Events area's own navbar has been retired into the shared AdminShell
// (app/admin/_shell/AdminShell.tsx), driven by lib/admin-nav.ts. This layout is
// now just a metadata boundary; the shell provides all chrome.

export const metadata = {
  title: "Events Pipeline — EHC Admin",
  robots: { index: false, follow: false },
};

export default function AdminEventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
