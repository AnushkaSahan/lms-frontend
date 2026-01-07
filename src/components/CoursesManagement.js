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
  BookOpen,
  Filter,
  User,
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
};

function CoursesManagement({ api }) {
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    description: "",
    lecturerId: "",
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
    filterAndPaginateCourses();
  }, [debouncedSearchTerm, currentPage, allCourses]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [coursesData, lecturersData] = await Promise.all([
        api.getCourses(),
        api.getLecturers(),
      ]);
      setAllCourses(coursesData || []);
      setLecturers(lecturersData || []);
    } catch (error) {
      console.error("Error loading data:", error);
      setAllCourses([]);
      setLecturers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndPaginateCourses = () => {
    let filtered = allCourses;
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase().trim();
      filtered = allCourses.filter(
        (course) =>
          course.title?.toLowerCase().includes(searchLower) ||
          course.code?.toLowerCase().includes(searchLower) ||
          course.description?.toLowerCase().includes(searchLower)
      );
    }
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCourses(
      filtered.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await api.updateCourse(editingCourse.id, formData);
      } else {
        await api.createCourse(formData);
      }
      setShowModal(false);
      setEditingCourse(null);
      setFormData({ title: "", code: "", description: "", lecturerId: "" });
      loadData();
    } catch (error) {
      alert("Error saving course: " + error.message);
    }
  };

  const getLecturerName = (lecturerId) => {
    const lecturer = lecturers.find((l) => l.id === lecturerId);
    return lecturer ? lecturer.fullName : "Unassigned";
  };

  const getLecturerDepartment = (lecturerId) => {
    const lecturer = lecturers.find((l) => l.id === lecturerId);
    return lecturer ? lecturer.department : "";
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Courses Catalog</h1>
          <p style={styles.subtitle}>
            Manage academic courses and assign lecturers
          </p>
        </div>
        <button
          className="btn-primary-action"
          onClick={() => {
            setEditingCourse(null);
            setFormData({
              title: "",
              code: "",
              description: "",
              lecturerId: "",
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
          <BookOpen size={18} /> Add Course
        </button>
      </header>

      {/* Controls */}
      <div style={styles.controls}>
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input
            style={styles.searchInput}
            placeholder="Search by title, code, or description..."
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
            <p>Fetching course records...</p>
          </div>
        ) : (
          <>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Course</th>
                  <th style={styles.th}>Code</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Lecturer</th>
                  <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <tr key={course.id}>
                      <td style={styles.td}>
                        <div style={{ fontWeight: "600", color: "#1e293b" }}>
                          {course.title}
                        </div>
                        <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                          ID: {course.id}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            backgroundColor: "#f1f5f9",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#475569",
                          }}
                        >
                          {course.code}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div
                          style={{
                            maxWidth: "250px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={course.description}
                        >
                          {course.description}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={{ fontWeight: "500" }}>
                          {getLecturerName(course.lecturerId)}
                        </div>
                        {course.lecturerId && (
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              marginTop: "2px",
                            }}
                          >
                            {getLecturerDepartment(course.lecturerId)}
                          </div>
                        )}
                      </td>
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        <button
                          style={styles.actionBtn("edit")}
                          onClick={() => {
                            setEditingCourse(course);
                            setFormData({
                              title: course.title,
                              code: course.code,
                              description: course.description,
                              lecturerId: course.lecturerId || "",
                            });
                            setShowModal(true);
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          style={styles.actionBtn("delete")}
                          onClick={() => {
                            if (window.confirm("Delete course?"))
                              api.deleteCourse(course.id).then(loadData);
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
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
                        ? `No courses found matching "${debouncedSearchTerm}"`
                        : "No courses available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Footer */}
            <div style={styles.pagination}>
              <div style={{ fontSize: "13px", color: "#64748b" }}>
                Showing <b>{courses.length}</b> of <b>{allCourses.length}</b>{" "}
                records
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
                {editingCourse ? "Update Course" : "Create New Course"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingCourse(null);
                  setFormData({
                    title: "",
                    code: "",
                    description: "",
                    lecturerId: "",
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
                  Course Title
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
                  Course Code
                </label>
                <input
                  style={styles.searchInput}
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
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
                  Description
                </label>
                <textarea
                  style={styles.textarea}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  rows="3"
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
                  Assign Lecturer
                </label>
                <select
                  style={styles.select}
                  value={formData.lecturerId}
                  onChange={(e) =>
                    setFormData({ ...formData, lecturerId: e.target.value })
                  }
                >
                  <option value="">Select Lecturer</option>
                  {lecturers.map((lecturer) => (
                    <option key={lecturer.id} value={lecturer.id}>
                      {lecturer.fullName} - {lecturer.department}
                    </option>
                  ))}
                </select>
                {formData.lecturerId && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginTop: "4px",
                    }}
                  >
                    Selected:{" "}
                    {
                      lecturers.find((l) => l.id === formData.lecturerId)
                        ?.fullName
                    }
                  </div>
                )}
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
                {editingCourse ? "Save Changes" : "Create Course"}
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

export default CoursesManagement;
