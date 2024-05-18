import React, { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import MyToastContainer from "../components/MyToastContainer";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const resetForm = () => {
    setUsername("");
    setPassword("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username) {
      toast.error("Username is required");
      return;
    }
    if (!password) {
      toast.error("Password is required");
      return;
    }
    const userData = { username, password };

    api
      .post("/users/login", userData)
      .then((response) => {
        toast.success("Logged In successfully!");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.user.username);
        localStorage.setItem("id", response.data.user.id);
        resetForm();
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      })
      .catch((error) => {
        if (error) {
          toast.error(error.response.data.msg);
        }
      });
  };

  return (
    <>
      <MyToastContainer />
      <div className="flex min-h-screen items-center justify-center p-12">
        <form onSubmit={handleSubmit}>
          <div className="max-w-sm rounded-3xl bg-gradient-to-b from-sky-300 to-purple-500 p-px">
            <div className="rounded-[calc(1.5rem-1px)] bg-white px-10 p-12">
              <div>
                <h1 className="text-xl font-semibold text-gray-800">
                  Sign In to your account
                </h1>
                <p className="text-sm tracking-wide text-gray-600">
                  Don't have an account ?{" "}
                  <a
                    href="/signup"
                    className="text-blue-600 transition duration-200 hover:underline"
                  >
                    Signup
                  </a>{" "}
                  for free
                </p>
              </div>
              <div className="mt-8 space-y-8">
                <div className="space-y-6">
                  <input
                    className="w-full bg-transparent text-gray-600 rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-600 invalid:border-red-500"
                    placeholder="Your Username"
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <input
                    className="w-full bg-transparent text-gray-600 rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-600 invalid:border-red-500"
                    placeholder="Your Password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  className="relative h-9 px-3 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:bg-blue-700 transition duration-500 rounded-md text-white"
                  type="submit"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
