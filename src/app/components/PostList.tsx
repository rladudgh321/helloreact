// app/components/PostList.tsx (재사용 가능한 컴포넌트)

import PostTable from './PostTable'; // 게시글 테이블 컴포넌트
import { getPostsAPI } from '../api/post';

interface PostListProps {
  searchParams?: { postsPerPage?: string };
}

export default async function PostList({ searchParams }: PostListProps) {
  // 쿼리 파라미터에서 페이지 당 게시물 수 가져오기
  const postsPerPage = searchParams?.postsPerPage ? parseInt(searchParams.postsPerPage) : 10; // 기본값 10
  const initialData = await getPostsAPI(1, postsPerPage); // 첫 페이지의 데이터 가져오기

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">게시판</h1>
      <PostTable initialPosts={initialData} postsPerPage={postsPerPage} />
    </div>
  );
}
