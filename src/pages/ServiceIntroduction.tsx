import React from "react";
import Layout from "../layouts/Layout";
import StudyZZAL from "../assets/study.png"

const ServiceIntroduction: React.FC = () => {
  return (
    <Layout>
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#205781] to-[#4F959D] text-transparent bg-clip-text tracking-tight mb-6">
              JK만의 특별한 수업용 단어장
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed mb-10">
              JK가 엄선한 단어들로
              <br />
              영어 실력을 더 높여드립니다
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-500 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors">
                로그인하여 시작하기
              </button>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center">
            <img 
              src={StudyZZAL} 
              className="h-128"
            />
            <p className="text-3xl font-bold text-blue-600">단@어를 외워서 암기왕이 될꺼야</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceIntroduction;