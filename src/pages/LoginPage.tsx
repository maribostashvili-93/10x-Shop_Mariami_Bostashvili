import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password.");
      return;
    }

    setError("");
    login(username);

    const destination =
      location.state?.from === "/checkout" ? "/checkout" : "/";

    navigate(destination, { replace: true });
  }

  return (
    <section className="mx-auto max-w-md py-10">
      <h1 className="text-3xl font-semibold text-slate-900">Login</h1>

      <p className="mt-3 text-sm text-slate-600">
        Demo login: enter any username and password. Do not use a real password.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="username"
            className="mb-2 block text-sm font-medium text-slate-900"
          >
            Username
          </label>

          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-slate-900"
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-800">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="min-h-11 w-full rounded-lg bg-red-900 px-4 font-semibold text-white transition-colors hover:bg-red-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
        >
          Login
        </button>
      </form>
    </section>
  );
}

export default LoginPage;
