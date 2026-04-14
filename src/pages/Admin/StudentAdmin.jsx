import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {BASE_URL} from "../../utils/Config";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

const inr = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n ?? 0);

const getYearColor = (year) => {
  const map = {
    "1st": { bg: "#dcfce7", text: "#15803d", border: "#86efac" },
    "2nd": { bg: "#dbeafe", text: "#1d4ed8", border: "#93c5fd" },
    "3rd": { bg: "#fef9c3", text: "#a16207", border: "#fde047" },
    "4th": { bg: "#f3e8ff", text: "#7e22ce", border: "#d8b4fe" },
  };
  return map[year] ?? { bg: "#f3f4f6", text: "#6b7280", border: "#d1d5db" };
};

const dotStyle = (status) => {
  const map = {
    paid:    { bg: "#22c55e", border: "#16a34a", text: "#fff" },
    active:  { bg: "#6366f1", border: "#4f46e5", text: "#fff" },
    partial: { bg: "#f97316", border: "#ea580c", text: "#fff" },
    locked:  { bg: "#e5e7eb", border: "#d1d5db", text: "#9ca3af" },
  };
  return map[status] ?? map.locked;
};

const getStatusBadge = (yearlyFees = []) => {
  const allPaid = yearlyFees.length > 0 && yearlyFees.every((y) => y.status === "paid");
  if (allPaid) return { label: "All Paid", bg: "#dcfce7", text: "#15803d" };
  if (yearlyFees.find((y) => y.status === "partial")) return { label: "Partial", bg: "#ffedd5", text: "#c2410c" };
  if (yearlyFees.find((y) => y.status === "active"))  return { label: "Unpaid",  bg: "#fee2e2", text: "#b91c1c" };
  return { label: "—", bg: "#f3f4f6", text: "#6b7280" };
};

const getGrandTotalPaid = (yearlyFees = []) =>
  yearlyFees.reduce((acc, y) => acc + (y.paidFee || 0), 0);

