import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/common/Header";
import FilterGroup from "../components/group/GroupFilter";
import GroupHeader from "../components/group/GroupHeader";
import GroupPhotoGallery from "../components/group/GroupPhotoGallery";
import GroupNavigation from "../components/group/GroupNavigation";
import GroupArtists from "./Gallery/GroupArtists";
import GroupInfo from "./Gallery/GroupInfo";
import { Loader, Heart, MessageCircle, User, Music } from "lucide-react";
import Footer from "./../components/common/Footer";
import GroupCommunity from "./Gallery/GroupCommunity";

interface GroupData {
  id: string;
  name: string;
  description: string;
  fanCount: number;
}

interface Photo {
  id: string;
  src: string;
  alt: string;
}

// 캐시 저장소 (실제 앱에서는 Redux, Context API 등을 사용하는 것이 좋음)
const dataCache = {
  groups: new Map<string, GroupData>(),
  photos: new Map<string, Photo[]>()
};

// 스켈레톤 컴포넌트들
const SkeletonBanner = () => {
  return (
    <div className="w-full h-48 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
  );
};

const SkeletonHeader = () => {
  return (
    <div className="w-full p-6 rounded-lg mb-6 bg-gray-100 animate-pulse">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="mb-4 md:mb-0">
          <div className="h-8 bg-gray-300 rounded-md w-40 mb-3"></div>
          <div className="h-4 bg-gray-300 rounded-md w-60 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded-md w-24"></div>
        </div>
        <div className="h-10 bg-gray-300 rounded-md w-32"></div>
      </div>
    </div>
  );
};

const SkeletonTabs = () => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex space-x-6 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 bg-gray-200 rounded-md w-24 animate-pulse"></div>
        ))}
      </div>
    </div>
  );
};

// 갤러리 스켈레톤
const SkeletonGallery = () => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-3/4 md:pr-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
          {Array(12).fill(0).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-md"></div>
          ))}
        </div>
      </div>
      <div className="w-full md:w-1/4 mt-6 md:mt-0">
        <div className="space-y-6 animate-pulse">
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="h-5 bg-gray-300 rounded-md w-3/4 mb-4"></div>
            <div className="space-y-2">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 rounded-md w-full"></div>
              ))}
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="h-5 bg-gray-300 rounded-md w-3/4 mb-4"></div>
            <div className="space-y-2">
              {Array(2).fill(0).map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 rounded-md w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 아티스트 스켈레톤
const SkeletonArtists = () => {
  return (
    <div className="w-full mb-32">
      {/* 스켈레톤 그룹 정보 */}
      <div className="mb-6 bg-gray-100 rounded-lg p-4 animate-pulse">
        <div className="h-6 bg-gray-300 rounded-md w-1/3 mb-2"></div>
        <div className="flex gap-4">
          <div className="h-4 bg-gray-300 rounded-md w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded-md w-1/5"></div>
        </div>
      </div>
      
      {/* 스켈레톤 아티스트 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6).fill(0).map((_, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-100 animate-pulse">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-gray-300 mr-4"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-300 rounded-md w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded-md w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 커뮤니티 스켈레톤
const SkeletonCommunity = () => {
  return (
    <div className="w-full">
      {/* 카테고리 스켈레톤 */}
      <div className="mb-6 flex items-center w-full justify-between">
        <div className="flex space-x-2 overflow-x-auto flex-1">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded-full w-16 animate-pulse"></div>
          ))}
        </div>
        <div className="h-10 bg-gray-200 rounded-full w-16 animate-pulse"></div>
      </div>
      
      {/* 게시글 스켈레톤 */}
      <div className="space-y-4">
        {Array(5).fill(0).map((_, index) => (
          <div key={index} className="border-b border-blue-100 py-4 animate-pulse">
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
        ))}
      </div>
      
      {/* 페이지네이션 스켈레톤 */}
      <div className="mt-8 flex justify-center">
        <div className="flex space-x-2">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 기타 정보 스켈레톤
