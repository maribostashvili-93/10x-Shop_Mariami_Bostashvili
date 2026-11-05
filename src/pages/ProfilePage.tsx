import { Navigate, useSearchParams } from "react-router";
import { useAuth } from "../hooks/useAuth";
import ProfileOverview from "../components/profile/ProfileOverview";
import ProfileSettings from "../components/profile/ProfileSettings";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "settings", label: "Settings" },
] as const;

type TabId = (typeof TABS)[number]["id"];

/** /profile — Overview (orders, activity, perks) and Settings (edit, theme, local data). The tab lives in ?tab=. */
export default function ProfilePage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const active: TabId = searchParams.get("tab") === "settings" ? "settings" : "overview";

  if (!user) {
    return <Navigate to="/login" state={{ from: "/profile" }} replace />;
  }

  function select(tab: TabId) {
    setSearchParams(tab === "overview" ? {} : { tab });
  }

  return (
    <section className="mx-auto max-w-6xl py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">Your account</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">My profile</p>
        </div>
        <div role="tablist" aria-label="Profile sections" className="flex gap-1 rounded-xl bg-violet-50 p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`profile-tab-${tab.id}`}
              aria-selected={active === tab.id}
              aria-controls={`profile-panel-${tab.id}`}
              tabIndex={active === tab.id ? 0 : -1}
              onClick={() => select(tab.id)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                  const next = tab.id === "overview" ? "settings" : "overview";
                  select(next);
                  document.getElementById(`profile-tab-${next}`)?.focus();
                }
              }}
              className={`min-h-11 rounded-lg px-4 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 ${active === tab.id ? "bg-white text-violet-800 shadow-sm" : "text-slate-600 hover:text-violet-800"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div role="tabpanel" id={`profile-panel-${active}`} aria-labelledby={`profile-tab-${active}`}>
        {active === "overview" ? <ProfileOverview onEdit={() => select("settings")} /> : <ProfileSettings />}
      </div>
    </section>
  );
}
