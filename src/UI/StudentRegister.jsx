import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/Config";

const COURSE_CONFIG = {
  "B.Tech":  { totalFee: 500000,  totalYears: 4 },
  "MBA":     { totalFee: 1000000, totalYears: 2 },
  "M.Tech":  { totalFee: 400000,  totalYears: 2 },
  "Diploma": { totalFee: 350000,  totalYears: 3 },
};

function calculateFees(course, residencyType) {
  const config = COURSE_CONFIG[course];
  if (!config) {
    return { hostelerPerYear: 0, dayScholarPerYear: 0, selectedPerYear: 0, perYearFee: 0, discount: 0, totalYears: 0 };
  }
  const { totalFee, totalYears } = config;
  const perYearFee        = Math.round(totalFee / totalYears);
  const discount          = Math.round(perYearFee * 0.30);
  const hostelerPerYear   = perYearFee;
  const dayScholarPerYear = perYearFee - discount;
  const selectedPerYear   =
    residencyType === "hosteler"   ? hostelerPerYear :
    residencyType === "dayscholar" ? dayScholarPerYear : 0;

  return { hostelerPerYear, dayScholarPerYear, selectedPerYear, perYearFee, discount, totalYears };
}

const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

export default function StudentRegister() {
  const navigate = useNavigate();
  const userDet = JSON.parse(localStorage.getItem("userDet"));

  const [formData, setFormData] = useState({
    firstName:     userDet?.username || "",
    lastName:      "",
    fathersName:   "",
    mothersName:   "",
    phoneNo:       "",
    course:        "",
    email:         userDet?.email || "",
    gender:        userDet?.gender || "",
    dateOfBirth:   "",
    address:       "",
    residencyType: "",
  });

  const [fees, setFees] = useState({
    hostelerPerYear: 0, dayScholarPerYear: 0,
    selectedPerYear: 0, perYearFee: 0, discount: 0, totalYears: 0,
  });
  const [focused, setFocused] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.course) {
      setFees(calculateFees(formData.course, formData.residencyType));
    } else {
      setFees({ hostelerPerYear: 0, dayScholarPerYear: 0, selectedPerYear: 0, perYearFee: 0, discount: 0, totalYears: 0 });
    }
  }, [formData.course, formData.residencyType]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.residencyType) { toast.error("Please select residency type"); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/student/register`, formData, { withCredentials: true });
      if (res.data?.success) {
        localStorage.setItem("studentToken", res.data?.token);
        localStorage.setItem("studentDet", JSON.stringify(res.data?.student));
        toast.success("Student registered successfully!");
        setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error(res.data?.message || "Registration failed!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (name) =>
    `w-full px-4 py-3 rounded-xl border text-sm font-medium text-gray-800
     bg-white/70 backdrop-blur-sm outline-none transition-all duration-200
     placeholder:text-gray-400 placeholder:font-normal
     ${focused === name
       ? "border-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
       : "border-gray-200 hover:border-gray-300"}`;

  const disabledClass =
    "w-full px-4 py-3 rounded-xl border text-sm font-medium bg-gray-50 border-gray-200 text-gray-400 outline-none cursor-not-allowed";
  const labelClass = "block mb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide";

  const courseConfig = COURSE_CONFIG[formData.course];
  const allYearLabels = ["1st", "2nd", "3rd", "4th"];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: "linear-gradient(135deg, #f8f9ff 0%, #eef0ff 40%, #f5f0ff 100%)" }}
    >
      {/* Background blobs */}
      <div style={{ position: "fixed", top: "-80px", right: "-80px", width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-60px", left: "-60px", width: "260px", height: "260px", borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.14), transparent 70%)", pointerEvents: "none" }} />

      <div
        className="w-full max-w-3xl"
        style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 8px 40px rgba(99,102,241,0.10)", padding: "40px 36px" }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(99,102,241,0.35)", fontSize: "20px", fontWeight: 800, color: "#fff" }}>
            ELT
          </div>
        </div>
        <h1 className="text-center mb-1" style={{ fontSize: "22px", fontWeight: 700, color: "#1e1b4b" }}>
          Student Registration
        </h1>
        <p className="text-center text-sm text-gray-400 mb-8">Complete your profile to get started</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* First Name */}
          <div>
            <label className={labelClass}>First Name</label>
            <input type="text" name="firstName" value={formData.firstName} placeholder="Auto-filled" className={disabledClass} required disabled />
          </div>

          {/* Last Name */}
          <div>
            <label className={labelClass}>Last Name</label>
            <input
              type="text" name="lastName" value={formData.lastName}
              onChange={handleChange}
              onFocus={() => setFocused("lastName")} onBlur={() => setFocused("")}
              placeholder="Enter last name" className={inputClass("lastName")}
            />
          </div>

          {/* Father's Name */}
          <div>
            <label className={labelClass}>Father's Name</label>
            <input
              type="text" name="fathersName" value={formData.fathersName}
              onChange={handleChange}
              onFocus={() => setFocused("fathersName")} onBlur={() => setFocused("")}
              placeholder="Enter father's name" className={inputClass("fathersName")} required
            />
          </div>

          {/* Mother's Name */}
          <div>
            <label className={labelClass}>Mother's Name</label>
            <input
              type="text" name="mothersName" value={formData.mothersName}
              onChange={handleChange}
              onFocus={() => setFocused("mothersName")} onBlur={() => setFocused("")}
              placeholder="Enter mother's name" className={inputClass("mothersName")} required
            />
          </div>

          {/* Phone */}
          <div>
            <label className={labelClass}>Phone Number</label>
            <input
              type="number" name="phoneNo" value={formData.phoneNo}
              onChange={handleChange}
              onFocus={() => setFocused("phoneNo")} onBlur={() => setFocused("")}
              placeholder="10-digit mobile number" className={inputClass("phoneNo")} required
            />
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" name="email" value={formData.email} placeholder="Auto-filled" className={disabledClass} required disabled />
          </div>

          {/* Course */}
          <div>
            <label className={labelClass}>Course</label>
            <select
              name="course" value={formData.course} onChange={handleChange}
              onFocus={() => setFocused("course")} onBlur={() => setFocused("")}
              className={inputClass("course")} required style={{ cursor: "pointer" }}
            >
              <option value="">Select Course</option>
              {Object.entries(COURSE_CONFIG).map(([name, cfg]) => (
                <option key={name} value={name}>
                  {name} — {formatINR(cfg.totalFee)} ({cfg.totalYears} yrs)
                </option>
              ))}
            </select>
            {formData.course && (
              <div style={{ marginTop: "6px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "11px", color: "#6366f1", fontWeight: 600, background: "rgba(99,102,241,0.08)", padding: "2px 8px", borderRadius: "999px" }}>
                  {formatINR(fees.perYearFee)} / yr base
                </span>
                <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 600, background: "rgba(16,185,129,0.08)", padding: "2px 8px", borderRadius: "999px" }}>
                  Day Scholar saves {formatINR(fees.discount)} / yr
                </span>
              </div>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className={labelClass}>Gender</label>
            <select name="gender" value={formData.gender} className={disabledClass} required disabled>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className={labelClass}>Date of Birth</label>
            <input
              type="date" name="dateOfBirth" value={formData.dateOfBirth}
              onChange={handleChange}
              onFocus={() => setFocused("dateOfBirth")} onBlur={() => setFocused("")}
              className={inputClass("dateOfBirth")} required
            />
          </div>

          {/* Residency Type */}
          <div className="md:col-span-2">
            <label className={labelClass}>
              Residency Type <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4 mt-1">

              {/* Hosteler */}
              <label className="cursor-pointer" style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: "20px 12px", borderRadius: "14px", border: "2px solid",
                borderColor:  formData.residencyType === "hosteler" ? "#6366f1" : "#e5e7eb",
                background:   formData.residencyType === "hosteler" ? "linear-gradient(135deg,#eef2ff,#f5f3ff)" : "rgba(255,255,255,0.7)",
                boxShadow:    formData.residencyType === "hosteler" ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
                transition: "all 0.2s",
              }}>
                <input type="radio" name="residencyType" value="hosteler" checked={formData.residencyType === "hosteler"} onChange={handleChange} className="hidden" />
                <span style={{ fontSize: "28px", marginBottom: "8px" }}>🏠</span>
                <span style={{ fontWeight: 700, fontSize: "15px", color: "#1e1b4b" }}>Hosteler</span>
                <span style={{ marginTop: "4px", fontSize: "12px", color: "#6b7280" }}>Full yearly fee</span>
                {formData.course && (
                  <>
                    <span style={{ marginTop: "8px", fontSize: "16px", fontWeight: 800, color: "#6366f1" }}>{formatINR(fees.hostelerPerYear)}</span>
                    <span style={{ fontSize: "10px", color: "#a5b4fc" }}>per year</span>
                  </>
                )}
                {formData.residencyType === "hosteler" && (
                  <span style={{ marginTop: "8px", fontSize: "11px", background: "#6366f1", color: "#fff", padding: "2px 10px", borderRadius: "999px", fontWeight: 600 }}>✓ Selected</span>
                )}
              </label>

              {/* Day Scholar */}
              <label className="cursor-pointer" style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: "20px 12px", borderRadius: "14px", border: "2px solid",
                borderColor:  formData.residencyType === "dayscholar" ? "#10b981" : "#e5e7eb",
                background:   formData.residencyType === "dayscholar" ? "linear-gradient(135deg,#ecfdf5,#f0fdf4)" : "rgba(255,255,255,0.7)",
                boxShadow:    formData.residencyType === "dayscholar" ? "0 0 0 3px rgba(16,185,129,0.12)" : "none",
                transition: "all 0.2s",
              }}>
                <input type="radio" name="residencyType" value="dayscholar" checked={formData.residencyType === "dayscholar"} onChange={handleChange} className="hidden" />
                <span style={{ fontSize: "28px", marginBottom: "8px" }}>🏡</span>
                <span style={{ fontWeight: 700, fontSize: "15px", color: "#1e1b4b" }}>Day Scholar</span>
                <span style={{ marginTop: "4px", fontSize: "12px", color: "#6b7280" }}>30% discount on yearly fee</span>
                {formData.course && (
                  <>
                    <span style={{ marginTop: "8px", fontSize: "16px", fontWeight: 800, color: "#10b981" }}>{formatINR(fees.dayScholarPerYear)}</span>
                    <span style={{ fontSize: "10px", color: "#6ee7b7" }}>per year</span>
                    <span style={{ marginTop: "4px", fontSize: "11px", color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "2px 8px", borderRadius: "999px", fontWeight: 600 }}>
                      Save {formatINR(fees.discount)}/yr
                    </span>
                  </>
                )}
                {formData.residencyType === "dayscholar" && (
                  <span style={{ marginTop: "6px", fontSize: "11px", background: "#10b981", color: "#fff", padding: "2px 10px", borderRadius: "999px", fontWeight: 600 }}>✓ Selected</span>
                )}
              </label>
            </div>
          </div>

          {/* Fee Structure Table */}
          {formData.course && (
            <div className="md:col-span-2" style={{ borderRadius: "16px", background: "linear-gradient(135deg,#eef2ff,#f5f3ff)", border: "1px solid #e0e7ff", padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#6366f1", letterSpacing: "0.08em", margin: 0 }}>
                  📋 FEE STRUCTURE — All {fees.totalYears} Years
                </p>
                <span style={{ fontSize: "11px", fontWeight: 700, background: "rgba(99,102,241,0.1)", color: "#4f46e5", padding: "3px 10px", borderRadius: "999px" }}>
                  {formData.course} · {formatINR(courseConfig?.totalFee)} · {formatINR(fees.perYearFee)}/yr
                </span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "rgba(99,102,241,0.08)" }}>
                      <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: "#4f46e5", borderRadius: "8px 0 0 8px" }}>Year</th>
                      <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: "#6366f1" }}>🏠 Hosteler / yr</th>
                      <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: "#10b981" }}>🏡 Day Scholar / yr</th>
                      <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: "#f59e0b", borderRadius: "0 8px 8px 0" }}>💰 Saves</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allYearLabels.slice(0, fees.totalYears).map((yr, i) => (
                      <tr key={yr} style={{
                        background: i % 2 === 0 ? "rgba(99,102,241,0.03)" : "transparent",
                        borderBottom: i < fees.totalYears - 1 ? "1px solid #e0e7ff" : "none",
                      }}>
                        <td style={{ padding: "10px 14px", fontWeight: 600, color: "#374151" }}>
                          {yr} Year
                          {i === 0 && (
                            <span style={{ marginLeft: "8px", fontSize: "10px", background: "#6366f1", color: "#fff", padding: "1px 7px", borderRadius: "999px", fontWeight: 600 }}>
                              Starts here
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "right", color: "#6366f1", fontWeight: 600 }}>
                          {formatINR(fees.hostelerPerYear)}
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "right", color: "#10b981", fontWeight: 600 }}>
                          {formatINR(fees.dayScholarPerYear)}
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "right", color: "#f59e0b", fontWeight: 600 }}>
                          {formatINR(fees.discount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  {formData.residencyType && (
                    <tfoot>
                      <tr style={{ background: "rgba(99,102,241,0.06)", borderTop: "2px solid #c7d2fe" }}>
                        <td style={{ padding: "10px 14px", fontWeight: 700, color: "#4f46e5", fontSize: "12px" }}>
                          Total ({fees.totalYears} yrs)
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: "#6366f1" }}>
                          {formatINR(fees.hostelerPerYear * fees.totalYears)}
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: "#10b981" }}>
                          {formatINR(fees.dayScholarPerYear * fees.totalYears)}
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: "#f59e0b" }}>
                          {formatINR(fees.discount * fees.totalYears)}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>

              {formData.residencyType && (
                <div style={{ marginTop: "14px", padding: "14px 18px", background: "#fff", borderRadius: "12px", border: "2px solid #6366f1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: "#6366f1" }}>
                      Fee per year — {formData.residencyType === "hosteler" ? "🏠 Hosteler" : "🏡 Day Scholar"}
                    </p>
                    <p style={{ margin: "3px 0 0 0", fontSize: "10px", color: "#9ca3af" }}>
                      Pay year by year · Next year unlocks after current is fully paid
                      {formData.residencyType === "dayscholar" && ` · Saves ${formatINR(fees.discount)} vs hosteler/yr`}
                    </p>
                  </div>
                  <span style={{ fontSize: "22px", fontWeight: 800, color: "#1e1b4b" }}>
                    {formatINR(fees.selectedPerYear)}
                  </span>
                </div>
              )}

              {!formData.residencyType && (
                <p style={{ marginTop: "10px", fontSize: "11px", color: "#a5b4fc", textAlign: "center" }}>
                  👆 Select residency type to see your fee per year
                </p>
              )}
            </div>
          )}

          {/* Address */}
          <div className="md:col-span-2">
            <label className={labelClass}>Address</label>
            <textarea
              name="address" value={formData.address} onChange={handleChange}
              onFocus={() => setFocused("address")} onBlur={() => setFocused("")}
              placeholder="Enter full address" rows="3"
              className={inputClass("address") + " resize-none"} required
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit" disabled={loading}
              style={{
                width: "100%", padding: "13px", borderRadius: "12px",
                background: loading ? "linear-gradient(135deg,#a5b4fc,#c4b5fd)" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "#fff", fontWeight: 700, fontSize: "15px", border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(99,102,241,0.35)", transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.45)"; }}}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(99,102,241,0.35)"; }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Registering…
                </>
              ) : "Register Student →"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}