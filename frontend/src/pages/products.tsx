import { useState, useEffect, useCallback } from "react";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [allSubcategories, setAllSubcategories] = useState<Subcategory[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 50,
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
          limit: 50,
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
  }, [searchTerm, selectedCategory, selectedSubcategory, currentPage]);

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
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Product Catalog
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse our collection of {pagination.totalItems} products
          </p>
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

        {/* Results Info */}
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {loading ? (
            <span>Loading products...</span>
          ) : (
            <span>
              Showing {products.length === 0 ? 0 : (currentPage - 1) * 50 + 1} -{" "}
              {Math.min(currentPage * 50, pagination.totalItems)} of{" "}
              {pagination.totalItems} products
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
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
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
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
