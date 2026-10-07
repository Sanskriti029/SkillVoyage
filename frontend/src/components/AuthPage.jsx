import { useState } from "react";

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    if (mode === "register") {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      const existingUser = JSON.parse(
        localStorage.getItem("internscout_user") || "null"
      );

      if (
        existingUser &&
        existingUser.email.toLowerCase() === email.trim().toLowerCase()
      ) {
        setError("An account with this email already exists.");
        return;
      }

      const user = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      };

      localStorage.setItem("internscout_user", JSON.stringify(user));

      setMessage("Account created successfully! You can now log in.");
      setMode("login");
      setPassword("");
      return;
    }

    const user = JSON.parse(
      localStorage.getItem("internscout_user") || "null"
    );

    if (!user) {
      setError("No account found. Please register first.");
      return;
    }

    if (
      user.email !== email.trim().toLowerCase() ||
      user.password !== password
    ) {
      setError("Incorrect email or password.");
      return;
    }

    localStorage.setItem(
      "internscout_logged_in",
      JSON.stringify({
        name: user.name,
        email: user.email,
      })
    );

    onLogin({
      name: user.name,
      email: user.email,
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🎯</div>

        <h1>InternScout</h1>

        <p className="auth-subtitle">
          Search live opportunities. Understand your fit. Close your skill gaps.
        </p>

        <div className="auth-tabs">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => {
              setMode("login");
              setError("");
              setMessage("");
            }}
          >
            Login
          </button>

          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => {
              setMode("register");
              setError("");
              setMessage("");
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className="auth-field">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
          )}

          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
            />
          </div>

          {error && <div className="auth-error">⚠️ {error}</div>}

          {message && <div className="auth-success">✅ {message}</div>}

          <button className="auth-submit" type="submit">
            {mode === "login" ? "Login to InternScout" : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
              setMessage("");
            }}
          >
            {mode === "login" ? "Register" : "Login"}
          </button>
        </p>

        <p className="auth-demo-note">
          Demo authentication for the InternScout hackathon project.
        </p>
      </div>
    </div>
  );
}

export default AuthPage;