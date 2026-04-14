import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../utils/Config";

// ============================================
// COURSE CONFIGURATION & UTILITIES
// ============================================

const COURSE_CONFIG = {
  "B.Tech":  { totalFee: 500000,  totalYears: 4 },
  "MBA":     { totalFee: 1000000, totalYears: 2 },
  "M.Tech":  { totalFee: 400000,  totalYears: 2 },
  "Diploma": { totalFee: 350000,  totalYears: 3 },
};

function calculateFees(course, residencyType) {
  const config = COURSE_CONFIG[course];
  if (!config) return { selectedPerYear: 0, perYearFee: 0, discount: 0, totalYears: 0 };
  const { totalFee, totalYears } = config;
  const perYearFee      = Math.round(totalFee / totalYears);
  const discount        = Math.round(perYearFee * 0.30);
  const selectedPerYear = residencyType === "hosteler" ? perYearFee : perYearFee - discount;
  return { selectedPerYear, perYearFee, discount, totalYears };
}

const inr = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n ?? 0);

// ============================================
// AVATAR FALLBACK COMPONENT
// ============================================

function AvatarFallback({ name, size = "md" }) {
  const letter = name?.charAt(0)?.toUpperCase() || "U";

  const sizeStyles = {
    sm: { width: "44px", height: "44px", fontSize: "17px" },
    md: { width: "112px", height: "112px", fontSize: "40px" },
    lg: { width: "140px", height: "140px", fontSize: "52px" },
  }[size] || { width: "112px", height: "112px", fontSize: "40px" };

  return (
    <div
      style={{
        ...sizeStyles,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: "700",
        border: "4px solid #fbbf24",
        boxShadow: "0 8px 24px rgba(249, 115, 22, 0.35)",
        flexShrink: 0,
        userSelect: "none",
        transition: "all 0.3s ease",
      }}
    >
      {letter}
    </div>
  );
}

// ============================================
// PROFILE AVATAR COMPONENT
// ============================================

function ProfileAvatar({ student, size = "md" }) {
  const [imgError, setImgError] = useState(false);

  const dimensions = {
    sm: "44px",
    md: "112px",
    lg: "140px",
  }[size] || "112px";

  const studentName =
    student?.firstName ||
    student?.lastName ||
    student?.username ||
    student?.name ||
    "U";

  if (student?.profilePic && !imgError) {
    return (
      <div
        style={{
          width: dimensions,
          height: dimensions,
          borderRadius: "50%",
          overflow: "hidden",
          border: "4px solid #fbbf24",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          flexShrink: 0,
          background: "#f0f0f0",
        }}
      >
        <img
          className="w-full h-full object-cover"
          src={student.profilePic}
          alt="Profile"
          onError={() => setImgError(true)}
          style={{ display: "block" }}
        />
      </div>
    );
  }

  return <AvatarFallback name={studentName} size={size} />;
}

// ============================================
// STAT CARD COMPONENT
// ============================================

function StatCard({ label, value, bg = "bg-gray-50", textColor = "text-gray-700", labelColor = "text-gray-400" }) {
  return (
    <div className={`${bg} rounded-xl p-4 text-center transition-all hover:shadow-md`}>
      <p className={`text-xs ${labelColor} mb-2 font-medium tracking-wide uppercase`}>{label}</p>
      <p className={`text-lg font-extrabold ${textColor}`}>{value}</p>
    </div>
  );
}

// ============================================
// MAIN PROFILE PAGE COMPONENT
// ============================================

