import React, { useEffect, useRef } from "react";
import PhotoCard from "../common/PhotoCard";
import { Photo } from "../../types/Photo";

interface GroupPhotoGalleryProps {
  photos: Photo[];
}

const GroupPhotoGallery: React.FC<GroupPhotoGalleryProps> = ({ photos }) => {
  const galleryRef = useRef<HTMLDivElement>(null);

  // 마사리 레이아웃 적용
  useEffect(() => {
    if (!galleryRef.current) return;
    
    const resizeAllGridItems = () => {
      const allItems = document.getElementsByClassName("masonry-item");
      for (let i = 0; i < allItems.length; i++) {
        resizeGridItem(allItems[i] as HTMLElement);
      }
    };

    const resizeGridItem = (item: HTMLElement) => {
      const grid = galleryRef.current;
      const rowHeight = 5; // CSS Grid의 row-gap과 맞춰줍니다
      const rowGap = parseInt(window.getComputedStyle(grid!).getPropertyValue("grid-row-gap"));
      const rowSpan = Math.ceil((item.querySelector(".masonry-content")!.getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
      item.style.gridRowEnd = "span " + rowSpan;
    };

    resizeAllGridItems();
    window.addEventListener("resize", resizeAllGridItems);
    
    return () => {
      window.removeEventListener("resize", resizeAllGridItems);
    };
  }, [photos]);

  return (
    <div 
      ref={galleryRef} 
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2"
      style={{ 
        gridAutoRows: "5px",
        gridAutoFlow: "dense"
      }}
    >
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
    </div>
  );
};

export default GroupPhotoGallery;