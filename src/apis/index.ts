import axios from "axios";
import authAPI from "./authAPI";

export const customAxios = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://api.turtleship.io/v2"
      : // : "https://api.turtleship.io/v2"
        "http://localhost:8000/v2",
  headers: { "Content-Type": "application/json" },
});

export { authAPI };
