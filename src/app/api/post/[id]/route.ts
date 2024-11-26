import { supabase } from "../../../lib";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const postId = params.id; // URL 경로에서 id 값 추출

  try {
    // 1. 특정 게시물의 데이터 가져오기 (join을 사용한 쿼리)
    const { data: postData, error } = await supabase
      .from('posts') // 게시글 테이블
      .select(`
        id,
        title,
        createdAt,
        tags:post_tags(tag_id), 
        images:images(src)
      `) // tags는 post_tags를 통해, images는 images 테이블을 통해 가져옵니다.
      .eq('id', postId); // 특정 게시물 조회

    if (error) {
      console.error('Error fetching post:', error);
      return new Response("Server error", { status: 500 });
    }

    if (!postData || postData.length === 0) {
      // 해당 post가 없는 경우 404 에러 반환
      return new Response("Post not found", { status: 404 });
    }

    // 태그와 이미지 데이터를 처리하여 반환할 데이터 형식 맞추기
    const { id, title, createdAt, tags, images } = postData[0];

    const responseData = {
      id,
      title,
      date: createdAt,
      tags: tags ? tags.map((tag: any) => tag.tag_id) : [], // 태그 배열 처리
      images: images ? images.map((image: any) => image.src) : [] // 이미지 배열 처리
    };

    return Response.json(responseData); // 첫 번째 게시물 데이터 반환
  } catch (error) {
    console.error('Error fetching post:', error);
    return new Response("Server error", { status: 500 });
  }
}
