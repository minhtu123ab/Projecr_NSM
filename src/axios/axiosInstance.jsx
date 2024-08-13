import axios from "axios";
import env from "../Env";
import useRefeshToken from "../hook/useRefeshToken";
import { useNavigate } from "react-router-dom";

const axiosInstance = (token) => {
  const navigate = useNavigate();

  const instance = axios.create({
    baseURL: env.urlServer,
    headers: {
      Authorization: `Bearer ${token.access}`,
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response.status === 401) {
        const newToken = await useRefeshToken();
        if (newToken) {
          return instance.request(error.config);
        } else {
          navigate(`/login`);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default axiosInstance;
