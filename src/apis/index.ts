import axios from "axios";
import authAPI from "./authAPI";
import userAPI from "./userAPI";
import retailerCompanyAPI from "./retailerCompanyAPI";
import retailerStoreAPI from "./retailerStoreAPI";
import warehousingAPI from "./warehousingAPI";
import orderAPI from "./orderAPI";
import vendorAPI from "./vendorAPI";
import basicDataAPI from "./basicDataAPI";
import bucketListAPI from "./bucketListAPI";
import excelAPI from "./excelAPI";

export const v1Axios = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://dev.turtleship.io/api/v1"
      : "https://dev.turtleship.io/api/v1",
  headers: { "Content-Type": "application/json" },
});

export const v2Axios = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://alpha.turtleship.io/v2"
      : "https://devel.turtleship.io/v2",
  headers: { "Content-Type": "application/json" },
});

export const mockAxios = axios.create({
  baseURL: "https://92f5fce6-d961-48c8-8ce3-4c190a701ace.mock.pstmn.io/",
  headers: { "Content-Type": "application/json" },
});

export {
  authAPI,
  userAPI,
  retailerCompanyAPI,
  retailerStoreAPI,
  warehousingAPI,
  orderAPI,
  vendorAPI,
  basicDataAPI,
  bucketListAPI,
  excelAPI,
};
