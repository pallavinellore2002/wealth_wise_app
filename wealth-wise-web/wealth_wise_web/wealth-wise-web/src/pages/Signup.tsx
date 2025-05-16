import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!username || !email.includes("@") || password.length < 6) {
      alert("Please fill in valid information.");
      return;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
  
      // const text = await response.text(); // use text for better debug
      // console.log("Raw response text:", text);
  
      // const data = JSON.parse(text);
      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Signup successful! please Sign in.");
        navigate("/signin");
      }else{
       if (data.error?.includes("exists")){
        alert("User already exists.Redirecting to signin...");
        navigate("/signin");
      }else {
          alert(data.error || "Signup failed.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };
  return (
    <div style={wrapperStyle}>
      <form onSubmit={handleSignup} style={formStyle}>
        <h1 style={headingStyle}>Sign Up</h1>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" style={buttonStyle}>Register</button>
      </form>
    </div>
  );
};

const wrapperStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "grey",
};

const formStyle = {
  display: "flex",
  flexDirection: "column" as const,
  width: "400px",
  gap: "20px",
  background: "white",
  padding: "35px",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const headingStyle = {
  textAlign: "center" as const,
  fontSize: "35px",
  marginBottom: "25px",
};

const buttonStyle = {
  padding: "10px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "10px",
};

export default Signup;
