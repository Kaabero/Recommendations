import axios from "axios";
import { Credentials } from "../../../types";

const baseUrl = "/api/users";

const create = async (newUser: Credentials) => {
  const response = await axios.post(baseUrl, newUser);
  return response.data;
};

const login = async (user: Credentials) => {
  const response = await axios.post("/api/login/", user);
  return response.data;
};

const getUserById = async (id: number | undefined) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const update = async (id: number, token: string | undefined) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(`${baseUrl}/${id}`, {}, config);
  return response.data;
};

const logout = async (token: string | undefined) => {
  await axios.post("/api/logout/", { token: token });
};

export default { create, login, getUserById, getAll, update, logout };
