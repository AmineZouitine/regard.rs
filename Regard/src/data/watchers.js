import axios from "axios";

export const getWatchers = async () => {
  let responce = await axios.get("http://127.0.0.1:7777/api/watchers");
  return responce.data;
};
