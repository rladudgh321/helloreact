"use client"

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getPostsAPI } from './api/post';

export default function Home() {
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: getPostsAPI,
  });

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

  // 현재 페이지 상태
  const [currentPage, setCurrentPage] = useState(1);

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  const stringToArray: stringToArrayProps[] = data.map((item: dataProps) => ({
    ...item,  // 기존 속성 유지
    images: item.images.split(','),  // images를 쉼표로 분리하여 배열로 변환
    tags: item.tags.split(',')       // tags를 쉼표로 분리하여 배열로 변환
  }));

  console.log('stringToArray', stringToArray);


  // 페이지당 보여줄 게시글 수
  const postsPerPage = 3;

  // 현재 페이지에 해당하는 게시글을 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = stringToArray.slice(indexOfFirstPost, indexOfLastPost);

  // 페이지네이션 처리
  const totalPages = Math.ceil(stringToArray.length / postsPerPage);

  // 페이지 그룹 범위 (1~10, 11~20, 21~30 ...)
  const pageGroup = Math.ceil(currentPage / 10);
  const startPage = (pageGroup - 1) * 10 + 1;
  const endPage = Math.min(pageGroup * 10, totalPages);

  // 페이지 번호 클릭 시 페이지 변경
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">게시판</h1>

      {/* 게시글 목록 */}
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
        {/* 이전 페이지 그룹 버튼 */}
        {pageGroup > 1 && (
          <button
            className="px-4 py-2 border rounded-md mx-2 bg-gray-200 hover:bg-gray-300"
            onClick={() => setCurrentPage((pageGroup - 2) * 10 + 1)}
          >
            이전
          </button>
        )}
        
        {/* 페이지 번호 */}
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

        {/* 다음 페이지 그룹 버튼 */}
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
