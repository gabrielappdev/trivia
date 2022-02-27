import axios from "axios";

const axiosClient = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "production_url"
      : "http://localhost:1337/api",
});

axiosClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("_trivia");
    if (user) {
      const userObject = JSON.parse(user);
      config.headers.Authorization = `Bearer ${userObject!.user!.jwt}`;
    }
  }
  return config;
});

export default axiosClient;
