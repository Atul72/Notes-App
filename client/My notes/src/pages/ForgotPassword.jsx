import "./forgotPassword.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

function ForgotPassword() {
  const { register, handleSubmit } = useForm();
  const [status, setStatus] = useState(false);

  async function onSubmit(data) {
    if (!data.to) return;
    const res = await axios.post(`https://notes-app-pvrs.onrender.com/api/v1/email`, {
      userEmail: data.to,
    });
    console.log(res);
    if (res.data.status === "Success") {
      setStatus(true);
    }
  }

  return (
    <div className="email">
      <form className="email_form" id="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="email_header">Forgot your password?</div>
        <div className="email_body">
          <div className="form-group">
            <input
              type="text"
              placeholder="Email"
              id="To:"
              {...register("to")}
            />
          </div>
        </div>
        <div className="email_footer">
          <button type="submit" className="btn_submit">
            Send reset email
          </button>
        </div>
      </form>
      <div>{status && <span>Email sent to your registered email id</span>}</div>
    </div>
  );
}

export default ForgotPassword;
