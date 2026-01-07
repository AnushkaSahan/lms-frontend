import React, { useState, useEffect } from "react";
import {
  Search,
  Edit2,
  Trash2,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  FileText,
  Filter,
  User,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Star,
  MessageSquare,
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
    backgroundColor: type === "review" ? "#eff6ff" : "#fef2f2",
    color: type === "review" ? "#3b82f6" : "#ef4444",
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
    maxWidth: "700px",
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
    minHeight: "100px",
  },
};

function SubmissionReview({ api }) {
  const [submissions, setSubmissions] = useState([]);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [reviewData, setReviewData] = useState({
    marks: "",
    feedback: "",
  });
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, reviewed
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 10;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndPaginateSubmissions();
  }, [
    debouncedSearchTerm,
    currentPage,
    filterStatus,
    selectedAssignment,
    allSubmissions,
  ]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [submissionsData, assignmentsData, studentsData] =
        await Promise.all([
          api.getSubmissions().catch((err) => {
            console.error("Error loading submissions:", err);
            return [];
          }),
          api.getAssignments().catch((err) => {
            console.error("Error loading assignments:", err);
            return [];
          }),
          api.getStudents(0, 1000).catch((err) => {
            console.error("Error loading students:", err);
            return { content: [] };
          }),
        ]);

      setAllSubmissions(submissionsData || []);
      setAssignments(assignmentsData || []);
      setStudents(studentsData.content || studentsData || []);
    } catch (error) {
      console.error("Error loading data:", error);
      setAllSubmissions([]);
      setAssignments([]);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndPaginateSubmissions = () => {
    let filtered = allSubmissions;

    // Filter by status
    if (filterStatus === "pending") {
      filtered = filtered.filter(
        (s) => s.marks === null || s.marks === undefined
      );
    } else if (filterStatus === "reviewed") {
      filtered = filtered.filter(
        (s) => s.marks !== null && s.marks !== undefined
      );
    }

    // Filter by assignment
    if (selectedAssignment) {
      filtered = filtered.filter(
        (s) => s.assignmentId?.toString() === selectedAssignment
      );
    }

    // Filter by search term
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase().trim();
      filtered = filtered.filter((submission) => {
        const studentName = getStudentName(submission.studentId).toLowerCase();
        const assignmentTitle = getAssignmentTitle(
          submission.assignmentId
        ).toLowerCase();
        const description = submission.description?.toLowerCase() || "";
        return (
          studentName.includes(searchLower) ||
          assignmentTitle.includes(searchLower) ||
          description.includes(searchLower)
        );
      });
    }

    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setSubmissions(
      filtered.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      )
    );
  };

  const [totalPages, setTotalPages] = useState(0);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!reviewData.marks || reviewData.marks < 0 || reviewData.marks > 100) {
      alert("Please enter valid marks (0-100)");
      return;
    }

    try {
      await api.updateSubmission(
        selectedSubmission.id,
        parseInt(reviewData.marks),
        reviewData.feedback || ""
      );

      setSelectedSubmission(null);
      setReviewData({ marks: "", feedback: "" });
      await loadData();

      alert("Submission reviewed successfully!");
    } catch (error) {
      console.error("Error reviewing submission:", error);
      alert("Error reviewing submission: " + error.message);
    }
  };

  const handleDeleteSubmission = async (id) => {
    if (window.confirm("Are you sure you want to delete this submission?")) {
      try {
        await api.deleteSubmission(id);
        await loadData();
        alert("Submission deleted successfully!");
      } catch (error) {
        console.error("Error deleting submission:", error);
        alert("Error deleting submission: " + error.message);
      }
    }
  };

  const getAssignmentTitle = (assignmentId) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    return assignment ? assignment.title : "Unknown Assignment";
  };

  const getStudentName = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student ? student.fullName : "Unknown Student";
  };

  const getAssignmentCourse = (assignmentId) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    return assignment ? getCourseName(assignment.courseId) : "N/A";
  };

  const getCourseName = (courseId) => {
    // This would need courses data loaded separately
    return "Course Info";
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const getStatusBadge = (submission) => {
    if (submission.marks !== null && submission.marks !== undefined) {
      return (
        <span
          style={{
            backgroundColor: "#10b98120",
            color: "#10b981",
            padding: "4px 12px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "600",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <CheckCircle size={12} /> Reviewed
        </span>
      );
    }
    return (
      <span
        style={{
          backgroundColor: "#f59e0b20",
          color: "#d97706",
          padding: "4px 12px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "600",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <Clock size={12} /> Pending
      </span>
    );
  };

  const getMarksDisplay = (submission) => {
    if (submission.marks !== null && submission.marks !== undefined) {
      const marks = parseInt(submission.marks);
      let color = "#ef4444";
      if (marks >= 80) color = "#10b981";
      else if (marks >= 60) color = "#f59e0b";
      else if (marks >= 40) color = "#3b82f6";

      return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: color,
            }}
          >
            {marks}/100
          </div>
          {submission.feedback && (
            <MessageSquare size={14} color="#94a3b8" title="Has feedback" />
          )}
        </div>
      );
    }
    return (
      <span style={{ color: "#94a3b8", fontStyle: "italic" }}>Not graded</span>
    );
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Submission Review</h1>
          <p style={styles.subtitle}>Review and grade student submissions</p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "14px",
            color: "#64748b",
          }}
        >
          <div style={{ textAlign: "right" }}>
            <div
              style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b" }}
            >
              {allSubmissions.length}
            </div>
            <div>Total Submissions</div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div style={styles.controls}>
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input
            style={styles.searchInput}
            placeholder="Search by student name, assignment, or description..."
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
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Submissions</option>
          <option value="pending">Pending Review</option>
          <option value="reviewed">Reviewed</option>
        </select>

        <select
          style={styles.filterSelect}
          value={selectedAssignment}
          onChange={(e) => setSelectedAssignment(e.target.value)}
        >
          <option value="">All Assignments</option>
          {assignments.map((assignment) => (
            <option key={assignment.id} value={assignment.id}>
              {assignment.title}
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
            <p>Fetching submissions...</p>
          </div>
        ) : (
          <>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Student</th>
                  <th style={styles.th}>Assignment</th>
                  <th style={styles.th}>Submitted</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>File</th>
                  <th style={styles.th}>Marks</th>
                  <th style={styles.th}>Status</th>
                  <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length > 0 ? (
                  submissions.map((submission) => (
                    <tr key={submission.id}>
                      <td style={styles.td}>
                        <div style={{ fontWeight: "600", color: "#1e293b" }}>
                          {getStudentName(submission.studentId)}
                        </div>
                        <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                          ID: {submission.studentId}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={{ fontWeight: "500" }}>
                          {getAssignmentTitle(submission.assignmentId)}
                        </div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>
                          {getAssignmentCourse(submission.assignmentId)}
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
                          <span>{formatDate(submission.submittedAt)}</span>
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
                          title={submission.description}
                        >
                          {submission.description || "No description"}
                        </div>
                      </td>
                      <td style={styles.td}>
                        {submission.fileUrl ? (
                          <a
                            href={submission.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              color: "#3b82f6",
                              textDecoration: "none",
                              fontWeight: "500",
                              fontSize: "13px",
                            }}
                          >
                            <Download size={14} /> View File
                          </a>
                        ) : (
                          <span
                            style={{ color: "#94a3b8", fontStyle: "italic" }}
                          >
                            No file
                          </span>
                        )}
                      </td>
                      <td style={styles.td}>{getMarksDisplay(submission)}</td>
                      <td style={styles.td}>{getStatusBadge(submission)}</td>
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        <button
                          style={styles.actionBtn("review")}
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setReviewData({
                              marks: submission.marks || "",
                              feedback: submission.feedback || "",
                            });
                          }}
                          title={
                            submission.marks ? "Edit Review" : "Add Review"
                          }
                        >
                          {submission.marks ? (
                            <Edit2 size={16} />
                          ) : (
                            <Star size={16} />
                          )}
                        </button>
                        <button
                          style={styles.actionBtn("delete")}
                          onClick={() => handleDeleteSubmission(submission.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      style={{
                        ...styles.td,
                        textAlign: "center",
                        padding: "48px",
                        color: "#94a3b8",
                      }}
                    >
                      {allSubmissions.length === 0
                        ? "No submissions available"
                        : "No submissions match the current filters"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Footer */}
            <div style={styles.pagination}>
              <div style={{ fontSize: "13px", color: "#64748b" }}>
                Showing <b>{submissions.length}</b> of{" "}
                <b>{allSubmissions.length}</b> records
                {filterStatus !== "all" && (
                  <span style={{ marginLeft: "12px", color: "#3b82f6" }}>
                    ({filterStatus === "pending" ? "Pending" : "Reviewed"} only)
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
        )}
      </div>

      {/* Review Modal */}
      {selectedSubmission && (
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
                  {selectedSubmission.marks
                    ? "Edit Review"
                    : "Review Submission"}
                </h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
                  {getStudentName(selectedSubmission.studentId)} -{" "}
                  {getAssignmentTitle(selectedSubmission.assignmentId)}
                </p>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
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
              {/* Submission Details */}
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "24px",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 12px 0",
                    color: "#475569",
                    fontSize: "14px",
                  }}
                >
                  Submission Details
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginBottom: "4px",
                      }}
                    >
                      Student
                    </div>
                    <div style={{ fontWeight: "600", color: "#1e293b" }}>
                      {getStudentName(selectedSubmission.studentId)}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginBottom: "4px",
                      }}
                    >
                      Assignment
                    </div>
                    <div style={{ fontWeight: "600", color: "#1e293b" }}>
                      {getAssignmentTitle(selectedSubmission.assignmentId)}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginBottom: "4px",
                      }}
                    >
                      Submitted
                    </div>
                    <div style={{ color: "#475569" }}>
                      {formatDate(selectedSubmission.submittedAt)}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginBottom: "4px",
                      }}
                    >
                      Status
                    </div>
                    <div>{getStatusBadge(selectedSubmission)}</div>
                  </div>
                </div>

                {selectedSubmission.description && (
                  <div style={{ marginTop: "12px" }}>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginBottom: "4px",
                      }}
                    >
                      Description
                    </div>
                    <div style={{ color: "#475569" }}>
                      {selectedSubmission.description}
                    </div>
                  </div>
                )}

                {selectedSubmission.fileUrl && (
                  <div style={{ marginTop: "12px" }}>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginBottom: "4px",
                      }}
                    >
                      Submission File
                    </div>
                    <a
                      href={selectedSubmission.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#3b82f6",
                        textDecoration: "none",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      <Download size={16} /> Download Submission File
                    </a>
                  </div>
                )}
              </div>

              {/* Review Form */}
              <form
                onSubmit={handleReviewSubmit}
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
                    Marks (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    style={styles.searchInput}
                    value={reviewData.marks}
                    onChange={(e) =>
                      setReviewData({ ...reviewData, marks: e.target.value })
                    }
                    required
                    placeholder="Enter marks (0-100)"
                  />
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
                    Feedback
                  </label>
                  <textarea
                    style={styles.textarea}
                    value={reviewData.feedback}
                    onChange={(e) =>
                      setReviewData({ ...reviewData, feedback: e.target.value })
                    }
                    rows="4"
                    placeholder="Provide constructive feedback to the student..."
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "12px",
                  }}
                >
                  <button
                    onClick={() => setSelectedSubmission(null)}
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
                      padding: "10px 20px",
                      backgroundColor: "#3b82f6",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                    disabled={!reviewData.marks}
                  >
                    {selectedSubmission.marks ? "Update Review" : "Save Review"}
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

export default SubmissionReview;
