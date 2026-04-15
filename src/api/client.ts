import axios from "axios";

export const client = axios.create();

// Inject token on every request automatically
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("tf_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize errors
client.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.error ?? "Something went wrong";
    return Promise.reject(new Error(message));
  },
);
