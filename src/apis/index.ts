import axios from "axios";
import authAPI from "./authAPI";
import userAPI from "./userAPI";
import retailerCompanyAPI from "./retailerCompanyAPI";

export const v1Axios = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://api.turtleship.io/api/v1"
      : "https://dev.turtleship.io/api/v1",
  headers: { "Content-Type": "application/json" },
});

export const v2Axios = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://alpha.turtleship.io/v2"
      : "https://alpha.turtleship.io/v2",
  headers: { "Content-Type": "application/json" },
});

export { authAPI, userAPI, retailerCompanyAPI };
