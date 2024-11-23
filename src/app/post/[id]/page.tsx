// app/post/[id]/page.tsx
import { notFound } from "next/navigation"; // 404 페이지를 위한 Next.js 내장 함수
import { getPostAPI } from "../../api/post/post"; // API 함수 임포트
import PostContent from "../../components/PostContent"; // 자식 컴포넌트 임포트
import { DataProps, StringToArrayProps } from "../../types";
import { getPostsAPI } from "../../api/post";
import PostList from "../../components/PostList";

export interface PostListProps {
  searchParams?: { postsPerPage?: string; page?: string; tag?: string; };
}

interface PostProps extends PostListProps {
  params: { id: string }
}

// 페이지 컴포넌트는 서버 컴포넌트로, 데이터를 서버에서 바로 가져옵니다.
export default async function Post({ params, searchParams }: PostProps) {
  const { id } = params;

  // 서버에서 데이터 직접 가져오기
  const data = await getPostAPI(Number(id));

  // 데이터가 없으면 404 페이지로 리디렉션
  if (!data) {
    notFound();
  }


  // 데이터 가공: 이미지와 태그를 배열로 변환
  const stringToArraytoObject: StringToArrayProps = data.posts.map((item: DataProps) => ({
    ...item,
    images: item.images.split(','),
    tags: item.tags.split(','),
  }))[Number(params.id)];


  console.log('stringToArraytoObject',stringToArraytoObject);

  // 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달
  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* 자식 컴포넌트에 데이터 전달 */}
      <PostContent post={stringToArraytoObject} />
      <PostList searchParams={searchParams} />
    </div>
  );
}

export async function generateStaticParams({ searchParams }: PostListProps) {
  // API 호출하여 게시글 목록 가져오기
  const postsPerPage = searchParams?.postsPerPage ? parseInt(searchParams.postsPerPage) : 10; // 기본값 10
  const posts = await getPostsAPI(1, postsPerPage, '');

  // 각 게시글의 ID를 기반으로 동적 경로를 생성
  return posts.posts.map((post: DataProps) => ({
    id: post.id.toString(), // 동적 경로에서 사용되는 파라미터
  }));
}