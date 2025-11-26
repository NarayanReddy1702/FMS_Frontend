import React, { useEffect, useState } from 'react'

import Card from '../../components/Card'
import axios from 'axios'
import BASE_URl from "../../utils/Config"
import { FaBook, FaUsers } from 'react-icons/fa'

const HomeAdmin = () => {
  const [userLength,setUserLength]=useState(0)
  const [studentLength,setStudentLength]=useState(0)

  useEffect(()=>{
  async function fetchAllUser(){
        const res =  await  axios.get(`${BASE_URl}/user/allUsers`,{},{withCredential:true})
        if(res.data?.success){
           setUserLength(res.data?.users.length)
           console.log(res.data?.message);
           
        }else{
        console.error(res.data?.message);
        }
        
           
    }
    fetchAllUser()


    async function fetchAllStudent(){
          const res =  await  axios.get(`${BASE_URl}/student/all-student`,{},{withCredential:true})
        if(res.data?.success){
           setStudentLength(res.data?.student.length)
           console.log(res.data?.message);
           
        }else{
        console.error(res.data?.message);
        }
        
    }
    fetchAllStudent()
  },[userLength,studentLength])
  return (
    <div className='p-5'>
         <div className="flex gap-5 flex-wrap">
        <Card length={userLength} title={"Total Users Register"} router={"/admin/users"} icon={<FaUsers size={28} />}/>
        <Card length={studentLength} title={"Total Student Register"} router={"/admin/students"} icon={ <FaBook size={28} />}/>
    </div>
    </div>
  )
}

export default HomeAdmin
