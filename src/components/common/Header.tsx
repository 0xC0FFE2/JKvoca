import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import OAuthSDK from "nanuid-websdk";
import logo from "../../assets/logos/logo_RX_BLACK.svg";
import logoMobile from "../../assets/logos/logo_RR.svg";
import {
  Search,
  User,
  LogOut,
  ArrowRight,
  LogIn,
  BookOpen,
  Users,
} from "lucide-react";
import { getValidToken } from "../../utils/auth";

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const fetchUserEmail = async () => {
      const accessToken = await getValidToken();

      if (accessToken) {
        try {
          const response = await fetch("https://auth.nanu.cc/auth/get/email", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data = await response.text();
          setUserEmail(data.trim());
        } catch (error) {
          console.error("이메일 요청 중 오류 발생:", error);
        }
      }
    };

    fetchUserEmail();
  }, []);

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLogout = () => {
    OAuthSDK.logout("/login");
  };

  const handleLogin = () => {
    window.location.href =
      "https://id.nanu.cc/oauth?app_name=jKvoca%20Service&auth_scope=[%22EMAIL%22]&redirect_uri=https://jkvoca.ncloud.sbs/oauth_handler&app_id=78df346b-3feb-459e-8bc7-39ab0a778f38";
  };

  return (
    <header className="w-full border-b border-gray-200 py-3 px-4 flex items-center justify-between bg-white sticky top-0 z-50">
      <div className="flex items-center text-gray-700 font-medium">
        <Link to="/">
          <img
            src={logo}
            alt="JKvoca"
            className="h-10 cursor-pointer hidden md:block"
          />
          <img
            src={logoMobile}
            alt="JKvoca"
            className="h-8 cursor-pointer md:hidden"
          />
        </Link>
      </div>

      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <input
            type="text"
            placeholder="JK가 만든 단어장을 찾아보세요"
            className="w-full py-2 pl-10 pr-4 border border-indigo-100 rounded-full bg-[#f8faff] text-sm focus:outline-none focus:ring-2 focus:ring-[#C7D9DD] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-400"
          />
          {searchTerm && (
            <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-indigo-500 text-white p-1 rounded-full hover:bg-indigo-600 transition-colors"
            >
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="relative" ref={userMenuRef}>
        <button
          className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
            userEmail
              ? "bg-indigo-100 hover:bg-indigo-200"
              : "bg-white border-2 border-[#4F959D] hover:border-[#4F959D]"
          }`}
          onClick={toggleUserMenu}
        >
          <User
            size={18}
            className={userEmail ? "text-[#4F959D]" : "text-[#4F959D]"}
          />
        </button>

        {isUserMenuOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
            {userEmail ? (
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">{userEmail}</p>
                <p className="text-xs text-gray-500">회원 정보</p>
              </div>
            ) : (
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-700 font-medium mb-1">
                    관리자 로그인이 필요합니다
                  </p>
                  <p className="text-xs text-gray-500 mb-3 text-center">
                    로그인하여 JK용 기능을 이용하세요
                  </p>
                  <button
                    onClick={handleLogin}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors"
                  >
                    <LogIn size={16} className="mr-2" /> 로그인하여 계속하기
                  </button>
                </div>
              </div>
            )}

            {userEmail && (
              <>
                <div className="py-1">
                  <Link
                    to="/vocab/"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                  >
                    <BookOpen size={16} className="mr-3 text-indigo-500" />{" "}
                    단어장 관리
                  </Link>
                  <Link
                    to="/class"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                  >
                    <Users size={16} className="mr-3 text-indigo-500" /> 반 관리
                  </Link>
                </div>

                <div className="py-1 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 w-full text-left"
                  >
                    <LogOut size={16} className="mr-3 text-indigo-500" />{" "}
                    로그아웃
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
