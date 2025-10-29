import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { IoArrowBack } from "react-icons/io5";
import { AiOutlineLoading3Quarters, AiOutlinePlus } from "react-icons/ai";
import { Product, Category, Subcategory } from "@/types";
import {
  fetchProducts,
  fetchCategories,
  fetchSubcategories,
  deleteProduct,
  deleteCategory,
  deleteSubcategory,
} from "@/services/api";
import DefaultLayout from "@/layouts/default";
import ProductModal from "@/components/ProductModal";
import CategoryModal from "@/components/CategoryModal";
import SubcategoryModal from "@/components/SubcategoryModal";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

type Tab = "products" | "categories" | "subcategories";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("products");

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  // Loading states
  const [loading, setLoading] = useState(false);

  // Modal states
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [subcategoryModalOpen, setSubcategoryModalOpen] = useState(false);

  // Edit states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] =
    useState<Subcategory | null>(null);

  // Load all data
  const loadData = async () => {
    setLoading(true);
    try {
      const [categoriesData, subcategoriesData, productsData] =
        await Promise.all([
          fetchCategories(),
          fetchSubcategories(),
          fetchProducts({ limit: 1000 }),
        ]);
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
      setProducts(productsData.data);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Delete handlers with confirmation
  const handleDeleteProduct = (product: Product) => {
    confirmAlert({
      title: "Confirm Delete",
      message: `Are you sure you want to delete "${product.name}"?`,
      buttons: [
        {
          label: "Yes, Delete",
          onClick: async () => {
            const result = await deleteProduct(product.id);
            if (result.success) {
              toast.success("Product deleted successfully!");
              loadData();
            } else {
              toast.error(result.error || "Failed to delete product");
            }
          },
        },
        {
          label: "Cancel",
          onClick: () => {},
        },
      ],
    });
  };

  const handleDeleteCategory = (category: Category) => {
    confirmAlert({
      title: "Confirm Delete",
      message: `Are you sure you want to delete "${category.name}"? This may affect products using this category.`,
      buttons: [
        {
          label: "Yes, Delete",
          onClick: async () => {
            const result = await deleteCategory(category.id);
            if (result.success) {
              toast.success("Category deleted successfully!");
              loadData();
            } else {
              toast.error(result.error || "Failed to delete category");
            }
          },
        },
        {
          label: "Cancel",
          onClick: () => {},
        },
      ],
    });
  };

  const handleDeleteSubcategory = (subcategory: Subcategory) => {
    confirmAlert({
      title: "Confirm Delete",
      message: `Are you sure you want to delete "${subcategory.name}"? This may affect products using this subcategory.`,
      buttons: [
        {
          label: "Yes, Delete",
          onClick: async () => {
            const result = await deleteSubcategory(subcategory.id);
            if (result.success) {
              toast.success("Subcategory deleted successfully!");
              loadData();
            } else {
              toast.error(result.error || "Failed to delete subcategory");
            }
          },
        },
        {
          label: "Cancel",
          onClick: () => {},
        },
      ],
    });
  };

  // Edit handlers
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryModalOpen(true);
  };

  const handleEditSubcategory = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setSubcategoryModalOpen(true);
  };

  // Add handlers
  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductModalOpen(true);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryModalOpen(true);
  };

  const handleAddSubcategory = () => {
    setEditingSubcategory(null);
    setSubcategoryModalOpen(true);
  };

  return (
    <DefaultLayout>
      <div className="w-full py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Content Management Dashboard
          </h1>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2"
          >
            <IoArrowBack className="w-4 h-4" />
            Back to Products
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "products"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "categories"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab("subcategories")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "subcategories"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Subcategories ({subcategories.length})
          </button>
        </div>

        {/* Add Button */}
        <div className="flex justify-end mb-4">
          {activeTab === "products" && (
            <button
              onClick={handleAddProduct}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <AiOutlinePlus className="w-4 h-4" />
              Add Product
            </button>
          )}
          {activeTab === "categories" && (
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <AiOutlinePlus className="w-4 h-4" />
              Add Category
            </button>
          )}
          {activeTab === "subcategories" && (
            <button
              onClick={handleAddSubcategory}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <AiOutlinePlus className="w-4 h-4" />
              Add Subcategory
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <AiOutlineLoading3Quarters className="animate-spin h-12 w-12 text-blue-600" />
          </div>
        )}

        {/* Tables */}
        {!loading && (
          <>
            {/* Products Table */}
            {activeTab === "products" && (
              <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Subcategory
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {product.category.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {product.subcategory.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center gap-1 transition-colors"
                            >
                              <CiEdit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product)}
                              className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-1 transition-colors"
                            >
                              <MdDeleteOutline className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {products.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No products found. Click "Add Product" to create one.
                  </div>
                )}
              </div>
            )}

            {/* Categories Table */}
            {activeTab === "categories" && (
              <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {category.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center gap-1 transition-colors"
                            >
                              <CiEdit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category)}
                              className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-1 transition-colors"
                            >
                              <MdDeleteOutline className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {categories.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No categories found. Click "Add Category" to create one.
                  </div>
                )}
              </div>
            )}

            {/* Subcategories Table */}
            {activeTab === "subcategories" && (
              <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {subcategories.map((subcategory) => {
                      const category = categories.find(
                        (c) => c.id === subcategory.categoryId
                      );
                      return (
                        <tr key={subcategory.id}>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {subcategory.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {category?.name || "Unknown"}
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() =>
                                  handleEditSubcategory(subcategory)
                                }
                                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center gap-1 transition-colors"
                              >
                                <CiEdit className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteSubcategory(subcategory)
                                }
                                className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-1 transition-colors"
                              >
                                <MdDeleteOutline className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {subcategories.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No subcategories found. Click "Add Subcategory" to create
                    one.
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Modals */}
        <ProductModal
          isOpen={productModalOpen}
          onClose={() => {
            setProductModalOpen(false);
            setEditingProduct(null);
          }}
          onSuccess={loadData}
          product={editingProduct}
          mode={editingProduct ? "edit" : "create"}
          categories={categories}
          subcategories={subcategories}
        />

        <CategoryModal
          isOpen={categoryModalOpen}
          onClose={() => {
            setCategoryModalOpen(false);
            setEditingCategory(null);
          }}
          onSuccess={loadData}
          category={editingCategory}
          mode={editingCategory ? "edit" : "create"}
        />

        <SubcategoryModal
          isOpen={subcategoryModalOpen}
          onClose={() => {
            setSubcategoryModalOpen(false);
            setEditingSubcategory(null);
          }}
          onSuccess={loadData}
          subcategory={editingSubcategory}
          mode={editingSubcategory ? "edit" : "create"}
          categories={categories}
        />
      </div>
    </DefaultLayout>
  );
}
