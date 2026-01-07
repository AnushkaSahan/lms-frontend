import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  RotateCcw,
  Palette,
  Bell,
  Users,
  BookOpen,
  Clock,
  Lock,
  Globe,
  FileText,
  Mail,
  Shield,
  Eye,
  EyeOff,
  Upload,
  Download,
} from "lucide-react";

// --- STYLES ---
const styles = {
  container: { padding: "32px", backgroundColor: "#f8fafc", minHeight: "100%" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  titleSection: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  title: { fontSize: "24px", fontWeight: "700", color: "#1e293b", margin: 0 },
  subtitle: { fontSize: "14px", color: "#64748b" },

  // Grid Layout
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
    paddingBottom: "12px",
    borderBottom: "1px solid #f1f5f9",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    margin: 0,
  },

  // Form Controls
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#475569",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#fff",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    fontFamily: "inherit",
    resize: "vertical",
    minHeight: "80px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#475569",
    cursor: "pointer",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    cursor: "pointer",
  },

  // Actions
  actions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "32px",
    paddingTop: "24px",
    borderTop: "1px solid #e2e8f0",
  },
  button: (type) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    backgroundColor:
      type === "primary"
        ? "#3b82f6"
        : type === "success"
        ? "#10b981"
        : type === "danger"
        ? "#ef4444"
        : "#f1f5f9",
    color:
      type === "primary" || type === "success" || type === "danger"
        ? "#fff"
        : "#64748b",
  }),
};

