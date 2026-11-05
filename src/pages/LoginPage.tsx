import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import FormField from "../components/ui/FormField";

type LoginFields = {
  username: string;
  password: string;
};

const MIN_PASSWORD_LENGTH = 6;

const loginSchema: Yup.ObjectSchema<LoginFields> = Yup.object({
  username: Yup.string().trim().required("Username is required"),
  password: Yup.string()
    .required("Password is required")
    .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`),
});

function getRedirectTarget(state: unknown): string {
  if (typeof state === "object" && state !== null && "from" in state && typeof state.from === "string") {
    return state.from;
  }
  return "/";
}

/** Simulated network delay so the loading state is visible; there is no real auth server. */
const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const formik = useFormik<LoginFields>({
    initialValues: { username: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus }) => {
      await wait(500);
      login(values.username);
      setStatus({ type: "success", message: `Welcome, ${values.username.trim()}! Redirecting...` });
      navigate(getRedirectTarget(location.state), { replace: true });
    },
  });

  const status: unknown = formik.status;
  const successMessage =
    typeof status === "object" && status !== null && "message" in status && typeof status.message === "string" ? status.message : "";
  const showErrorSummary = formik.submitCount > 0 && !formik.isValid;

  function fieldState(name: keyof LoginFields) {
    const error = formik.touched[name] ? formik.errors[name] : undefined;
    const valid = formik.touched[name] && !formik.errors[name];
    const border = error ? "border-amber-600" : valid ? "border-emerald-600" : "border-slate-300";
    return {
      error,
      inputProps: {
        id: name,
        ...formik.getFieldProps(name),
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? `${name}-error` : undefined,
        disabled: formik.isSubmitting,
        className: `min-h-11 w-full rounded-lg border bg-white px-3 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:bg-slate-50 disabled:opacity-60 ${border}`,
      },
    };
  }

  const username = fieldState("username");
  const password = fieldState("password");

  return (
    <section className="mx-auto max-w-md py-10">
      <h1 className="text-3xl font-semibold text-slate-900">Login</h1>

      <p className="mt-3 text-sm text-slate-600">
        Demo login: enter any username and a password of at least {MIN_PASSWORD_LENGTH} characters. Do not use a real password.
      </p>

      <form onSubmit={formik.handleSubmit} noValidate className="mt-8 space-y-5" aria-busy={formik.isSubmitting}>
        {showErrorSummary && (
          <p role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Please fix the highlighted fields.
          </p>
        )}

        <FormField id="username" label="Username" error={username.error}>
          <input type="text" autoComplete="username" required {...username.inputProps} />
        </FormField>

        <FormField id="password" label="Password" error={password.error}>
          <input type="password" autoComplete="current-password" required minLength={MIN_PASSWORD_LENGTH} {...password.inputProps} />
        </FormField>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 font-semibold text-white transition-colors hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:cursor-wait disabled:opacity-70"
        >
          {formik.isSubmitting && <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
          {formik.isSubmitting ? "Signing in..." : "Log In"}
        </button>

        <p role="status" className="text-sm text-emerald-700">{successMessage}</p>
      </form>

      <Link to="/" className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-brand-700 hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700">
        <span aria-hidden="true" className="mr-1">←</span> Back to catalog
      </Link>
    </section>
  );
}

export default LoginPage;
