import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sessionAPI } from "../api/client";

export default function Reflection() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!token || !id) return;
    setLoading(true);
    try {
      await sessionAPI.reflect(token, id, reflection);
      navigate("/dashboard");
    } catch (err: any) {
      alert(err.message || "Failed to save reflection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 600, margin: "0 auto", marginTop: "10vh" }}>
        <h1 className="text-3xl font-bold mb-2">Self Reflection</h1>
        <p className="text-muted mb-6">Why didn't you complete this goal? What distracted you?</p>

        <textarea 
          className="input" 
          style={{ minHeight: 150, resize: "vertical", marginBottom: "2rem" }}
          placeholder="E.g., I got distracted by my phone..."
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
        />

        <div className="flex gap-4">
          <button className="btn btn-outline" onClick={() => navigate("/dashboard")}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ flex: 1, background: "var(--danger)" }}>Take Responsibility & Finish</button>
        </div>
      </div>
    </div>
  );
}
