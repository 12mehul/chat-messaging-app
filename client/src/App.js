import { BrowserRouter, Navigate } from "react-router-dom";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import Chat from "./pages/chat";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

function App() {
  const isAuthenticated = localStorage.getItem("token");
  return (
    <div>
      <BrowserRouter>
        {isAuthenticated ? (
          <div>
            <Header />
            <div className="w-full flex">
              <Sidebar />
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/chat/:chatId" element={<Chat />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
