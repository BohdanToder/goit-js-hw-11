import axios from 'axios';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '26399752-b290053c4119a3919f89d6b14';

export default class FetchDataApi {

  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async getImages() {
    try {
      const searchParams = new URLSearchParams({
        key: API_KEY,
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: 40,
      });

      Loading.dots('Loading...');
      const response = await axios.get(`${BASE_URL}?${searchParams}`);
      this.incrementPage();
      Loading.remove();

      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}