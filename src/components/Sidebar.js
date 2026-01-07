import React from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  CheckSquare,
  Inbox,
  Megaphone,
  Settings,
  LogOut,
  Hexagon,
} from "lucide-react";

// --- STYLES ---
const styles = {
  sidebar: {
    width: "260px",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e2e8f0",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: 0,
    padding: "24px 0",
  },
  logoSection: {
    padding: "0 24px 32px 24px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoIcon: {
    color: "#3b82f6",
  },
  logoText: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: "-0.5px",
  },
  nav: {
    flex: 1,
    padding: "0 12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  sectionLabel: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    padding: "16px 12px 8px 12px",
  },
  navItem: (isActive) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    backgroundColor: isActive ? "#eff6ff" : "transparent",
    color: isActive ? "#3b82f6" : "#64748b",
    fontSize: "14px",
    fontWeight: isActive ? "600" : "500",
    width: "100%",
    textAlign: "left",
    transition: "all 0.2s",
  }),
  footer: {
    padding: "24px",
    borderTop: "1px solid #e2e8f0",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#fff",
    color: "#ef4444",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
};

function Sidebar({ activeTab, setActiveTab, onLogout }) {
  // Explicit icon mapping for cleaner code
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { id: "students", label: "Students", icon: <GraduationCap size={20} /> },
    { id: "lecturers", label: "Lecturers", icon: <Users size={20} /> },
    { id: "courses", label: "Courses", icon: <BookOpen size={20} /> },
    { id: "assignments", label: "Assignments", icon: <FileText size={20} /> },
    { id: "quizzes", label: "Quizzes", icon: <CheckSquare size={20} /> },
    { id: "submissions", label: "Submissions", icon: <Inbox size={20} /> },
    {
      id: "announcements",
      label: "Announcements",
      icon: <Megaphone size={20} />,
    },
  ];

  return (
    <div style={styles.sidebar}>
      {/* Logo Area */}
      <div style={styles.logoSection}>
        <Hexagon style={styles.logoIcon} strokeWidth={2.5} size={32} />
        <span style={styles.logoText}>LMS Admin</span>
      </div>

      {/* Navigation Menu */}
      <nav style={styles.nav}>
        <div style={styles.sectionLabel}>Main Menu</div>
        {menuItems.map((item) => (
          <button
            key={item.id}
            style={styles.navItem(activeTab === item.id)}
            onClick={() => setActiveTab(item.id)}
            onMouseEnter={(e) => {
              if (activeTab !== item.id) {
                e.currentTarget.style.backgroundColor = "#f8fafc";
                e.currentTarget.style.color = "#1e293b";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== item.id) {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#64748b";
              }
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}

        <div style={styles.sectionLabel}>System</div>
        <button
          style={styles.navItem(activeTab === "settings")}
          onClick={() => setActiveTab("settings")}
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </nav>

      {/* Footer / Logout */}
      <div style={styles.footer}>
        <button
          style={styles.logoutBtn}
          onClick={onLogout}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#fef2f2")
          }
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
