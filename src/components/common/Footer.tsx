import React from "react";
import Logo from "../../assets/logos/logo_RX_BLACK.svg";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white pt-6 pb-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto pl-2">
        <div className="mb-4">
          <img src={Logo} alt="StarPick Limited" className="h-10 mb-2" />
          <p className="text-gray-500 text-midium font-bold tracking-wide mb-1">
            JKvoca Service
          </p>
          <p className="text-gray-500 text-sm font-light tracking-wide">
            운영사 : (주)나누클라우드홀딩스
          </p>
          <p className="text-gray-500 text-sm font-light mt-1">
            대표 : 이동현 · 문의 : cs@nanu.cc · 비즈니스 문의 : biz@nanu.cc
          </p>
        </div>
        
        <div className="mb-4">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <a href="https://nanu.cc/static/docs/eula.html" className="text-gray-900 hover:text-blue-500 text-sm font-medium transition-colors">
              이용약관
            </a>
            <a href="https://nanu.cc/static/docs/privacy.html" className="text-gray-900 hover:text-blue-500 text-sm transition-colors">
              개인정보처리방침
            </a>
            <a href="#" className="text-gray-900 hover:text-blue-500 text-sm font-medium transition-colors">
              문의하기
            </a>
          </div>
        </div>
        
        <div className="border-gray-100">
          <p className="text-gray-400 text-xs font-light mt-2">
            본 서비스는 나누클라우드홀딩스의 자산이며 저작권법과 기타 법률에 의해 보호됩니다
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;