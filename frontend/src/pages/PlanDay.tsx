import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sessionAPI } from "../api/client";

export default function PlanDay() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [goals, setGoals] = useState([{ goal: "", duration: 25 }]);
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    if (goals.length < 3) setGoals([...goals, { goal: "", duration: 25 }]);
  };

  const handleChange = (index: number, field: string, value: string | number) => {
    const newGoals = [...goals];
    newGoals[index] = { ...newGoals[index], [field]: value };
    setGoals(newGoals);
  };

  const handleRemove = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const validGoals = goals.filter(g => g.goal.trim() !== "");
    if (validGoals.length === 0) return alert("Please enter at least one goal.");
    setLoading(true);
    try {
      if (token) {
        await sessionAPI.planDay(token, validGoals);
        navigate("/dashboard");
      }
    } catch (err: any) {
      alert(err.message || "Failed to save plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 600, margin: "0 auto" }}>
        <h1 className="text-3xl font-bold mb-2">Plan Your Day</h1>
        <p className="text-muted mb-6">Set up to 3 high-impact goals for today.</p>

        <div className="flex flex-col gap-4">
          {goals.map((g, i) => (
            <div key={i} className="flex gap-4 items-center">
              <span className="font-bold">{i + 1}.</span>
              <input 
                className="input" 
                placeholder="What will you accomplish?" 
                value={g.goal} 
                onChange={(e) => handleChange(i, 'goal', e.target.value)} 
              />
              <select className="input" style={{ width: 100 }} value={g.duration} onChange={(e) => handleChange(i, 'duration', parseInt(e.target.value))}>
                <option value={15}>15m</option>
                <option value={25}>25m</option>
                <option value={45}>45m</option>
                <option value={60}>60m</option>
              </select>
              {goals.length > 1 && (
                <button onClick={() => handleRemove(i)} className="btn btn-outline" style={{ padding: "0.5rem 1rem", color: "var(--danger)" }}>✕</button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-8">
          {goals.length < 3 && <button className="btn btn-outline" onClick={handleAdd}>+ Add Goal</button>}
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ flex: 1 }}>Save Plan</button>
        </div>
      </div>
    </div>
  );
}
