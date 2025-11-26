import { useNavigate } from "react-router-dom"

const Card = ({length,title,icon,router}) => {
  const navigate = useNavigate()
  return (
    <div onClick={()=>navigate(router)} className="bg-white rounded-2xl w-80 cursor-pointer shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition">
          <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
            {icon}
          </div>
          <div>
            <p className="text-gray-500 font-medium">{title}</p>
            <h2 className="text-2xl font-bold text-gray-800">{length}</h2>
          </div>
        </div>
  )
}

export default Card
