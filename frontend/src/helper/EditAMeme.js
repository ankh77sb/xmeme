
      import { API } from "../backend";

      export const EditAMeme = (fields) => {
        console.log(fields);
        const requestOptions = {
          method: "PATCH",
          header: {
            "Content-type":"application/json;",
          },
          body: JSON.stringify(fields),
        };

        console.log(requestOptions.body);
        return fetch(`${API}/memes/${fields.id}`,requestOptions)
        .then((response) => response.json())
        .catch((err) =>console.log(err));
      };

      export default EditAMeme;
