import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBudgetAuth } from "../contexts/BudgetAuthContext";

const BudgetSignin = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // Not used for auth, but kept if needed
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useBudgetAuth();

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/auth/budget-signin/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username , password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        login(); // set login state in context
        navigate("/budget");
      } else {
        alert(data.error || "Login failed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong during login.");
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gray-700">
      <form onSubmit={handleSignin} className="bg-white p-8 rounded-xl w-96 shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center"> Budget Sign In</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-6 p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
        >
          Login to Budget
        </button>
      </form>
    </div>
  );
};

export default BudgetSignin;
  

