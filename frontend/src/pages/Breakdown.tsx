import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sessionAPI } from "../api/client";

export default function Breakdown() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [subtasks, setSubtasks] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  const handleSubtaskChange = (index: number, val: string) => {
    const newTasks = [...subtasks];
    newTasks[index] = val;
    setSubtasks(newTasks);
  };

  const addSubtask = () => setSubtasks([...subtasks, ""]);

  const handleCommit = async () => {
    if (!token || !id) return;
    const valid = subtasks.filter(t => t.trim() !== "");
    setLoading(true);
    try {
      if (valid.length > 0) {
        await sessionAPI.breakdown(token, id, valid);
      }
      await sessionAPI.start(token, id);
      navigate(`/focus/${id}`);
    } catch (err: any) {
      alert(err.message || "Failed to start session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 600, margin: "0 auto" }}>
        <h1 className="text-3xl font-bold mb-2">Break It Down</h1>
        <p className="text-muted mb-6">Divide your goal into smaller, actionable steps.</p>
        
        <div className="flex flex-col gap-4">
          {subtasks.map((task, i) => (
            <input 
              key={i} 
              className="input" 
              placeholder={`Step ${i + 1}`} 
              value={task} 
              onChange={(e) => handleSubtaskChange(i, e.target.value)} 
            />
          ))}
        </div>

        <div className="flex gap-4 mt-8">
          <button className="btn btn-outline" onClick={addSubtask}>+ Add Step</button>
          <button className="btn btn-primary" onClick={handleCommit} disabled={loading} style={{ flex: 1 }}>Commit & Start</button>
        </div>
      </div>
    </div>
  );
}
