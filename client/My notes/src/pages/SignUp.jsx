import { useState } from "react";
import "./signUp.css";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [, setCookie] = useCookies(["access_token"]);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name && !email && !password && !passwordConfirm) return;
    const newUser = {
      name,
      email,
      password,
      passwordConfirm,
    };
    const res = await axios.post(
      `https://notes-app-pvrs.onrender.com/api/v1/users/signUp`,
      newUser
    );

    setCookie("access_token", res.data.token);
    window.localStorage.setItem("userId", res.data.data._id);

    navigate("/myNotes");
  }

  return (
    <div className="login-page">
      <div className="banner">
        <span>Create Your Account</span>
      </div>
      <div className="main">
        <div className="content">
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input
              type="name"
              name="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
            <label htmlFor="passwordConfirm">Password Confirm</label>
            <input
              type="password"
              name="passwordConfirm"
              placeholder="Re-enter your password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />

            <button className="button">SignUp</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
