import { useState } from "react";
import "./login.css";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setCookie] = useCookies(["access_token"]);
  const navigate = useNavigate("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email && !password) {
      return;
    }
    const user = {
      email,
      password,
    };

    const res = await axios.post(
      "http://127.0.0.1:7500/api/v1/users/login",
      user
    );
    console.log(res);
    setCookie("access_token", res.data.token);
    window.localStorage.setItem("userId", res.data.user.id);
    navigate("/myNotes");
  }

  return (
    <div className="login-page">
      <div className="banner">
        <span>Login Into Your Account</span>
      </div>
      <div className="main">
        <div className="content">
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div>
              <button className="button">Login</button>
              <Link to="/forgot" className="fpass">
                forgot password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
