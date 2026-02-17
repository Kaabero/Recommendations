import axios from "axios";

const baseUrl = "/api/comments";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (
  newComment: string,
  token: string | undefined,
) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(baseUrl, {comment: newComment}, config);
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
  updatedComment: string,
  token: string | undefined,
) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(
    `${baseUrl}/${id}`,
    { comment: updatedComment },
    config,
  );
  return response.data;
};

const addComment = async (
  id: number,
  comment: string,
  token: string | undefined,
) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(
    `${baseUrl}/${id}`,
    { comment: comment },
    config,
  );
  return response.data;
};

export default { getAll, create, remove, update, addComment };