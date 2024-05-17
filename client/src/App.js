import { BrowserRouter, Navigate } from "react-router-dom";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import Chat from "./pages/chat";
import Login from "./pages/login";
import Signup from "./pages/signup";

function App() {
  const isAuthenticated = localStorage.getItem("token");
  return (
    <div>
      <BrowserRouter>
        {isAuthenticated ? (
          <Routes>
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<Navigate to="/chat" />} />
          </Routes>
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
