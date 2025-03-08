import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/logos/logo_RX_BLACK.svg";
import logoMobile from "../../assets/logos/logo_RR.svg";
import { Search, User, Settings, LogOut, Heart, ArrowRight } from "lucide-react";

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  return (
    <header className="w-full border-b border-gray-200 py-3 px-4 flex items-center justify-between bg-white sticky top-0 z-50">
      <div className="flex items-center text-gray-700 font-medium">
        <Link to="/">
          {/* 데스크톱 로고 - 모바일에서 숨김 */}
          <img 
            src={logo} 
            alt="JKvoca" 
            className="h-10 cursor-pointer hidden md:block" 
          />
          {/* 모바일 로고 - 데스크톱에서 숨김 */}
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
          className="flex items-center justify-center w-9 h-9 bg-indigo-100 rounded-full hover:bg-indigo-200 transition-colors"
          onClick={toggleUserMenu}
        >
          <User size={18} className="text-indigo-600" />
        </button>

        {isUserMenuOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-800">김스타픽</p>
              <p className="text-xs text-gray-500">starpick@example.com</p>
            </div>

            <div className="py-1">
              <a
                href="#profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
              >
                <User size={16} className="mr-3 text-indigo-500" />
                프로필
              </a>
              <a
                href="#favorites"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
              >
                <Heart size={16} className="mr-3 text-indigo-500" />
                관심 그룹
              </a>
              <a
                href="#settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
              >
                <Settings size={16} className="mr-3 text-indigo-500" />
                회원정보 관리
              </a>
            </div>

            <div className="py-1 border-t border-gray-100">
              <a
                href="#logout"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
              >
                <LogOut size={16} className="mr-3 text-indigo-500" />
                로그아웃
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;