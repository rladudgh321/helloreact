"use client"

// app/components/PostTable.tsx
import { useState } from 'react';
import Link from 'next/link';
import { DataProps, StringToArrayProps } from '../types';

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}.${month}.${day}.`;
}

export default function PostTable({
  initialPosts,
  postsPerPage,
  currentPage,
  totalPages,
  tag,
}: {
  initialPosts: DataProps[];
  postsPerPage: number;
  currentPage: number;
  totalPages: number;
  tag: string; // tag 파라미터 추가
}) {
  console.log('initialPosts', initialPosts);
  const stringToArray: StringToArrayProps[] = initialPosts.map((item: DataProps) => ({
    ...item,
    images: item.images.split(','),
    tags: item.tags.split(','),
  }));

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
          {stringToArray.map((post, index) => (
            <tr key={post.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{index + 1 + (currentPage - 1) * postsPerPage}</td>
              <td className="py-2 px-4">
                <Link href={`/post/${post.id}?page=${currentPage}`} className="text-blue-600 hover:text-blue-800">
                  {post.title}
                </Link>
              </td>
              <td className="py-2 px-4">
                {post.tags.map((tag, idx) => (
                  <Link key={idx} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs mr-2" href={`/?tag=${tag}&page=${currentPage}`}>
                    {tag}
                  </Link>
                ))}
              </td>
              <td className="py-2 px-4">{formatDate(new Date(post.date))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div className="flex justify-center mt-6">
        {currentPage > 1 && (
          <button
            className="px-4 py-2 border rounded-md mx-2 bg-gray-200 hover:bg-gray-300"
            onClick={() => window.location.search = `?page=${currentPage - 1}&tag=${tag}`}
          >
            이전
          </button>
        )}

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`px-4 py-2 border rounded-md mx-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => window.location.search = `?page=${index + 1}&tag=${tag}`}
          >
            {index + 1}
          </button>
        ))}

        {currentPage < totalPages && (
          <button
            className="px-4 py-2 border rounded-md mx-2 bg-gray-200 hover:bg-gray-300"
            onClick={() => window.location.search = `?page=${currentPage + 1}&tag=${tag}`}
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
}
