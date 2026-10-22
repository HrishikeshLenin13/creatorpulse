import Link from 'next/link';

export default function SignupPage() {
  return (
    <main className="auth-shell">
      <div className="auth-panel glass-panel">
        <div className="brand-wrap auth-brand">
          <div className="brand-mark">C</div>
          <div>
            <div className="brand-name">CreatorPulse</div>
          </div>
        </div>

        <h1>Create your account</h1>
        <p className="auth-subtitle">Launch your analytics workspace in minutes.</p>

        <form className="auth-form">
          <label>
            <span>Full name</span>
            <input type="text" defaultValue="Ava Chen" />
          </label>

          <label>
            <span>Email</span>
            <input type="email" defaultValue="ava@creatorpulse.io" />
          </label>

          <label>
            <span>Password</span>
            <input type="password" defaultValue="********" />
          </label>

          <button type="button" className="primary-btn auth-submit">
            Create account
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <Link href="/login">Sign in</Link>
        </div>
      </div>
    </main>
  );
}
