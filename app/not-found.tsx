import Link from "next/link";
export default function NotFound() {
  return (
    <main className="account-page">
      <section className="panel">
        <h1>This page isn’t in your workspace.</h1>
        <Link href="/dashboard" className="button primary">
          Back to overview
        </Link>
      </section>
    </main>
  );
}
