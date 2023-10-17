import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat,setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  
  const navigate = useNavigate(); // Use the useNavigate hook to obtain the navigation function

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    // Check if user is logged in - as user info will be stored in local storage
    if (!userInfo) {
      navigate("/"); // Use the navigate function to perform navigation
    }
  }, [navigate]);

  return (
    <ChatContext.Provider value={{ user, setUser , selectedChat, setSelectedChat, chats, setChats }}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
