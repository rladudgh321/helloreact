// api/post/post.ts
import { backUrl } from '../../config'; // http://localhost:3065
import axios from 'axios';
import https from 'https';

axios.defaults.baseURL = backUrl;

// SSL 인증서 검증 비활성화 설정
axios.defaults.httpsAgent = new https.Agent({
  rejectUnauthorized: false  // 인증서 검증을 비활성화
});

export async function getPostAPI(id: number) {
  try {
    const response = await axios.get(`/api/post/${id}`);
    return response.data;
  } catch (error) {
    console.error('getPostAPI findOne Error fetching data:', error);
    return null; // 데이터가 없으면 null 반환
  }
}
