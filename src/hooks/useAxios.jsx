import { useEffect } from "react";
import axios from "axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

// Create Axios instance
const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,   
  withCredentials: true,                   
});

export default function useAxios() {
  const navigate = useNavigate();
  const { logOut } = useAuth();

  useEffect(() => {
    // -------------- REQUEST INTERCEPTOR --------------
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access-token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // -------------- RESPONSE INTERCEPTOR --------------
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status;

        // If token expired or unauthorized
        if (status === 401 || status === 403) {
          await logOut();
          navigate("/login");
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logOut, navigate]);

  return axiosSecure;
}
