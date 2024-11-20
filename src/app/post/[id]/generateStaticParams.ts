// app/post/[id]/generateStaticParams.ts

import { getPostsAPI } from "../../api/post";

interface PostListProps {
  searchParams?: { postsPerPage?: string };
}

export async function generateStaticParams({ searchParams }: PostListProps) {
  console.log('searchParams', searchParams)
  // API 호출하여 게시글 목록 가져오기
  const postsPerPage = searchParams?.postsPerPage ? parseInt(searchParams.postsPerPage) : 10; // 기본값 10
  const posts = await getPostsAPI(1, postsPerPage);

  // 각 게시글의 ID를 기반으로 동적 경로를 생성
  return posts.map((post) => ({
    id: post.id, // 동적 경로에서 사용되는 파라미터
  }));
}
