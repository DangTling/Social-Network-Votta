import { createContext, useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import io from "socket.io-client"

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketContextProvider = ({children}) => {
    const [socket, setSocket] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const currentUser = useSelector((state:any)=>state.auth.login.currentUser);

    useEffect(() => {
        if (currentUser?.id) {
            const socket = io("http://localhost:8086", {
                query: {
                    userId: currentUser.id,
                },
            });

            socket.on('connect', () => {
                console.log('socket server is connected')
            })

            socket.on('disconnect', () => {
                console.log('socket server is disconnected')
            })

            setSocket(socket);

            socket.on("getOnlineUsers", (users) => setOnlineUsers(users));
            return () => socket && socket.close();
        }
    }, [currentUser?.id]);
    

    return <SocketContext.Provider value={{socket, onlineUsers}}>{children}</SocketContext.Provider>
}