import { v2Axios } from '.';

const getBank = async () => {
  const url = `provisioning/preset/bank`;
  const response = await v2Axios.get(url);
  return response.data;
};

const getBuilding = async () => {
  const url = `provisioning/preset/building`;
  const response = await v2Axios.get(url);
  return response.data;
};

const presetAPI = {
  getBank,
  getBuilding,
};

export default presetAPI;
