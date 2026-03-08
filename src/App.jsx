import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import jsPDF from "jspdf";

/* ── QR SVG ── */
const QRCode = ({ amount, name }) => {
  const seed = (name + amount)
    .split("")
    .reduce((a, c) => a + c.charCodeAt(0), 0);
  const SIZE = 21,
    CELL = 8;
  const cells = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const inTL = r < 9 && c < 9;
      const inTR = r < 9 && c >= SIZE - 9;
      const inBL = r >= SIZE - 9 && c < 9;
      let dark = false;
      if (inTL)
        dark =
          r === 2 ||
          r === 6 ||
          c === 2 ||
          c === 6 ||
          (r >= 3 && r <= 5 && c >= 3 && c <= 5);
      else if (inTR)
        dark =
          r === 2 ||
          r === 6 ||
          c === SIZE - 3 ||
          c === SIZE - 7 ||
          (r >= 3 && r <= 5 && c >= SIZE - 6 && c <= SIZE - 4);
      else if (inBL)
        dark =
          r === SIZE - 3 ||
          r === SIZE - 7 ||
          c === 2 ||
          c === 6 ||
          (r >= SIZE - 6 && r <= SIZE - 4 && c >= 3 && c <= 5);
      else dark = (seed * (r * 31 + c * 17 + 7)) % 100 < 45;
      if (dark) cells.push({ r, c });
    }
  }
  const total = SIZE * CELL;

  return (
    <svg width={total} height={total} viewBox={`0 0 ${total} ${total}`}>
      <rect width={total} height={total} fill="white" />
      {cells.map(({ r, c }, i) => (
        <rect
          key={i}
          x={c * CELL}
          y={r * CELL}
          width={CELL}
          height={CELL}
          fill="#0f172a"
        />
      ))}
    </svg>
  );
};

/* ── Stepper ── */
const STEPS = ["details", "payment", "receipt"];
const STEP_LABELS = ["Student Details", "Scan & Pay", "Download Receipt"];

const Stepper = ({ current }) => {
  const idx = STEPS.indexOf(current);

  return (
    <div className="bg-white border-b border-slate-100 flex justify-center px-4">
      {STEPS.map((s, i) => {
        const active = i === idx;
        const done = i < idx;

        return (
          <div key={s} className="flex items-center">
            <div
              className={`flex items-center gap-2.5 px-4 sm:px-7 py-4 border-b-2
              ${
                active
                  ? "border-rose-500"
                  : done
                    ? "border-emerald-400"
                    : "border-transparent"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white
                ${
                  done
                    ? "bg-emerald-400"
                    : active
                      ? "bg-rose-500"
                      : "bg-slate-200"
                }`}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className={`text-sm font-semibold hidden sm:block
                ${
                  active
                    ? "text-slate-800"
                    : done
                      ? "text-slate-500"
                      : "text-slate-300"
                }`}
              >
                {STEP_LABELS[i]}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span className="text-slate-200 text-xl mx-0.5">›</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ── MAIN APP ── */
export default function App() {
  const [form, setForm] = useState({
    name: "",
    course: "",
    totalFee: "",
    paidFee: "",
  });

  const [step, setStep] = useState("details");
  const [paymentDone, setPaymentDone] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const balanceFee = Number(form.totalFee || 0) - Number(form.paidFee || 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProceed = () => {
    if (!form.name || !form.course || !form.totalFee || !form.paidFee) {
      toast.error("Please fill all fields");
      return;
    }
    setStep("payment");
  };

  const simulatePayment = () => {
    setCountdown(5);
    const iv = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(iv);
          setPaymentDone(true);
          toast.success("Payment verified!");
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const downloadReceipt = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("College Fee Receipt", 20, 20);

    doc.setFontSize(12);
    doc.text(`Student Name: ${form.name}`, 20, 40);
    doc.text(`Course: ${form.course}`, 20, 50);
    doc.text(`Total Fee: ₹${form.totalFee}`, 20, 60);
    doc.text(`Paid Fee: ₹${form.paidFee}`, 20, 70);
    doc.text(`Balance Fee: ₹${balanceFee}`, 20, 80);

    doc.save("fee-receipt.pdf");
    toast.success("Receipt downloaded");
  };

  return (
    <>

      {/* ================= HERO SECTION ================= */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 sm:px-10 md:px-20 py-20 bg-gray-50">
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            Fee Management System{" "}
            <span className="text-orange-500">(CFMS)</span>
          </h1>

          <p className="text-gray-600 text-lg max-w-xl">
            Manage student payments, generate receipts, and ensure financial
            transparency.
          </p>

          <button
            onClick={() => toast.success("Getting Started!")}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md"
          >
            Get Started
          </button>
        </div>

        <div className="w-full md:w-1/2 flex justify-center mb-10 md:mb-0">
          <img
            src="./home.png"
            alt="CFMS"
            className="w-72 md:w-[550px] object-contain drop-shadow-lg"
          />
        </div>
      </section>

      {/* ================= PROCESS HEADING ================= */}
      <section className="text-center py-10 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Fee Payment Process
        </h2>
        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
          Complete the following 3 simple steps to securely pay your fees and
          download your receipt.
        </p>
      </section>

      {/* ================= STEPPER ================= */}
      <Stepper current={step} />

      {/* ================= DETAILS STEP ================= */}
      {step === "details" && (
        <div className="max-w-lg mx-auto p-6 space-y-4">
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
          <input
            name="course"
            placeholder="Course"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
          <input
            name="totalFee"
            placeholder="Total Fee"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
          <input
            name="paidFee"
            placeholder="Paid Fee"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <button
            onClick={handleProceed}
            className="w-full bg-rose-500 text-white py-3 rounded"
          >
            Proceed to Payment
          </button>
        </div>
      )}

      {/* ================= PAYMENT STEP ================= */}
      {step === "payment" && (
        <div className="max-w-lg mx-auto p-6 text-center space-y-6">
          <QRCode amount={form.paidFee} name={form.name} />

          {countdown !== null ? (
            <h2 className="text-4xl text-rose-500">{countdown}</h2>
          ) : !paymentDone ? (
            <button
              onClick={simulatePayment}
              className="bg-rose-500 text-white px-6 py-3 rounded"
            >
              I've Completed Payment
            </button>
          ) : (
            <button
              onClick={() => setStep("receipt")}
              className="bg-green-500 text-white px-6 py-3 rounded"
            >
              View Receipt
            </button>
          )}
        </div>
      )}

      {/* ================= RECEIPT STEP ================= */}
      {step === "receipt" && (
        <div className="max-w-lg mx-auto p-6 space-y-4 text-center">
          <h2 className="text-2xl font-bold">Receipt</h2>
          <p>Name: {form.name}</p>
          <p>Course: {form.course}</p>
          <p>Total: ₹{form.totalFee}</p>
          <p>Paid: ₹{form.paidFee}</p>
          <p>Balance: ₹{balanceFee}</p>

          <button
            onClick={downloadReceipt}
            className="bg-blue-600 text-white px-6 py-3 rounded"
          >
            Download PDF
          </button>
        </div>
      )}
    </>
  );
}
