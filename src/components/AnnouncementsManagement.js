import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Filter,
  BookOpen,
  Globe,
  User,
  Calendar,
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

  // Search & Filter Bar
  controls: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  searchWrapper: {
    position: "relative",
    flex: 1,
    minWidth: "300px",
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
  },
  searchInput: {
    width: "100%",
    padding: "10px 40px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s",
  },
  clearBtn: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
  },
  filterSelect: {
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#fff",
    minWidth: "180px",
  },

  // Announcements Grid
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
    gap: "20px",
  },
  announcementCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    transition: "all 0.2s",
    display: "flex",
    flexDirection: "column",
  },
  announcementHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  announcementTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 8px 0",
  },
  announcementContent: {
    flex: 1,
    marginBottom: "16px",
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#475569",
  },

  // Modal
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "600px",
    padding: "0",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    fontFamily: "inherit",
    resize: "vertical",
    minHeight: "150px",
  },

  // Pagination
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 0 0 0",
    marginTop: "24px",
    borderTop: "1px solid #e2e8f0",
  },
  pageBtn: (disabled) => ({
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#fff",
    color: disabled ? "#cbd5e1" : "#64748b",
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: "13px",
  }),
};

function AnnouncementsManagement({ api }) {
  const [announcements, setAnnouncements] = useState([]);
  const [allAnnouncements, setAllAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    courseId: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 8;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndPaginateAnnouncements();
  }, [debouncedSearchTerm, currentPage, selectedCourse, allAnnouncements]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [announcementsData, coursesData] = await Promise.all([
        api.getAnnouncements(),
        api.getCourses(),
      ]);
      setAllAnnouncements(announcementsData || []);
      setCourses(coursesData || []);
    } catch (error) {
      console.error("Error loading data:", error);
      setAllAnnouncements([]);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndPaginateAnnouncements = () => {
    let filtered = allAnnouncements;

    // Filter by course
    if (selectedCourse) {
      filtered = filtered.filter(
        (a) => a.courseId?.toString() === selectedCourse
      );
    }

    // Filter by search term
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (announcement) =>
          announcement.title?.toLowerCase().includes(searchLower) ||
          announcement.message?.toLowerCase().includes(searchLower)
      );
    }

    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setAnnouncements(
      filtered.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const announcementData = {
        title: formData.title.trim(),
        message: formData.message.trim(),
        courseId: formData.courseId ? parseInt(formData.courseId) : null,
        postedByRole: "ADMIN",
        postedById: user.id,
      };

      await api.createAnnouncement(announcementData);
      setShowModal(false);
      setFormData({ title: "", message: "", courseId: "" });
      loadData();
    } catch (error) {
      console.error("Error creating announcement:", error);
      alert("Error creating announcement: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await api.deleteAnnouncement(id);
        loadData();
      } catch (error) {
        console.error("Error deleting announcement:", error);
        alert("Error deleting announcement: " + error.message);
      }
    }
  };

  const getCourseName = (courseId) => {
    if (!courseId) return "Global";
    const course = courses.find((c) => c.id === courseId);
    return course ? `${course.code} - ${course.title}` : "Unknown Course";
  };

  const getCourseCode = (courseId) => {
    if (!courseId) return "Global";
    const course = courses.find((c) => c.id === courseId);
    return course ? course.code : "N/A";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getAudienceBadge = (courseId) => {
    if (!courseId) {
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            backgroundColor: "#3b82f620",
            color: "#3b82f6",
            padding: "4px 12px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          <Globe size={12} /> Global
        </span>
      );
    }

    const course = courses.find((c) => c.id === courseId);
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          backgroundColor: "#10b98120",
          color: "#10b981",
          padding: "4px 12px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "600",
        }}
      >
        <BookOpen size={12} /> {course?.code || "Course"}
      </span>
    );
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Announcements</h1>
          <p style={styles.subtitle}>
            Create and manage announcements for students and lecturers
          </p>
        </div>
        <button
          className="btn-primary-action"
          onClick={() => {
            setFormData({ title: "", message: "", courseId: "" });
            setShowModal(true);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          <MessageSquare size={18} /> Create Announcement
        </button>
      </header>

      {/* Controls */}
      <div style={styles.controls}>
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input
            style={styles.searchInput}
            placeholder="Search announcements by title or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button style={styles.clearBtn} onClick={() => setSearchTerm("")}>
              <X size={16} />
            </button>
          )}
        </div>

        <select
          style={styles.filterSelect}
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">All Audiences</option>
          <option value="">🌍 Global Announcements</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              📚 {course.code} - {course.title}
            </option>
          ))}
        </select>

        <button
          onClick={loadData}
          style={{ ...styles.pageBtn(false), padding: "10px" }}
        >
          <RefreshCw size={18} className={loading ? "spin" : ""} />
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
          <RefreshCw
            size={32}
            className="spin"
            style={{ marginBottom: "12px" }}
          />
          <p>Loading announcements...</p>
        </div>
      )}

      {/* Announcements Grid */}
      {!loading && (
        <>
          {announcements.length > 0 ? (
            <>
              <div style={styles.cardGrid}>
                {announcements.map((announcement) => (
                  <div key={announcement.id} style={styles.announcementCard}>
                    <div style={styles.announcementHeader}>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "8px",
                          }}
                        >
                          {getAudienceBadge(announcement.courseId)}
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#94a3b8",
                              backgroundColor: "#f8fafc",
                              padding: "2px 8px",
                              borderRadius: "4px",
                            }}
                          >
                            ID: {announcement.id}
                          </span>
                        </div>
                        <h3 style={styles.announcementTitle}>
                          {announcement.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        style={{
                          padding: "8px",
                          borderRadius: "6px",
                          border: "none",
                          cursor: "pointer",
                          backgroundColor: "#fef2f2",
                          color: "#ef4444",
                          transition: "all 0.2s",
                        }}
                        title="Delete Announcement"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={styles.announcementContent}>
                      <p style={{ margin: 0 }}>{announcement.message}</p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "auto",
                        paddingTop: "16px",
                        borderTop: "1px solid #f1f5f9",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <User size={12} color="#64748b" />
                          <span style={{ fontSize: "12px", color: "#64748b" }}>
                            {announcement.postedByRole}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Calendar size={12} color="#64748b" />
                          <span style={{ fontSize: "12px", color: "#64748b" }}>
                            {formatDate(announcement.postedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div style={styles.pagination}>
                <div style={{ fontSize: "13px", color: "#64748b" }}>
                  Showing <b>{announcements.length}</b> of{" "}
                  <b>{allAnnouncements.length}</b> announcements
                  {selectedCourse && (
                    <span style={{ marginLeft: "12px", color: "#3b82f6" }}>
                      (
                      {selectedCourse
                        ? getCourseName(selectedCourse)
                        : "Global"}{" "}
                      only)
                    </span>
                  )}
                </div>
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <button
                    style={styles.pageBtn(currentPage === 0)}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <span style={{ fontSize: "13px", color: "#64748b" }}>
                    Page {currentPage + 1} of {totalPages || 1}
                  </span>
                  <button
                    style={styles.pageBtn(currentPage >= totalPages - 1)}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currentPage >= totalPages - 1}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "80px 24px",
                backgroundColor: "#fff",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  fontSize: "48px",
                  marginBottom: "16px",
                  color: "#cbd5e1",
                }}
              >
                📢
              </div>
              <h3 style={{ marginBottom: "8px", color: "#64748b" }}>
                {allAnnouncements.length === 0
                  ? "No Announcements Yet"
                  : "No Announcements Found"}
              </h3>
              <p
                style={{
                  marginBottom: "24px",
                  color: "#94a3b8",
                  maxWidth: "400px",
                  margin: "0 auto 24px auto",
                }}
              >
                {allAnnouncements.length === 0
                  ? "Create your first announcement to share important information with students and lecturers."
                  : "Try adjusting your search or filters to find what you're looking for."}
              </p>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  backgroundColor: "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                <MessageSquare size={18} /> Create Announcement
              </button>
            </div>
          )}
        </>
      )}

      {/* Create Announcement Modal */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div
              style={{
                padding: "24px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#f8fafc",
              }}
            >
              <div>
                <h3
                  style={{ margin: 0, marginBottom: "4px", color: "#1e293b" }}
                >
                  Create New Announcement
                </h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
                  Share important information with students and lecturers
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "6px",
                  color: "#94a3b8",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "24px" }}>
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "8px",
                      color: "#475569",
                    }}
                  >
                    Title *
                  </label>
                  <input
                    style={styles.searchInput}
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    placeholder="Enter announcement title"
                    maxLength="255"
                  />
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#94a3b8",
                      marginTop: "4px",
                    }}
                  >
                    {formData.title.length}/255 characters
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "8px",
                      color: "#475569",
                    }}
                  >
                    Target Audience
                  </label>
                  <select
                    style={styles.filterSelect}
                    value={formData.courseId}
                    onChange={(e) =>
                      setFormData({ ...formData, courseId: e.target.value })
                    }
                  >
                    <option value="">🌍 Global (All users)</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        📚 {course.code} - {course.title}
                      </option>
                    ))}
                  </select>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginTop: "4px",
                    }}
                  >
                    Leave as Global to send to all users, or select a specific
                    course
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "8px",
                      color: "#475569",
                    }}
                  >
                    Message *
                  </label>
                  <textarea
                    style={styles.textarea}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    rows="6"
                    placeholder="Enter your announcement message..."
                    maxLength="2000"
                  />
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#94a3b8",
                      marginTop: "4px",
                    }}
                  >
                    {formData.message.length}/2000 characters
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "12px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#f8fafc",
                      color: "#64748b",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 20px",
                      backgroundColor: "#3b82f6",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                    disabled={
                      !formData.title.trim() || !formData.message.trim()
                    }
                  >
                    <MessageSquare size={16} /> Post Announcement
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
    </div>
  );
}

export default AnnouncementsManagement;
