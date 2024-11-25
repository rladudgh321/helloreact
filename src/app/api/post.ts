// api/post.ts
import { backUrl } from '../config'; // http://localhost:3065
import axios from 'axios';

axios.defaults.baseURL = backUrl;

export async function getPostsAPI(page: number, postsPerPage: number, tag?: string) {
  try {
    const response = await axios.get('/api', {
      params: {
        page,
        postsPerPage,
        tag, // tag 추가
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}