const SkeletonInfo = () => {
  return (
    <div className="bg-white rounded-lg mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 bg-gray-200 rounded-md w-1/4 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded-md w-24 animate-pulse"></div>
      </div>

      {/* 기본 정보 스켈레톤 */}
      <section className="mb-8 animate-pulse">
        <div className="h-7 bg-gray-200 rounded-md w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <div className="h-4 bg-gray-200 rounded-md w-1/4 mb-2"></div>
            <div className="h-5 bg-gray-200 rounded-md w-2/4"></div>
          </div>
          <div className="flex flex-col">
            <div className="h-4 bg-gray-200 rounded-md w-1/4 mb-2"></div>
            <div className="h-5 bg-gray-200 rounded-md w-1/4"></div>
          </div>
          <div className="flex flex-col col-span-1 md:col-span-2">
            <div className="h-4 bg-gray-200 rounded-md w-1/4 mb-2"></div>
            <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
          </div>
        </div>
      </section>

      {/* 관리자 테이블 스켈레톤 */}
      <section className="animate-pulse">
        <div className="h-7 bg-gray-200 rounded-md w-1/4 mb-4"></div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Array(5).fill(0).map((_, i) => (
                  <th key={i} className="px-6 py-3 text-left">
                    <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array(4).fill(0).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 mr-3"></div>
                      <div className="h-4 bg-gray-200 rounded-md w-20"></div>
                    </div>
                  </td>
                  {Array(4).fill(0).map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded-md w-16"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 방침 스켈레톤 */}
      <section className="mt-8 animate-pulse">
        <div className="h-7 bg-gray-200 rounded-md w-1/4 mb-4"></div>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex">
                <div className="h-4 bg-gray-200 rounded-md w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 안내사항 스켈레톤 */}
      <section className="mt-8 animate-pulse">
        <div className="h-7 bg-gray-200 rounded-md w-1/4 mb-4"></div>
        <div className="bg-blue-50 p-4 rounded-md">
          <div className="space-y-2">
            {Array(2).fill(0).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded-md w-full"></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const GroupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { groupName } = useParams();

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupInfo, setGroupInfo] = useState<GroupData | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("MMA 2023");
  const [selectedYear, setSelectedYear] = useState("2023");

  const events = ["MMA 2023", "MAMA 2023"];
  const years = ["2023", "2022"];

  const getActiveTabFromPath = (path: string) => {
    if (path.includes("/otherinfo")) {
      return "기타 정보";
    } else if (path.includes("/community")) {
      return "커뮤니티";
    } else if (path.includes("/artists")) {
      return "아티스트";
    } else {
      return "갤러리";
    }
  };

  const [activeTab, setActiveTab] = useState(() => 
    getActiveTabFromPath(location.pathname)
  );

  useEffect(() => {
    const fetchGroupData = async () => {
      if (!groupName) return;

      // 이미 캐시에 데이터가 있는지 확인
      const cachedGroupInfo = dataCache.groups.get(groupName);
      const cachedPhotos = dataCache.photos.get(groupName);

      // 캐시된 데이터가 있으면 바로 사용
      if (cachedGroupInfo && cachedPhotos) {
        setGroupInfo(cachedGroupInfo);
        setPhotos(cachedPhotos);
        setLoading(false);
        setInitialLoading(false);
        return;
      }

      // 캐시된 데이터가 없으면 로딩 상태로 전환
      setLoading(true);
      setError(null);

      try {
        // API 호출 시뮬레이션 (지연시간 1.5초로 수정)
        await new Promise(resolve => setTimeout(resolve, 1500));

        const groupData = {
          id: groupName,
          name: groupName === "ive" ? "아이브 (IVE)" : "그룹명",
          description: `${groupName}의 StarPick 그룹입니다.`,
          fanCount: 488
        };

        const dummyPhotos = Array.from({ length: 15 }, (_, i) => ({
          id: String(i + 1),
          src: `/dummy.png?id=${i + 1}`,
          alt: `${groupData.name} 사진 ${i + 1}`
        }));

        // 데이터 캐시에 저장
        dataCache.groups.set(groupName, groupData);
        dataCache.photos.set(groupName, dummyPhotos);

        setGroupInfo(groupData);
        setPhotos(dummyPhotos);
        setLoading(false);
        setInitialLoading(false);
      } catch (err) {
        console.error("그룹 데이터 로딩 실패:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchGroupData();
  }, [groupName]);

  const handleTabChange = (tab: string) => {
    if (!groupName) return;
    
    let path = `/${groupName}`;
    
    if (tab === "커뮤니티") {
      path += "/community";
    } else if (tab === "아티스트") {
      path += "/artists";
    } else if (tab === "기타 정보") {
      path += "/otherinfo";
    } else {
      path += "/gallery";
    }
    
    if (location.pathname !== path) {
      setActiveTab(tab);
      navigate(path);
    }
  };

  useEffect(() => {
    const newActiveTab = getActiveTabFromPath(location.pathname);
    
    if (newActiveTab !== activeTab) {
      setActiveTab(newActiveTab);
    }
  }, [location.pathname, activeTab]);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  const tabs = ["갤러리", "커뮤니티", "아티스트", "기타 정보"];

  // 로딩 중인 상태에 따라 각 탭에 맞는 스켈레톤 UI 표시
  const renderLoadingState = () => {
    switch (activeTab) {
      case "갤러리":
        return <SkeletonGallery />;
      case "커뮤니티":
        return <SkeletonCommunity />;
      case "아티스트":
        return <SkeletonArtists />;
      case "기타 정보":
        return <SkeletonInfo />;
      default:
        return <SkeletonGallery />;
    }
  };

  const renderTabContent = () => {
    if (error) {
      return (
        <div className="w-full bg-red-50 p-4 rounded-lg text-center my-10">
          <p className="text-red-600">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm"
            onClick={() => window.location.reload()}
          >
            다시 시도하기
          </button>
        </div>
      );
    }

    // 로딩 상태에 따라 각 탭에 맞는 스켈레톤 UI 표시
    // 초기 로딩 중에만 스켈레톤 UI를 표시
    if (initialLoading && loading) {
      return renderLoadingState();
    }

    switch (activeTab) {
      case "갤러리":
        return (
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-3/4 md:pr-6">
              <GroupPhotoGallery photos={photos} />
            </div>

            <div className="w-full md:w-1/4">
              <div className="md:hidden mb-8 space-y-6">
                <FilterGroup
                  title="최근 이벤트"
                  options={events}
                  selectedOption={selectedEvent}
                  onOptionChange={setSelectedEvent}
                />

                <FilterGroup
                  title="연도별"
                  options={years}
                  selectedOption={selectedYear}
                  onOptionChange={setSelectedYear}
                />
              </div>

              <div className="hidden md:block space-y-6 sticky top-4">
                <FilterGroup
                  title="최근 이벤트"
                  options={events}
                  selectedOption={selectedEvent}
                  onOptionChange={setSelectedEvent}
                />

                <FilterGroup
                  title="연도별"
                  options={years}
                  selectedOption={selectedYear}
                  onOptionChange={setSelectedYear}
                />
              </div>
            </div>
          </div>
        );
      case "커뮤니티":
        return <GroupCommunity />;
      case "아티스트":
        return <GroupArtists />;
      case "기타 정보":
        return groupInfo ? <GroupInfo groupInfo={groupInfo} /> : null;
      default:
        return <GroupPhotoGallery photos={photos} />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {initialLoading && loading && <SkeletonBanner />}
        
        {initialLoading && loading ? (
          <SkeletonHeader />
        ) : groupInfo ? (
          <GroupHeader
            name={groupInfo.name}
            description={groupInfo.description}
            fanCount={groupInfo.fanCount}
            isFollowing={isFollowing}
            onFollowToggle={handleFollowToggle}
          />
        ) : null}

        {initialLoading && loading ? (
          <SkeletonTabs />
        ) : (
          <GroupNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        )}

        {renderTabContent()}
      </main>
      <Footer/>
    </div>
  );
};

export default GroupPage;