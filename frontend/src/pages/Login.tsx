import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../api/client";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return setError("Fill all fields");
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        const res = await authAPI.signup(email, password);
        await login(email, password); // just to set token if signup doesn't set it in context but wait context has signup
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="card w-full" style={{ maxWidth: 400 }}>
        <h1 className="text-3xl font-bold text-center mb-6">Focus Forge</h1>
        {error && <p style={{ color: "var(--danger)", marginBottom: "1rem" }}>{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            className="input" 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            className="input" 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>
        <p className="text-center mt-4 text-muted" style={{ cursor: "pointer" }} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Need an account? Sign Up" : "Already have an account? Log In"}
        </p>
      </div>
    </div>
  );
}
