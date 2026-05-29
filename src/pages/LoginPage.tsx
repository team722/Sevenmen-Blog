import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { auth } from "../firebase";

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@sevenmensolutions.com");
  const [password, setPassword] = useState("Qwerty@123");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setErrorMessage("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-container">
        <div className="login-brand-panel">
          <div>
            <div className="secure-badge">
              <ShieldCheck size={18} />
              <span>Secure Admin Access</span>
            </div>

            <h1>Sevenmen Blog Admin Dashboard</h1>

            <p>
              Create, edit, manage, and publish blog content from one secure
              admin panel.
            </p>
          </div>

          <div className="login-stats">
            <div>
              <strong>100%</strong>
              <span>Admin Protected</span>
            </div>

            <div>
              <strong>CMS</strong>
              <span>Blog Control</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="login-form-panel">
          <div className="login-icon">
            <Lock size={26} />
          </div>

          <h2>Admin Login</h2>

          <p className="login-subtitle">
            Login to manage blog submissions, drafts, and published posts.
          </p>

          {errorMessage && <div className="login-error">{errorMessage}</div>}

          <div className="form-group">
            <label>Email Address</label>

            <div className="input-wrap">
              <Mail size={18} />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>

            <div className="input-wrap">
              <Lock size={18} />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>

          <p className="login-note">
            Protected access for authorized Sevenmen team members only.
          </p>
        </form>
      </section>
    </main>
  );
}