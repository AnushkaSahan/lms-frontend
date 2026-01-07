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
  FileText,
  Filter,
  Calendar,
  BookOpen,
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

  // Table Styling
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: {
    padding: "16px",
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "12px",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  td: {
    padding: "16px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
    color: "#334155",
  },
  actionBtn: (type) => ({
    padding: "8px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    marginRight: "8px",
    backgroundColor: type === "edit" ? "#eff6ff" : "#fef2f2",
    color: type === "edit" ? "#3b82f6" : "#ef4444",
    transition: "all 0.2s",
  }),

  // Pagination
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
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
    maxWidth: "520px",
    padding: "32px",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    fontFamily: "inherit",
    resize: "vertical",
    minHeight: "80px",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#fff",
  },
  dateInput: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
  },
};

function AssignmentsManagement({ api }) {
  const [assignments, setAssignments] = useState([]);
  const [allAssignments, setAllAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    courseId: "",
  });

  const itemsPerPage = 10;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndPaginateAssignments();
  }, [debouncedSearchTerm, currentPage, allAssignments]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [assignmentsData, coursesData] = await Promise.all([
        api.getAssignments(),
        api.getCourses(),
      ]);
      setAllAssignments(assignmentsData || []);
      setCourses(coursesData || []);
    } catch (error) {
      console.error("Error loading data:", error);
      setAllAssignments([]);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndPaginateAssignments = () => {
    let filtered = allAssignments;
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase().trim();
      filtered = allAssignments.filter(
        (assignment) =>
          assignment.title?.toLowerCase().includes(searchLower) ||
          assignment.description?.toLowerCase().includes(searchLower)
      );
    }
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setAssignments(
      filtered.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAssignment) {
        await api.updateAssignment(editingAssignment.id, formData);
      } else {
        await api.createAssignment(formData);
      }
      setShowModal(false);
      setEditingAssignment(null);
      setFormData({ title: "", description: "", dueDate: "", courseId: "" });
      loadData();
    } catch (error) {
      alert("Error saving assignment: " + error.message);
    }
  };

  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? `${course.code} - ${course.title}` : "Unknown Course";
  };

  const getCourseCode = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.code : "N/A";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return { color: "#64748b", label: "No date" };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    if (due < today) {
      return { color: "#ef4444", label: "Overdue" };
    } else if (due.getTime() === today.getTime()) {
      return { color: "#f59e0b", label: "Due Today" };
    } else if (due.getTime() - today.getTime() <= 7 * 24 * 60 * 60 * 1000) {
      return { color: "#f59e0b", label: "Due Soon" };
    } else {
      return { color: "#10b981", label: "Upcoming" };
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Assignments Hub</h1>
          <p style={styles.subtitle}>Create and manage academic assignments</p>
        </div>
        <button
          className="btn-primary-action"
          onClick={() => {
            setEditingAssignment(null);
            setFormData({
              title: "",
              description: "",
              dueDate: "",
              courseId: "",
            });
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
          <FileText size={18} /> Add Assignment
        </button>
      </header>

      {/* Controls */}
      <div style={styles.controls}>
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input
            style={styles.searchInput}
            placeholder="Search assignments by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button style={styles.clearBtn} onClick={() => setSearchTerm("")}>
              <X size={16} />
            </button>
          )}
        </div>
        <button
          onClick={loadData}
          style={{ ...styles.pageBtn(false), padding: "10px" }}
        >
          <RefreshCw size={18} className={loading ? "spin" : ""} />
        </button>
      </div>

      {/* Data Table */}
      <div style={styles.card}>
        {loading ? (
          <div
            style={{ padding: "60px", textAlign: "center", color: "#64748b" }}
          >
            <RefreshCw
              size={32}
              className="spin"
              style={{ marginBottom: "12px" }}
            />
            <p>Fetching assignment records...</p>
          </div>
        ) : (
          <>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Assignment</th>
                  <th style={styles.th}>Course</th>
                  <th style={styles.th}>Due Date</th>
                  <th style={styles.th}>Description</th>
                  <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.length > 0 ? (
                  assignments.map((assignment) => {
                    const status = getDueDateStatus(assignment.dueDate);
                    return (
                      <tr key={assignment.id}>
                        <td style={styles.td}>
                          <div style={{ fontWeight: "600", color: "#1e293b" }}>
                            {assignment.title}
                          </div>
                          <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                            ID: {assignment.id}
                          </div>
                        </td>
                        <td style={styles.td}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <BookOpen size={14} color="#64748b" />
                            <div>
                              <div style={{ fontWeight: "500" }}>
                                {getCourseName(assignment.courseId)}
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "#64748b",
                                  marginTop: "2px",
                                }}
                              >
                                Code: {getCourseCode(assignment.courseId)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <Calendar size={14} color="#64748b" />
                            <div>
                              <div>{formatDate(assignment.dueDate)}</div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  color: status.color,
                                  marginTop: "2px",
                                }}
                              >
                                {status.label}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <div
                            style={{
                              maxWidth: "200px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={assignment.description}
                          >
                            {assignment.description}
                          </div>
                        </td>
                        <td style={{ ...styles.td, textAlign: "right" }}>
                          <button
                            style={styles.actionBtn("edit")}
                            onClick={() => {
                              setEditingAssignment(assignment);
                              setFormData({
                                title: assignment.title,
                                description: assignment.description,
                                dueDate: assignment.dueDate,
                                courseId: assignment.courseId || "",
                              });
                              setShowModal(true);
                            }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            style={styles.actionBtn("delete")}
                            onClick={() => {
                              if (window.confirm("Delete assignment?"))
                                api
                                  .deleteAssignment(assignment.id)
                                  .then(loadData);
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        ...styles.td,
                        textAlign: "center",
                        padding: "48px",
                        color: "#94a3b8",
                      }}
                    >
                      {debouncedSearchTerm
                        ? `No assignments found matching "${debouncedSearchTerm}"`
                        : "No assignments available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Footer */}
            <div style={styles.pagination}>
              <div style={{ fontSize: "13px", color: "#64748b" }}>
                Showing <b>{assignments.length}</b> of{" "}
                <b>{allAssignments.length}</b> records
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
        )}
      </div>

      {/* Form Modal */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <h3 style={{ margin: 0 }}>
                {editingAssignment
                  ? "Update Assignment"
                  : "Create New Assignment"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingAssignment(null);
                  setFormData({
                    title: "",
                    description: "",
                    dueDate: "",
                    courseId: "",
                  });
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={20} color="#94a3b8" />
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Assignment Title
                </label>
                <input
                  style={styles.searchInput}
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Course
                </label>
                <select
                  style={styles.select}
                  value={formData.courseId}
                  onChange={(e) =>
                    setFormData({ ...formData, courseId: e.target.value })
                  }
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.title}
                    </option>
                  ))}
                </select>
                {formData.courseId && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginTop: "4px",
                    }}
                  >
                    Selected:{" "}
                    {courses.find((c) => c.id === formData.courseId)?.code} -{" "}
                    {courses.find((c) => c.id === formData.courseId)?.title}
                  </div>
                )}
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Due Date
                </label>
                <input
                  type="date"
                  style={styles.dateInput}
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  required
                />
                {formData.dueDate && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginTop: "4px",
                    }}
                  >
                    Selected: {formatDate(formData.dueDate)}
                  </div>
                )}
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Description
                </label>
                <textarea
                  style={styles.textarea}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  rows="4"
                />
              </div>
              <button
                className="btn-primary-action"
                type="submit"
                style={{
                  marginTop: "12px",
                  padding: "12px",
                  backgroundColor: "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                {editingAssignment ? "Save Changes" : "Create Assignment"}
              </button>
            </form>
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

export default AssignmentsManagement;
