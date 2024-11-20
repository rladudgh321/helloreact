// api/post/post.ts
import { backUrl } from '../../config'; // http://localhost:3065
import axios from 'axios';

axios.defaults.baseURL = backUrl;

export async function getPostAPI(id: number) {
  try {
    const response = await axios.get(`/api/post`, { // /api/post?id=1
      params: { id: Number(id) }, // API 요청에 id를 쿼리 파라미터로 전달
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null; // 데이터가 없으면 null 반환
  }
}
