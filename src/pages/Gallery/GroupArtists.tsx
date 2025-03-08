import React, { useState, useEffect } from "react";
import { User, Music } from "lucide-react";
import { Link } from "react-router-dom";

// API 응답 타입 정의
interface Artist {
  id: string;
  name: string;
  stageName: string;
  position: string;
  imageUrl: string;
}

interface GroupInfo {
  id: string;
  name: string;
  debutDate: string;
  company: string;
  memberCount: number;
}

// 스켈레톤 카드 컴포넌트
const SkeletonCard = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-100 animate-pulse">
      <div className="flex items-center">
        <div className="w-16 h-16 rounded-full bg-gray-300 mr-4"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-300 rounded-md w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded-md w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

// 스켈레톤 그룹 정보 컴포넌트
const SkeletonGroupInfo = () => {
  return (
    <div className="mb-6 bg-gray-100 rounded-lg p-4 animate-pulse">
      <div className="h-6 bg-gray-300 rounded-md w-1/3 mb-2"></div>
      <div className="flex gap-4">
        <div className="h-4 bg-gray-300 rounded-md w-1/4"></div>
        <div className="h-4 bg-gray-300 rounded-md w-1/5"></div>
      </div>
    </div>
  );
};

const ArtistCard: React.FC<{ artist: Artist }> = ({ artist }) => {
  return (
    <Link to={`/artist/${artist.id}`} className="block">
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white">
        <div className="flex items-center">
          <img
            src={artist.imageUrl}
            alt={`${artist.name} 프로필 사진`}
            className="w-16 h-16 rounded-full object-cover mr-4"
          />
          <div>
            <h3 className="text-lg font-bold text-gray-800">{artist.stageName}</h3>
            <span className="text-sm text-gray-600">{artist.position}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const GroupArtists: React.FC = () => {
  // 상태 관리
  const [artists, setArtists] = useState<Artist[]>([]);
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // API 호출 시뮬레이션
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // API 호출 시뮬레이션 (지연시간 추가)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 더미 데이터 (실제로는 API 응답)
        const dummyArtists: Artist[] = [
          {
            id: "1",
            name: "안유진",
            stageName: "안유진 (Yujin)",
            position: "리더, 메인보컬",
            imageUrl: "/dummy.png?1"
          },
          {
            id: "2",
            name: "가을",
            stageName: "가을 (Gaeul)",
            position: "리드래퍼, 리드댄서",
            imageUrl: "/dummy.png?2"
          },
          {
            id: "3",
            name: "레이",
            stageName: "레이 (Rei)",
            position: "서브보컬, 서브래퍼",
            imageUrl: "/dummy.png?3"
          },
          {
            id: "4",
            name: "장원영",
            stageName: "장원영 (Wonyoung)",
            position: "센터, 리드보컬, 비주얼",
            imageUrl: "/dummy.png?4"
          },
          {
            id: "5",
            name: "리즈",
            stageName: "리즈 (Liz)",
            position: "메인래퍼, 리드댄서",
            imageUrl: "/dummy.png?5"
          },
          {
            id: "6",
            name: "이서",
            stageName: "이서 (Leeseo)",
            position: "메인댄서, 서브보컬",
            imageUrl: "/dummy.png?6"
          }
        ];

        const dummyGroupInfo: GroupInfo = {
          id: "ive",
          name: "아이브 (IVE)",
          debutDate: "2021.12.01",
          company: "스타쉽 엔터테인먼트",
          memberCount: 6
        };

        setArtists(dummyArtists);
        setGroupInfo(dummyGroupInfo);
        setLoading(false);
      } catch (err) {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    // 로딩 중일 때는 로딩 모달 대신 스켈레톤 UI를 보여줌
    return (
      <div className="w-full mb-32">
        <SkeletonGroupInfo />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-red-50 p-4 rounded-lg text-center my-6">
        <p className="text-red-600">{error}</p>
        <button 
          className="mt-3 px-4 py-1 bg-indigo-500 text-white rounded-lg text-sm"
          onClick={() => window.location.reload()}
        >
          다시 시도하기
        </button>
      </div>
    );
  }

  return (
    <div className="w-full mb-32">
      {groupInfo && (
        <div className="mb-6 bg-gray-50 rounded-lg p-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{groupInfo.name}</h3>
            <div className="text-sm text-gray-600 flex flex-wrap gap-x-4 mt-1">
              <span className="flex items-center">
                <Music size={14} className="mr-1 text-indigo-400" />
                {groupInfo.debutDate} 데뷔
              </span>
              <span className="flex items-center">
                <User size={14} className="mr-1 text-indigo-400" />
                {groupInfo.memberCount}명의 멤버
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
};

export default GroupArtists;