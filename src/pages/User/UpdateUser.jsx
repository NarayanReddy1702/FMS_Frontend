import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../utils/Config";


const COURSE_CONFIG = {
  "B.Tech":  { totalFee: 500000,  totalYears: 4 },
  "MBA":     { totalFee: 1000000, totalYears: 2 },
  "M.Tech":  { totalFee: 400000,  totalYears: 2 },
  "Diploma": { totalFee: 350000,  totalYears: 3 },
};

function calculateFees(course, residencyType) {
  const config = COURSE_CONFIG[course];
  if (!config) return { hostelerPerYear: 0, dayScholarPerYear: 0, selectedPerYear: 0, perYearFee: 0, discount: 0 };
  const { totalFee, totalYears } = config;
  const perYearFee        = Math.round(totalFee / totalYears);
  const discount          = Math.round(perYearFee * 0.30);
  const hostelerPerYear   = perYearFee;
  const dayScholarPerYear = perYearFee - discount;
  const selectedPerYear   = residencyType === "hosteler" ? hostelerPerYear : residencyType === "dayscholar" ? dayScholarPerYear : 0;
  return { hostelerPerYear, dayScholarPerYear, selectedPerYear, perYearFee, discount };
}

function getValidYears(course) {
  const config = COURSE_CONFIG[course];
  if (!config) return [];
  return ["1st", "2nd", "3rd", "4th"].slice(0, config.totalYears);
}

const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n ?? 0);

