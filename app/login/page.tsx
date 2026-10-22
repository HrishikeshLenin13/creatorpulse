import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="auth-shell">
      <div className="auth-panel glass-panel">
        <div className="brand-wrap auth-brand">
          <div className="brand-mark">C</div>
          <div>
            <div className="brand-name">CreatorPulse</div>
          </div>
        </div>

        <h1>Welcome back</h1>
        <p className="auth-subtitle">Sign in to your creator workspace.</p>

        <form className="auth-form">
          <label>
            <span>Email</span>
            <input type="email" defaultValue="ava@creatorpulse.io" />
          </label>

          <label>
            <span>Password</span>
            <input type="password" defaultValue="********" />
          </label>

          <button type="button" className="primary-btn auth-submit">
            Sign in
          </button>
        </form>

        <div className="auth-footer">
          <span>New to CreatorPulse?</span>
          <Link href="/signup">Create account</Link>
        </div>
      </div>
    </main>
  );
}
