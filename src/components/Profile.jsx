import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../utils/Config";

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
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(n ?? 0);

function ProfilePage() {
  const navigate = useNavigate();

  // ── Only trust the _id from localStorage, fetch everything else live ──────
  const storedRaw = JSON.parse(localStorage.getItem("studentDet") || "{}");
  const studentId = storedRaw?._id;

  const [student,  setStudent]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  useEffect(() => {
    if (!studentId) {
      setError("Session expired. Please log in again.");
      setLoading(false);
      return;
    }
    setLoading(true);
    axios
      .get(`${BASE_URL}/student/get-one-student/${studentId}`, { withCredentials: true })
      .then((res) => {
        if (res.data?.success) {
          setStudent(res.data.student);
          // Keep localStorage in sync (for other pages that might need it)
          localStorage.setItem("studentDet", JSON.stringify(res.data.student));
        } else {
          setError("Failed to load student data.");
        }
      })
      .catch(() => setError("Network error. Please try again."))
      .finally(() => setLoading(false));
  }, [studentId]);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 font-medium text-sm">Loading profile…</p>
      </div>
    </div>
  );

  if (error || !student) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-gray-700 font-semibold mb-4">{error || "Student not found."}</p>
        <button onClick={() => navigate("/login")}
          className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-semibold text-sm hover:bg-orange-600 cursor-pointer transition-colors">
          Go to Login
        </button>
      </div>
    </div>
  );

  // ── All derived data comes from fresh API response ────────────────────────
  const isHosteler = student.residencyType === "hosteler";
  const { selectedPerYear, discount, totalYears } = calculateFees(student.course, student.residencyType);

  const yearlyFees   = student.yearlyFees || [];
  const activeEntry  = yearlyFees.find((y) => y.status === "active" || y.status === "partial");
  const allYearsPaid = yearlyFees.length > 0 && yearlyFees.every((y) => y.status === "paid");

  const totalDue       = activeEntry?.fee    ?? 0;
  const paidFeeActive  = activeEntry?.paidFee ?? 0;
  const dueFee         = Math.max(totalDue - paidFeeActive, 0);
  const pct            = totalDue > 0 ? Math.min((paidFeeActive / totalDue) * 100, 100) : 0;

  const grandTotalPaid = yearlyFees.reduce((acc, y) => acc + (y.paidFee || 0), 0);
  const grandTotalFee  = selectedPerYear * totalYears;

  const feeStatusLabel =
    allYearsPaid        ? "ALL PAID"  :
    dueFee <= 0         ? "YEAR PAID" :
    paidFeeActive > 0   ? "PARTIAL"   : "UNPAID";

  const feeStatusCls =
    allYearsPaid || dueFee <= 0 ? "bg-emerald-100 text-emerald-700" :
    paidFeeActive > 0           ? "bg-orange-100 text-orange-600"   :
                                  "bg-red-100 text-red-600";

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl p-6 md:p-10">
<<<<<<< HEAD
        {/* Header Section */}
=======

        {/* ── Header ─────────────────────────────────────────────────────── */}
>>>>>>> 589774a (Payment Page Added Successfully!)
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-8 mb-8 text-center sm:text-left">
          <img
            src={student.profilePic || "/default-avatar.png"} alt="Profile"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-orange-500 shadow-md"
          />
          <div className="mt-4 sm:mt-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {student.firstName} {student.lastName}
            </h1>
<<<<<<< HEAD
            <p className="text-gray-500 text-sm sm:text-base mt-1">
              {student.email}
            </p>
            <p className="text-gray-500 text-sm sm:text-base">
              📞 {student.phoneNo}
            </p>
