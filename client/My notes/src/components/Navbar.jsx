import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useCookies } from "react-cookie";

function Navbar() {
  const [cookies, setCookies] = useCookies(["access_token"]);

  const navigate = useNavigate();

  function logout() {
    setCookies("access_token", "");
    window.localStorage.removeItem("userId");
    navigate("/login");
  }

  return (
    <>
      <nav className="navbar">
        <Link className="logo" to="/">
          NotesX
        </Link>
        <div className="links">
          <Link to="/myNotes" className="link">
            My Notes
          </Link>
          {!cookies.access_token ? (
            <>
              <Link to="/login" className="link">
                Login
              </Link>
              <Link to="/signup" className="link">
                SignUp
              </Link>
            </>
          ) : (
            <>
              <Link to="/createNote" className="link">
                Create Note
              </Link>
              <button className="button" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
