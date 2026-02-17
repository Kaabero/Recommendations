import axios from "axios";

const baseUrl = "/api/services";

const getAll = async (token: string | undefined) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(baseUrl, config);
  return response.data;
};

export default { getAll };
