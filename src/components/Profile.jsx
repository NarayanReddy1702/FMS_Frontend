import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const navigate = useNavigate();
  const student = JSON.parse(localStorage.getItem("studentDet"));

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl p-6 md:p-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-8 mb-8 text-center sm:text-left">
          <img
            src={student.profilePic || "/default-avatar.png"}
            alt="Profile"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-orange-500 shadow-md"
          />
          <div className="mt-4 sm:mt-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mt-1">{student.email}</p>
            <p className="text-gray-500 text-sm sm:text-base">📞 {student.phoneNo}</p>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Parent Details */}
          <div className="bg-orange-50 p-5 rounded-lg shadow-sm hover:shadow-md transition">
            <h2 className="font-semibold text-gray-700 mb-3 text-lg">👨‍👩‍👧 Parent's Details</h2>
            <p className="text-gray-700"><span className="font-medium">Father:</span> {student.fathersName}</p>
            <p className="text-gray-700"><span className="font-medium">Mother:</span> {student.mothersName}</p>
          </div>

          {/* Academic Details */}
          <div className="bg-orange-50 p-5 rounded-lg shadow-sm hover:shadow-md transition">
            <h2 className="font-semibold text-gray-700 mb-3 text-lg">🎓 Academic Details</h2>
            <p className="text-gray-700"><span className="font-medium">Course:</span> {student.course}</p>
            <p className="text-gray-700"><span className="font-medium">Year:</span> {student.year}</p>
            <p className="text-gray-700">
              <span className="font-medium">
                Total {student.course === "MBA" || student.course === "M.Tech" || student.course === "Diploma" ? "3" : student.course === "B.Tech" ? "4" : ""} Year Course Fee:
              </span>{" "}
              ₹{student.courseFee || "N/A"}
            </p>
          </div>

          {/* Personal Info */}
          <div className="bg-orange-50 p-5 rounded-lg shadow-sm hover:shadow-md transition">
            <h2 className="font-semibold text-gray-700 mb-3 text-lg">🧍 Personal Info</h2>
            <p className="text-gray-700"><span className="font-medium">Gender:</span> {student.gender}</p>
            <p className="text-gray-700"><span className="font-medium">DOB:</span> {student.dateOfBirth}</p>
            <p className="text-gray-700"><span className="font-medium">Address:</span> {student.address}</p>
          </div>

          {/* Contact Info */}
          <div className="bg-orange-50 p-5 rounded-lg shadow-sm hover:shadow-md transition">
            <h2 className="font-semibold text-gray-700 mb-3 text-lg">📧 Contact Info</h2>
            <p className="text-gray-700"><span className="font-medium">Email:</span> {student.email}</p>
            <p className="text-gray-700"><span className="font-medium">Phone:</span> {student.phoneNo}</p>
          </div>
        </div>

        {/* Edit Button */}
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
