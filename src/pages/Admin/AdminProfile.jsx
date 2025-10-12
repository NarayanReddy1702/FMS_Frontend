import React from 'react'
import { useNavigate } from 'react-router-dom'

const AdminProfile = () => {
   const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("userDet"))
  return (
     <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <img
            src={user.profilePic}
            alt="User Avatar"
            className="w-28 h-28 rounded-full border-4 border-orange-500 shadow-md"
          />
          <h2 className="text-2xl font-bold mt-4 text-gray-800">{user.username}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>

      

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6" onClick={()=>navigate(`/admin/userEdit/${user._id}`)}>
          <button  className="flex-1 bg-orange-500 cursor-pointer hover:bg-orange-600 text-white py-2 rounded-lg shadow transition">
            Edit User
          </button>
          
        </div>
      </div>
    </div>
  )
}

export default AdminProfile
