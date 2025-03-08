import React from "react";

interface GroupHeaderProps {
  name: string;
  description: string;
  fanCount: number;
  isFollowing: boolean;
  onFollowToggle: () => void;
  bannerImage?: string;
  profileImage?: string;
}

const GroupHeader: React.FC<GroupHeaderProps> = ({
  name,
  description,
  fanCount,
  isFollowing,
  onFollowToggle,
  bannerImage = "https://cdn.hankyung.com/photo/202205/01.29829960.1.jpg",
  profileImage = "https://i.pinimg.com/474x/7b/41/b9/7b41b9ac9fb07e0c0ed525dbebdef0fe.jpg",
}) => {
  return (
    <div className="mb-6">
      <div className="w-full h-48 overflow-hidden rounded-lg mb-4">
        <img
          src={bannerImage}
          alt={`${name} 배너`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
            <img
              src={profileImage}
              alt={`${name} 프로필`}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">{name}</h1>
            <p className="text-gray-600 mb-4">{description}</p>
          </div>
        </div>

        <div>
          <button
            onClick={onFollowToggle}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              isFollowing
                ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {isFollowing ? "팔로잉" : "팔로우"}
          </button>
        </div>
      </div>

      <button className="px-3 py-1 rounded-full text-xs bg-[#D8E8EA] text-[#000] hover:bg-[#c5dde0]">
        맴버 {fanCount}명
      </button>
    </div>
  );
};

export default GroupHeader;
