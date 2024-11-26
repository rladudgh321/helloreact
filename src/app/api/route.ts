// api/route.ts
import { supabase } from '../lib';

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get('page')) || 1;
  const postsPerPage = Number(url.searchParams.get('postsPerPage')) || 10;
  const tag = url.searchParams.get('tag') || ''; // tag 파라미터 처리

  const offset = (page - 1) * postsPerPage;
  
  console.log('supabaseAPI')
  try {
    // 1. 전체 게시물 수를 구하는 쿼리
    let countQuery = supabase
      .from('posts')
      .select('id', { count: 'exact', head: true }); // 'id'를 기준으로 카운트만 가져옴

    if (tag) {
      // 'tag'가 있을 경우, 해당 태그가 포함된 게시물만 필터링
      const { data: postTagData, error: postTagError } = await supabase
        .from('post_tags')
        .select('post_id')
        .eq('tag_id', tag);

      if (postTagError) throw postTagError;

      if (postTagData && postTagData.length > 0) {
        const postIds = postTagData.map((row: any) => row.post_id);
        countQuery = countQuery.in('id', postIds); // post_ids가 있을 경우만 필터링
      }
    }

    const { count, error: countError } = await countQuery;

    if (countError) throw countError;

    const totalCount = count;

    // 2. 현재 페이지에 해당하는 게시물 데이터를 가져오는 쿼리
    let postsQuery = supabase
      .from('posts')
      .select('id, title, createdAt, tags:post_tags(tag_id)') // 게시물의 'id', 'title', 'createdAt', 'tags' 포함
      .order('createdAt', { ascending: false })
      .range(offset, offset + postsPerPage - 1); // 페이지네이션 처리

    if (tag) {
      const { data: postTagData, error: postTagError } = await supabase
        .from('post_tags')
        .select('post_id')
        .eq('tag_id', tag);

      if (postTagError) throw postTagError;

      if (postTagData && postTagData.length > 0) {
        const postIds = postTagData.map((row: any) => row.post_id);
        postsQuery = postsQuery.in('id', postIds); // post_ids가 있을 경우만 필터링
      }
    }

    const { data: posts, error: postsError } = await postsQuery;

    if (postsError) throw postsError;

    return new Response(
      JSON.stringify({
        totalCount,
        posts,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('500 err', error);
    return new Response('Database connection error', { status: 500 });
  }
};
