"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { StringToArrayPropsWithoutImages } from "../types";
import Link from "next/link";

export default function PostTable({
  initialPosts,
  postsPerPage,
  currentPage,
  totalPages,
  tag,
}: {
  initialPosts: StringToArrayPropsWithoutImages[];
  postsPerPage: number;
  currentPage: number;
  totalPages: number;
  tag: string;
}) {
  const router = useRouter();
  // 페이지 이동 함수
  const handlePageChange = (page: number) => {
    // scroll: false 를 설정하여 스크롤이 최상단으로 이동하지 않도록 함
    router.push(
      `?page=${page}${tag ? `&tag=${tag}` : ""}`,
      { scroll: false } // 스크롤 이동 비활성화
    );
  };

  // 태그 클릭 시 해당 태그로 필터링된 게시글을 보기 위해 URL 변경
  const handleTagClick = (tag: string) => {
    // 페이지는 1페이지부터 시작하도록 처리
    router.push(
      `?tag=${tag}&page=1`,
      { scroll: false } // 스크롤 이동 비활성화
    );
  };

  // useEffect로 tag가 변경될 때 페이지 갱신 (클릭된 tag에 맞는 페이지로 이동)
  useEffect(() => {
    if (tag) {
      // tag가 변경되면 페이지를 1로 리셋
      router.push(`?tag=${tag}&page=1`, { scroll: false });
    }
  }, [tag, router]); // tag 또는 router가 변경될 때마다 실행

  // 페이지네이션 번호 범위 계산 (예: 1~10, 11~20 등)
  const getPaginationRange = (currentPage: number, totalPages: number) => {
    const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
    const endPage = Math.min(startPage + 9, totalPages); // 최대 10개 페이지 번호 표시
    const range = [];
    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }
    return range;
  };

  const paginationRange = getPaginationRange(currentPage, totalPages);

  return (
    <div>
      <table className="w-full border-collapse table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-left">번호</th>
            <th className="py-2 px-4 border-b text-left">제목</th>
            <th className="py-2 px-4 border-b text-left">태그</th>
            {/* <th className="py-2 px-4 border-b text-left">날짜</th> */}
          </tr>
        </thead>
        <tbody>
          {initialPosts.map((post, index) => (
            <tr key={post.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">
                {index + 1 + (currentPage - 1) * postsPerPage}
              </td>
              <td className="py-2 px-4">
                <Link
                  href={`/post/${Number(post.id)}?page=${currentPage}${tag ? `&tag=${tag}` : ""}`}
                  className="text-blue-600 hover:text-blue-800"
                  scroll={true} // 스크롤 이동 비활성화
                >
                  {post.title}
                </Link>
              </td>
              <td className="py-2 px-4">
                {post.tags.map((tag) => (
                  <button
                    key={tag.id}
                    className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs mr-2"
                    onClick={() => handleTagClick(tag.name)}
                  >
                    {tag.name}
                  </button>
                ))}
              </td>
              {/* <td className="py-2 px-4">{formatDate(new Date(post.date))}</td> */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div className="flex justify-center mt-6">
        {currentPage > 1 && (
          <button
            className="px-4 py-2 border rounded-md mx-2 bg-gray-200 hover:bg-gray-300"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            이전
          </button>
        )}

        {/* 페이지 번호 */}
        {paginationRange.map((page) => (
          <button
            key={page}
            className={`px-4 py-2 border rounded-md mx-2 ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}

        {currentPage < totalPages && (
          <button
            className="px-4 py-2 border rounded-md mx-2 bg-gray-200 hover:bg-gray-300"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
}
