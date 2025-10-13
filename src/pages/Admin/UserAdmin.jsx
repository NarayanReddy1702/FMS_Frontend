import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa';
import BASE_URL from '../../utils/Config';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const UserAdmin = () => {
const navigate = useNavigate()
  const [allUser,setAllUser]=useState([])

  useEffect(()=>{
    axios.get(`${BASE_URL}/user/allUsers`,{},{withCredentials:true}).then((res)=>setAllUser(res.data.users)).catch(error=>console.log(error))
  },[allUser])

 const handleDelete = async (id) => {
  try {
    const isConfirmed = window.confirm(`Do you want to delete this user with ID: ${id}?`);

    if (isConfirmed) {
      const res = await axios.delete(`${BASE_URL}/user/deleteAuth/${id}`, {
        withCredentials: true,
      });

      if (res.data?.success) {
        toast.success(res.data?.message);
      } else {
        toast.error(res.data?.message || "Failed to delete user");
      }
    }
  } catch (error) {
    toast.error("Failed to delete user");
    console.error(error);
  }
};

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
       {allUser.length>0? <><div className=" w-full px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Users List</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">SI No</th>
                <th className="px-6 py-3 text-left">Username</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Gender</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {allUser.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium">{user.username}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.gender}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button onClick={()=>navigate(`/admin/userEdit/${user._id}`)} className="flex items-center cursor-pointer gap-2 px-3 py-1 rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition">
                        <FaEdit />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button onClick={()=>handleDelete(user._id)} className="flex items-center gap-2 px-3 cursor-pointer py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition">
                        <FaTrash />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div></>:<div className=' justify-center flex items-center py-7'>
          <h1 >There is no data yet!</h1></div>}
      </div>
    </div>
  );
}

export default UserAdmin