function ProfilePage() {
  const navigate = useNavigate();

  const storedRaw = JSON.parse(localStorage.getItem("studentDet") || "{}");
  const studentId = storedRaw?._id;

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================== FETCH STUDENT DATA ====================
  useEffect(() => {
    if (!studentId) {
      setError("Session expired. Please log in again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`${BASE_URL}/student/get-one-student/${studentId}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data?.success) {
          setStudent(res.data.student);
          localStorage.setItem("studentDet", JSON.stringify(res.data.student));
        } else {
          setError("Failed to load student data.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Network error. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [studentId]);

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin mx-auto mb-6"
            style={{
              animation: "spin 1s linear infinite",
            }}
          />
          <p className="text-gray-600 font-semibold text-base">Loading your profile…</p>
          <p className="text-gray-400 text-sm mt-2">Just a moment</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // ==================== ERROR STATE ====================
  if (error || !student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-gray-800 font-bold text-lg mb-3">{error || "Student not found"}</p>
          <p className="text-gray-500 text-sm mb-6">
            {error ? "Please try logging in again." : "We couldn't retrieve your profile information."}
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // ==================== CALCULATE FEE DATA ====================
  const isHosteler = student.residencyType === "hosteler";
  const { selectedPerYear, discount, totalYears } = calculateFees(
    student.course,
    student.residencyType
  );

  const yearlyFees = student.yearlyFees || [];
  const activeEntry = yearlyFees.find(
    (y) => y.status === "active" || y.status === "partial"
  );
  const allYearsPaid =
    yearlyFees.length > 0 && yearlyFees.every((y) => y.status === "paid");

  const totalDue = activeEntry?.fee ?? 0;
  const paidFeeActive = activeEntry?.paidFee ?? 0;
  const dueFee = Math.max(totalDue - paidFeeActive, 0);
  const pct = totalDue > 0 ? Math.min((paidFeeActive / totalDue) * 100, 100) : 0;

  const grandTotalPaid = yearlyFees.reduce((acc, y) => acc + (y.paidFee || 0), 0);
  const grandTotalFee = selectedPerYear * totalYears;
  const remainingTotal = Math.max(grandTotalFee - grandTotalPaid, 0);

  const feeStatusLabel = allYearsPaid
    ? "ALL PAID"
    : dueFee <= 0
    ? "YEAR PAID"
    : paidFeeActive > 0
    ? "PARTIAL"
    : "UNPAID";

  const feeStatusCls =
    allYearsPaid || dueFee <= 0
      ? "bg-emerald-100 text-emerald-700"
      : paidFeeActive > 0
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";

  // ==================== RETURN JSX ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-gray-100">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full opacity-5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full opacity-5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* ==================== MAIN CARD ====================*/}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header Section with Background */}
          <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 px-6 md:px-10 pt-10 pb-32">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
              {/* Avatar & Basic Info */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-6">
                <div className="flex-shrink-0">
                  <ProfileAvatar student={student} size="lg" />
                </div>

                <div className="pb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {student.firstName} {student.lastName}
                  </h1>
                  <p className="text-orange-100 text-sm md:text-base flex items-center gap-2">
                    📧 {student.email}
                  </p>
                  <p className="text-orange-100 text-sm md:text-base mt-1">
                    📱 {student.phoneNo}
                  </p>
                  {student.course && (
                    <p className="text-orange-100 text-sm md:text-base mt-1 font-medium">
                      🎓 {student.course} - Year {student.year}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {!allYearsPaid && (
                <button
                  onClick={() => {
                    if (dueFee > 0) {
                      navigate(`/payment/${student._id}`);
                    } else {
                      toast.success("This year's fees are paid!");
                    }
                  }}
                  className="flex items-center justify-center gap-2 bg-white text-orange-600 font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 active:scale-95 whitespace-nowrap"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                  Pay Fees
                </button>
              )}

              {allYearsPaid && (
                <div className="flex items-center justify-center gap-2 bg-white text-emerald-600 font-bold px-6 py-3 rounded-xl shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                  All Fees Paid
                </div>
              )}
            </div>

            {/* Residency Badge */}
            <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold">
              {isHosteler ? "🏠 Hosteler" : "🏡 Day Scholar"}
            </div>
          </div>

          {/* Content Section */}
          <div className="px-6 md:px-10 py-10 -mt-24 relative z-20">
            {/* ==================== DETAILS GRID ====================*/}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {/* Parent's Details */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-100 hover:shadow-lg transition-all">
                <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                  👨‍👩‍👧 Parent's Details
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Father</p>
                    <p className="text-gray-800 font-medium mt-1">{student.fathersName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Mother</p>
                    <p className="text-gray-800 font-medium mt-1">{student.mothersName}</p>
                  </div>
                </div>
              </div>

              {/* Academic Details */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 hover:shadow-lg transition-all">
                <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                  🎓 Academic Details
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Course</p>
                    <p className="text-gray-800 font-medium mt-1">{student.course}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Year</p>
                    <p className="text-gray-800 font-medium mt-1">Year {student.year}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Total Course Fee</p>
                    <p className="text-gray-800 font-bold mt-1">₹{student.courseFee || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100 hover:shadow-lg transition-all">
                <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                  👤 Personal Info
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Gender</p>
                    <p className="text-gray-800 font-medium mt-1 capitalize">{student.gender}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Date of Birth</p>
                    <p className="text-gray-800 font-medium mt-1">{student.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Address</p>
                    <p className="text-gray-800 font-medium mt-1 line-clamp-2">{student.address}</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100 hover:shadow-lg transition-all">
                <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                  📞 Contact Info
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Email</p>
                    <p className="text-gray-800 font-medium mt-1 break-all text-sm">{student.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Phone</p>
                    <p className="text-gray-800 font-medium mt-1">{student.phoneNo}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== OVERALL FEE PROGRESS ====================*/}
            <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-orange-100 p-6 md:p-8 rounded-2xl shadow-md mb-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    📊 Overall Fee Progress
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Total course duration: {totalYears} years
                  </p>
                </div>
                <span
                  className={`mt-4 sm:mt-0 text-sm font-bold px-4 py-2 rounded-full ${feeStatusCls}`}
                >
                  {feeStatusLabel}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <StatCard
                  label="Total Course Fee"
                  value={inr(grandTotalFee)}
                  bg="bg-gray-100"
                  textColor="text-gray-800"
                  labelColor="text-gray-500"
                />
                <StatCard
                  label="Total Paid"
                  value={inr(grandTotalPaid)}
                  bg="bg-emerald-50"
                  textColor="text-emerald-700"
                  labelColor="text-emerald-500"
                />
                <StatCard
                  label={remainingTotal <= 0 ? "Status" : "Remaining"}
                  value={remainingTotal <= 0 ? "✓ Cleared" : inr(remainingTotal)}
                  bg={remainingTotal <= 0 ? "bg-emerald-50" : "bg-red-50"}
                  textColor={remainingTotal <= 0 ? "text-emerald-700" : "text-red-700"}
                  labelColor={remainingTotal <= 0 ? "text-emerald-500" : "text-red-500"}
                />
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>
                    {grandTotalFee > 0
                      ? ((grandTotalPaid / grandTotalFee) * 100).toFixed(1)
                      : 0}
                    % Paid
                  </span>
                  <span>
                    {grandTotalFee > 0
                      ? (((grandTotalFee - grandTotalPaid) / grandTotalFee) * 100).toFixed(1)
                      : 100}
                    % Remaining
                  </span>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${
                        grandTotalFee > 0
                          ? Math.min((grandTotalPaid / grandTotalFee) * 100, 100)
                          : 0
                      }%`,
                      background:
                        grandTotalPaid >= grandTotalFee
                          ? "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)"
                          : "linear-gradient(90deg, #f97316 0%, #ea580c 100%)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ==================== YEAR-WISE FEE TRACKER ====================*/}
            <div
              className="rounded-2xl overflow-hidden shadow-md mb-10 border-2"
              style={{
                borderColor: isHosteler ? "#e0e7ff" : "#d1fae5",
              }}
            >
              <div
                style={{
                  background: isHosteler
                    ? "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)"
                    : "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)",
                  padding: "20px 24px",
                  borderBottom: `1px solid ${isHosteler ? "#e0e7ff" : "#d1fae5"}`,
                }}
              >
                <h2
                  style={{
                    fontWeight: 700,
                    fontSize: "18px",
                    color: isHosteler ? "#4f46e5" : "#059669",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {isHosteler ? "🏠" : "🏡"} Year-wise Fee Tracker
                </h2>
                <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "6px", marginBottom: 0 }}>
                  Pay one year at a time • Next year unlocks automatically after payment
                </p>
              </div>

              <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {yearlyFees.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#9ca3af",
                      padding: "40px 20px",
                      background: "#fafafa",
                      borderRadius: "12px",
                    }}
                  >
                    <p style={{ fontSize: "14px", margin: 0 }}>📋 No fee records found</p>
                    <p style={{ fontSize: "12px", marginTop: "4px", margin: 0 }}>
                      Please contact the admin to set up your payment schedule
                    </p>
                  </div>
                ) : (
                  yearlyFees.map((entry, idx) => {
                    const isPaid = entry.status === "paid";
                    const isActive = entry.status === "active" || entry.status === "partial";
                    const isLocked = entry.status === "locked";
                    const entryDue = Math.max(entry.fee - entry.paidFee, 0);
                    const entryPct = entry.fee > 0 ? Math.min((entry.paidFee / entry.fee) * 100, 100) : 0;

                    return (
                      <div
                        key={entry.year}
                        style={{
                          borderRadius: "14px",
                          border: "1.5px solid",
                          borderColor: isPaid
                            ? "#d1fae5"
                            : isActive
                            ? isHosteler
                              ? "#c7d2fe"
                              : "#a7f3d0"
                            : "#e5e7eb",
                          background: isPaid
                            ? "#f0fdf4"
                            : isActive
                            ? isHosteler
                              ? "#eef2ff"
                              : "#ecfdf5"
                            : "#fafafa",
                          padding: "16px 20px",
                          opacity: isLocked ? 0.6 : 1,
                          transition: "all 0.3s ease",
                          animation:
                            isActive && entryDue > 0
                              ? `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`
                              : "none",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", flex: 1 }}>
                            <span style={{ fontSize: "24px", flexShrink: 0, marginTop: "2px" }}>
                              {isPaid ? "✅" : isActive ? "🔓" : "🔒"}
                            </span>

                            <div style={{ flex: 1 }}>
                              <p
                                style={{
                                  margin: 0,
                                  fontWeight: 700,
                                  fontSize: "15px",
                                  color: isPaid ? "#059669" : isActive ? (isHosteler ? "#4f46e5" : "#059669") : "#9ca3af",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  flexWrap: "wrap",
                                  marginBottom: "4px",
                                }}
                              >
                                Year {entry.year}
                                {isActive && (
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      background: isHosteler ? "#6366f1" : "#10b981",
                                      color: "#fff",
                                      padding: "3px 10px",
                                      borderRadius: "999px",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {entry.status === "partial" ? "Partially Paid" : "Active"}
                                  </span>
                                )}
                                {isPaid && (
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      background: "#d1fae5",
                                      color: "#059669",
                                      padding: "3px 10px",
                                      borderRadius: "999px",
                                      fontWeight: 600,
                                    }}
                                  >
                                    Completed
                                  </span>
                                )}
                                {isLocked && (
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      background: "#f3f4f6",
                                      color: "#9ca3af",
                                      padding: "3px 10px",
                                      borderRadius: "999px",
                                      fontWeight: 600,
                                    }}
                                  >
                                    Locked
                                  </span>
                                )}
                              </p>
                              <p style={{ margin: 0, fontSize: "13px", color: "#6b7280", lineHeight: "1.4" }}>
                                {isPaid
                                  ? `Fully paid • ${inr(entry.fee)}`
                                  : isActive
                                  ? `Paid ${inr(entry.paidFee)} • Due ${inr(entryDue)}`
                                  : `${inr(entry.fee)} • Unlocks after Year ${entry.year - 1}`}
                              </p>
                            </div>
                          </div>

                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <p
                              style={{
                                margin: 0,
                                fontWeight: 800,
                                fontSize: "16px",
                                color: isPaid ? "#059669" : isActive ? (isHosteler ? "#6366f1" : "#10b981") : "#d1d5db",
                              }}
                            >
                              {inr(entry.fee)}
                            </p>
                            {!isLocked && (
                              <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#9ca3af", fontWeight: 600 }}>
                                {entryPct.toFixed(0)}% paid
                              </p>
                            )}
                          </div>
                        </div>

                        {isActive && (
                          <div style={{ marginTop: "14px" }}>
                            <div
                              style={{
                                height: "6px",
                                background: "#e5e7eb",
                                borderRadius: "999px",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  height: "100%",
                                  borderRadius: "999px",
                                  background: isHosteler
                                    ? "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)"
                                    : "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                                  width: `${entryPct}%`,
                                  transition: "width 0.8s ease",
                                }}
                              />
                            </div>
                            {entryDue > 0 && (
                              <button
                                onClick={() => navigate(`/payment/${student._id}`)}
                                style={{
                                  marginTop: "12px",
                                  width: "100%",
                                  padding: "11px",
                                  borderRadius: "10px",
                                  background: isHosteler
                                    ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                                    : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                  color: "#fff",
                                  fontWeight: 700,
                                  fontSize: "14px",
                                  border: "none",
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.transform = "translateY(-2px)";
                                  e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.transform = "translateY(0)";
                                  e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                                }}
                              >
                                Pay {inr(entryDue)} for Year {entry.year} →
                              </button>
                            )}
                          </div>
                        )}

                        {isPaid && (
                          <div style={{ marginTop: "12px" }}>
                            <div
                              style={{
                                height: "5px",
                                background: "#d1fae5",
                                borderRadius: "999px",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  height: "100%",
                                  width: "100%",
                                  background: "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)",
                                  borderRadius: "999px",
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {allYearsPaid && (
                <div
                  style={{
                    margin: "0 24px 20px",
                    padding: "20px",
                    background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
                    borderRadius: "14px",
                    border: "1px solid #a7f3d0",
                    textAlign: "center",
                  }}
                >
                  <p style={{ fontSize: "28px", margin: "0 0 8px" }}>🎉</p>
                  <p style={{ margin: 0, fontWeight: 700, color: "#059669", fontSize: "16px" }}>
                    All fees cleared!
                  </p>
                  <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#6ee7b7" }}>
                    Total paid: {inr(grandTotalPaid)} • No pending dues
                  </p>
                </div>
              )}
            </div>

            {/* ==================== CURRENT YEAR FEE STATUS ====================*/}
            {!allYearsPaid && activeEntry && (
              <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-orange-100 p-6 md:p-8 rounded-2xl shadow-md mb-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      💳 Fee Status — Year {activeEntry.year}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {isHosteler ? "Hosteler (Full Fee)" : `Day Scholar (30% Discount)`}
                    </p>
                  </div>
                  <span className={`mt-4 sm:mt-0 text-sm font-bold px-4 py-2 rounded-full ${feeStatusCls}`}>
                    {feeStatusLabel}
                  </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <StatCard
                    label="Year Fee"
                    value={inr(totalDue)}
                    bg="bg-gray-100"
                    textColor="text-gray-800"
                    labelColor="text-gray-500"
                  />
                  <StatCard
                    label="Paid"
                    value={inr(paidFeeActive)}
                    bg="bg-emerald-50"
                    textColor="text-emerald-700"
                    labelColor="text-emerald-500"
                  />
                  <StatCard
                    label={dueFee <= 0 ? "Status" : "Remaining"}
                    value={dueFee <= 0 ? "✓ Paid" : inr(dueFee)}
                    bg={dueFee <= 0 ? "bg-emerald-50" : "bg-red-50"}
                    textColor={dueFee <= 0 ? "text-emerald-700" : "text-red-700"}
                    labelColor={dueFee <= 0 ? "text-emerald-500" : "text-red-500"}
                  />
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>{pct.toFixed(1)}% Paid</span>
                    <span>{(100 - pct).toFixed(1)}% Remaining</span>
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${pct}%`,
                        background:
                          pct >= 100
                            ? "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)"
                            : "linear-gradient(90deg, #f97316 0%, #ea580c 100%)",
                      }}
                    />
                  </div>
                </div>

                {dueFee > 0 && (
                  <button
                    onClick={() => navigate(`/payment/${student._id}`)}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                  >
                    Pay {inr(dueFee)} Now →
                  </button>
                )}
              </div>
            )}

            {/* ==================== EDIT PROFILE BUTTON ====================*/}
            <div className="flex justify-center">
              <button
                onClick={() => navigate(`/updateUser/${student._id}`)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-8 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Footer spacing */}
        <div className="h-16" />
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}

export default ProfilePage;