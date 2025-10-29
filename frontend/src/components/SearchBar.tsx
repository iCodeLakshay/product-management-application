import { useState, useEffect } from "react";
import { IoSearchOutline, IoCloseCircle } from "react-icons/io5";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = "Search products...",
}: SearchBarProps) {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchValue);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchValue, onSearch]);

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <IoSearchOutline className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </div>
      <input
        className="block w-full pl-10 pr-3 py-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors"
        placeholder={placeholder}
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {searchValue && (
        <button
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={() => setSearchValue("")}
        >
          <IoCloseCircle className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
