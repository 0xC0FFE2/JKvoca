import React from "react";
import NANU_holdings_logo from "../../assets/logos/NANU_HOLDINGS_LOGO_SLOGAN.svg";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white pt-6 pb-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto pl-2">
        <div className="mb-4">
          <img
            src={NANU_holdings_logo}
            alt="StarPick Limited"
            className="h-12 mb-4 ml-2"
          />
          <p className="text-gray-500 text-sm tracking-wide ml-2">
            운영사 : 나누홀딩스
          </p>
          <p className="text-gray-500 text-sm  mt-1 ml-2">
            대표 : 이동현 · 문의 : cs@nanu.cc · 비즈니스 문의 : biz@nanu.cc<br/>주소지 : 서울시 구로구 고척로 49길 2, 고척헤리츠 1층 2-2 (스위트 공유오피스) 아이 26호
          </p>
        </div>

        <div className="mb-4 ml-2">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <a
              href="https://nanu.cc/static/docs/eula.html"
              className="text-gray-900 hover:text-blue-500 text-sm font-medium transition-colors"
            >
              이용약관
            </a>
            <a
              href="https://nanu.cc/static/docs/privacy.html"
              className="text-gray-900 hover:text-blue-500 text-sm transition-colors"
            >
              개인정보처리방침
            </a>
            <a
              href="#"
              className="text-gray-900 hover:text-blue-500 text-sm font-medium transition-colors"
            >
              문의하기
            </a>
          </div>
        </div>

        <div className="border-gray-100 ml-2">
          <p className="text-gray-400 text-xs font-light mt-2">
            본 서비스는 (주)나누홀딩스의 자산이며 저작권법과 기타 법률에
            의해 보호됩니다
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
