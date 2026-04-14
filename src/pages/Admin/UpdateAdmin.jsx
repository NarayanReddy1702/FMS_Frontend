import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {BASE_URL} from "../../utils/Config";

const COURSE_CONFIG = {
  "B.Tech":  { totalFee: 500000,  totalYears: 4 },
  "MBA":     { totalFee: 1000000, totalYears: 2 },
  "M.Tech":  { totalFee: 400000,  totalYears: 2 },
  "Diploma": { totalFee: 350000,  totalYears: 3 },
};

const inr = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(n ?? 0);

const UpdateAdmin = () => {
  const loggedUser = JSON.parse(localStorage.getItem("userDet"));
  const { id } = useParams();
  const navigate = useNavigate();

  const [studentDet, setStudentDet] = useState(null);
  const [formData, setFormData] = useState({
    firstName:     "",
    lastName:      "",
    fathersName:   "",
    mothersName:   "",
    phoneNo:       "",
    course:        "",
    residencyType: "",
    manualFee:     "",
    email:         "",
    gender:        "",
    dateOfBirth:   "",
    address:       "",
  });
  const [loading, setLoading]     = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch student ─────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/student/get-one-student/${id}`, { withCredentials: true })
      .then((res) => {
        if (res.data?.success) {
          setStudentDet(res.data.student);
        } else {
          toast.error("Failed to fetch student data");
        }
      })
      .catch(() => toast.error("Error fetching student data"))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Populate form when student data loads ─────────────────────────────────
  useEffect(() => {
    if (studentDet) {
      setFormData({
        firstName:     studentDet.firstName     || "",
        lastName:      studentDet.lastName      || "",
        fathersName:   studentDet.fathersName   || "",
        mothersName:   studentDet.mothersName   || "",
        phoneNo:       studentDet.phoneNo       || "",
        course:        studentDet.course        || "",
        residencyType: studentDet.residencyType || "",
        manualFee:     "",   // leave blank = auto-calculate from course + residency
        email:         studentDet.email         || "",
        gender:        studentDet.gender        || "",
        dateOfBirth:   studentDet.dateOfBirth   || "",
        address:       studentDet.address       || "",
      });
    }
  }, [studentDet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...formData };
      // If admin left manualFee blank, don't send it (backend auto-calculates)
      if (!payload.manualFee) delete payload.manualFee;

      const res = await axios.put(
        `${BASE_URL}/student/update-admin/${id}`,
        payload,
        { withCredentials: true }
      );
      if (res.data?.success) {
        toast.success(res.data.message || "Student updated successfully");
        navigate("/admin/students");
      } else {
        toast.error(res.data.message || "Failed to update student");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Derived fee preview ───────────────────────────────────────────────────
  const courseConfig   = COURSE_CONFIG[formData.course];
  const perYearFee     = courseConfig ? Math.round(courseConfig.totalFee / courseConfig.totalYears) : 0;
  const discount       = Math.round(perYearFee * 0.30);
  const autoFee        = formData.residencyType === "hosteler" ? perYearFee : perYearFee - discount;
  const effectiveFee   = formData.manualFee ? Number(formData.manualFee) : autoFee;

  // Year-wise fee from existing student data
  const yearlyFees = studentDet?.yearlyFees || [];

  // ── Status badge helper ───────────────────────────────────────────────────
  const yearStatusStyle = (status) => {
    const map = {
      paid:    "bg-emerald-100 text-emerald-700 border-emerald-300",
      active:  "bg-indigo-100 text-indigo-700 border-indigo-300",
      partial: "bg-orange-100 text-orange-700 border-orange-300",
      locked:  "bg-gray-100 text-gray-500 border-gray-200",
    };
    return map[status] || "bg-gray-100 text-gray-500";
  };

  const yearStatusIcon = (status) => {
    return status === "paid" ? "✅" : status === "active" ? "🔓" : status === "partial" ? "⏳" : "🔒";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Loading student data…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">

      {/* Admin Header */}
      <div className="w-full h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/students")}
            className="text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium flex items-center gap-1"
          >
            ← Back
          </button>
          <span className="text-gray-300">|</span>
          <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-600 font-medium text-sm">{loggedUser?.username}</span>
          <img
            onClick={() => navigate("/admin/profile")}
            src={loggedUser?.profilePic || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-9 h-9 rounded-full cursor-pointer object-cover border border-gray-300"
          />
        </div>
      </div>

      <div className="w-full max-w-5xl px-4 py-6 space-y-6">

        {/* ── Current Year-wise Fee Status (read-only) ──────────────────── */}
        {yearlyFees.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-800">📊 Year-wise Fee Status</h3>
              <span className="text-xs text-gray-500">
                Current Year: <strong className="text-indigo-600">{studentDet?.currentYear}</strong>
              </span>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {yearlyFees.map((entry) => {
                const pct = entry.fee > 0 ? Math.min((entry.paidFee / entry.fee) * 100, 100) : 0;
                return (
                  <div
                    key={entry.year}
                    className={`rounded-xl border p-4 ${yearStatusStyle(entry.status)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold">
                        {yearStatusIcon(entry.status)} {entry.year} Year
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${yearStatusStyle(entry.status)}`}>
                        {entry.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs mb-1">Fee: <strong>{inr(entry.fee)}</strong></p>
                    <p className="text-xs mb-2">Paid: <strong>{inr(entry.paidFee)}</strong></p>
                    <div className="h-1.5 bg-white/60 rounded-full overflow-hidden border border-white/40">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: pct >= 100 ? "#16a34a" : "#f97316",
                          transition: "width 0.4s",
                        }}
                      />
                    </div>
                    <p className="text-[10px] mt-1 text-right opacity-70">{pct.toFixed(0)}% paid</p>
                  </div>
                );
              })}
            </div>

            {/* Grand totals */}
            <div className="px-5 pb-5">
              <div className="rounded-xl bg-gray-50 border border-gray-200 px-5 py-3 flex flex-wrap gap-6">
                {[
                  { label: "Grand Total Fee",    val: inr(yearlyFees.reduce((a, y) => a + y.fee, 0)),     color: "text-gray-700"    },
                  { label: "Total Paid",          val: inr(yearlyFees.reduce((a, y) => a + y.paidFee, 0)), color: "text-emerald-600" },
                  { label: "Total Remaining",     val: inr(yearlyFees.reduce((a, y) => a + Math.max(y.fee - y.paidFee, 0), 0)), color: "text-red-500" },
                  { label: "Years Completed",     val: `${yearlyFees.filter((y) => y.status === "paid").length} / ${yearlyFees.length}`, color: "text-indigo-600" },
                ].map(({ label, val, color }) => (
                  <div key={label}>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className={`text-base font-extrabold ${color}`}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Edit Form ──────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h1 className="text-lg font-bold text-gray-800">✏️ Edit Student Details</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Changing course or residency type will reset and rebuild all year fees.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* First Name */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-semibold">First Name <span className="text-red-400">*</span></label>
              <input
                type="text" name="firstName" value={formData.firstName}
                onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-semibold">Last Name</label>
              <input
                type="text" name="lastName" value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
            </div>

            {/* Father's Name */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-semibold">Father's Name</label>
              <input
                type="text" name="fathersName" value={formData.fathersName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
            </div>

            {/* Mother's Name */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-semibold">Mother's Name <span className="text-red-400">*</span></label>
              <input
                type="text" name="mothersName" value={formData.mothersName}
                onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-semibold">Phone Number <span className="text-red-400">*</span></label>
              <input
                type="tel" name="phoneNo" value={formData.phoneNo}
                onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-semibold">Email <span className="text-red-400">*</span></label>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
            </div>

            {/* Course */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-semibold">Course <span className="text-red-400">*</span></label>
              <select
                name="course" value={formData.course}
                onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none cursor-pointer"
              >
                <option value="">Select Course</option>
                {Object.entries(COURSE_CONFIG).map(([name, cfg]) => (
                  <option key={name} value={name}>
                    {name} — {inr(cfg.totalFee)} ({cfg.totalYears} yrs)
                  </option>
                ))}
              </select>
              {formData.course && (
                <p className="text-xs text-gray-400 mt-1">
                  {courseConfig?.totalYears} years · {inr(perYearFee)}/yr base
                </p>
              )}
            </div>

            {/* Residency Type */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-semibold">Residency Type <span className="text-red-400">*</span></label>
              <select
                name="residencyType" value={formData.residencyType}
                onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none cursor-pointer"
              >
                <option value="">Select Residency</option>
                <option value="hosteler">🏠 Hosteler — Full fee</option>
                <option value="dayscholar">🏡 Day Scholar — 30% off</option>
              </select>
              {formData.course && formData.residencyType && (
                <p className="text-xs mt-1 font-semibold" style={{ color: formData.residencyType === "hosteler" ? "#6366f1" : "#10b981" }}>
                  Auto fee: {inr(autoFee)}/yr
                  {formData.residencyType === "dayscholar" && ` (saves ${inr(discount)}/yr)`}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-semibold">Gender <span className="text-red-400">*</span></label>
              <select
                name="gender" value={formData.gender}
                onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none cursor-pointer"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-semibold">Date of Birth <span className="text-red-400">*</span></label>
              <input
                type="date" name="dateOfBirth" value={formData.dateOfBirth}
                onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
            </div>

            {/* Manual Fee Override */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1 text-sm font-semibold">
                Manual Fee Override{" "}
                <span className="text-gray-400 font-normal">(leave blank to auto-calculate)</span>
              </label>
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <input
                    type="number" name="manualFee" value={formData.manualFee}
                    onChange={handleChange} min="0"
                    placeholder={`Auto: ${inr(autoFee)}/yr`}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>
                {/* Effective fee preview card */}
                <div className="flex-shrink-0 bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2.5 text-center min-w-[130px]">
                  <p className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wide">Effective/yr</p>
                  <p className="text-base font-extrabold text-indigo-700">{inr(effectiveFee)}</p>
                </div>
              </div>
              <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                ⚠️ Changing course or residency will reset all yearly fees and paidFee to zero.
              </p>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1 text-sm font-semibold">Address <span className="text-red-400">*</span></label>
              <textarea
                name="address" value={formData.address}
                onChange={handleChange} required rows="3"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none resize-none"
              />
            </div>

            {/* Actions */}
            <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/admin/students")}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit" disabled={submitting}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Updating…
                  </>
                ) : "Update Student"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateAdmin;