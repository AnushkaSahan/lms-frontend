import React from "react";
import { Search, Bell, Menu, ChevronDown, User } from "lucide-react";

// --- STYLES ---
const styles = {
  header: {
    height: "70px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    position: "sticky",
    top: 0,
    zIndex: 40,
  },
  searchContainer: {
    position: "relative",
    width: "400px",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    color: "#94a3b8",
    width: "18px",
  },
  input: {
    width: "100%",
    padding: "10px 10px 10px 40px",
    borderRadius: "8px",
    border: "1px solid #f1f5f9",
    backgroundColor: "#f8fafc",
    fontSize: "14px",
    color: "#334155",
    outline: "none",
    transition: "all 0.2s",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  iconButton: {
    position: "relative",
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: "6px",
    right: "8px",
    width: "8px",
    height: "8px",
    backgroundColor: "#ef4444",
    borderRadius: "50%",
    border: "2px solid #fff",
  },
  userProfile: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "6px 8px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background 0.2s",
    border: "1px solid transparent", // Prevents layout shift on hover
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#3b82f6",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "600",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  userName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e293b",
  },
  userRole: {
    fontSize: "11px",
    color: "#64748b",
  },
};

function Header({ user, onMenuClick }) {
  return (
    <header style={styles.header}>
      {/* Left: Mobile Menu Trigger (hidden on desktop usually) & Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#1e293b",
            margin: 0,
          }}
        >
          Admin Console
        </h1>
      </div>

      {/* Center: Search Bar */}
      {/* <div style={styles.searchContainer}>
        <Search style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search students, courses, or settings..."
          style={styles.input}
          onFocus={(e) => {
            e.target.style.backgroundColor = "#fff";
            e.target.style.boxShadow = "0 0 0 2px #e2e8f0";
          }}
          onBlur={(e) => {
            e.target.style.backgroundColor = "#f8fafc";
            e.target.style.boxShadow = "none";
          }}
        />
      </div> */}

      {/* Right: Actions & Profile */}
      <div style={styles.rightSection}>
        <button style={styles.iconButton} title="Notifications">
          <Bell size={20} />
          <span style={styles.badge}></span>
        </button>

        <div
          style={styles.userProfile}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#f8fafc")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <div style={styles.userInfo}>
            <span style={styles.userName}>
              {user?.fullName || "Admin User"}
            </span>
            <span style={styles.userRole}>Super Admin</span>
          </div>
          <div style={styles.avatar}>
            {user?.fullName ? (
              user.fullName.charAt(0).toUpperCase()
            ) : (
              <User size={18} />
            )}
          </div>
          <ChevronDown size={16} color="#94a3b8" />
        </div>
      </div>
    </header>
  );
}

export default Header;
