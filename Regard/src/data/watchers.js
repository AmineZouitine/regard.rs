import axios from "axios";

export const getWatchers = async () => {
  let responce = await axios.get("http://127.0.0.1:7777/api/watchers");
  return responce.data;
};

export const deleteWatcher = async (watcherName) => {
  let responce = await axios.delete(
    `http://127.0.0.1:7777/api/watchers/${watcherName}`
  );
  return responce.data;
};

export const patchWatcher = async ({ watcherName, body }) => {
  console.log(body);
  let responce = await axios.patch(
    `http://127.0.0.1:7777/api/watchers/${watcherName}`,
    body
  );
  return responce.data;
};
