import React, { useState, useEffect } from "react";
import { Heart, MessageCircle } from "lucide-react";

// CommunityPostProps 타입 정의
interface CommunityPostProps {
  id: string;
  title: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
}

// 스켈레톤 포스트 컴포넌트
const SkeletonPost = () => {
  return (
    <div className="border-b border-blue-100 py-4 animate-pulse">
      <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-2"></div>
      <div className="flex items-center space-x-2">
        <div className="h-3 bg-gray-200 rounded-md w-16"></div>
        <div className="h-3 bg-gray-200 rounded-md w-3"></div>
        <div className="h-3 bg-gray-200 rounded-md w-20"></div>
        <div className="h-3 bg-gray-200 rounded-md w-3"></div>
        <div className="h-3 bg-gray-200 rounded-md w-12"></div>
        <div className="h-3 bg-gray-200 rounded-md w-3"></div>
        <div className="h-3 bg-gray-200 rounded-md w-12"></div>
      </div>
    </div>
  );
};

// 스켈레톤 카테고리 컴포넌트
const SkeletonCategories = () => {
  return (
    <div className="mb-6 flex items-center w-full justify-between">
      <div className="flex space-x-2 overflow-x-auto flex-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-8 bg-gray-200 rounded-full w-16 animate-pulse"
          ></div>
        ))}
      </div>
      <div className="h-10 bg-gray-200 rounded-full w-16 animate-pulse"></div>
    </div>
  );
};

// 개별 커뮤니티 포스트 컴포넌트
const CommunityPost: React.FC<CommunityPostProps> = ({
  title,
  author,
  date,
  likes,
  comments,
}) => {
  return (
    <div className="border-b border-blue-100 py-4 hover:bg-blue-50 transition-colors duration-200">
      <h3 className="text-lg font-medium mb-1 hover:text-indigo-500 transition-colors duration-200 cursor-pointer">
        {title}
      </h3>
      <div className="flex items-center text-sm text-gray-500">
        <span>{author}</span>
        <span className="mx-2">•</span>
        <span>{date}</span>
        <span className="mx-2">•</span>
        <span className="flex items-center">
          <Heart size={14} className="mr-1 text-indigo-300" />
          {likes}
        </span>
        <span className="mx-2">•</span>
        <span className="flex items-center">
          <MessageCircle size={14} className="mr-1 text-blue-300" />
          {comments}
        </span>
      </div>
    </div>
  );
};

// 그룹 커뮤니티 컴포넌트
const GroupCommunity: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [communityPosts, setCommunityPosts] = useState<CommunityPostProps[]>([]);
  const categories = ["전체", "공지사항", "팬아트", "후기", "정보"];
  const [activeCategory, setActiveCategory] = useState("전체");

  // JSON 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/communityPosts.json").then(
          data => data.json()
        )

        // API 응답에서 communityPosts 추출
        setCommunityPosts(response.communityPosts);
        
        // 로딩 지연 시뮬레이션 (개발 테스트용, 실제 배포 시 제거)
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 로딩 중일 때 스켈레톤 UI 표시
  if (loading) {
    return (
      <div className="w-full">
        <SkeletonCategories />
        
        <div className="space-y-4">
          {Array(5).fill(0).map((_, index) => (
            <SkeletonPost key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 카테고리 필터 */}
      <div className="mb-6 flex items-center w-full justify-between">
        <div className="flex space-x-2 overflow-x-auto flex-1">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                activeCategory === category
                  ? "bg-[#1f1f1f] text-white"
                  : "bg-white border border-black-800 text-gray-700"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <button className="px-4 py-2 bg-indigo-400 hover:bg-indigo-500 text-white rounded-full text-sm">
          글쓰기
        </button>
      </div>

      {/* 커뮤니티 게시글 목록 */}
      <div>
        {communityPosts.length > 0 ? (
          communityPosts.map((post) => (
            <CommunityPost key={post.id} {...post} />
          ))
        ) : (
          <p className="text-center text-gray-500 py-10">게시글이 없습니다.</p>
        )}
      </div>
      
      {/* 페이지네이션 */}
      {communityPosts.length > 0 && (
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            <button className="w-8 h-8 flex items-center justify-center border border-blue-200 rounded hover:bg-blue-50 transition-colors duration-200">
              &lt;
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-indigo-300 text-indigo-800 rounded">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-blue-200 rounded hover:bg-blue-50 transition-colors duration-200">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-blue-200 rounded hover:bg-blue-50 transition-colors duration-200">
              3
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-blue-200 rounded hover:bg-blue-50 transition-colors duration-200">
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupCommunity