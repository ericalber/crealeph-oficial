import { ReportsClient } from "./ReportsClient";

export const metadata = { robots: { index: false, follow: false } } as const;

export default function ReportsPage() {
  return <ReportsClient />;
}
