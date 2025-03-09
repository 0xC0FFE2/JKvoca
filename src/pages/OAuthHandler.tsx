import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OAuthSDK from "nanuid-websdk";
import api from "../utils/publicApi";

const OAuthHandler: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const code = queryParams.get("code");

        if (!code) {
          console.error("인증 코드가 없습니다");
          setError("인증 코드가 없습니다");
          setTimeout(() => navigate("/"), 2000);
          return;
        }

        const response = await api.post("/v1/auth/token", { code });

        const { access_token, refresh_token } = response.data;
        OAuthSDK.setTokens(access_token, refresh_token);
        
        setIsLoading(false);
        navigate("/admin");
      } catch (error) {
        console.error("OAuth 처리 중 오류 발생:", error);
        setError("인증 처리 중 오류가 발생했습니다");
        setTimeout(() => navigate("/"), 3000);
      }
    };

    handleOAuth();
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {isLoading && !error && (
          <>
            <h2 className="text-xl font-semibold mb-2">인증 처리 중...</h2>
            <p className="text-gray-600">잠시만 기다려주세요.</p>
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          </>
        )}
        {error && (
          <>
            <h2 className="text-xl font-semibold mb-2 text-red-500">오류 발생</h2>
            <p className="text-gray-600">{error}</p>
            <p className="text-gray-500 mt-2 text-sm">메인 페이지로 이동합니다...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthHandler;