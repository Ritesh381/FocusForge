import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sessionAPI } from "../api/client";
import { LogOut, Flame, CheckCircle, Clock } from "lucide-react";

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (token) {
      sessionAPI.getDashboard(token).then(res => setData(res.data)).catch(console.error);
    }
  }, [token]);

  if (!data) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="container">
      <div className="header-row">
        <div>
          <h1 className="text-3xl font-bold">Good Day, {user?.email.split('@')[0]}</h1>
          <p className="text-muted mt-2">Ready to focus?</p>
        </div>
        <button onClick={() => { logout(); navigate("/"); }} className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="card flex flex-col items-center justify-center">
          <Flame size={32} color="var(--danger)" />
          <h2 className="text-3xl font-bold mt-2">{data.stats.streak}</h2>
          <p className="text-muted">Day Streak</p>
        </div>
        <div className="card flex flex-col items-center justify-center">
          <CheckCircle size={32} color="var(--success)" />
          <h2 className="text-3xl font-bold mt-2">{data.stats.completedToday}</h2>
          <p className="text-muted">Goals Today</p>
        </div>
        <div className="card flex flex-col items-center justify-center">
          <Clock size={32} color="var(--accent)" />
          <h2 className="text-3xl font-bold mt-2">{Math.floor(data.stats.totalFocusTimeToday / 60)}m</h2>
          <p className="text-muted">Focused Today</p>
        </div>
        <div className="card flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold mt-2">{data.stats.totalCompleted}</h2>
          <p className="text-muted">Total Completed</p>
        </div>
      </div>

      <div className="card">
        <div className="header-row" style={{ marginBottom: "1rem" }}>
          <h2 className="text-2xl font-bold">Today's Plan</h2>
          {!data.active && data.planned.length === 0 && (
            <Link to="/plan" className="btn btn-primary">Plan Day</Link>
          )}
        </div>

        {data.active ? (
          <div style={{ padding: "1.5rem", background: "#f9fafb", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <h3 className="font-bold">Active Goal: {data.active.goal}</h3>
            <Link to={`/focus/${data.active._id}`} className="btn btn-primary mt-4">Resume Session</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {data.planned.map((p: any) => (
              <div key={p._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", border: "1px solid var(--border)", borderRadius: "8px" }}>
                <span>{p.goal} ({p.duration}m)</span>
                <Link to={`/breakdown/${p._id}`} className="btn btn-outline">Start</Link>
              </div>
            ))}
            {data.planned.length === 0 && <p className="text-muted">No goals planned yet.</p>}
          </div>
        )}
      </div>

      {data.recentReflections && data.recentReflections.length > 0 && (
        <div className="card mt-8">
          <h2 className="text-2xl font-bold mb-4">Insights & Reflections</h2>
          <div className="flex flex-col gap-4">
            {data.recentReflections.map((r: any) => (
              <div key={r._id} style={{ padding: "1rem", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px" }}>
                <p className="font-bold text-[var(--danger)] mb-1">Goal: {r.goal}</p>
                <p style={{ fontStyle: "italic", color: "#7F1D1D" }}>"{r.reflection}"</p>
                <p className="text-muted text-sm mt-2">{new Date(r.completedAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
