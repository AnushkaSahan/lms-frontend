import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Hexagon,
  AlertCircle,
  Loader2,
} from "lucide-react";

// --- STYLES ---
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
    backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
    backgroundSize: "32px 32px",
    padding: "20px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
    padding: "40px",
    position: "relative",
    overflow: "hidden",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  logoBox: {
    width: "56px",
    height: "56px",
    backgroundColor: "#eff6ff",
    color: "#3b82f6",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px auto",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    position: "relative",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
    marginBottom: "8px",
    marginLeft: "4px",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "16px",
    color: "#94a3b8",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "12px 16px 12px 48px", // Left padding for icon
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    fontSize: "15px",
    color: "#1e293b",
    outline: "none",
    transition: "all 0.2s",
    backgroundColor: "#f8fafc",
  },
  toggleBtn: {
    position: "absolute",
    right: "16px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#94a3b8",
    padding: 0,
    display: "flex",
  },
  button: (isLoading) => ({
    width: "100%",
    padding: "14px",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: isLoading ? "not-allowed" : "pointer",
    transition: "background 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "8px",
    opacity: isLoading ? 0.8 : 1,
  }),
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fee2e2",
    borderRadius: "12px",
    color: "#b91c1c",
    fontSize: "13px",
    marginBottom: "20px",
  },
  footer: {
    marginTop: "32px",
    textAlign: "center",
    fontSize: "13px",
    color: "#64748b",
  },
  link: {
    color: "#3b82f6",
    textDecoration: "none",
    fontWeight: "600",
    cursor: "pointer",
  },
};

function Login({ onLogin, api }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simulate minimum loading time for better UX
      const loginPromise = api.login(credentials.email, credentials.password);
      const delayPromise = new Promise((resolve) => setTimeout(resolve, 800));

      const [result] = await Promise.all([loginPromise, delayPromise]);

      if (result.success && result.user) {
        onLogin(result.user);
      } else {
        setError(result.message || "Invalid credentials provided.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to handle input focus styles
  const handleFocus = (e) => {
    e.target.style.borderColor = "#3b82f6";
    e.target.style.backgroundColor = "#ffffff";
    e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = "#e2e8f0";
    e.target.style.backgroundColor = "#f8fafc";
    e.target.style.boxShadow = "none";
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.logoBox}>
            <Hexagon size={32} strokeWidth={2.5} />
          </div>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>Please enter your details to sign in</p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.errorBox}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Form Section */}
        <form style={styles.form} onSubmit={handleSubmit}>
          {/* Email Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type="email"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                required
                placeholder="name@company.com"
                style={styles.input}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                required
                placeholder="Enter your password"
                style={{ ...styles.input, paddingRight: "48px" }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <button
                type="button"
                style={styles.toggleBtn}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div style={{ textAlign: "right", marginTop: "8px" }}>
              <a
                href="#"
                style={{ ...styles.link, fontSize: "12px", color: "#64748b" }}
              >
                Forgot password?
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={styles.button(loading)}
            disabled={loading}
            onMouseEnter={(e) =>
              !loading && (e.currentTarget.style.backgroundColor = "#2563eb")
            }
            onMouseLeave={(e) =>
              !loading && (e.currentTarget.style.backgroundColor = "#3b82f6")
            }
          >
            {loading ? (
              <>
                <Loader2 size={20} className="spin-animation" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Section */}
        <div style={styles.footer}>
          Don't have an account?{" "}
          <a href="#" style={styles.link}>
            Contact Admin
          </a>
        </div>
      </div>

      {/* CSS for Spinner Animation */}
      <style>
        {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .spin-animation {
                        animation: spin 1s linear infinite;
                    }
                `}
      </style>
    </div>
  );
}

export default Login;
