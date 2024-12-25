import { deleteAUser, getAllUser } from "@/redux/reducers/adminSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const DashboardScreen = () => {
  const dispatch = useDispatch()
  const {users, totalPages} = useSelector((state: any) => state.admin)
  const [page, setPage] = useState(0)

  useEffect(()=> {
    dispatch(getAllUser({page: page}))
  }, [page])

  return (
    
            

<div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full px-6 py-6 rounded-2xl custom-scrollbar">
    
    <table className="w-full text-sm text-left rtl:text-right text-gray-400">
        <thead className="text-xs  uppercase  bg-gray-700 text-gray-400">
            <tr>
                
                <th scope="col" className="px-6 py-3">
                    Name
                </th>
                
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody className="h-96 overflow-y-scroll">
          {users.map((user: any) => (
            <tr className=" border-b bg-gray-800 border-gray-700  hover:bg-gray-600 ">
                
                <th scope="row" className="flex items-center px-6 py-4  whitespace-nowrap text-white">
                    <img className="w-10 h-10 rounded-full" src={user.profilePic} alt="Jese image"/>
                    <div className="ps-3">
                        <div className="text-base font-semibold">{user.name}</div>
                        <div className="font-normal text-gray-500">{user.email}</div>
                    </div>  
                </th>
                
                <td className="px-6 py-4">
                    <button onClick={()=>{
                      dispatch(deleteAUser(user.id))
                      dispatch(getAllUser({page: page}))
                      }} className="h-8 w-24 bg-red rounded-xl font-medium text-white hover:underline">Delete user</button>
                </td>
            </tr>
          ))}
            
            
        </tbody>
    </table>
    <nav aria-label="Page navigation example">
  <ul className="inline-flex -space-x-px text-sm mt-6">
    <li onClick={() => setPage(page - 1)}>
      <a href="#" className="flex items-center justify-center px-3 h-8 ms-0 leading-tight  border border-e-0  rounded-s-lg  bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white">Previous</a>
    </li>
    {totalPages > 0 && [...Array(totalPages)].map((_, index) => (
      <li key={index} onClick={() => setPage(index)}>
        <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight  border border-e-0  bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white">{index + 1}</a>
      </li>
    ))}
    <li onClick={() => setPage(page + 1)}>
      <a href="#" className="flex items-center justify-center px-3 h-8 ms-0 leading-tight  border border-e-0  rounded-e-lg  bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white">Next</a>
    </li>
  </ul>
</nav>
</div>

       
  );
};

export default DashboardScreen;