=======
            <p className="text-gray-500 text-sm mt-1">{student.email}</p>
            <p className="text-gray-500 text-sm">📞 {student.phoneNo}</p>
            <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap", justifyContent: "center" }}
              className="sm:justify-start">
              <span style={{
                fontSize: "12px", fontWeight: 700, padding: "3px 12px", borderRadius: "999px",
                background: isHosteler ? "rgba(99,102,241,0.1)" : "rgba(16,185,129,0.1)",
                color: isHosteler ? "#6366f1" : "#10b981",
                border: `1px solid ${isHosteler ? "rgba(99,102,241,0.2)" : "rgba(16,185,129,0.2)"}`,
              }}>
                {isHosteler ? "🏠 Hosteler" : "🏡 Day Scholar"}
                {!isHosteler && <span style={{ marginLeft: "6px", opacity: 0.8 }}>· 30% off</span>}
              </span>
              <span style={{
                fontSize: "12px", fontWeight: 700, padding: "3px 12px", borderRadius: "999px",
                background: "rgba(99,102,241,0.08)", color: "#4f46e5", border: "1px solid rgba(99,102,241,0.15)",
              }}>
                📅 Current: {student.currentYear || "1st"} Year
              </span>
            </div>
>>>>>>> 589774a (Payment Page Added Successfully!)
          </div>

          {!allYearsPaid && (
            <button
              onClick={() => navigate(`/payment/${student._id}`)}
              className="cursor-pointer mt-4 sm:mt-0 flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg active:scale-95 transition-all duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              Pay Fees
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
<<<<<<< HEAD
          {/* Parent Details */}
          <div className="bg-orange-50 p-5 rounded-lg shadow-sm hover:shadow-md transition">
            <h2 className="font-semibold text-gray-700 mb-3 text-lg">
              👨‍👩‍👧 Parent's Details
            </h2>
            <p className="text-gray-700">
              <span className="font-medium">Father:</span> {student.fathersName}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Mother:</span> {student.mothersName}
            </p>
          </div>

          {/* Academic Details */}
          <div className="bg-orange-50 p-5 rounded-lg shadow-sm hover:shadow-md transition">
            <h2 className="font-semibold text-gray-700 mb-3 text-lg">
              🎓 Academic Details
            </h2>
            <p className="text-gray-700">
              <span className="font-medium">Course:</span> {student.course}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Year:</span> {student.year}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">
                Total{" "}
                {student.course === "MBA" || student.course === "M.Tech"
                  ? "2"
                  : student.course === "B.Tech"
                    ? "4"
                    : student.course === "Diploma"
                      ? "3"
                      : ""}{" "}
                Year Course Fee:
              </span>{" "}
              ₹{student.courseFee || "N/A"}
=======

          {/* Parent Details */}
          <div className="bg-orange-50 p-5 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="font-semibold text-gray-700 mb-3 text-lg">👨‍👩‍👧 Parent's Details</h2>
            <p className="text-gray-700"><span className="font-medium">Father:</span> {student.fathersName}</p>
            <p className="text-gray-700"><span className="font-medium">Mother:</span> {student.mothersName}</p>
          </div>

          {/* Academic Details */}
          <div className="bg-orange-50 p-5 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="font-semibold text-gray-700 mb-3 text-lg">🎓 Academic Details</h2>
            <p className="text-gray-700"><span className="font-medium">Course:</span> {student.course} ({totalYears} Years)</p>
            <p className="text-gray-700"><span className="font-medium">Current Year:</span> {student.currentYear || "1st"}</p>
            <p className="text-gray-700"><span className="font-medium">Residency:</span> {isHosteler ? "🏠 Hosteler" : "🏡 Day Scholar"}</p>
            <p className="text-gray-700"><span className="font-medium">Fee / Year:</span> {inr(selectedPerYear)}</p>
            <p className="text-gray-700">
              <span className="font-medium">Total Course Fee:</span> {inr(grandTotalFee)}
              {!isHosteler && (
                <span className="ml-2 text-xs text-emerald-600 font-semibold">
                  (saves {inr(discount * totalYears)} total)
                </span>
              )}
>>>>>>> 589774a (Payment Page Added Successfully!)
            </p>
          </div>

          {/* Personal Info */}
<<<<<<< HEAD
          <div className="bg-orange-50 p-5 rounded-lg shadow-sm hover:shadow-md transition">
            <h2 className="font-semibold text-gray-700 mb-3 text-lg">
              🧍 Personal Info
            </h2>
            <p className="text-gray-700">
              <span className="font-medium">Gender:</span> {student.gender}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">DOB:</span> {student.dateOfBirth}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Address:</span> {student.address}
            </p>
          </div>

          {/* Contact Info */}
          <div className="bg-orange-50 p-5 rounded-lg shadow-sm hover:shadow-md transition">
            <h2 className="font-semibold text-gray-700 mb-3 text-lg">
              📧 Contact Info
            </h2>
            <p className="text-gray-700">
              <span className="font-medium">Email:</span> {student.email}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Phone:</span> {student.phoneNo}
            </p>
=======
          <div className="bg-orange-50 p-5 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="font-semibold text-gray-700 mb-3 text-lg">🧍 Personal Info</h2>
            <p className="text-gray-700"><span className="font-medium">Gender:</span> {student.gender}</p>
            <p className="text-gray-700"><span className="font-medium">DOB:</span> {student.dateOfBirth}</p>
            <p className="text-gray-700"><span className="font-medium">Address:</span> {student.address}</p>
          </div>

          {/* Contact Info */}
          <div className="bg-orange-50 p-5 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="font-semibold text-gray-700 mb-3 text-lg">📧 Contact Info</h2>
            <p className="text-gray-700"><span className="font-medium">Email:</span> {student.email}</p>
            <p className="text-gray-700"><span className="font-medium">Phone:</span> {student.phoneNo}</p>
>>>>>>> 589774a (Payment Page Added Successfully!)
          </div>

          {/* ── Overall Progress ─────────────────────────────────────────── */}
          <div className="sm:col-span-2 bg-white border-2 border-orange-100 p-5 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-gray-700 text-lg">📊 Overall Fee Progress</h2>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${feeStatusCls}`}>
                {feeStatusLabel}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { label: "Total Course Fee",   value: inr(grandTotalFee),                              bg: "bg-gray-50",    text: "text-gray-700"    },
                { label: "Grand Total Paid",    value: inr(grandTotalPaid),                             bg: "bg-emerald-50", text: "text-emerald-600", labelCls: "text-emerald-500" },
                {
                  label: grandTotalFee - grandTotalPaid <= 0 ? "Cleared ✓" : "Remaining",
                  value: inr(Math.max(grandTotalFee - grandTotalPaid, 0)),
                  bg:   grandTotalFee - grandTotalPaid <= 0 ? "bg-emerald-50" : "bg-red-50",
                  text: grandTotalFee - grandTotalPaid <= 0 ? "text-emerald-600" : "text-red-500",
                  labelCls: grandTotalFee - grandTotalPaid <= 0 ? "text-emerald-500" : "text-red-400",
                },
              ].map(({ label, value, bg, text, labelCls }) => (
                <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                  <p className={`text-xs ${labelCls || "text-gray-400"} mb-1`}>{label}</p>
                  <p className={`text-base font-extrabold ${text}`}>{value}</p>
                </div>
              ))}
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>{grandTotalFee > 0 ? ((grandTotalPaid / grandTotalFee) * 100).toFixed(0) : 0}% paid</span>
                <span>{grandTotalFee > 0 ? (((grandTotalFee - grandTotalPaid) / grandTotalFee) * 100).toFixed(0) : 100}% remaining</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{
                  width: `${grandTotalFee > 0 ? Math.min((grandTotalPaid / grandTotalFee) * 100, 100) : 0}%`,
                  background: grandTotalPaid >= grandTotalFee
                    ? "linear-gradient(90deg,#22c55e,#16a34a)"
                    : "linear-gradient(90deg,#f97316,#ea580c)",
                }} />
              </div>
            </div>
          </div>

          {/* ── Year-wise Fee Tracker ─────────────────────────────────────── */}
          <div className="sm:col-span-2 rounded-xl border overflow-hidden shadow-sm"
            style={{ borderColor: isHosteler ? "#e0e7ff" : "#d1fae5" }}>

            <div style={{
              background: isHosteler
                ? "linear-gradient(135deg,#eef2ff,#f5f3ff)"
                : "linear-gradient(135deg,#ecfdf5,#f0fdf4)",
              padding: "16px 20px",
              borderBottom: `1px solid ${isHosteler ? "#e0e7ff" : "#d1fae5"}`,
            }}>
              <h2 style={{ fontWeight: 700, fontSize: "15px", color: isHosteler ? "#4f46e5" : "#059669", margin: 0 }}>
                {isHosteler ? "🏠 Year-wise Fee Tracker" : "🏡 Year-wise Fee Tracker"}
              </h2>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "3px", marginBottom: 0 }}>
                {student.course} · {inr(selectedPerYear)}/yr · Pay one year at a time — next year unlocks automatically
              </p>
            </div>

            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {yearlyFees.length === 0 ? (
                <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "13px", padding: "20px 0" }}>
                  No fee records found. Please contact admin.
                </p>
              ) : yearlyFees.map((entry) => {
                const isPaid   = entry.status === "paid";
                const isActive = entry.status === "active" || entry.status === "partial";
                const isLocked = entry.status === "locked";
                const entryDue = Math.max(entry.fee - entry.paidFee, 0);
                const entryPct = entry.fee > 0 ? Math.min((entry.paidFee / entry.fee) * 100, 100) : 0;

                return (
                  <div key={entry.year} style={{
                    borderRadius: "12px", border: "1px solid",
                    borderColor: isPaid ? "#d1fae5" : isActive ? (isHosteler ? "#c7d2fe" : "#a7f3d0") : "#e5e7eb",
                    background:  isPaid ? "#f0fdf4" : isActive ? (isHosteler ? "#eef2ff" : "#ecfdf5") : "#fafafa",
                    padding: "14px 16px", opacity: isLocked ? 0.5 : 1, transition: "all 0.2s",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "22px" }}>
                          {isPaid ? "✅" : isActive ? "🔓" : "🔒"}
                        </span>
                        <div>
                          <p style={{
                            margin: 0, fontWeight: 700, fontSize: "14px",
                            color: isPaid ? "#059669" : isActive ? (isHosteler ? "#4f46e5" : "#059669") : "#9ca3af",
                            display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap",
                          }}>
                            {entry.year} Year
                            {isActive && (
                              <span style={{ fontSize: "11px", background: isHosteler ? "#6366f1" : "#10b981", color: "#fff", padding: "1px 8px", borderRadius: "999px" }}>
                                {entry.status === "partial" ? "Partially Paid" : "Active"}
                              </span>
                            )}
                            {isPaid && <span style={{ fontSize: "11px", background: "#d1fae5", color: "#059669", padding: "1px 8px", borderRadius: "999px" }}>Completed</span>}
                            {isLocked && <span style={{ fontSize: "11px", background: "#f3f4f6", color: "#9ca3af", padding: "1px 8px", borderRadius: "999px" }}>Locked</span>}
                          </p>
                          <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
                            {isPaid
                              ? `Fully paid — ${inr(entry.fee)}`
                              : isActive
                              ? `Paid ${inr(entry.paidFee)} · Due ${inr(entryDue)}`
                              : `${inr(entry.fee)} — unlocks after previous year is paid`}
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <span style={{
                          fontWeight: 800, fontSize: "16px",
                          color: isPaid ? "#059669" : isActive ? (isHosteler ? "#6366f1" : "#10b981") : "#d1d5db",
                        }}>
                          {inr(entry.fee)}
                        </span>
                        {!isLocked && <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af" }}>{entryPct.toFixed(0)}% paid</p>}
                      </div>
                    </div>

                    {isActive && (
                      <div style={{ marginTop: "12px" }}>
                        <div style={{ height: "6px", background: "#e5e7eb", borderRadius: "999px", overflow: "hidden" }}>
                          <div style={{
                            height: "100%", borderRadius: "999px",
                            background: isHosteler ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : "linear-gradient(90deg,#10b981,#059669)",
                            width: `${entryPct}%`, transition: "width 0.6s",
                          }} />
                        </div>
                        {entryDue > 0 && (
                          <button onClick={() => navigate(`/payment/${student._id}`)} style={{
                            marginTop: "10px", width: "100%", padding: "9px", borderRadius: "8px",
                            background: isHosteler ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "linear-gradient(135deg,#10b981,#059669)",
                            color: "#fff", fontWeight: 700, fontSize: "13px", border: "none", cursor: "pointer",
                          }}>
                            Pay {inr(entryDue)} for {entry.year} Year →
                          </button>
                        )}
                      </div>
                    )}

                    {isPaid && (
                      <div style={{ marginTop: "10px" }}>
                        <div style={{ height: "5px", background: "#d1fae5", borderRadius: "999px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: "100%", background: "linear-gradient(90deg,#22c55e,#16a34a)", borderRadius: "999px" }} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {allYearsPaid && (
              <div style={{ margin: "0 20px 20px", padding: "16px", background: "linear-gradient(135deg,#ecfdf5,#d1fae5)", borderRadius: "12px", border: "1px solid #a7f3d0", textAlign: "center" }}>
                <p style={{ fontSize: "24px", margin: "0 0 6px" }}>🎉</p>
                <p style={{ margin: 0, fontWeight: 700, color: "#059669", fontSize: "15px" }}>All fees cleared!</p>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#6ee7b7" }}>
                  Total paid: {inr(grandTotalPaid)} · No pending dues
                </p>
              </div>
            )}
          </div>

          {/* ── Current Year Fee Status ──────────────────────────────────── */}
          {!allYearsPaid && activeEntry && (
            <div className="sm:col-span-2 bg-white border-2 border-orange-100 p-5 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-gray-700 text-lg">
                    💳 Fee Status — {activeEntry.year} Year
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Current year fee: {inr(activeEntry.fee)} ·{" "}
                    {isHosteler ? "Hosteler (full)" : `Day Scholar (30% off, saves ${inr(discount)})`}
                  </p>
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${feeStatusCls}`}>
                  {feeStatusLabel}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400 mb-1">This Year's Fee</p>
                  <p className="text-base font-extrabold text-gray-700">{inr(totalDue)}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-emerald-500 mb-1">Paid</p>
                  <p className="text-base font-extrabold text-emerald-600">{inr(paidFeeActive)}</p>
                </div>
                <div className={`rounded-xl p-3 text-center ${dueFee <= 0 ? "bg-emerald-50" : "bg-red-50"}`}>
                  <p className={`text-xs mb-1 ${dueFee <= 0 ? "text-emerald-500" : "text-red-400"}`}>
                    {dueFee <= 0 ? "Cleared ✓" : "Remaining"}
                  </p>
                  <p className={`text-base font-extrabold ${dueFee <= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {inr(dueFee)}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>{pct.toFixed(0)}% paid</span>
                  <span>{(100 - pct).toFixed(0)}% remaining</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{
                    width: `${pct}%`,
                    background: pct >= 100
                      ? "linear-gradient(90deg,#22c55e,#16a34a)"
                      : "linear-gradient(90deg,#f97316,#ea580c)",
                  }} />
                </div>
              </div>

              {dueFee > 0 && (
                <button
                  onClick={() => navigate(`/payment/${student._id}`)}
                  className="mt-4 w-full cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md text-sm"
                >
                  Pay {inr(dueFee)} Now →
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => navigate(`/updateUser/${student._id}`)}
            className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            ✏️ Edit Profile
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProfilePage;