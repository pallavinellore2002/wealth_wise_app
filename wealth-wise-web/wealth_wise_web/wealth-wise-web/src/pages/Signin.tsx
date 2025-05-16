import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Signin = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { loginWithRedirect } = useAuth0(); // Auth0 function

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@") || password.length < 6) {
      alert("Please enter valid credentials.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/signin/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("isLoggedIn", "true");
        alert("Login successful!,Welcome to Wealth Wise Financial Calculators");
        navigate("/home"); // redirect to WealthWise after login 
         
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error during signin");
    }
  };

  return (
    <div style={wrapperStyle}>
      <form onSubmit={handleSignin} style={formStyle}>
        <h1 style={headingStyle}>Sign In</h1>

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
        <p style={{ textAlign: "right", margin: "0" }}>
          <button
            type="button"
            onClick={() => {
              window.location.href = "http://127.0.0.1:8000/auth/password-reset/";
            }}
            style={linkButtonStyle}
          >
            Forgot password?
          </button>
        </p>

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        


        <button type="submit" style={buttonStyle}>Login</button>

        {/* Login with Google */}
        <button
          type="button"
          onClick={() => loginWithRedirect()}
          style={googleButtonStyle}
        >
          Login with Google
        </button>
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
  gap: "15px",
  background: "white",
  padding: "40px",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const headingStyle = {
  textAlign: "center" as const,
  fontSize: "35px",
  marginBottom: "30px",
};

const buttonStyle = {
  padding: "10px",
  backgroundColor: "green",
  color: "white",
  border: "none",
  borderRadius: "5px",
};

const googleButtonStyle = {
  padding: "10px",
  backgroundColor: "blue",
  color: "white",
  border: "none",
  borderRadius: "5px",
};

const linkButtonStyle = {
  background: "none",
  border: "none",
  color: "#007bff",
  textDecoration: "underline",
  cursor: "pointer",
  fontSize: "14px",
};

export default Signin;
