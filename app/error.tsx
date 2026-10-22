"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="account-page">
      <section className="panel">
        <h1>Something interrupted your workspace.</h1>
        <p>
          Your saved reports remain in this browser. Try loading this page
          again.
        </p>
        <button className="button primary" onClick={reset}>
          Try again
        </button>
      </section>
    </main>
  );
}
