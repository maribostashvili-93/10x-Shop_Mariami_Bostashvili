import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import FormField from "../components/ui/FormField";

type LoginFields = {
  username: string;
  password: string;
};

type LoginErrors = Partial<Record<keyof LoginFields, string>>;

const MIN_PASSWORD_LENGTH = 6;

function validate(fields: LoginFields): LoginErrors {
  const errors: LoginErrors = {};
  if (!fields.username.trim()) errors.username = "Username is required.";
  if (!fields.password) errors.password = "Password is required.";
  else if (fields.password.length < MIN_PASSWORD_LENGTH) errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  return errors;
}

function getRedirectTarget(state: unknown): string {
  if (typeof state === "object" && state !== null && "from" in state && typeof state.from === "string") {
    return state.from;
  }
  return "/";
}

function LoginPage() {
  const [fields, setFields] = useState<LoginFields>({ username: "", password: "" });
  const [errors, setErrors] = useState<LoginErrors>({});

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function updateField(field: keyof LoginFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    login(fields.username);
    navigate(getRedirectTarget(location.state), { replace: true });
  }

  const inputClass = (hasError: boolean) =>
    `min-h-11 w-full rounded-lg border bg-white px-3 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 ${hasError ? "border-amber-600" : "border-slate-300"}`;

  return (
    <section className="mx-auto max-w-md py-10">
      <h1 className="text-3xl font-semibold text-slate-900">Login</h1>

      <p className="mt-3 text-sm text-slate-600">
        Demo login: enter any username and a password of at least {MIN_PASSWORD_LENGTH} characters. Do not use a real password.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        <FormField id="username" label="Username" error={errors.username}>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={fields.username}
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? "username-error" : undefined}
            onChange={(event) => updateField("username", event.target.value)}
            className={inputClass(Boolean(errors.username))}
          />
        </FormField>

        <FormField id="password" label="Password" error={errors.password}>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            value={fields.password}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            onChange={(event) => updateField("password", event.target.value)}
            className={inputClass(Boolean(errors.password))}
          />
        </FormField>

        <button
          type="submit"
          className="min-h-11 w-full rounded-lg bg-violet-700 px-4 font-semibold text-white transition-colors hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
        >
          Login
        </button>
      </form>
    </section>
  );
}

export default LoginPage;
