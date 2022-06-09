import { v2Axios } from '.';

const getAddress = async function () {
  const url = `/building/v2`;
  const response = await v2Axios.get(url);
  return response.data;
};

const getBank = async function () {
  const url = `/common/system/code_sets?org_id=1&code_set_name=BANK_CODE`;
  const response = await v2Axios.get(url);
  return response.data;
};

const basicDataAPI = {
  getAddress,
  getBank,
};

export default basicDataAPI;