const StudentAdmin = () => {
  const [studentDet, setStudentDet]   = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading]         = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/student/all-student`, { withCredentials: true })
      .then((res) => setStudentDet(res?.data?.student || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(`Delete student with ID: ${id}?`);
    if (!isConfirmed) return;
    try {
      const res = await axios.delete(`${BASE_URL}/student/delete-student/${id}`, {
        withCredentials: true,
      });
      if (res.data?.success) {
        toast.success(res.data?.message);
        setStudentDet((prev) => prev.filter((s) => s._id !== id));
      }
    } catch {
      toast.error("Failed to delete student");
    }
  };

  const filtered = studentDet.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.course?.toLowerCase().includes(q) ||
      String(s.phoneNo).includes(q)
    );
  });

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalCollected = studentDet.reduce((acc, s) => acc + getGrandTotalPaid(s.yearlyFees || []), 0);
  const fullyPaid      = studentDet.filter((s) => (s.yearlyFees || []).length > 0 && (s.yearlyFees || []).every((y) => y.status === "paid")).length;
  const partialCount   = studentDet.filter((s) => (s.yearlyFees || []).some((y) => y.status === "partial")).length;

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "4px solid #e0e7ff", borderTop: "4px solid #6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        <p style={{ color: "#94a3b8", fontSize: 14 }}>Loading students…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (studentDet.length === 0) return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
      <span style={{ fontSize: 56 }}>🎓</span>
      <h2 style={{ color: "#475569", margin: 0 }}>No students found</h2>
      <p style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>Students will appear here once registered.</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "28px 20px", fontFamily: "inherit" }}>
      <div style={{ maxWidth: 1380, margin: "0 auto" }}>

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: 0 }}>
            🎓 Student Management
          </h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "5px 0 0" }}>
            View and manage all enrolled students and their year-wise fee progress
          </p>
        </div>

        {/* ── Summary cards ───────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
          {[
            { label: "Total Students",   value: studentDet.length, icon: "👥", accent: "#6366f1", light: "#eef2ff" },
            { label: "Fully Paid",        value: fullyPaid,         icon: "✅", accent: "#16a34a", light: "#dcfce7" },
            { label: "Partial Payment",   value: partialCount,      icon: "⏳", accent: "#ea580c", light: "#ffedd5" },
            { label: "Total Collected",   value: inr(totalCollected), icon: "💰", accent: "#b45309", light: "#fef3c7" },
          ].map(({ label, value, icon, accent, light }) => (
            <div key={label} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "16px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600, letterSpacing: "0.02em" }}>{label}</span>
                <div style={{ width: 34, height: 34, background: light, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>
                  {icon}
                </div>
              </div>
              <p style={{ fontSize: 24, fontWeight: 800, color: accent, margin: 0, lineHeight: 1 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── Search bar ──────────────────────────────────────────────────── */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <span style={{ fontSize: 16, color: "#94a3b8", flexShrink: 0 }}>🔍</span>
          <input
            type="text"
            placeholder="Search by name, email, course or phone…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1, border: "none", outline: "none", fontSize: 13,
              color: "#334155", background: "transparent",
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 18, lineHeight: 1, padding: 0 }}>
              ×
            </button>
          )}
          <span style={{ fontSize: 12, color: "#94a3b8", flexShrink: 0, borderLeft: "1px solid #e2e8f0", paddingLeft: 12 }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Table card ──────────────────────────────────────────────────── */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>

          {/* Scrollable wrapper */}
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 980 }}>

              {/* THEAD */}
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {[
                    { label: "#",             align: "left"   },
                    { label: "Student",       align: "left"   },
                    { label: "Phone",         align: "left"   },
                    { label: "Course",        align: "left"   },
                    { label: "Current Year",  align: "left"   },
                    { label: "Year Progress", align: "left"   },
                    { label: "Fee / Year",    align: "right"  },
                    { label: "Total Paid",    align: "right"  },
                    { label: "Status",        align: "center" },
                    { label: "Actions",       align: "center" },
                  ].map(({ label, align }) => (
                    <th key={label} style={{
                      padding: "13px 18px",
                      textAlign: align,
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#64748b",
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      borderBottom: "2px solid #e2e8f0",
                      whiteSpace: "nowrap",
                    }}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* TBODY */}
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ padding: "60px 16px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                      No students match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((student, index) => {
                    const yearlyFees     = student.yearlyFees || [];
                    const activeEntry    = yearlyFees.find((y) => y.status === "active" || y.status === "partial");
                    const totalYears     = yearlyFees.length;
                    const paidYears      = yearlyFees.filter((y) => y.status === "paid").length;
                    const grandTotalPaid = getGrandTotalPaid(yearlyFees);
                    const totalFee       = (student.courseFee || 0) * totalYears;
                    const overallPct     = totalFee > 0 ? Math.min((grandTotalPaid / totalFee) * 100, 100) : 0;
                    const { label: statusLabel, bg: sBg, text: sText } = getStatusBadge(yearlyFees);
                    const currentYear = student.currentYear || activeEntry?.year || "1st";
                    const yc          = getYearColor(currentYear);
                    const isHosteler  = student.residencyType === "hosteler";

                    return (
                      <tr key={student._id}
                        style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.12s" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#fafbff"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >

                        {/* # */}
                        <td style={{ padding: "14px 18px", fontSize: 13, color: "#94a3b8", fontWeight: 600, whiteSpace: "nowrap" }}>
                          {index + 1}
                        </td>

                        {/* Student */}
                        <td style={{ padding: "14px 18px", whiteSpace: "nowrap" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                            <img
                              src={
                                student.profilePic ||
                                `https://avatar.iran.liara.run/public/${student.gender === "female" ? "girl" : "boy"}?username=${student.firstName}`
                              }
                              alt={student.firstName}
                              style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "2px solid #e2e8f0", flexShrink: 0 }}
                            />
                            <div>
                              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#0f172a", lineHeight: 1.3 }}>
                                {student.firstName} {student.lastName}
                              </p>
                              <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                                {student.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td style={{ padding: "14px 18px", fontSize: 13, color: "#475569", whiteSpace: "nowrap" }}>
                          {student.phoneNo}
                        </td>

                        {/* Course + Residency */}
                        <td style={{ padding: "14px 18px", whiteSpace: "nowrap" }}>
                          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                            {student.course}
                          </p>
                          <span style={{
                            display: "inline-block", marginTop: 5,
                            fontSize: 10, fontWeight: 700,
                            padding: "3px 9px", borderRadius: 999,
                            background: isHosteler ? "#eef2ff" : "#ecfdf5",
                            color: isHosteler ? "#4f46e5" : "#15803d",
                            border: `1.5px solid ${isHosteler ? "#c7d2fe" : "#86efac"}`,
                          }}>
                            {isHosteler ? "🏠 Hosteler" : "🏡 Day Scholar"}
                          </span>
                        </td>

                        {/* Current Year */}
                        <td style={{ padding: "14px 18px", whiteSpace: "nowrap" }}>
                          <span style={{
                            display: "inline-block",
                            padding: "5px 14px", borderRadius: 999,
                            fontSize: 12, fontWeight: 700,
                            background: yc.bg, color: yc.text,
                            border: `1.5px solid ${yc.border}`,
                          }}>
                            {currentYear} Year
                          </span>
                        </td>

                        {/* Year Progress */}
                        <td style={{ padding: "14px 18px", whiteSpace: "nowrap" }}>
                          {totalYears > 0 ? (
                            <div>
                              {/* Dots */}
                              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
                                {yearlyFees.map((y) => {
                                  const ds = dotStyle(y.status);
                                  return (
                                    <div key={y.year}
                                      title={`${y.year} yr — ${y.status} — paid: ${inr(y.paidFee)} / ${inr(y.fee)}`}
                                      style={{
                                        width: 28, height: 28, borderRadius: "50%",
                                        background: ds.bg, border: `2px solid ${ds.border}`,
                                        color: ds.text,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 10, fontWeight: 800, cursor: "default",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                      }}>
                                      {y.status === "paid" ? "✓" : y.yearNum}
                                    </div>
                                  );
                                })}
                              </div>
                              {/* Stats */}
                              <p style={{ margin: 0, fontSize: 10, color: "#94a3b8", marginBottom: 4 }}>
                                {paidYears}/{totalYears} yrs completed
                              </p>
                              {/* Progress bar */}
                              <div style={{ width: 88, height: 6, background: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
                                <div style={{
                                  height: "100%", borderRadius: 999,
                                  width: `${overallPct}%`,
                                  background: overallPct >= 100
                                    ? "linear-gradient(90deg,#22c55e,#16a34a)"
                                    : "linear-gradient(90deg,#f97316,#ea580c)",
                                  transition: "width 0.5s ease",
                                }} />
                              </div>
                              <p style={{ margin: "3px 0 0", fontSize: 10, color: "#94a3b8" }}>
                                {overallPct.toFixed(0)}%
                              </p>
                            </div>
                          ) : (
                            <span style={{ fontSize: 12, color: "#94a3b8" }}>—</span>
                          )}
                        </td>

                        {/* Fee / Year */}
                        <td style={{ padding: "14px 18px", textAlign: "right", whiteSpace: "nowrap" }}>
                          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                            {student.courseFee ? inr(student.courseFee) : "—"}
                          </p>
                          <p style={{ margin: 0, fontSize: 10, color: "#94a3b8", marginTop: 2 }}>per year</p>
                        </td>

                        {/* Total Paid */}
                        <td style={{ padding: "14px 18px", textAlign: "right", whiteSpace: "nowrap" }}>
                          <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#16a34a" }}>
                            {inr(grandTotalPaid)}
                          </p>
                          {totalFee > 0 && (
                            <p style={{ margin: 0, fontSize: 10, color: "#94a3b8", marginTop: 2 }}>
                              of {inr(totalFee)}
                            </p>
                          )}
                        </td>

                        {/* Status */}
                        <td style={{ padding: "14px 18px", textAlign: "center", whiteSpace: "nowrap" }}>
                          <span style={{
                            display: "inline-block",
                            padding: "5px 14px", borderRadius: 999,
                            fontSize: 11, fontWeight: 700,
                            background: sBg, color: sText,
                          }}>
                            {statusLabel}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: "14px 18px", textAlign: "center", whiteSpace: "nowrap" }}>
                          <div style={{ display: "inline-flex", gap: 8 }}>
                            <button
                              onClick={() => navigate(`/admin/adminEdit/${student._id}`)}
                              style={{
                                display: "flex", alignItems: "center", gap: 6,
                                padding: "8px 14px", borderRadius: 8, border: "none",
                                background: "#fef9c3", color: "#92400e",
                                fontSize: 12, fontWeight: 700, cursor: "pointer",
                                transition: "all 0.15s", whiteSpace: "nowrap",
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "#fde047"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "#fef9c3"; }}
                            >
                              <FaEdit size={11} /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(student._id)}
                              style={{
                                display: "flex", alignItems: "center", gap: 6,
                                padding: "8px 14px", borderRadius: 8, border: "none",
                                background: "#fee2e2", color: "#991b1b",
                                fontSize: 12, fontWeight: 700, cursor: "pointer",
                                transition: "all 0.15s", whiteSpace: "nowrap",
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "#fca5a5"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "#fee2e2"; }}
                            >
                              <FaTrash size={11} /> Delete
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ── Table footer / legend ────────────────────────────────────── */}
          <div style={{ borderTop: "1px solid #f1f5f9", padding: "12px 20px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>Year dots:</span>
              {[
                { label: "Paid",    bg: "#22c55e" },
                { label: "Active",  bg: "#6366f1" },
                { label: "Partial", bg: "#f97316" },
                { label: "Locked",  bg: "#d1d5db" },
              ].map(({ label, bg }) => (
                <span key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#64748b" }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: bg, display: "inline-block" }} />
                  {label}
                </span>
              ))}
            </div>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>
              Hover dots to see year details
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentAdmin;