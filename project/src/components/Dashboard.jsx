import Sidebar from "../pages/Sidebar"
import Mainpage from '../pages/Mainpage'
export default function Dashboard() {
  function showChatbotOnLogin() {
  const chat = document.getElementById("chatbot");
  chat.style.display = "flex"; // show chatbot
  addMessage("👋 Welcome back! I’m your Expireery Assistant. How can I help today?", "bot");
}
showChatbotOnLogin()
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar/>
      <Mainpage/>
    </div>
  )
}
