import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const resetForm = () => {
    setUsername("");
    setPassword("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { username, password };

    api
      .post("/users", userData)
      .then((response) => {
        resetForm();
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((error) => {
        console.log("Error creating user:", error);
      });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-12">
      <form onSubmit={handleSubmit}>
        <div className="max-w-sm rounded-3xl bg-gradient-to-b from-sky-300 to-purple-500 p-px">
          <div className="rounded-[calc(1.5rem-1px)] bg-white px-10 p-12">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Sign up for an account
              </h1>
              <p className="text-sm tracking-wide text-gray-600">
                Already have an account ?{" "}
                <a
                  href="/"
                  className="text-blue-600 transition duration-200 hover:underline"
                >
                  Sign in
                </a>
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
              <button className="h-9 px-3 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:bg-blue-700 transition duration-500 rounded-md text-white">
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Signup;
