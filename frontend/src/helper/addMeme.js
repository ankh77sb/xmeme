import { API } from "../backend";

export const addMeme = (fields) => {
  console.log(fields);
  const requestOptions = {
    method: "POST",
    header: {
      "Content-type":"application/json;",
    },
    body: JSON.stringify(fields)
  };

  console.log(requestOptions.body);
  return fetch(`${API}/memes`,requestOptions)
  .then((response) => response.json())
  .catch((err) =>console.log(err));
};

export default addMeme;
