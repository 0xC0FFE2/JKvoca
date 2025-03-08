import React from "react";
import { Photo } from "../../types/Photo";
  
interface PhotoCardProps {
  photo: Photo;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo }) => {
  // 이미지 높이를 랜덤하게 생성 (실제 구현에서는 이미지 비율에 맞게 조정해야 함)
  const getRandomRatio = () => {
    const idNum = parseInt(photo.id.replace(/\D/g, '')) || photo.id.charCodeAt(0);
    return 0.8 + (idNum % 7) * 0.2; // 0.8에서 2.2 사이의 비율
  };
  
  return (
    <div className="masonry-item p-1 overflow-hidden rounded-xl">
      <div 
        className="masonry-content w-full overflow-hidden rounded-lg"
        style={{ paddingBottom: `${getRandomRatio() * 100}%`, position: "relative" }}
      >
        <img 
          src={photo.src} 
          alt={photo.alt} 
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default PhotoCard;