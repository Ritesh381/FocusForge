import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sessionAPI } from "../api/client";
import { Pause, Play, CheckCircle } from "lucide-react";

export default function FocusSession() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [data, setData] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (token) {
      sessionAPI.getDashboard(token).then(res => {
        const active = res.data.active;
        if (active && active._id === id) {
          setData(active);
          const elapsed = Math.floor((new Date().getTime() - new Date(active.startedAt).getTime()) / 1000);
          const totalSeconds = (active.duration || 25) * 60;
          setTimeLeft(Math.max(totalSeconds - elapsed, 0));
        } else {
            navigate("/dashboard");
        }
      }).catch(console.error);
    }
  }, [token, id]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleComplete = async () => {
    if (!token || !id) return;
    try {
      await sessionAPI.complete(token, id);
      navigate("/dashboard");
    } catch (err: any) {
      alert(err.message || "Failed to complete");
    }
  };

  const handleReflect = () => {
    navigate(`/reflect/${id}`);
  };

  if (!data) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ background: "#FAFAFA" }}>
      <h2 className="text-2xl font-bold mb-8">Focus: {data.goal}</h2>
      
      <div style={{ fontSize: "6rem", fontWeight: 900, fontFamily: "monospace", letterSpacing: "-0.05em", color: "var(--primary)" }}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div className="flex gap-4 mt-12">
        <button onClick={() => setIsRunning(!isRunning)} className="btn btn-outline flex items-center gap-2">
          {isRunning ? <><Pause size={20} /> Pause</> : <><Play size={20} /> Resume</>}
        </button>
        <button onClick={handleComplete} className="btn btn-primary flex items-center gap-2">
          <CheckCircle size={20} /> Complete
        </button>
      </div>

      <button onClick={handleReflect} className="btn mt-8" style={{ color: "var(--danger)", background: "transparent" }}>
        Abandon & Reflect
      </button>

      {data.subtasks && data.subtasks.length > 0 && (
        <div className="card mt-12 w-full" style={{ maxWidth: 400 }}>
          <h3 className="font-bold mb-4">Steps</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {data.subtasks.map((st: any, i: number) => (
              <li key={i} style={{ padding: "0.5rem 0", borderBottom: "1px solid var(--border)", display: "flex", gap: "0.5rem" }}>
                <span style={{ color: "var(--text-muted)" }}>{i + 1}.</span> {st.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
