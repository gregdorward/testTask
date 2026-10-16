import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import BrandPanel from '../components/layout/BrandPanel';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0–4
}

const strengthLabels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = ['bg-gray-200', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];

export default function RegisterPage() {
  const { register } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const strength = passwordStrength(form.password);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required.';
    if (!form.lastName.trim()) e.lastName = 'Last name is required.';
    if (!EMAIL_RE.test(form.email)) e.email = 'Enter a valid email address.';
    if (form.password.length < 8) e.password = 'At least 8 characters.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form);
      notify('Account created — welcome to Waracle');
      navigate('/');
    } catch (err: any) {
      setErrors({ form: err?.response?.data?.message || 'Registration failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-screen max-w-7xl gap-8 p-4 sm:p-6 lg:grid-cols-2 lg:items-stretch">
      <BrandPanel />

      <div className="flex items-center justify-center">
        <div className="w-full max-w-md card p-8 animate-fade-in">
          <h2 className="text-2xl font-bold">Create your account</h2>
          <p className="mt-1 text-sm text-gray-500">Join Waracle Store in seconds</p>

          {errors.form && (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{errors.form}</div>
          )}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name" value={form.firstName} onChange={set('firstName')} error={errors.firstName} />
              <Field label="Last Name" value={form.lastName} onChange={set('lastName')} error={errors.lastName} />
            </div>
            <Field label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} />

            <div>
              <Field label="Password" type="password" value={form.password} onChange={set('password')} error={errors.password} />
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={`h-1 flex-1 rounded-full ${i < strength ? strengthColors[strength] : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{strengthLabels[strength]}</p>
                </div>
              )}
            </div>

            <Field
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              error={errors.confirmPassword}
            />

            <button type="submit" className="btn-accent w-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-obsidian underline hover:opacity-70">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  type = 'text',
  value,
  onChange,
  error,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input type={type} className={`field ${error ? 'border-red-400' : ''}`} value={value} onChange={onChange} />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
