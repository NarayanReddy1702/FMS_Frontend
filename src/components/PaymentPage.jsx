import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {BASE_URL} from "../utils/Config";

/* ─── helpers ─────────────────────────────────────────────────────────────── */
const inr = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(n ?? 0);

const fmtDate = (d) =>
  new Date(d).toLocaleString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

/* ── Fee progress bar ─────────────────────────────────────────────────────── */
function FeeBar({ paid, total }) {
  const pct = total > 0 ? Math.min((paid / total) * 100, 100) : 0;
  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-gray-400 mb-1.5">
        <span>{pct.toFixed(0)}% paid</span>
        <span>{(100 - pct).toFixed(0)}% remaining</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{
          width: `${pct}%`,
          background: pct >= 100 ? "linear-gradient(90deg,#22c55e,#16a34a)" : "linear-gradient(90deg,#f97316,#ea580c)",
        }} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   STEP 1 — PAYMENT
══════════════════════════════════════════════════════════════════════════════ */
function StepPayment({ student, onSuccess, onRefresh }) {
  const [phase,   setPhase]   = useState("amount");
  const [amount,  setAmount]  = useState("");
  const [remarks, setRemarks] = useState("");
  const [utr,     setUtr]     = useState("");
  const [saving,  setSaving]  = useState(false);
  const utrRef = useRef(null);

  // ── Always use live data from props ──────────────────────────────────────
  const activeEntry = student.yearlyFees?.find(
    (y) => y.status === "active" || y.status === "partial"
  );
  const due       = student.dueFee ?? 0;
  const parsedAmt = parseFloat(amount) || 0;

  const currentStatus =
    due <= 0 ? "paid" : (activeEntry?.paidFee ?? 0) > 0 ? "partial" : "unpaid";

  const statusMeta = {
    paid:    { cls: "bg-emerald-100 text-emerald-700", label: "FULLY PAID" },
    partial: { cls: "bg-orange-100 text-orange-600",   label: "PARTIAL"    },
    unpaid:  { cls: "bg-red-100 text-red-600",         label: "UNPAID"     },
  };
  const { cls: badgeCls, label: badgeLabel } = statusMeta[currentStatus];

  const handleShowQR = () => {
    if (!parsedAmt || parsedAmt <= 0) return toast.error("Enter a valid amount");
    if (parsedAmt > due)              return toast.error(`Max payable: ${inr(due)}`);
    setPhase("qr");
  };

  const handleIPaid = () => {
    setPhase("paid");
    setTimeout(() => utrRef.current?.focus(), 100);
  };

  const handleUtrSubmit = () => {
    if (!utr.trim() || utr.trim().length < 6)
      return toast.error("Enter the UTR / Transaction ID from your payment app");
    setPhase("confirm");
  };

  const handleConfirm = async () => {
    setSaving(true);
    try {
      const res = await axios.post(`${BASE_URL}/student/process-payment`, {
        studentId:  student._id,
        amountPaid: parsedAmt,
        remarks:    remarks || `UTR: ${utr.trim()}`,
      });

      if (res.data?.success) {
        // ── Only keep the _id in localStorage — all real data comes from API ──
        const stored = JSON.parse(localStorage.getItem("studentDet") || "{}");
        localStorage.setItem("studentDet", JSON.stringify({
          ...stored,
          _id: student._id,  // preserve ID for next fetch
        }));

        if (res.data.payment.nextYearUnlocked) {
          toast.success(
            `🎉 ${res.data.payment.year} year fully paid! ${res.data.payment.nextYearUnlocked} year is now unlocked.`,
            { duration: 4000 }
          );
        } else {
          toast.success("Payment recorded! 🎉");
        }

        onSuccess({ ...res.data.payment, utr: utr.trim() });
      } else {
        toast.error(res.data?.message || "Failed to save payment");
        setPhase("paid");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
      setPhase("paid");
    } finally {
      setSaving(false);
    }
  };

  /* ── Student summary card ──────────────────────────────────────────────── */
  const StudentCard = (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-4">
        <img
          src={student.profilePic || `https://avatar.iran.liara.run/public/${student.gender === "female" ? "girl" : "boy"}?username=${student.firstName}`}
          alt={student.firstName}
          className="w-14 h-14 rounded-xl object-cover shadow-md flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-extrabold text-gray-800 leading-tight">
            {student.firstName} {student.lastName}
          </h2>
          <p className="text-sm text-gray-400 mt-0.5 truncate">
            {student.course} · {activeEntry?.year ?? student.currentYear} Year
          </p>
          <p className="text-xs text-gray-400 truncate">{student.email}</p>
        </div>
        <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full flex-shrink-0 ${badgeCls}`}>
          {badgeLabel}
        </span>
      </div>

      {activeEntry && (
        <div style={{ marginTop: "12px", padding: "8px 12px", background: "rgba(99,102,241,0.06)", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "#6366f1", fontWeight: 600 }}>
            📅 Current: {activeEntry.year} Year
          </span>
          <span style={{ fontSize: "12px", color: "#9ca3af" }}>
            {inr(activeEntry.paidFee)} paid · {inr(activeEntry.fee - activeEntry.paidFee)} due
          </span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-[10px] text-gray-400 mb-1">Year Fee</p>
          <p className="text-sm font-extrabold text-gray-700">{inr(activeEntry?.fee ?? student.courseFee)}</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-3 text-center">
          <p className="text-[10px] text-emerald-500 mb-1">Paid</p>
          <p className="text-sm font-extrabold text-emerald-600">{inr(activeEntry?.paidFee ?? 0)}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 text-center">
          <p className="text-[10px] text-red-400 mb-1">Due</p>
          <p className="text-sm font-extrabold text-red-500">{inr(due)}</p>
        </div>
      </div>
      <FeeBar paid={activeEntry?.paidFee ?? 0} total={activeEntry?.fee ?? student.courseFee} />
    </div>
  );

  /* ══════════════  PHASE: amount  ══════════════ */
  if (phase === "amount") return (
    <div className="space-y-4">
      {StudentCard}
      {due <= 0 ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-3">🎉</div>
          <p className="text-emerald-700 font-bold text-lg">
            {student.allYearsPaid ? "All years fully paid!" : "This year's fees cleared!"}
          </p>
          <p className="text-emerald-500 text-sm mt-1">No pending dues.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Enter Payment Amount — {activeEntry?.year} Year
          </p>

          <div className="flex items-center bg-orange-50 border-2 border-orange-200 focus-within:border-orange-500 rounded-xl overflow-hidden transition-colors mb-4">
            <span className="px-4 text-xl font-extrabold text-orange-500 border-r-2 border-orange-200 select-none">₹</span>
            <input
              type="number" min="1" max={due} placeholder="0"
              value={amount} onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-transparent px-4 py-4 text-3xl font-extrabold text-gray-800 text-center outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {[500, 1000, 2000, 5000].map((q) => (
              <button key={q} disabled={q > due} onClick={() => setAmount(q.toString())}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all cursor-pointer ${
                  parsedAmt === q
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-500 border-gray-200 hover:border-orange-400 hover:text-orange-500"
                } disabled:opacity-30 disabled:cursor-not-allowed`}>
                ₹{q.toLocaleString("en-IN")}
              </button>
            ))}
            <button onClick={() => setAmount(due.toString())}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all cursor-pointer ${
                parsedAmt === due
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-500 border-gray-200 hover:border-orange-400 hover:text-orange-500"
              }`}>
              Clear Year Due
            </button>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              Remarks <span className="font-normal normal-case">(optional)</span>
            </label>
            <input type="text" placeholder="e.g. Semester 3 tuition fee"
              value={remarks} onChange={(e) => setRemarks(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none" />
          </div>

          <button onClick={handleShowQR} disabled={!amount || parsedAmt <= 0}
            className="w-full cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-md text-base">
            Show QR Code →
          </button>
        </div>
      )}
    </div>
  );

  /* ══════════════  PHASE: qr  ══════════════ */
  if (phase === "qr") return (
    <div className="space-y-4">
      {StudentCard}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5 text-white text-center">
          <p className="text-sm font-semibold opacity-80 mb-1">Scan &amp; Pay — {activeEntry?.year} Year</p>
          <p className="text-4xl font-black tracking-tight">{inr(parsedAmt)}</p>
          <p className="text-xs opacity-60 mt-1">{student.firstName} {student.lastName} · {student.course}</p>
        </div>

        <div className="p-6 flex flex-col items-center">
          <div className="relative mb-5">
            <div className="p-3 bg-white rounded-2xl shadow-lg ring-4 ring-orange-100">
              <img src="/qr-code.png" alt="Scan to Pay"
                className="w-52 h-52 object-contain rounded-xl"
                onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
              <div style={{ display: "none" }}
                className="w-52 h-52 flex-col items-center justify-center gap-2 bg-orange-50 rounded-xl border-2 border-dashed border-orange-200">
                <span className="text-4xl">📷</span>
                <p className="text-xs text-orange-400 font-semibold text-center px-4 leading-snug">
                  Add QR at <code className="bg-orange-100 px-1 rounded">public/qr-code.png</code>
                </p>
              </div>
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-1 text-center">Open PhonePe, GPay or Paytm</p>
          <p className="text-xs text-gray-400 text-center mb-5">Scan and pay {inr(parsedAmt)}, then tap below</p>

          <div className="flex items-center gap-5 mb-6 opacity-50">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/64px-PhonePe_Logo.svg.png" alt="PhonePe" className="h-5 object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Google_Pay_Logo.svg/64px-Google_Pay_Logo.svg.png" alt="GPay" className="h-5 object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/64px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" className="h-4 object-contain" />
          </div>

          <button onClick={handleIPaid}
            className="cursor-pointer w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-base text-white shadow-lg hover:shadow-xl active:scale-95 transition-all"
            style={{ background: "linear-gradient(135deg,#16a34a 0%,#15803d 60%,#166534 100%)" }}>
            <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            I have completed the payment
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">
            Tap only after you see "Payment Successful" in your UPI app
          </p>
        </div>

        <div className="px-6 pb-5 border-t border-gray-50 pt-3">
          <button onClick={() => setPhase("amount")}
            className="cursor-pointer w-full py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors">
            ← Change Amount
          </button>
        </div>
      </div>
    </div>
  );

  /* ══════════════  PHASE: paid (UTR entry)  ══════════════ */
  if (phase === "paid") return (
    <div className="space-y-4">
      {StudentCard}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-8 flex flex-col items-center text-center"
          style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-md"
            style={{ background: "linear-gradient(135deg,#16a34a,#15803d)" }}>
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-extrabold text-emerald-800">Payment Done!</h3>
          <p className="text-sm text-emerald-600 mt-1">You paid <strong>{inr(parsedAmt)}</strong> via UPI</p>
        </div>

        <div className="p-6">
          <div className="mb-5">
            <label className="block text-sm font-extrabold text-gray-700 mb-1">
              Enter Transaction ID / UTR Number
            </label>
            <p className="text-xs text-gray-400 mb-3">
              Find this in your PhonePe / GPay / Paytm notification or transaction history
            </p>
            <input ref={utrRef} type="text"
              placeholder="e.g. T2406151234567 or 426123456789"
              value={utr} onChange={(e) => setUtr(e.target.value.toUpperCase())} maxLength={30}
              className="w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl px-4 py-3.5 text-base font-mono font-semibold text-gray-800 focus:outline-none transition-colors tracking-wider" />
            <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <span className="text-lg flex-shrink-0">💡</span>
              <p className="text-xs text-amber-700 leading-relaxed">
                Open your UPI app → Transaction History → Tap on this payment → Copy the <strong>UTR No.</strong> or <strong>Transaction ID</strong>
              </p>
            </div>
          </div>

          <button onClick={handleUtrSubmit} disabled={!utr.trim() || utr.trim().length < 6}
            className="cursor-pointer w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base text-white transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg,#16a34a,#15803d)" }}>
            Continue →
          </button>
          <button onClick={() => { setPhase("qr"); setUtr(""); }}
            className="cursor-pointer w-full py-2.5 mt-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors">
            ← Go back to QR
          </button>
        </div>
      </div>
    </div>
  );

  /* ══════════════  PHASE: confirm  ══════════════ */
  return (
    <div className="space-y-4">
      {StudentCard}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg"
            style={{ background: "linear-gradient(135deg,#16a34a,#15803d)" }}>
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-extrabold text-gray-800">Confirm Payment</h3>
          <p className="text-sm text-gray-400 mt-1 text-center">Review and save to generate receipt</p>
        </div>

        <div className="rounded-xl border border-gray-100 overflow-hidden mb-5">
          {[
            ["Student",        `${student.firstName} ${student.lastName}`],
            ["Course",         `${student.course} · ${activeEntry?.year} Year`],
            ["Amount Paid",    inr(parsedAmt)],
            ["Due After",      inr(Math.max((student.dueFee ?? 0) - parsedAmt, 0))],
            ["Transaction ID", utr.trim()],
            ...(remarks ? [["Remarks", remarks]] : []),
          ].map(([lbl, val], i) => (
            <div key={lbl} className={`flex justify-between items-center px-4 py-3 text-sm ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
              <span className="text-gray-400 font-medium">{lbl}</span>
              <span className={`font-bold ${lbl === "Amount Paid" ? "text-emerald-600 text-base" : lbl === "Transaction ID" ? "text-gray-700 font-mono text-xs" : "text-gray-800"}`}>
                {val}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={() => setPhase("paid")}
            className="cursor-pointer px-5 py-3.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-gray-400 transition-colors">
            ← Back
          </button>
          <button onClick={handleConfirm} disabled={saving}
            className="cursor-pointer flex-1 flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl transition-all shadow-md disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#16a34a,#15803d)" }}>
            {saving ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Saving…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                Save &amp; Generate Receipt
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   STEP 2 — RECEIPT
══════════════════════════════════════════════════════════════════════════════ */
function StepReceipt({ data, onBack }) {
  const receiptRef  = useRef();
  const isFullyPaid = data.remainingDue <= 0;

  const handlePrint = () => {
    const inner = receiptRef.current.innerHTML;
    const win = window.open("", "_blank", "width=780,height=1020");
    win.document.write(`<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8"/>
<title>Fee Receipt · ${data.receiptNumber}</title>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Sans',sans-serif;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact;color:#1a1a1a}
.page{max-width:700px;margin:0 auto}
table{width:100%;border-collapse:collapse;font-size:12px;margin-bottom:10px}
th{background:#f5f0e8;color:#7c1d1d;font-weight:700;padding:7px 11px;font-size:9.5px;letter-spacing:1px;text-transform:uppercase;border:1px solid #e8d8b0;text-align:left}
td{padding:8px 11px;border:1px solid #ede8dc}
tr:nth-child(even) td{background:#faf8f4}
.wm{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-38deg);font-family:'EB Garamond',serif;font-size:140px;font-weight:900;color:rgba(124,29,29,0.04);pointer-events:none;white-space:nowrap;z-index:0}
</style></head><body>
<div class="wm">PAID</div>
<div class="page">${inner}</div>
<script>window.onload=()=>{window.print();window.close()}<\/script>
</body></html>`);
    win.document.close();
  };

  return (
    <div className="space-y-4">
      <div ref={receiptRef} className="overflow-hidden rounded-2xl border border-gray-200 shadow-xl bg-white">

        {/* College header */}
        <div style={{ background: "linear-gradient(135deg,#7c1d1d 0%,#991b1b 50%,#7c1d1d 100%)" }}
          className="px-8 py-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl flex-shrink-0 border-2"
            style={{ background: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.3)" }}>🎓</div>
          <div className="flex-1">
            <h1 style={{ fontFamily: "'Georgia',serif" }} className="text-2xl font-bold text-white tracking-wide leading-tight">
              FMS College of Technology
            </h1>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>
              Faculty Management System · Affiliated to State University
            </p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
              123 College Road, City · Tel: +91-XXXXXXXXXX
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "1px" }}>ESTD.</p>
            <p className="text-xl font-bold text-white">2005</p>
          </div>
        </div>

        {/* Title bar */}
        <div className="flex justify-between items-center px-8 py-3"
          style={{ background: "#f5f0e8", borderBottom: "2px solid #7c1d1d" }}>
          <p style={{ fontFamily: "'Georgia',serif", color: "#7c1d1d", letterSpacing: "3px" }}
            className="text-sm font-bold uppercase">Fee Payment Receipt</p>
          <div className="text-right">
            <p className="text-[9px] text-gray-400 uppercase tracking-widest">Receipt No.</p>
            <p className="font-mono font-bold text-gray-800 text-sm mt-0.5">{data.receiptNumber}</p>
          </div>
        </div>

        <div className="px-8 py-6">
          {/* Amount hero */}
          <div className="rounded-xl p-5 mb-6 flex justify-between items-center"
            style={{ background: "linear-gradient(135deg,#7c1d1d,#991b1b)" }}>
            <div>
              <p className="text-[9px] tracking-[3px] uppercase mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>Amount Paid</p>
              <p style={{ fontFamily: "'Georgia',serif", fontSize: "42px", fontWeight: 800, color: "#fff", letterSpacing: "-1px", lineHeight: 1 }}>
                {inr(data.amountPaid)}
              </p>
              <p className="text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.45)" }}>
                {fmtDate(data.paymentDate)} · {data.year} Year
              </p>
            </div>
            <div style={{ transform: "rotate(-5deg)" }}
              className="border-2 border-yellow-400 text-yellow-300 px-5 py-2.5 rounded font-black tracking-[5px] text-sm">
              ✓ PAID
            </div>
          </div>

          {/* Student info */}
          <div className="mb-5">
            <p style={{ fontFamily: "'Georgia',serif", color: "#7c1d1d", letterSpacing: "2px", borderBottom: "1.5px solid #e8d8b0" }}
              className="text-xs font-bold uppercase pb-1.5 mb-3">Student Information</p>
            <div className="grid grid-cols-2 gap-x-8">
              {[
                ["Student Name",   data.studentName],
                ["Course",         data.course],
                ["Year",           `${data.year} Year`],
                ["Email",          data.email],
                ["Phone",          data.phoneNo],
                ["Payment Method", data.paymentMethod],
              ].map(([lbl, val]) => val ? (
                <div key={lbl} className="flex gap-2 py-1.5 border-b" style={{ borderColor: "#f0ebe0" }}>
                  <span className="text-xs text-gray-400 min-w-[110px] flex-shrink-0">{lbl}</span>
                  <span className="text-xs font-semibold text-gray-800 truncate">{val}</span>
                </div>
              ) : null)}
            </div>
          </div>

          {/* Fee table */}
          <div className="mb-4">
            <p style={{ fontFamily: "'Georgia',serif", color: "#7c1d1d", letterSpacing: "2px", borderBottom: "1.5px solid #e8d8b0" }}
              className="text-xs font-bold uppercase pb-1.5 mb-3">Fee Details — {data.year} Year</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ background: "#f5f0e8" }}>
                  <th className="text-left px-3 py-2 text-xs font-bold uppercase tracking-wide border" style={{ color: "#7c1d1d", borderColor: "#e8d8b0" }}>Description</th>
                  <th className="text-right px-3 py-2 text-xs font-bold uppercase tracking-wide border" style={{ color: "#7c1d1d", borderColor: "#e8d8b0" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: `${data.year} Year Fee`,              val: inr(data.courseFee),                        cls: "text-gray-700"             },
                  { label: "Previously Paid This Year",           val: inr((data.paidFee ?? 0) - data.amountPaid), cls: "text-emerald-600"          },
                  { label: "Balance Before This Payment",         val: inr(data.previousDue),                      cls: "text-red-500"              },
                  { label: "Amount Paid (This Transaction)",      val: `+ ${inr(data.amountPaid)}`,                cls: "text-emerald-600 font-bold" },
                ].map(({ label, val, cls }, i) => (
                  <tr key={label} style={{ background: i % 2 === 0 ? "#faf8f4" : "#fff" }}>
                    <td className="px-3 py-2.5 border text-gray-600" style={{ borderColor: "#ede8dc" }}>{label}</td>
                    <td className={`px-3 py-2.5 border text-right ${cls}`} style={{ borderColor: "#ede8dc" }}>{val}</td>
                  </tr>
                ))}
                <tr style={{ background: "#7c1d1d" }}>
                  <td className="px-3 py-3 text-white font-bold border" style={{ borderColor: "#991b1b" }}>Balance Remaining This Year</td>
                  <td className={`px-3 py-3 text-right font-extrabold border ${isFullyPaid ? "text-yellow-300" : "text-red-200"}`}
                    style={{ borderColor: "#991b1b" }}>{inr(data.remainingDue)}</td>
                </tr>
              </tbody>
            </table>

            {data.nextYearUnlocked && (
              <div style={{ marginTop: "10px", padding: "10px 14px", background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "16px" }}>🎉</span>
                <p style={{ margin: 0, fontSize: "12px", color: "#059669", fontWeight: 600 }}>
                  {data.year} year fully paid! {data.nextYearUnlocked} year is now unlocked.
                </p>
              </div>
            )}

            <div className="flex justify-between items-center px-3 py-2.5 rounded-lg mt-3"
              style={{ background: "#faf8f4", border: "1.5px solid #e8d8b0" }}>
              <span className="text-xs text-gray-500">Year Fee Status</span>
              <span className={`text-xs font-bold px-4 py-1.5 rounded-full ${
                isFullyPaid ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-yellow-50 text-yellow-700 border border-yellow-200"
              }`}>{isFullyPaid ? "YEAR FULLY PAID" : "PARTIALLY PAID"}</span>
            </div>
          </div>

          {/* Transaction */}
          <div>
            <p style={{ fontFamily: "'Georgia',serif", color: "#7c1d1d", letterSpacing: "2px", borderBottom: "1.5px solid #e8d8b0" }}
              className="text-xs font-bold uppercase pb-1.5 mb-3">Transaction Details</p>
            <div className="grid grid-cols-2 gap-x-8">
              {[
                ["Transaction ID",  data.transactionId],
                ["UPI Ref (UTR)",   data.utr || "—"],
                ["Payment Method",  data.paymentMethod],
                ["Receipt No.",     data.receiptNumber],
                ...(data.remarks ? [["Remarks", data.remarks]] : []),
              ].map(([lbl, val]) => (
                <div key={lbl} className="flex gap-2 py-1.5 border-b" style={{ borderColor: "#f0ebe0" }}>
                  <span className="text-xs text-gray-400 min-w-[110px] flex-shrink-0">{lbl}</span>
                  <span className="text-xs font-semibold text-gray-800 font-mono truncate">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end px-8 py-4"
          style={{ background: "#f5f0e8", borderTop: "2px solid #7c1d1d" }}>
          <div>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Computer-generated receipt · No physical signature required.<br />
              For fee queries contact the Finance Department.
            </p>
            <p className="text-[10px] text-gray-400 mt-1">Generated: {fmtDate(new Date())}</p>
          </div>
          <div className="text-right flex-shrink-0 ml-8">
            <div className="w-28 border-t border-gray-400 mb-1" />
            <p className="text-[9px] text-gray-400 uppercase tracking-widest">Cashier / Finance Dept.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pb-6">
        <button onClick={onBack}
          className="cursor-pointer px-5 py-3.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-gray-400 transition-colors">
          ← Back
        </button>
        <button onClick={handlePrint}
          className="cursor-pointer flex-1 flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
          style={{ background: "linear-gradient(135deg,#7c1d1d,#991b1b)" }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
          </svg>
          Download / Print Receipt
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN PAGE — fetches LIVE data from backend, no localStorage for student data
══════════════════════════════════════════════════════════════════════════════ */
export default function PaymentPage() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [step,        setStep]        = useState("pay");
  const [student,     setStudent]     = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");

  // ── Fetch live student + fee data from backend ───────────────────────────
  const fetchStudent = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/student/get-fee-details/${id}`);
      if (res.data?.success) {
        setStudent(res.data.student);
        // Keep only _id in localStorage — all real data is fetched live
        const stored = JSON.parse(localStorage.getItem("studentDet") || "{}");
        localStorage.setItem("studentDet", JSON.stringify({ ...stored, _id: res.data.student._id }));
      } else {
        setError(res.data?.message || "Student not found");
      }
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load student");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudent(); }, [id]);

  const handleSuccess = (payment) => {
    setReceiptData(payment);
    setStep("receipt");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 font-medium text-sm">Loading fee details…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-xs">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-gray-700 font-semibold mb-4">{error}</p>
        <button onClick={() => navigate(-1)}
          className="cursor-pointer px-6 py-2.5 bg-gray-800 text-white rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors">
          ← Go Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-gray-400 transition-colors text-base font-bold">
            ←
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-black text-gray-800 tracking-tight leading-tight">Fee Payment</h1>
            <p className="text-xs text-gray-400">Faculty Management System</p>
          </div>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold shadow-md text-base"
            style={{ background: "linear-gradient(135deg,#7c1d1d,#991b1b)" }}>₹</div>
        </div>

        {/* Step indicator */}
        <div className="max-w-lg mx-auto px-4 pb-3 flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            step === "pay" ? "bg-orange-500 text-white" : "bg-emerald-100 text-emerald-700"
          }`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step === "pay" ? "bg-white/20" : "bg-emerald-500 text-white"
            }`}>{step === "receipt" ? "✓" : "1"}</span>
            Pay Fees
          </div>
          <div className="flex-1 h-px bg-gray-200 mx-1" />
          <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            step === "receipt" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"
          }`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step === "receipt" ? "bg-white/20" : "bg-gray-200 text-gray-400"
            }`}>2</span>
            Receipt
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5">
        {step === "pay"
          ? <StepPayment student={student} onSuccess={handleSuccess} onRefresh={fetchStudent} />
          : <StepReceipt data={receiptData} onBack={() => navigate(-1)} />
        }
      </div>
    </div>
  );
}