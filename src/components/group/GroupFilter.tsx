import React from "react";

interface FilterGroupProps {
  title: string;
  options: string[];
  selectedOption: string;
  onOptionChange: (option: string) => void;
}

const FilterGroup: React.FC<FilterGroupProps> = ({ title, options, selectedOption, onOptionChange }) => {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            className={`px-4 py-2 rounded-full text-xs ${
              selectedOption === option
                ? "bg-gray-200 text-black font-medium"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => onOptionChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterGroup