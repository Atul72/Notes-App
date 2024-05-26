import { useCookies } from "react-cookie";
import "./myNotes.css";
import { useEffect, useState } from "react";
import axios from "axios";

function MyNotes() {
  const [notes, setNotes] = useState([]);
  const [cookie] = useCookies(["access_token"]);
  const userId = window.localStorage.getItem("userId");

  useEffect(function () {
    const userNotes = async () => {
      try {
        if (!userId) return;
        const res = await axios.get(
          `http://127.0.0.1:7500/api/v1/users/${userId}/notes`,
          {
            headers: { Authorization: `Bearer ${cookie.access_token}` },
          }
        );

        setNotes(res.data.notes);
      } catch (error) {
        console.log(error);
      }
    };
    userNotes();
  }, []);

  if (notes.length > 0) {
    return (
      <div className="main-section">
        Your notes are as follows:==
        <ul>
          {notes.map((note) => (
            <li key={Math.random()}>
              <div>{note.title}</div>
              <div>{note.content}</div>
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    return (
      <div>
        <button>Login</button>
        <button>SignUp</button>
      </div>
    );
  }
}

export default MyNotes;