function SystemSettings({ api }) {
  const [settings, setSettings] = useState({
    // General Settings
    appName: "Learning Management System",
    instituteName: "",
    supportEmail: "",
    contactPhone: "",
    address: "",
    timezone: "UTC",
    language: "en",
    dateFormat: "MM/DD/YYYY",

    // Display Settings
    theme: "light",
    primaryColor: "#3b82f6",
    accentColor: "#8b5cf6",
    itemsPerPage: 10,
    showProfilePictures: true,
    enableAnimations: true,

    // Security Settings
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5,
    enable2FA: false,
    requireStrongPasswords: true,
    passwordExpiryDays: 90,
    enableIPWhitelist: false,

    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    assignmentDueReminders: true,
    announcementAlerts: true,
    gradePostAlerts: true,

    // Registration & Access
    allowStudentRegistration: true,
    requireEmailVerification: true,
    requireAdminApproval: false,
    maxStudentsPerCourse: 100,
    maxCoursesPerStudent: 10,

    // Academic Settings
    gradingScale: "percentage", // percentage, letter, gpa
    passingGrade: 40,
    decimalPlaces: 2,
    autoGradeSubmissions: false,
    lateSubmissionPenalty: 10, // percentage

    // File Upload Settings
    maxFileSize: 10, // MB
    allowedFileTypes: [
      ".pdf",
      ".doc",
      ".docx",
      ".ppt",
      ".pptx",
      ".jpg",
      ".png",
    ],
    enableCloudStorage: false,
    storageQuota: 1000, // MB per user

    // System Maintenance
    maintenanceMode: false,
    maintenanceMessage: "System under maintenance. Please check back later.",
    backupFrequency: "daily", // daily, weekly, monthly
    enableAutoBackup: true,
  });

  const [saving, setSaving] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // In real implementation, this would be an API call
      const savedSettings = localStorage.getItem("lmsSystemSettings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // In real implementation, this would be an API call
      localStorage.setItem("lmsSystemSettings", JSON.stringify(settings));

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all settings to default values?"
      )
    ) {
      setSettings({
        appName: "Learning Management System",
        instituteName: "",
        supportEmail: "",
        contactPhone: "",
        address: "",
        timezone: "UTC",
        language: "en",
        dateFormat: "MM/DD/YYYY",
        theme: "light",
        primaryColor: "#3b82f6",
        accentColor: "#8b5cf6",
        itemsPerPage: 10,
        showProfilePictures: true,
        enableAnimations: true,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        enable2FA: false,
        requireStrongPasswords: true,
        passwordExpiryDays: 90,
        enableIPWhitelist: false,
        emailNotifications: true,
        pushNotifications: true,
        assignmentDueReminders: true,
        announcementAlerts: true,
        gradePostAlerts: true,
        allowStudentRegistration: true,
        requireEmailVerification: true,
        requireAdminApproval: false,
        maxStudentsPerCourse: 100,
        maxCoursesPerStudent: 10,
        gradingScale: "percentage",
        passingGrade: 40,
        decimalPlaces: 2,
        autoGradeSubmissions: false,
        lateSubmissionPenalty: 10,
        maxFileSize: 10,
        allowedFileTypes: [
          ".pdf",
          ".doc",
          ".docx",
          ".ppt",
          ".pptx",
          ".jpg",
          ".png",
        ],
        enableCloudStorage: false,
        storageQuota: 1000,
        maintenanceMode: false,
        maintenanceMessage:
          "System under maintenance. Please check back later.",
        backupFrequency: "daily",
        enableAutoBackup: true,
      });
      localStorage.removeItem("lmsSystemSettings");
      alert("Settings reset to defaults!");
    }
  };

  const exportSettings = () => {
    const exportData = {
      settings,
      exportedAt: new Date().toISOString(),
      exportedBy:
        JSON.parse(localStorage.getItem("user") || "{}").fullName || "Admin",
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `lms-settings-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleFileTypeChange = (fileType, checked) => {
    const newFileTypes = checked
      ? [...settings.allowedFileTypes, fileType]
      : settings.allowedFileTypes.filter((type) => type !== fileType);

    setSettings({ ...settings, allowedFileTypes: newFileTypes });
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.titleSection}>
          <h1 style={styles.title}>System Settings</h1>
          <p style={styles.subtitle}>
            Configure and customize your Learning Management System
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={exportSettings} style={styles.button("primary")}>
            <Download size={16} />
            Export Settings
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div style={styles.grid}>
        {/* General Settings */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Settings size={20} color="#3b82f6" />
            <h3 style={styles.cardTitle}>General Settings</h3>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Application Name</label>
            <input
              style={styles.input}
              type="text"
              value={settings.appName}
              onChange={(e) =>
                setSettings({ ...settings, appName: e.target.value })
              }
              placeholder="Learning Management System"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Institute Name</label>
            <input
              style={styles.input}
              type="text"
              value={settings.instituteName}
              onChange={(e) =>
                setSettings({ ...settings, instituteName: e.target.value })
              }
              placeholder="Enter institute name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Support Email</label>
            <input
              style={styles.input}
              type="email"
              value={settings.supportEmail}
              onChange={(e) =>
                setSettings({ ...settings, supportEmail: e.target.value })
              }
              placeholder="support@example.com"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Contact Phone</label>
            <input
              style={styles.input}
              type="text"
              value={settings.contactPhone}
              onChange={(e) =>
                setSettings({ ...settings, contactPhone: e.target.value })
              }
              placeholder="+94 11 234 5678"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Timezone</label>
            <select
              style={styles.select}
              value={settings.timezone}
              onChange={(e) =>
                setSettings({ ...settings, timezone: e.target.value })
              }
            >
              <option value="UTC">UTC</option>
              <option value="Asia/Colombo">Asia/Colombo (Sri Lanka)</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Europe/London">Europe/London</option>
              <option value="Asia/Singapore">Asia/Singapore</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Language</label>
            <select
              style={styles.select}
              value={settings.language}
              onChange={(e) =>
                setSettings({ ...settings, language: e.target.value })
              }
            >
              <option value="en">English</option>
              <option value="si">සිංහල</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>
        </div>

        {/* Display Settings */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Palette size={20} color="#8b5cf6" />
            <h3 style={styles.cardTitle}>Display Settings</h3>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Theme</label>
            <select
              style={styles.select}
              value={settings.theme}
              onChange={(e) =>
                setSettings({ ...settings, theme: e.target.value })
              }
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Primary Color</label>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <input
                style={{ ...styles.input, width: "100px" }}
                type="color"
                value={settings.primaryColor}
                onChange={(e) =>
                  setSettings({ ...settings, primaryColor: e.target.value })
                }
              />
              <span style={{ fontSize: "14px", color: "#64748b" }}>
                {settings.primaryColor}
              </span>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Items Per Page</label>
            <select
              style={styles.select}
              value={settings.itemsPerPage}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  itemsPerPage: parseInt(e.target.value),
                })
              }
            >
              <option value="5">5 items</option>
              <option value="10">10 items</option>
              <option value="20">20 items</option>
              <option value="50">50 items</option>
              <option value="100">100 items</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={settings.showProfilePictures}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    showProfilePictures: e.target.checked,
                  })
                }
              />
              Show profile pictures
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={settings.enableAnimations}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    enableAnimations: e.target.checked,
                  })
                }
              />
              Enable animations
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Shield size={20} color="#ef4444" />
            <h3 style={styles.cardTitle}>Security Settings</h3>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Session Timeout (minutes)</label>
            <input
              style={styles.input}
              type="number"
              min="5"
              max="240"
              value={settings.sessionTimeout}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  sessionTimeout: parseInt(e.target.value),
                })
              }
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Max Login Attempts</label>
            <input
              style={styles.input}
              type="number"
              min="1"
              max="10"
              value={settings.maxLoginAttempts}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maxLoginAttempts: parseInt(e.target.value),
                })
              }
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={settings.enable2FA}
                onChange={(e) =>
                  setSettings({ ...settings, enable2FA: e.target.checked })
                }
              />
              Enable Two-Factor Authentication
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={settings.requireStrongPasswords}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    requireStrongPasswords: e.target.checked,
                  })
                }
              />
              Require strong passwords
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password Expiry (days)</label>
            <select
              style={styles.select}
              value={settings.passwordExpiryDays}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  passwordExpiryDays: parseInt(e.target.value),
                })
              }
            >
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
              <option value="180">180 days</option>
              <option value="0">Never expire</option>
            </select>
          </div>
        </div>

        {/* Notification Settings */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Bell size={20} color="#f59e0b" />
            <h3 style={styles.cardTitle}>Notification Settings</h3>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={settings.emailNotifications}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    emailNotifications: e.target.checked,
                  })
                }
              />
              <Mail size={16} />
              Email notifications
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={settings.pushNotifications}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    pushNotifications: e.target.checked,
                  })
                }
              />
              <Bell size={16} />
              Push notifications
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={settings.assignmentDueReminders}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    assignmentDueReminders: e.target.checked,
                  })
                }
              />
              Assignment due reminders
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={settings.announcementAlerts}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    announcementAlerts: e.target.checked,
                  })
                }
              />
              New announcement alerts
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={settings.gradePostAlerts}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    gradePostAlerts: e.target.checked,
                  })
                }
              />
              Grade posting alerts
            </label>
          </div>
        </div>

        {/* Academic Settings */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <BookOpen size={20} color="#10b981" />
            <h3 style={styles.cardTitle}>Academic Settings</h3>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Grading System</label>
            <select
              style={styles.select}
              value={settings.gradingScale}
              onChange={(e) =>
                setSettings({ ...settings, gradingScale: e.target.value })
              }
            >
              <option value="percentage">Percentage (0-100%)</option>
              <option value="letter">Letter Grades (A-F)</option>
              <option value="gpa">GPA Scale (0-4.0)</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Passing Grade</label>
            <input
              style={styles.input}
              type="number"
              min="0"
              max="100"
              value={settings.passingGrade}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  passingGrade: parseInt(e.target.value),
                })
              }
            />
            <div
              style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}
            >
              Minimum percentage required to pass
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Decimal Places</label>
            <select
              style={styles.select}
              value={settings.decimalPlaces}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  decimalPlaces: parseInt(e.target.value),
                })
              }
            >
              <option value="0">0 (Whole numbers)</option>
              <option value="1">1 decimal place</option>
              <option value="2">2 decimal places</option>
              <option value="3">3 decimal places</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={settings.autoGradeSubmissions}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    autoGradeSubmissions: e.target.checked,
                  })
                }
              />
              Auto-grade quiz submissions
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Late Submission Penalty (%)</label>
            <input
              style={styles.input}
              type="number"
              min="0"
              max="100"
              value={settings.lateSubmissionPenalty}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  lateSubmissionPenalty: parseInt(e.target.value),
                })
              }
            />
          </div>
        </div>

        {/* Registration & Access */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Users size={20} color="#3b82f6" />
            <h3 style={styles.cardTitle}>Registration & Access</h3>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={settings.allowStudentRegistration}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    allowStudentRegistration: e.target.checked,
                  })
                }
              />
              Allow student registration
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={settings.requireEmailVerification}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    requireEmailVerification: e.target.checked,
                  })
                }
              />
              Require email verification
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={settings.requireAdminApproval}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    requireAdminApproval: e.target.checked,
                  })
                }
              />
              Require admin approval for new users
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Max Students per Course</label>
            <input
              style={styles.input}
              type="number"
              min="1"
              max="1000"
              value={settings.maxStudentsPerCourse}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maxStudentsPerCourse: parseInt(e.target.value),
                })
              }
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Max Courses per Student</label>
            <input
              style={styles.input}
              type="number"
              min="1"
              max="20"
              value={settings.maxCoursesPerStudent}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maxCoursesPerStudent: parseInt(e.target.value),
                })
              }
            />
          </div>
        </div>

        {/* File Upload Settings */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Upload size={20} color="#8b5cf6" />
            <h3 style={styles.cardTitle}>File Upload Settings</h3>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Max File Size (MB)</label>
            <input
              style={styles.input}
              type="number"
              min="1"
              max="100"
              value={settings.maxFileSize}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maxFileSize: parseInt(e.target.value),
                })
              }
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Allowed File Types</label>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {[
                { value: ".pdf", label: "PDF Documents" },
                { value: ".doc", label: "Word Documents (.doc, .docx)" },
                { value: ".ppt", label: "PowerPoint (.ppt, .pptx)" },
                { value: ".jpg", label: "Images (.jpg, .png, .gif)" },
                { value: ".zip", label: "Compressed Files (.zip, .rar)" },
                { value: ".mp4", label: "Videos (.mp4, .avi)" },
                { value: ".mp3", label: "Audio (.mp3, .wav)" },
              ].map((type) => (
                <label key={type.value} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    style={styles.checkbox}
                    checked={settings.allowedFileTypes.includes(type.value)}
                    onChange={(e) =>
                      handleFileTypeChange(type.value, e.target.checked)
                    }
                  />
                  {type.label}
                </label>
              ))}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={settings.enableCloudStorage}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    enableCloudStorage: e.target.checked,
                  })
                }
              />
              Enable cloud storage integration
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Storage Quota per User (MB)</label>
            <input
              style={styles.input}
              type="number"
              min="100"
              max="10000"
              value={settings.storageQuota}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  storageQuota: parseInt(e.target.value),
                })
              }
            />
          </div>
        </div>

        {/* System Maintenance */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Settings size={20} color="#64748b" />
            <h3 style={styles.cardTitle}>System Maintenance</h3>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={settings.maintenanceMode}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maintenanceMode: e.target.checked,
                  })
                }
              />
              Enable maintenance mode
            </label>
          </div>

          {settings.maintenanceMode && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Maintenance Message</label>
              <textarea
                style={styles.textarea}
                value={settings.maintenanceMessage}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maintenanceMessage: e.target.value,
                  })
                }
                rows="3"
              />
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Backup Frequency</label>
            <select
              style={styles.select}
              value={settings.backupFrequency}
              onChange={(e) =>
                setSettings({ ...settings, backupFrequency: e.target.value })
              }
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={settings.enableAutoBackup}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    enableAutoBackup: e.target.checked,
                  })
                }
              />
              Enable automatic backups
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={styles.actions}>
        <button onClick={resetToDefaults} style={styles.button("danger")}>
          <RotateCcw size={16} />
          Reset Defaults
        </button>
        <button
          onClick={saveSettings}
          style={styles.button("success")}
          disabled={saving}
        >
          {saving ? (
            <>
              <div
                className="spin"
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid #fff",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                }}
              />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Settings
            </>
          )}
        </button>
      </div>

      <style>{`
        .spin { 
          animation: spin 1s linear infinite; 
        }
        @keyframes spin { 
          from { transform: rotate(0deg); } 
          to { transform: rotate(360deg); } 
        }
      `}</style>
    </div>
  );
}

export default SystemSettings;
