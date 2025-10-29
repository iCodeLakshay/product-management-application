import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { BiPackage } from "react-icons/bi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { Product, Category, Subcategory, PaginationInfo } from "@/types";
import {
  fetchProducts,
  fetchCategories,
  fetchSubcategories,
} from "@/services/api";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import FilterDropdowns from "@/components/FilterDropdowns";
import Pagination from "@/components/Pagination";
import DefaultLayout from "@/layouts/default";

export default function ProductListPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [allSubcategories, setAllSubcategories] = useState<Subcategory[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await fetchCategories();

        setCategories(cats);
        const allSubs = await fetchSubcategories();

        setAllSubcategories(allSubs);
        setSubcategories(allSubs);
      } catch {
        // Error loading categories
      }
    };

    loadCategories();
  }, []);

  // Update subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      const filteredSubs = allSubcategories.filter(
        (sub) => sub.categoryId === selectedCategory
      );

      setSubcategories(filteredSubs);
      setSelectedSubcategory(""); // Reset subcategory when category changes
    } else {
      setSubcategories(allSubcategories);
    }
  }, [selectedCategory, allSubcategories]);

  // Load products when filters change
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchProducts({
          search: searchTerm,
          categoryId: selectedCategory,
          subcategoryId: selectedSubcategory,
          page: currentPage,
          limit: itemsPerPage,
        });

        setProducts(response.data);
        setPagination(response.pagination);
      } catch {
        setError("Failed to load products. Please try again.");
        // Error loading products
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    currentPage,
    itemsPerPage,
  ]);

  // Handle search with useCallback to prevent unnecessary re-renders
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on new search
  }, []);

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  // Handle subcategory change
  const handleSubcategoryChange = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedSubcategory("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm || selectedCategory || selectedSubcategory;

  return (
    <DefaultLayout>
      <div className="w-full py-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Product Catalog
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Browse our collection of {pagination.totalItems} products
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <MdDashboard className="w-5 h-5" />
            Manage Content
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <SearchBar
            placeholder="Search by product name, description, category, or subcategory..."
            onSearch={handleSearch}
          />

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1 w-full">
              <FilterDropdowns
                categories={categories}
                selectedCategory={selectedCategory}
                selectedSubcategory={selectedSubcategory}
                subcategories={subcategories}
                onCategoryChange={handleCategoryChange}
                onSubcategoryChange={handleSubcategoryChange}
              />
            </div>

            {hasActiveFilters && (
              <button
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Info and Items Per Page Selector */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {loading ? (
              <span>Loading products...</span>
            ) : (
              <span>
                Showing{" "}
                {products.length === 0
                  ? 0
                  : (currentPage - 1) * itemsPerPage + 1}{" "}
                - {Math.min(currentPage * itemsPerPage, pagination.totalItems)}{" "}
                of {pagination.totalItems} products
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="itemsPerPage"
              className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap"
            >
              Products per page:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <AiOutlineLoading3Quarters className="animate-spin h-12 w-12 text-blue-600" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <BiPackage className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No Products Found
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {hasActiveFilters
                ? "Try adjusting your search or filters to find what you're looking for."
                : "There are no products available at the moment."}
            </p>
            {hasActiveFilters && (
              <button
                className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={clearFilters}
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </DefaultLayout>
  );
}
