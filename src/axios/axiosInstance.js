import axios from "axios";
import env from "@/Env";
import useRefeshToken from "@/services/refeshToken";

const requestApi = (endpoint, method, body, params) => {
  const headers =
    body instanceof FormData
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" };

  const instance = axios.create({ headers, params });

  instance.interceptors.request.use(
    (config) => {
      const token = JSON.parse(localStorage.getItem("token"));
      if (token) {
        config.headers.Authorization = `Bearer ${token.access}`;
      } else {
        window.location.href = "/login";
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const orinalRequest = error.config;
      if (error.response.status === 401 && !orinalRequest._retry) {
        orinalRequest._retry = true;
        const newToken = await useRefeshToken();
        if (newToken) {
          orinalRequest.headers.Authorization = `Bearer ${newToken}`;
          return instance(orinalRequest);
        } else {
          window.location.href = "/login";
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance.request({
    method: method,
    url: `${env.urlServer}${endpoint}`,
    data: body,
    responseType: "json",
  });
};

export default requestApi;
