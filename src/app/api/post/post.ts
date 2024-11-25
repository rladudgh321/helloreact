// api/post/post.ts
import { backUrl } from '../../config'; // http://localhost:3065
import axios from 'axios';

axios.defaults.baseURL = backUrl;

export async function getPostAPI(id: number) {
  try {
    const response = await axios.get(`/api/post/${id}`);
    return response.data;
  } catch (error) {
    console.error('findOne Error fetching data:', error);
    return null; // 데이터가 없으면 null 반환
  }
}
