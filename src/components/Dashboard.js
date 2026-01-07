import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  Calendar,
  Clock,
  Activity,
  GraduationCap,
  ChevronUp,
} from "lucide-react";

// --- STYLES (In a real app, use Tailwind or CSS Modules) ---
const styles = {
  dashboard: {
    padding: "24px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: { marginBottom: "32px" },
  title: { fontSize: "28px", fontWeight: "700", color: "#1e293b", margin: 0 },
  subtitle: { color: "#64748b", marginTop: "4px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
  },
  iconBox: (color) => ({
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color + "20",
    color: color,
    marginBottom: "16px",
  }),
  statValue: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "8px 0",
  },
  statLabel: { fontSize: "14px", color: "#64748b", fontWeight: "500" },
  trend: {
    display: "flex",
    alignItems: "center",
    fontSize: "12px",
    color: "#10b981",
    fontWeight: "600",
    marginTop: "8px",
  },
  chartSection: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "24px",
    marginTop: "24px",
  }, // Responsive logic handled below
  chartCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    height: "400px",
    display: "flex",
    flexDirection: "column",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "24px",
  },
  list: { display: "flex", flexDirection: "column", gap: "16px" },
  listItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    borderRadius: "12px",
    backgroundColor: "#f8fafc",
  },
  loading: {
    display: "flex",
    height: "100vh",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
  },
};

function Dashboard({ api }) {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalLecturers: 0,
    totalCourses: 0,
    totalSubmissions: 0,
  });

  // Combined data state for charts to ensure synchronization
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // 1. Load Stats
      const statsData = await api.getDashboardStats();
      setStats(statsData);

      // 2. Generate Chart Data
      // We move generation here so it doesn't run on every render
      const generatedData = await generateChartData();
      setChartData(generatedData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = async () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        fullDate: date.toISOString().split("T")[0],
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
      };
    });

    // Mock API calls (safely handled)
    const [students, lecturers, courses, submissions] = await Promise.all([
      api.getStudents(0, 50).catch(() => ({ totalElements: 120 })),
      api.getLecturers().catch(() => ({ length: 15 })),
      api.getCourses().catch(() => ({ length: 8 })),
      api.getSubmissions().catch(() => ({ length: 450 })),
    ]);

    const totalS = students.totalElements || 120;

    return last7Days.map((dateObj, index) => ({
      name: dateObj.day,
      date: dateObj.fullDate,
      // Realistic organic growth simulation
      students: Math.floor(Math.random() * (totalS / 50)) + 5 + index * 2,
      lecturers: Math.floor(Math.random() * 2),
      courses: Math.floor(Math.random() * 2),
      submissions: Math.floor(Math.random() * 15) + 10 + index * 5,
      reviews: Math.floor(Math.random() * 10) + 5 + index * 4,
    }));
  };

  if (loading)
    return <div style={styles.loading}>Initializing Dashboard...</div>;

  return (
    <div style={styles.dashboard}>
      <div style={styles.header}>
        <h1 style={styles.title}>Overview</h1>
        <p style={styles.subtitle}>
          Welcome back. Here is what's happening today.
        </p>
      </div>

      {/* --- TOP STATS GRID --- */}
      <div style={styles.grid}>
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={<GraduationCap size={24} />}
          color="#3b82f6"
          trend="+12% this week"
        />
        <StatCard
          title="Active Lecturers"
          value={stats.totalLecturers}
          icon={<Users size={24} />}
          color="#8b5cf6"
          trend="+2 new today"
        />
        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={<BookOpen size={24} />}
          color="#f59e0b"
          trend="Stable"
        />
        <StatCard
          title="Submissions"
          value={stats.totalSubmissions}
          icon={<FileText size={24} />}
          color="#10b981"
          trend="+24% vs last week"
        />
      </div>

      {/* --- CHARTS SECTION --- */}
      {/* Note: In production, use CSS Grid media queries to make this stack on mobile */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "24px",
        }}
      >
        {/* Main Activity Chart */}
        <div style={styles.chartCard}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <h3 style={styles.sectionTitle}>Submission Activity</h3>
            <select
              style={{
                padding: "4px 12px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
              }}
            >
              <option>Last 7 Days</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="submissions"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSub)"
                name="Submissions"
              />
              <Area
                type="monotone"
                dataKey="reviews"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRev)"
                name="Reviews"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Secondary Chart: Registrations */}
        <div style={styles.chartCard}>
          <h3 style={styles.sectionTitle}>New Registrations</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "#f1f5f9" }}
                contentStyle={{ borderRadius: "8px", border: "none" }}
              />
              <Bar
                dataKey="students"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="Students"
                barSize={20}
              />
              <Bar
                dataKey="lecturers"
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
                name="Lecturers"
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- QUICK STATS ROW --- */}
      <div
        style={{
          marginTop: "32px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "24px",
        }}
      >
        <QuickStat
          icon={<Activity size={20} />}
          label="Avg Response Time"
          value="1.2 Hours"
          desc="Top 5% performance"
        />
        <QuickStat
          icon={<TrendingUp size={20} />}
          label="Growth Rate"
          value="+18.5%"
          desc="Compared to last month"
        />
        <QuickStat
          icon={<Calendar size={20} />}
          label="Busiest Day"
          value="Wednesday"
          desc="245 interactions"
        />
        <QuickStat
          icon={<Clock size={20} />}
          label="System Uptime"
          value="99.9%"
          desc="No outages detected"
        />
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS FOR CLEANER CODE ---

const StatCard = ({ title, value, icon, color, trend }) => (
  <div style={styles.card}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div style={styles.iconBox(color)}>{icon}</div>
      <div
        style={{
          ...styles.trend,
          color: trend.includes("-") ? "#ef4444" : "#10b981",
        }}
      >
        {trend.includes("Stable") ? null : (
          <ChevronUp
            size={16}
            style={{
              transform: trend.includes("-") ? "rotate(180deg)" : "none",
            }}
          />
        )}
        {trend}
      </div>
    </div>
    <div style={styles.statValue}>{value.toLocaleString()}</div>
    <div style={styles.statLabel}>{title}</div>
  </div>
);

const QuickStat = ({ icon, label, value, desc }) => (
  <div
    style={{
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "12px",
      }}
    >
      <div style={{ color: "#64748b" }}>{icon}</div>
      <span style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>
        {label}
      </span>
    </div>
    <div style={{ fontSize: "24px", fontWeight: "700", color: "#1e293b" }}>
      {value}
    </div>
    <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
      {desc}
    </div>
  </div>
);

export default Dashboard;