function UpdateUser() {
  const navigate    = useNavigate();
  const { id }      = useParams();
  const studentDet  = JSON.parse(localStorage.getItem("studentDet"));

  const [formData, setFormData] = useState({
    firstName:     studentDet.firstName     || "",
    lastName:      studentDet.lastName      || "",
    fathersName:   studentDet.fathersName   || "",
    mothersName:   studentDet.mothersName   || "",
    phoneNo:       studentDet.phoneNo       || "",
    course:        studentDet.course        || "",
    year:          studentDet.year          || "",
    email:         studentDet.email         || "",
    gender:        studentDet.gender        || "",
    dateOfBirth:   studentDet.dateOfBirth   || "",
    address:       studentDet.address       || "",
    residencyType: studentDet.residencyType || "",
  });

  const [fees, setFees]     = useState({ hostelerPerYear:0, dayScholarPerYear:0, selectedPerYear:0, perYearFee:0, discount:0 });
  const [loading, setLoading] = useState(false);

  // Reset year if course changes and year is now out of range
  useEffect(() => {
    if (formData.course && formData.year) {
      const valid = getValidYears(formData.course);
      if (!valid.includes(formData.year)) setFormData((p) => ({ ...p, year: "" }));
    }
  }, [formData.course]);

  // Recalculate fees live
  useEffect(() => {
    if (formData.course) setFees(calculateFees(formData.course, formData.residencyType));
  }, [formData.course, formData.residencyType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!formData.residencyType) { toast.error("Please select residency type"); return; }
    setLoading(true);
    try {
      const res = await axios.put(
        `${BASE_URL}/student/update-student/${id}`,
        formData
      );
      if (res.data?.success) {
        toast.success("Profile updated successfully!");
        localStorage.setItem("studentDet", JSON.stringify(res.data?.student));
        setTimeout(() => navigate("/profile"), 1500);
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const validYears   = getValidYears(formData.course);
  const courseConfig = COURSE_CONFIG[formData.course];

  const inputCls   = "w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all";
  const labelCls   = "block text-gray-700 mb-1.5 text-xs font-semibold uppercase tracking-wide";
  const disabledCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-400 outline-none cursor-not-allowed";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: "linear-gradient(135deg, #f8f9ff 0%, #eef0ff 40%, #f5f0ff 100%)" }}>

      {/* Blobs */}
      <div style={{ position:"fixed", top:"-80px", right:"-80px", width:"320px", height:"320px", borderRadius:"50%", background:"radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"fixed", bottom:"-60px", left:"-60px", width:"260px", height:"260px", borderRadius:"50%", background:"radial-gradient(circle, rgba(168,85,247,0.14), transparent 70%)", pointerEvents:"none" }} />

      <div className="w-full max-w-3xl" style={{ background:"rgba(255,255,255,0.90)", backdropFilter:"blur(20px)", borderRadius:"24px", border:"1px solid rgba(255,255,255,0.9)", boxShadow:"0 8px 40px rgba(99,102,241,0.10)", padding:"40px 36px" }}>

        {/* Header */}
        <div className="flex justify-center mb-4">
          <div style={{ width:"48px", height:"48px", borderRadius:"14px", background:"linear-gradient(135deg,#f97316,#ea580c)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 14px rgba(249,115,22,0.35)", fontSize:"20px", color:"#fff" }}>
            ✏️
          </div>
        </div>
        <h1 className="text-center mb-1 text-2xl font-bold text-gray-800">Update Profile</h1>
        <p className="text-center text-sm text-gray-400 mb-8">Edit your details below</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* First Name */}
          <div>
            <label className={labelCls}>First Name</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
              className={inputCls} required />
          </div>

          {/* Last Name */}
          <div>
            <label className={labelCls}>Last Name</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
              className={inputCls} />
          </div>

          {/* Father's Name */}
          <div>
            <label className={labelCls}>Father's Name</label>
            <input type="text" name="fathersName" value={formData.fathersName} onChange={handleChange}
              className={inputCls} required />
          </div>

          {/* Mother's Name */}
          <div>
            <label className={labelCls}>Mother's Name</label>
            <input type="text" name="mothersName" value={formData.mothersName} onChange={handleChange}
              className={inputCls} required />
          </div>

          {/* Phone */}
          <div>
            <label className={labelCls}>Phone Number</label>
            <input type="tel" name="phoneNo" value={formData.phoneNo} onChange={handleChange}
              className={inputCls} required />
          </div>

          {/* Email */}
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" name="email" value={formData.email}
              className={disabledCls} disabled />
          </div>

          {/* Course */}
          <div>
            <label className={labelCls}>Course</label>
            <select name="course" value={formData.course} onChange={handleChange}
              className={inputCls} required style={{ cursor:"pointer" }}>
              <option value="">Select Course</option>
              {Object.entries(COURSE_CONFIG).map(([name, cfg]) => (
                <option key={name} value={name}>
                  {name} — {formatINR(cfg.totalFee)} ({cfg.totalYears} yrs)
                </option>
              ))}
            </select>
            {formData.course && (
              <div style={{ marginTop:"6px", display:"flex", gap:"8px", flexWrap:"wrap" }}>
                <span style={{ fontSize:"11px", color:"#6366f1", fontWeight:600, background:"rgba(99,102,241,0.08)", padding:"2px 8px", borderRadius:"999px" }}>
                  {formatINR(fees.perYearFee)} / yr base
                </span>
                <span style={{ fontSize:"11px", color:"#10b981", fontWeight:600, background:"rgba(16,185,129,0.08)", padding:"2px 8px", borderRadius:"999px" }}>
                  Day Scholar saves {formatINR(fees.discount)} / yr
                </span>
              </div>
            )}
          </div>

          {/* Year — filtered by course */}
          <div>
            <label className={labelCls}>Enrolled Year</label>
            <select name="year" value={formData.year} onChange={handleChange}
              className={inputCls} required style={{ cursor:"pointer" }}
              disabled={!formData.course}>
              <option value="">{formData.course ? "Select Year" : "Select course first"}</option>
              {validYears.map((yr) => (
                <option key={yr} value={yr}>{yr} Year</option>
              ))}
            </select>
            {formData.course && (
              <p style={{ marginTop:"6px", fontSize:"11px", color:"#9ca3af" }}>
                {courseConfig?.totalYears}-year programme
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className={labelCls}>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}
              className={inputCls} required style={{ cursor:"pointer" }}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className={labelCls}>Date of Birth</label>
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange}
              className={inputCls} required />
          </div>

          {/* ── Residency Type ──────────────────────── */}
          <div className="md:col-span-2">
            <label className={labelCls}>Residency Type <span className="text-red-400">*</span></label>
            <div className="grid grid-cols-2 gap-4 mt-1">

              {/* Hosteler */}
              <label className="cursor-pointer" style={{
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                padding:"18px 12px", borderRadius:"14px", border:"2px solid",
                borderColor: formData.residencyType === "hosteler" ? "#6366f1" : "#e5e7eb",
                background: formData.residencyType === "hosteler" ? "linear-gradient(135deg,#eef2ff,#f5f3ff)" : "rgba(255,255,255,0.7)",
                boxShadow: formData.residencyType === "hosteler" ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
                transition:"all 0.2s",
              }}>
                <input type="radio" name="residencyType" value="hosteler"
                  checked={formData.residencyType === "hosteler"} onChange={handleChange} className="hidden" />
                <span style={{ fontSize:"26px", marginBottom:"6px" }}>🏠</span>
                <span style={{ fontWeight:700, fontSize:"14px", color:"#1e1b4b" }}>Hosteler</span>
                <span style={{ marginTop:"4px", fontSize:"12px", color:"#6b7280" }}>Full yearly fee</span>
                {formData.course && <span style={{ marginTop:"6px", fontSize:"15px", fontWeight:800, color:"#6366f1" }}>{formatINR(fees.hostelerPerYear)}</span>}
                {formData.course && <span style={{ fontSize:"10px", color:"#a5b4fc" }}>per year</span>}
                {formData.residencyType === "hosteler" && (
                  <span style={{ marginTop:"8px", fontSize:"11px", background:"#6366f1", color:"#fff", padding:"2px 10px", borderRadius:"999px", fontWeight:600 }}>✓ Selected</span>
                )}
              </label>

              {/* Day Scholar */}
              <label className="cursor-pointer" style={{
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                padding:"18px 12px", borderRadius:"14px", border:"2px solid",
                borderColor: formData.residencyType === "dayscholar" ? "#10b981" : "#e5e7eb",
                background: formData.residencyType === "dayscholar" ? "linear-gradient(135deg,#ecfdf5,#f0fdf4)" : "rgba(255,255,255,0.7)",
                boxShadow: formData.residencyType === "dayscholar" ? "0 0 0 3px rgba(16,185,129,0.12)" : "none",
                transition:"all 0.2s",
              }}>
                <input type="radio" name="residencyType" value="dayscholar"
                  checked={formData.residencyType === "dayscholar"} onChange={handleChange} className="hidden" />
                <span style={{ fontSize:"26px", marginBottom:"6px" }}>🏡</span>
                <span style={{ fontWeight:700, fontSize:"14px", color:"#1e1b4b" }}>Day Scholar</span>
                <span style={{ marginTop:"4px", fontSize:"12px", color:"#6b7280" }}>30% discount</span>
                {formData.course && <span style={{ marginTop:"6px", fontSize:"15px", fontWeight:800, color:"#10b981" }}>{formatINR(fees.dayScholarPerYear)}</span>}
                {formData.course && <span style={{ fontSize:"10px", color:"#6ee7b7" }}>per year</span>}
                {formData.course && <span style={{ marginTop:"4px", fontSize:"11px", color:"#10b981", background:"rgba(16,185,129,0.1)", padding:"2px 8px", borderRadius:"999px", fontWeight:600 }}>Save {formatINR(fees.discount)}/yr</span>}
                {formData.residencyType === "dayscholar" && (
                  <span style={{ marginTop:"6px", fontSize:"11px", background:"#10b981", color:"#fff", padding:"2px 10px", borderRadius:"999px", fontWeight:600 }}>✓ Selected</span>
                )}
              </label>
            </div>

            {/* Updated fee preview */}
            {formData.course && formData.residencyType && formData.year && (
              <div style={{ marginTop:"12px", padding:"12px 16px", background:"linear-gradient(135deg,#eef2ff,#f5f3ff)", borderRadius:"12px", border:"1px solid #e0e7ff", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:"12px", fontWeight:600, color:"#6366f1" }}>
                  Updated fee — {formData.year} Year · {formData.residencyType === "hosteler" ? "🏠 Hosteler" : "🏡 Day Scholar"}
                </span>
                <span style={{ fontSize:"18px", fontWeight:800, color:"#1e1b4b" }}>
                  {formatINR(fees.selectedPerYear)} / yr
                </span>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className={labelCls}>Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange}
              rows="3" className={`${inputCls} resize-none`} required />
          </div>

        </form>

        {/* ── Action Buttons ── */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">

          {/* Cancel */}
          <button onClick={() => navigate("/profile")}
            className="cursor-pointer px-6 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:border-gray-300 hover:bg-gray-50 transition">
            ← Back to Profile
          </button>

          {/* Pay Fees */}
          <button onClick={() => navigate(`/payment/${id}`)}
            className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            Pay Fees
          </button>

          {/* Update */}
          <button onClick={handleSubmit} disabled={loading}
            style={{ background: loading ? "linear-gradient(135deg,#fdba74,#f97316)" : "linear-gradient(135deg,#f97316,#ea580c)", boxShadow:"0 4px 14px rgba(249,115,22,0.35)" }}
            className="cursor-pointer flex items-center gap-2 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md transition text-sm disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? (
              <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.4)" strokeWidth="3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>Updating…</>
            ) : (<>✏️ Update Profile</>)}
          </button>
        </div>

      </div>
    </div>
  );
}

export default UpdateUser;