// api/post.ts
import { backUrl } from '../config'; // http://localhost:3065
import axios from 'axios';
import https from 'https';
import { supabase } from '../lib';
axios.defaults.baseURL = backUrl;

// SSL 인증서 검증 비활성화 설정
axios.defaults.httpsAgent = new https.Agent({
  rejectUnauthorized: false  // 인증서 검증을 비활성화
});

export async function getPostsAPI(page: number, postsPerPage: number, tag?: string) {
  try {
    console.log('APIAPIAPIAPIAPIAPIdd');
    const { data, error } = await supabase
    .from('posts') // 'posts' 테이블에서 데이터 가져오기
    .select('*');  // 모든 컬럼 조회

    console.log('datadatadata error', error);

    console.log('datadatadata', data);
    const response = await axios.get('/api', {
      params: {
        page,
        postsPerPage,
        tag, // tag 추가
      },
    });
    console.log('response.data', response.data);
    return response.data;
  } catch (error) {
    console.error('getPostsAPI Error fetching data:', error);
    return [];
  }
}
