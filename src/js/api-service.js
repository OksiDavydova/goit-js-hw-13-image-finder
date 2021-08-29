  
import axios from 'axios';

axios.defaults.baseURL = "https://pixabay.com/api/";
const KEY='23071441-390664cd2415d23736c9d0a4e';

function getPictures(query, page) {
  return axios.get(`?image_type=photo&orientation=horizontal&q=${query}&page=${page}&per_page=12&key=${KEY}`)
  
}

export default getPictures;