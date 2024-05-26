import axios from "axios";
import { useCookies } from "react-cookie";

export async function GetUserData() {
  const [cookie] = useCookies(["access_token"]);

  const res = await axios.get("http://127.0.0.1:7500/api/v1/users/me", {
    headers: { Authorization: `Bearer ${cookie.access_token}` },
  });

  return res.data.user;
}
