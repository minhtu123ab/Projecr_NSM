import axios from "axios";
import env from "../Env";

const useRefeshToken = async () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const TokenRefresh = {
    refresh: token.refresh,
  };
  try {
    const response = await axios.post(
      env.urlServer + "/refresh-token",
      TokenRefresh
    );
    localStorage.setItem("token", JSON.stringify(response.data));
    return response.data.access;
  } catch (err) {
    console.log(err);
    window.location.href("login");
    return null;
  }
};

export default useRefeshToken;
