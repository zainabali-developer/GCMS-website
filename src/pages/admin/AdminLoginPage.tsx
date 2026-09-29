import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import logo from '../../assets/gcms-logo.png';

function loginErrorMessage(raw: string): string {
  const msg = raw.toLowerCase();
  if (msg.includes('invalid login credentials')) {
    return "That email and password don't match any account. Double-check both for typos, or confirm this user exists under Authentication \u2192 Users in Supabase.";
  }
  if (msg.includes('email not confirmed')) {
    return 'This account exists but its email is not confirmed. In Supabase, open Authentication \u2192 Users, open this user, and confirm the email (or delete and recreate it with "Auto Confirm User" checked).';
  }
  if (msg.includes('failed to fetch') || msg.includes('networkerror')) {
    return "Couldn't reach Supabase. Check that VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file match your project, and restart the dev server after editing .env.";
  }
  return raw || 'Something went wrong signing in. Please try again.';
}

export default function AdminLoginPage() {
  const { session, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (session) {
    const from = (location.state as { from?: string })?.from || '/admin';
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await signIn(email, password);
    setLoading(false);
    if (signInError) {
      setError(loginErrorMessage(signInError));
      return;
    }
    navigate('/admin', { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-950 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <img src={logo} alt="GCMS Abbottabad crest" className="h-16 w-16 object-contain" />
          <h1 className="mt-4 font-serif text-lg font-semibold text-white">
            Government College of Management Sciences
          </h1>
          <p className="text-sm text-emerald-200">Administrator Login</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-panel sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              name="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <div className="flex items-start gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <Button type="submit" className="w-full" loading={loading} size="lg">
              <LogIn className="h-4 w-4" /> Sign in
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-emerald-200/70">
          Admin accounts are created directly in Supabase. See the project README for setup instructions.
        </p>
      </div>
    </div>
  );
}