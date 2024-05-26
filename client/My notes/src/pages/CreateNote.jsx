import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateNote() {
  const [userName, setUserName] = useState("");
  const [cookies] = useCookies(["access_token"]);
  const [userId] = window.localStorage.getItem("userId");

  const { register, handleSubmit } = useForm();

  useEffect(function () {
    const userName = async () => {
      const res = await axios.get("http://127.0.0.1:7500/api/v1/users/me", {
        headers: { Authorization: `Bearer ${cookies.access_token}` },
      });
      setUserName(res.data.user.name);
    };

    userName();
  }, []);

  const onSubmit = async (d) => {
    console.log(d);
    if (!d.content && !d.title) return;
    const newNote = {
      title: d.title,
      content: d.content,
      userId,
    };

    const res = await axios.post(
      "http://127.0.0.1:7500/api/v1/notes",
      newNote,
      { headers: { Authorization: `Bearer ${cookies.access_token}` } }
    );

    if (res.data.status === "Success") {
      toast("Note is saved", {
        position: "top-center",
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

    d.title = "";
    d.content = "";
  };

  return (
    <div>
      <h1>Create Your Note {userName}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Title</label>
        <input type="text" {...register("title")} />
        <label>Content</label>
        <input type="text" {...register("content")} />
        <input type="submit" value="Submit" />
      </form>
      <ToastContainer
        position="top-center"
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
    </div>
  );
}

export default CreateNote;
