import Link from "next/link";
import { Brand } from "@/components/Sidebar";
export default function AccountPage() {
  return (
    <main className="account-page">
      <section className="panel">
        <Brand />
        <h1>No account needed.</h1>
        <p>
          CreatorPulse currently offers a public workspace. Cloud sign-in and
          account sync are not configured, so we do not collect passwords.
        </p>
        <Link className="button primary" href="/dashboard">
          Open public workspace
        </Link>
        <Link className="text-link" href="/dashboard/settings">
          View storage & connection settings
        </Link>
      </section>
    </main>
  );
}
