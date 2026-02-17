import axios from "axios";
import { AddRecommendation, RecommendationType } from "../../../types";

const baseUrl = "/api/recommendations";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (
  newRecommendation: AddRecommendation,
  token: string | undefined,
) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(baseUrl, newRecommendation, config);
  return response.data;
};

const remove = async (id: number, token: string | undefined) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

const update = async (
  id: number,
  updatedRecommendation: RecommendationType,
  token: string | undefined,
) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(
    `${baseUrl}/${id}`,
    updatedRecommendation,
    config,
  );
  return response.data;
};


export default { getAll, create, remove, update};
