// api/post/route.ts
import { supabase } from '../../lib';

export const GET = async () => {
  try {
    // Supabase에서 'posts' 테이블의 모든 게시물 ID를 가져옵니다.
    const { data, error } = await supabase
      .from('posts') // 'posts' 테이블에서 데이터를 가져옵니다.
      .select('id'); // 'id' 컬럼만 선택합니다.

    if (error) {
      throw error;
    }

    // 결과가 정상적으로 반환되면 데이터 반환
    return new Response(JSON.stringify({ posts: data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('500 err', error);
    return new Response('Database connection error', { status: 500 });
  }
};
