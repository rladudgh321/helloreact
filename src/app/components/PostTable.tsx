"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPostsAPI } from '../api/post';
import Link from 'next/link';
import { DataProps, StringToArrayProps } from '../types';


function formatDate(date: Date) {
  const year = date.getFullYear(); // 연도 (4자리)
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월 (2자리, 1부터 시작하므로 +1)
  const day = date.getDate().toString().padStart(2, '0'); // 일 (2자리)

  return `${year}.${month}.${day}.`; // 원하는 형식으로 반환
}

export default function PostTable({
  initialPosts,
  postsPerPage,
}: {
  initialPosts: DataProps[];
  postsPerPage: number;
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const { isPending, error, data } = useQuery({
    queryKey: ['postList', currentPage],
    queryFn: () => getPostsAPI(currentPage, postsPerPage),
    initialData: initialPosts // 최초 데이터는 서버에서 받은 데이터 사용
  })

  if (isPending) return 'Loading...';
  if (error) return `An error occurred: ${error.message}`;

  const stringToArray: StringToArrayProps[] = data.map((item: DataProps) => ({
    ...item,
    images: item.images.split(','),
    tags: item.tags.split(','),
  }));

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = stringToArray.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(stringToArray.length / postsPerPage);
  const pageGroup = Math.ceil(currentPage / 10);
  const startPage = (pageGroup - 1) * 10 + 1;
  const endPage = Math.min(pageGroup * 10, totalPages);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
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
              <td className="py-2 px-4">{formatDate(new Date(post.date))}</td>
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
