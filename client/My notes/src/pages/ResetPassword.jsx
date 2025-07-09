import { useForm } from "react-hook-form";
import axios from "axios";
import "./resetPassword.css";
import { useParams } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ResetPassword() {
  const { handleSubmit, register } = useForm();
  const { token } = useParams();

  async function onSubmit(d) {
    if (!d.password && !d.passwordConfirm) return;
    const res = await axios.post(
      `https://notes-app-pvrs.onrender.com/api/v1/users/resetPassword/${token}`,
      {
        password: d.password,
        passwordConfirm: d.passwordConfirm,
      }
    );

    if (res.data.status === "Success") {
      toast(res.data.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  }
  return (
    <>
      <div className="resetContainer">
        <form id="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="reset_header">Reset your password</div>
          <div className="reset_body">
            <div className="form_group">
              <input
                type="text"
                placeholder="Enter new password"
                id="password"
                {...register("password")}
              />
              <input
                type="text"
                placeholder="Confirm your password"
                {...register("passwordConfirm")}
              />
            </div>
          </div>
          <div className="footer">
            <button type="submit" className="btn_submit">
              Change your password
            </button>
          </div>
        </form>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
      />
    </>
  );
}

export default ResetPassword;
