import React from "react";

interface GroupNavigationProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const GroupNavigation: React.FC<GroupNavigationProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-5 py-3 font-medium text-sm mr-2 ${
            activeTab === tab
              ? "text-black border-b-2 border-black"
              : "text-gray-500 hover:text-black"
          }`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default GroupNavigation;
