import axios from "axios";
import { useCookies } from "react-cookie";

export async function GetUserData() {
  const [cookie] = useCookies(["access_token"]);

  const res = await axios.get(
    `https://notes-app-pvrs.onrender.com/api/v1/users/me`,
    {
      headers: { Authorization: `Bearer ${cookie.access_token}` },
    }
  );

  return res.data.user;
}
