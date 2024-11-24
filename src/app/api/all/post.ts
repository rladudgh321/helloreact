// api/post.ts
import { backUrl } from '../../config'; // http://localhost:3065
import axios from 'axios';

axios.defaults.baseURL = backUrl;

export async function getPostsAllAPI() {
  try {
    const response = await axios.get('/api/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}
