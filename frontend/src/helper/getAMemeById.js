import { API } from "../backend";


  export const getAMemeById = (memeId) => {
   return fetch(`${API}/memes/${memeId}`,{
     method: "GET",
   })
   .then((response) => response.json())
   .catch((err) =>console.log(err));
  };

   export default getAMemeById;
