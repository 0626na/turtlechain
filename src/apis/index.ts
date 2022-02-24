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
import clearingAPI from "./clearingAPI";
import adjustmentAPI from "./adjustmentAPI";
import excelAPI from "./excelAPI";
import productAPI from "./productAPI";
import mainAPI from "./mainAPI";

export const v1Axios = axios.create({
  baseURL: "https://dev.turtleship.io/api/v1",
  headers: { "Content-Type": "application/json" },
});

export const v2Axios = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
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
  productAPI,
  vendorAPI,
  basicDataAPI,
  bucketListAPI,
  clearingAPI,
  adjustmentAPI,
  excelAPI,
  mainAPI,
};
