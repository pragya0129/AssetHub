import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getAssets = (token: string) =>
  API.get("/assets", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const createAsset = (
  token: string,
  data: unknown
) =>
  API.post("/assets", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });