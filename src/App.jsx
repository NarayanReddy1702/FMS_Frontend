import { useNavigate } from "react-router-dom";




/* ── MAIN APP ── */
export default function App() {
const navigate = useNavigate()

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
            onClick={() =>navigate("/profile")}
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

    </>
  );
}
