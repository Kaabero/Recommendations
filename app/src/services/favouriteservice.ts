import axios from "axios";
import { AddFavourite } from "../../../types";

const baseUrl = "/api/favourites";



const create = async (
  newFavourite: AddFavourite,
  token: string | undefined,
) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(baseUrl, newFavourite, config);
  return response.data;
};

const remove = async (id: number, token: string | undefined) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

export default { create, remove };