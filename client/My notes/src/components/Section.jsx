import { Link } from "react-router-dom";
import "./Section.css";
import { useCookies } from "react-cookie";

function Section() {
  const [cookies] = useCookies(["access_token"]);
  return (
    <div className="section">
      <div className="content">
        <div className="main-heading">Save Your Notes</div>
        <div className="btn">
          {!cookies.access_token ? (
            <>
              <Link to="signUp" className="button">
                SignUp
              </Link>
              <Link to="login" className="button">
                Login
              </Link>
            </>
          ) : (
            <div>Please create note.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Section;
