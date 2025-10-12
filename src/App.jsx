import toast from "react-hot-toast";

const App = () => {
  return (
    <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 sm:px-10 md:px-20 py-12 md:py-20 bg-gray-50">
      
      {/* 🟠 Left Section - Text Content */}
      <div className="w-full md:w-1/2 space-y-6 text-center md:text-left mt-10 md:mt-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
          Fee Management System <span className="text-orange-500">(FMS)</span>
        </h1>

        <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto md:mx-0">
          The Fee Management System (FMS) is a digital platform designed to simplify 
          and automate student fee collection, tracking, and reporting. It helps 
          educational institutions manage payments efficiently, generate receipts, 
          and ensure transparency in all financial operations.
        </p>

        <div>
          <button
            onClick={() => toast.success("Getting Started!")}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition duration-300"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* 🟣 Right Section - Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src="./home.png"
          alt="Fee Management System Illustration"
          className="w-64 sm:w-80 md:w-[550px] lg:w-[600px] object-contain drop-shadow-lg"
        />
      </div>
    </section>
  );
};

export default App;
