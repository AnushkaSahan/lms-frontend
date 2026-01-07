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
  UserPlus,
  Filter,
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
    maxWidth: "480px",
    padding: "32px",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
  },
};

function StudentsManagement({ api }) {
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    registrationNo: "",
  });

  const itemsPerPage = 10;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    loadStudentsFromAPI();
  }, []);

  useEffect(() => {
    filterAndPaginateStudents();
  }, [debouncedSearchTerm, currentPage, allStudents]);

  const loadStudentsFromAPI = async () => {
    setLoading(true);
    try {
      const data = await api.getStudents(0, 1000);
      const list = data.content || data || [];
      setAllStudents(list);
    } catch (error) {
      console.error(error);
      setAllStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndPaginateStudents = () => {
    let filtered = allStudents;
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase().trim();
      filtered = allStudents.filter(
        (s) =>
          s.fullName?.toLowerCase().includes(searchLower) ||
          s.email?.toLowerCase().includes(searchLower) ||
          s.registrationNo?.toLowerCase().includes(searchLower)
      );
    }
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setStudents(
      filtered.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) await api.updateStudent(editingStudent.id, formData);
      else await api.createStudent(formData);
      setShowModal(false);
      loadStudentsFromAPI();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Students Directory</h1>
          <p style={styles.subtitle}>
            Manage and monitor all registered students
          </p>
        </div>
        <button
          className="btn-primary-action"
          onClick={() => {
            setEditingStudent(null);
            setFormData({ fullName: "", email: "", registrationNo: "" });
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
          <UserPlus size={18} /> Add Student
        </button>
      </header>

      {/* Controls */}
      <div style={styles.controls}>
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input
            style={styles.searchInput}
            placeholder="Search by name, email, or ID..."
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
          onClick={loadStudentsFromAPI}
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
            <p>Fetching student records...</p>
          </div>
        ) : (
          <>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Student</th>
                  <th style={styles.th}>Registration No</th>
                  <th style={styles.th}>Email Address</th>
                  <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.id}>
                      <td style={styles.td}>
                        <div style={{ fontWeight: "600", color: "#1e293b" }}>
                          {student.fullName}
                        </div>
                        <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                          ID: {student.id}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            backgroundColor: "#f1f5f9",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "13px",
                          }}
                        >
                          {student.registrationNo}
                        </span>
                      </td>
                      <td style={styles.td}>{student.email}</td>
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        <button
                          style={styles.actionBtn("edit")}
                          onClick={() => {
                            setEditingStudent(student);
                            setFormData({ ...student });
                            setShowModal(true);
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          style={styles.actionBtn("delete")}
                          onClick={() => {
                            if (window.confirm("Delete student?"))
                              api
                                .deleteStudent(student.id)
                                .then(loadStudentsFromAPI);
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
                      colSpan="4"
                      style={{
                        ...styles.td,
                        textAlign: "center",
                        padding: "48px",
                        color: "#94a3b8",
                      }}
                    >
                      No students found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Footer */}
            <div style={styles.pagination}>
              <div style={{ fontSize: "13px", color: "#64748b" }}>
                Showing <b>{students.length}</b> of <b>{allStudents.length}</b>{" "}
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
                {editingStudent ? "Update Records" : "Register New Student"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
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
                  Full Name
                </label>
                <input
                  style={styles.searchInput}
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
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
                  Email Address
                </label>
                <input
                  type="email"
                  style={styles.searchInput}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
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
                  Registration Number
                </label>
                <input
                  style={styles.searchInput}
                  value={formData.registrationNo}
                  onChange={(e) =>
                    setFormData({ ...formData, registrationNo: e.target.value })
                  }
                  required
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
                {editingStudent ? "Save Changes" : "Complete Registration"}
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

export default StudentsManagement;
