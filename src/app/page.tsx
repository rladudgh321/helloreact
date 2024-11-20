// root page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getPostsAPI } from './api/post';

interface dataProps {
  id: number;
  date: string;
  images: string;
  tags: string;
  title: string;
}

interface stringToArrayProps extends Omit<dataProps, 'images' | 'tags'> {
  images: string[];
  tags: string[];
}

export default function Home({ initialPosts, postsPerPage }: { initialPosts: dataProps[]; postsPerPage: number }) {
  const [currentPage, setCurrentPage] = useState(1);

  // React Query에서 페이지에 맞는 데이터 로드
  const { isPending, error, data } = useQuery(
    ['repoData', currentPage],
    () => getPostsAPI(currentPage, postsPerPage),
    {
      initialData: initialPosts, // 최초 데이터는 서버에서 받은 데이터 사용
    }
  );

  // 에러 처리 및 로딩 상태
  if (isPending) return 'Loading...';
  if (error) return 'An error has occurred: ' + error.message;

  // 데이터 배열로 변환
  const stringToArray: stringToArrayProps[] = data.map((item: dataProps) => ({
    ...item,
    images: item.images.split(','),
    tags: item.tags.split(','),
  }));

  // 페이지네이션 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = stringToArray.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(stringToArray.length / postsPerPage);
  const pageGroup = Math.ceil(currentPage / 10);
  const startPage = (pageGroup - 1) * 10 + 1;
  const endPage = Math.min(pageGroup * 10, totalPages);

  // 페이지네이션 처리
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">게시판</h1>
      <table className="w-full border-collapse table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-left">번호</th>
            <th className="py-2 px-4 border-b text-left">제목</th>
            <th className="py-2 px-4 border-b text-left">태그</th>
            <th className="py-2 px-4 border-b text-left">날짜</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((post, index) => (
            <tr key={post.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{index + 1 + (currentPage - 1) * postsPerPage}</td>
              <td className="py-2 px-4">
                <Link href={`/post/${post.id}`} className="text-blue-600 hover:text-blue-800">
                  {post.title}
                </Link>
              </td>
              <td className="py-2 px-4">
                {post.tags.map((tag, idx) => (
                  <span key={idx} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs mr-2">
                    {tag}
                  </span>
                ))}
              </td>
              <td className="py-2 px-4">{post.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div className="flex justify-center mt-6">
        {pageGroup > 1 && (
          <button
            className="px-4 py-2 border rounded-md mx-2 bg-gray-200 hover:bg-gray-300"
            onClick={() => setCurrentPage((pageGroup - 2) * 10 + 1)}
          >
            이전
          </button>
        )}
        
        {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
          <button
            key={index}
            className={`px-4 py-2 border rounded-md mx-2 ${
              currentPage === startPage + index ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => paginate(startPage + index)}
          >
            {startPage + index}
          </button>
        ))}

        {pageGroup * 10 < totalPages && (
          <button
            className="px-4 py-2 border rounded-md mx-2 bg-gray-200 hover:bg-gray-300"
            onClick={() => setCurrentPage(pageGroup * 10 + 1)}
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
}

// export async function getStaticProps() {
//   // 최초 데이터는 SSG로 미리 로드
//   const postsPerPage = 3;
//   const initialData = await getPostsAPI(1, postsPerPage);

//   return {
//     props: {
//       initialPosts: initialData,
//       postsPerPage,
//     },
//   };
// }


import type { InferGetStaticPropsType, GetStaticProps } from 'next'
 
type Repo = {
  name: string
  stargazers_count: number
}
 
export const getStaticProps = (async (context) => {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo = await res.json()
  return { props: { repo } }
}) satisfies GetStaticProps<{
  repo: Repo
}>
 
export default function Page({
  repo,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return repo.stargazers_count
}