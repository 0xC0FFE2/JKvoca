import React from "react";
import Header from "../components/common/Header";
import ApplicationScreenshot from "../assets/intro_assets/service-screenshot.png";
import Footer from "../components/common/Footer";

const IntroPage = () => {
  return (
    <div className="bg-gradient-to-b from-purple-50 to-blue-50 min-h-screen font-sans">
      <Header />
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            <span className="text-purple-500">오로지 아이돌 덕질만을 위한</span>
            <br />
            <span className="text-blue-500">완벽한 서비스</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            당신의 아이돌 팬 활동을 더 즐겁고 편리하게 만들어 드립니다.
            StarPick과 함께 덕질의 새로운 세계를 경험하세요!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-purple-500 text-white px-8 py-3 rounded-full text-lg hover:bg-purple-600 transition shadow-lg">
              사용하기
            </button>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="text-purple-500">StarPick</span>의 기능
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl shadow-lg">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-purple-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                이제 갤러리에 아이돌 사진 저장은 그만
              </h3>
              <p className="text-gray-600">
                더 이상 휴대폰 저장공간을 걱정하지 마세요. StarPick에서 좋아하는
                아이돌의 모든 사진을 클라우드에 저장하고 언제 어디서나 접근할 수
                있습니다.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl shadow-lg">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                좋아하는 아이돌의 일정과 이벤트 확인하기
              </h3>
              <p className="text-gray-600">
                콘서트, 팬미팅, TV 출연 등 좋아하는 아이돌의 모든 일정을 한눈에
                확인하세요. 알림 설정으로 중요한 이벤트를 절대 놓치지 않습니다.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl shadow-lg">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-purple-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                커뮤니티와 함께하는 덕질 라이프
              </h3>
              <p className="text-gray-600">
                같은 아이돌을 좋아하는 팬들과 소통하고 정보를 공유하세요. 실시간
                채팅, 게시판, 팬아트 공유 등 다양한 커뮤니티 기능을 제공합니다.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl shadow-lg">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                커뮤니티 사용자가 올린 사진도 확인
              </h3>
              <p className="text-gray-600">
                팬들이 직접 촬영한 고퀄리티 사진과 영상을 발견하세요.
                팬사이트에서 놓친 특별한 순간들을 StarPick 커뮤니티에서 만나볼
                수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-purple-100 to-blue-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16">
            <span className="text-purple-500">StarPick</span>을 경험해보세요
          </h2>

          <div className="flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 bg-purple-200 rounded-full absolute -top-10 -left-10 opacity-50"></div>
              <div className="w-80 h-80 bg-blue-200 rounded-full absolute -bottom-10 -right-10 opacity-50"></div>
              <img src={ApplicationScreenshot} alt="" className="h-128" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            <span className="text-purple-500">지금 바로 시작하세요</span>
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            아이돌 덕질의 새로운 차원을 경험해보세요. StarPick과 함께라면 더
            즐겁고 편리한 팬 활동이 가능합니다.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <button className="flex items-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition shadow-lg">
              <svg
                className="w-8 h-8 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.707,9.293l-5-5C12.52,4.105,12.266,4,12,4s-0.52,0.105-0.707,0.293l-5,5C5.898,9.689,5.901,10.322,6.293,10.713 C6.685,11.105,7.318,11.114,7.715,10.715L11,7.429V20c0,0.552,0.447,1,1,1s1-0.448,1-1V7.429l3.285,3.286 c0.194,0.194,0.45,0.292,0.707,0.292c0.256,0,0.512-0.098,0.707-0.293C18.098,10.322,18.101,9.689,17.707,9.293z"></path>
              </svg>
              App Store
            </button>
            <button className="flex items-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition shadow-lg">
              <svg
                className="w-8 h-8 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3,20.5v-17C3,2.67,3.67,2,4.5,2h15C20.33,2,21,2.67,21,3.5v17c0,0.83-0.67,1.5-1.5,1.5h-15 C3.67,22,3,21.33,3,20.5z M6,11l5,3l5-3L6,4V11z"></path>
              </svg>
              Google Play
            </button>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default IntroPage;
