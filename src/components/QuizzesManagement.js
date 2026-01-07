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
  Users,
  BarChart3,
  HelpCircle,
  ListChecks,
  ArrowLeft,
  Award,
  CheckCircle,
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

  // Tabs
  tabsContainer: {
    display: "flex",
    borderBottom: "1px solid #e2e8f0",
    marginBottom: "24px",
  },
  tab: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    color: active ? "#3b82f6" : "#64748b",
    borderBottom: active ? "2px solid #3b82f6" : "2px solid transparent",
    position: "relative",
    transition: "all 0.2s",
  }),
  tabBadge: {
    backgroundColor: "#e2e8f0",
    color: "#475569",
    fontSize: "11px",
    fontWeight: "700",
    padding: "2px 6px",
    borderRadius: "12px",
    minWidth: "20px",
    textAlign: "center",
  },

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
    minWidth: "200px",
  },

  // Card Grid (for quizzes)
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "20px",
  },
  quizCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    transition: "all 0.2s",
  },
  quizCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  quizCardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
    margin: 0,
    marginBottom: "4px",
  },
  quizCardSubtitle: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
  },

  // Questions List
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "20px",
    marginBottom: "16px",
  },
  questionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  questionNumber: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#3b82f6",
    backgroundColor: "#eff6ff",
    padding: "4px 12px",
    borderRadius: "6px",
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
  largeModal: {
    maxWidth: "700px",
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

function QuizzesManagement({ api }) {
  const [activeSection, setActiveSection] = useState("quizzes"); // 'quizzes', 'questions', 'attempts'
  const [quizzes, setQuizzes] = useState([]);
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [allAttempts, setAllAttempts] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quiz Management State
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [quizFormData, setQuizFormData] = useState({
    title: "",
    courseId: "",
  });

  // Question Management State
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionFormData, setQuestionFormData] = useState({
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
  });

  // Filters and Search
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 10;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (activeSection === "quizzes") {
      filterAndPaginateQuizzes();
    } else if (activeSection === "attempts") {
      filterAndPaginateAttempts();
    }
  }, [
    debouncedSearchTerm,
    currentPage,
    selectedCourse,
    selectedStudent,
    activeSection,
  ]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [coursesData, studentsData, quizzesData, attemptsData] =
        await Promise.all([
          api.getCourses(),
          api.getStudents(0, 1000),
          api.getAllQuizzes?.(0, 1000) || api.getQuizzes?.(0, 1000) || [],
          api.getAllAttempts?.(0, 1000) || api.getAttempts?.(0, 1000) || [],
        ]);

      setCourses(coursesData || []);
      setStudents(studentsData.content || studentsData || []);
      setAllQuizzes(quizzesData.content || quizzesData || []);
      setAllAttempts(attemptsData.content || attemptsData || []);

      if (selectedCourse) {
        const filteredQuizzes = quizzesData.filter(
          (q) => q.courseId === selectedCourse
        );
        setQuizzes(filteredQuizzes);
      } else {
        setQuizzes(quizzesData.content || quizzesData || []);
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadQuestions = async (quizId) => {
    try {
      const data = await api.getQuestions(quizId);
      setQuestions(data || []);
    } catch (error) {
      console.error("Error loading questions:", error);
      setQuestions([]);
    }
  };

  const filterAndPaginateQuizzes = () => {
    let filtered = allQuizzes;

    if (selectedCourse) {
      filtered = filtered.filter((q) => q.courseId === selectedCourse);
    }

    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase().trim();
      filtered = filtered.filter((q) =>
        q.title?.toLowerCase().includes(searchLower)
      );
    }

    setQuizzes(filtered);
  };

  const filterAndPaginateAttempts = () => {
    let filtered = allAttempts;

    if (selectedStudent) {
      filtered = filtered.filter((a) => a.studentId === selectedStudent);
    }

    if (selectedCourse) {
      const courseQuizzes = allQuizzes.filter(
        (q) => q.courseId === selectedCourse
      );
      const courseQuizIds = courseQuizzes.map((q) => q.id);
      filtered = filtered.filter((a) => courseQuizIds.includes(a.quizId));
    }

    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase().trim();
      filtered = filtered.filter((attempt) => {
        const student = students.find((s) => s.id === attempt.studentId);
        const quiz = allQuizzes.find((q) => q.id === attempt.quizId);
        const studentName = student?.fullName?.toLowerCase() || "";
        const quizTitle = quiz?.title?.toLowerCase() || "";
        return (
          studentName.includes(searchLower) || quizTitle.includes(searchLower)
        );
      });
    }

    setAttempts(filtered);
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQuiz) {
        await api.updateQuiz(editingQuiz.id, quizFormData);
      } else {
        await api.createQuiz(quizFormData);
      }
      setShowQuizModal(false);
      setEditingQuiz(null);
      setQuizFormData({ title: "", courseId: "" });
      loadInitialData();
    } catch (error) {
      alert("Error saving quiz: " + error.message);
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this quiz? This will also delete all questions and attempts."
      )
    ) {
      try {
        await api.deleteQuiz(id);
        loadInitialData();
      } catch (error) {
        alert("Error deleting quiz: " + error.message);
      }
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createQuestion({
        ...questionFormData,
        quizId: selectedQuiz.id,
      });
      setShowQuestionModal(false);
      setQuestionFormData({
        questionText: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
      });
      loadQuestions(selectedQuiz.id);
    } catch (error) {
      alert("Error adding question: " + error.message);
    }
  };

  const handleManageQuestions = (quiz) => {
    setSelectedQuiz(quiz);
    setActiveSection("questions");
    loadQuestions(quiz.id);
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await api.deleteQuestion(id);
        loadQuestions(selectedQuiz.id);
      } catch (error) {
        alert("Error deleting question: " + error.message);
      }
    }
  };

  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? `${course.code} - ${course.title}` : "Unknown Course";
  };

  const getStudentName = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student ? student.fullName : "Unknown Student";
  };

  const getQuizName = (quizId) => {
    const quiz = allQuizzes.find((q) => q.id === quizId);
    return quiz ? quiz.title : "Unknown Quiz";
  };

  const getQuizQuestionsCount = (quizId) => {
    return questions.filter((q) => q.quizId === quizId).length;
  };

  const getAttemptsCount = (quizId) => {
    return allAttempts.filter((a) => a.quizId === quizId).length;
  };

  const getPerformanceColor = (score) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    if (score >= 40) return "#3b82f6";
    return "#ef4444";
  };

  const getPerformanceLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Average";
    return "Poor";
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Quizzes Hub</h1>
          <p style={styles.subtitle}>
            Create, manage and track quiz performance
          </p>
        </div>
        {activeSection === "quizzes" && (
          <button
            className="btn-primary-action"
            onClick={() => {
              setEditingQuiz(null);
              setQuizFormData({ title: "", courseId: "" });
              setShowQuizModal(true);
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
            <Plus size={18} /> Create Quiz
          </button>
        )}
        {activeSection === "questions" && selectedQuiz && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                backgroundColor: "#f8fafc",
                color: "#64748b",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
              }}
              onClick={() => {
                setActiveSection("quizzes");
                setSelectedQuiz(null);
              }}
            >
              <ArrowLeft size={16} /> Back to Quizzes
            </button>
            <button
              className="btn-primary-action"
              onClick={() => setShowQuestionModal(true)}
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
              <Plus size={18} /> Add Question
            </button>
          </div>
        )}
      </header>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        <button
          style={styles.tab(activeSection === "quizzes")}
          onClick={() => setActiveSection("quizzes")}
        >
          <FileText size={16} />
          Manage Quizzes
          <span style={styles.tabBadge}>{allQuizzes.length}</span>
        </button>
        <button
          style={styles.tab(activeSection === "questions")}
          onClick={() =>
            activeSection === "questions" && setActiveSection("quizzes")
          }
          disabled={!selectedQuiz}
        >
          <HelpCircle size={16} />
          Manage Questions
          <span style={styles.tabBadge}>{questions.length}</span>
        </button>
        <button
          style={styles.tab(activeSection === "attempts")}
          onClick={() => setActiveSection("attempts")}
        >
          <BarChart3 size={16} />
          View Attempts
          <span style={styles.tabBadge}>{allAttempts.length}</span>
        </button>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input
            style={styles.searchInput}
            placeholder={
              activeSection === "quizzes"
                ? "Search quizzes..."
                : activeSection === "questions"
                ? "Search questions..."
                : "Search attempts..."
            }
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
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code} - {course.title}
            </option>
          ))}
        </select>

        {activeSection === "attempts" && (
          <select
            style={styles.filterSelect}
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">All Students</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.fullName}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={loadInitialData}
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
          <p>Loading quiz data...</p>
        </div>
      )}

      {/* Content based on active section */}
      {!loading && activeSection === "quizzes" && (
        <>
          <div style={styles.cardGrid}>
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => {
                const quizQuestionsCount = getQuizQuestionsCount(quiz.id);
                const quizAttemptsCount = getAttemptsCount(quiz.id);

                return (
                  <div key={quiz.id} style={styles.quizCard}>
                    <div style={styles.quizCardHeader}>
                      <div>
                        <h3 style={styles.quizCardTitle}>{quiz.title}</h3>
                        <p style={styles.quizCardSubtitle}>
                          {getCourseName(quiz.courseId)}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          style={styles.actionBtn("edit")}
                          onClick={() => {
                            setEditingQuiz(quiz);
                            setQuizFormData({
                              title: quiz.title,
                              courseId: quiz.courseId,
                            });
                            setShowQuizModal(true);
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          style={styles.actionBtn("delete")}
                          onClick={() => handleDeleteQuiz(quiz.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "12px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <HelpCircle size={14} color="#64748b" />
                          <span style={{ fontSize: "13px", color: "#475569" }}>
                            {quizQuestionsCount} Questions
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Users size={14} color="#64748b" />
                          <span style={{ fontSize: "13px", color: "#475569" }}>
                            {quizAttemptsCount} Attempts
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleManageQuestions(quiz)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#f8fafc",
                        color: "#3b82f6",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <ListChecks size={16} /> Manage Questions
                    </button>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "48px",
                  color: "#94a3b8",
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
                <h3 style={{ marginBottom: "8px", color: "#64748b" }}>
                  No Quizzes Found
                </h3>
                <p style={{ marginBottom: "24px" }}>
                  Create your first quiz to get started
                </p>
                <button
                  onClick={() => setShowQuizModal(true)}
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
                  <Plus size={18} /> Create Quiz
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {!loading && activeSection === "questions" && selectedQuiz && (
        <div style={styles.card}>
          <div
            style={{
              padding: "24px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ margin: 0, marginBottom: "4px", color: "#1e293b" }}>
                Questions for: {selectedQuiz.title}
              </h3>
              <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
                Course: {getCourseName(selectedQuiz.courseId)}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  backgroundColor: "#f8fafc",
                  padding: "6px 12px",
                  borderRadius: "6px",
                }}
              >
                {questions.length} Questions
              </span>
            </div>
          </div>

          <div style={{ padding: "24px" }}>
            {questions.length > 0 ? (
              questions.map((question, index) => (
                <div key={question.id} style={styles.questionCard}>
                  <div style={styles.questionHeader}>
                    <span style={styles.questionNumber}>Q{index + 1}</span>
                    <button
                      style={styles.actionBtn("delete")}
                      onClick={() => handleDeleteQuestion(question.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 16px 0", color: "#1e293b" }}>
                      {question.questionText}
                    </h4>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                      }}
                    >
                      {["A", "B", "C", "D"].map((option) => (
                        <div
                          key={option}
                          style={{
                            padding: "12px",
                            borderRadius: "8px",
                            border: `1px solid ${
                              question.correctAnswer === option
                                ? "#10b981"
                                : "#e2e8f0"
                            }`,
                            backgroundColor:
                              question.correctAnswer === option
                                ? "#f0fdf4"
                                : "#fff",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <span
                              style={{
                                fontWeight: "600",
                                color:
                                  question.correctAnswer === option
                                    ? "#10b981"
                                    : "#475569",
                                marginRight: "8px",
                              }}
                            >
                              {option})
                            </span>
                            <span>{question[`option${option}`]}</span>
                          </div>
                          {question.correctAnswer === option && (
                            <CheckCircle size={16} color="#10b981" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px",
                  color: "#94a3b8",
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>❓</div>
                <h3 style={{ marginBottom: "8px", color: "#64748b" }}>
                  No Questions Added
                </h3>
                <p style={{ marginBottom: "24px" }}>
                  Add questions to make this quiz available for students
                </p>
                <button
                  onClick={() => setShowQuestionModal(true)}
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
                  <Plus size={18} /> Add First Question
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && activeSection === "attempts" && (
        <div style={styles.card}>
          <div
            style={{
              padding: "24px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ margin: 0, marginBottom: "4px", color: "#1e293b" }}>
                Student Attempts
              </h3>
              <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
                Track and analyze quiz performance
              </p>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#1e293b",
                  }}
                >
                  {attempts.length}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  Total Attempts
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#1e293b",
                  }}
                >
                  {attempts.length > 0
                    ? Math.round(
                        attempts.reduce((sum, att) => sum + att.score, 0) /
                          attempts.length
                      )
                    : 0}
                  %
                </div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  Average Score
                </div>
              </div>
            </div>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Student</th>
                <th style={styles.th}>Quiz</th>
                <th style={styles.th}>Course</th>
                <th style={styles.th}>Score</th>
                <th style={styles.th}>Correct</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Performance</th>
              </tr>
            </thead>
            <tbody>
              {attempts.length > 0 ? (
                attempts.map((attempt) => {
                  const quiz = allQuizzes.find((q) => q.id === attempt.quizId);
                  const performanceColor = getPerformanceColor(attempt.score);

                  return (
                    <tr key={attempt.id}>
                      <td style={styles.td}>
                        <div style={{ fontWeight: "600", color: "#1e293b" }}>
                          {getStudentName(attempt.studentId)}
                        </div>
                      </td>
                      <td style={styles.td}>{getQuizName(attempt.quizId)}</td>
                      <td style={styles.td}>
                        {quiz ? getCourseName(quiz.courseId) : "N/A"}
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            backgroundColor: performanceColor + "20",
                            color: performanceColor,
                            padding: "4px 12px",
                            borderRadius: "12px",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        >
                          {attempt.score}%
                        </span>
                      </td>
                      <td style={styles.td}>
                        {attempt.correctAnswers || "N/A"}
                      </td>
                      <td style={styles.td}>
                        {attempt.totalQuestions || "N/A"}
                      </td>
                      <td style={styles.td}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              flex: 1,
                              height: "8px",
                              backgroundColor: "#e2e8f0",
                              borderRadius: "4px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${attempt.score}%`,
                                height: "100%",
                                backgroundColor: performanceColor,
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: "12px",
                              color: performanceColor,
                              fontWeight: "600",
                              minWidth: "60px",
                            }}
                          >
                            {getPerformanceLabel(attempt.score)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      ...styles.td,
                      textAlign: "center",
                      padding: "48px",
                      color: "#94a3b8",
                    }}
                  >
                    No attempts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination for attempts */}
          {attempts.length > 0 && (
            <div style={styles.pagination}>
              <div style={{ fontSize: "13px", color: "#64748b" }}>
                Showing <b>{attempts.length}</b> of <b>{allAttempts.length}</b>{" "}
                records
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quiz Creation/Edit Modal */}
      {showQuizModal && (
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
                {editingQuiz ? "Edit Quiz" : "Create New Quiz"}
              </h3>
              <button
                onClick={() => setShowQuizModal(false)}
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
              onSubmit={handleQuizSubmit}
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
                  Quiz Title
                </label>
                <input
                  style={styles.searchInput}
                  value={quizFormData.title}
                  onChange={(e) =>
                    setQuizFormData({ ...quizFormData, title: e.target.value })
                  }
                  placeholder="Enter quiz title"
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
                  value={quizFormData.courseId}
                  onChange={(e) =>
                    setQuizFormData({
                      ...quizFormData,
                      courseId: e.target.value,
                    })
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
                {editingQuiz ? "Update Quiz" : "Create Quiz"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Question Creation Modal */}
      {showQuestionModal && (
        <div style={styles.overlay}>
          <div style={{ ...styles.modal, ...styles.largeModal }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <h3 style={{ margin: 0 }}>Add New Question</h3>
              <button
                onClick={() => setShowQuestionModal(false)}
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
              onSubmit={handleQuestionSubmit}
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
                  Question Text
                </label>
                <textarea
                  style={styles.textarea}
                  value={questionFormData.questionText}
                  onChange={(e) =>
                    setQuestionFormData({
                      ...questionFormData,
                      questionText: e.target.value,
                    })
                  }
                  placeholder="Enter your question..."
                  rows="3"
                  required
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
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
                    Option A
                  </label>
                  <input
                    style={styles.searchInput}
                    value={questionFormData.optionA}
                    onChange={(e) =>
                      setQuestionFormData({
                        ...questionFormData,
                        optionA: e.target.value,
                      })
                    }
                    placeholder="Option A"
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
                    Option B
                  </label>
                  <input
                    style={styles.searchInput}
                    value={questionFormData.optionB}
                    onChange={(e) =>
                      setQuestionFormData({
                        ...questionFormData,
                        optionB: e.target.value,
                      })
                    }
                    placeholder="Option B"
                    required
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
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
                    Option C
                  </label>
                  <input
                    style={styles.searchInput}
                    value={questionFormData.optionC}
                    onChange={(e) =>
                      setQuestionFormData({
                        ...questionFormData,
                        optionC: e.target.value,
                      })
                    }
                    placeholder="Option C"
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
                    Option D
                  </label>
                  <input
                    style={styles.searchInput}
                    value={questionFormData.optionD}
                    onChange={(e) =>
                      setQuestionFormData({
                        ...questionFormData,
                        optionD: e.target.value,
                      })
                    }
                    placeholder="Option D"
                    required
                  />
                </div>
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
                  Correct Answer
                </label>
                <select
                  style={styles.select}
                  value={questionFormData.correctAnswer}
                  onChange={(e) =>
                    setQuestionFormData({
                      ...questionFormData,
                      correctAnswer: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Correct Answer</option>
                  <option value="A">
                    A - {questionFormData.optionA || "Option A"}
                  </option>
                  <option value="B">
                    B - {questionFormData.optionB || "Option B"}
                  </option>
                  <option value="C">
                    C - {questionFormData.optionC || "Option C"}
                  </option>
                  <option value="D">
                    D - {questionFormData.optionD || "Option D"}
                  </option>
                </select>
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
                Add Question
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

export default QuizzesManagement;
