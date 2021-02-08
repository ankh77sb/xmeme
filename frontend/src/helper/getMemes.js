

      import { API } from "../backend";

       export const getMemes = () => {
        return fetch(`${API}/memes`,{
          method: "GET",
        })
        .then((response) => response.json())
        .catch((err) =>console.log(err));
      };

       export default getMemes;
