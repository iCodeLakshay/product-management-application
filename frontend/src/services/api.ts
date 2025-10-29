import {
  Product,
  Category,
  Subcategory,
  PaginatedResponse,
  ProductFilters,
} from "@/types";

// API Base URL - Update this to match your backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Backend API Response Types
interface BackendCategory {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BackendSubcategory {
  _id: string;
  name: string;
  description?: string;
  categoryId: string | { _id: string; name: string };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BackendProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  categoryId: {
    _id: string;
    name: string;
    description?: string;
  };
  subcategoryId: {
    _id: string;
    name: string;
    description?: string;
  };
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BackendPaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

interface BackendResponse<T> {
  success: boolean;
  data: T[] | T;
  count?: number;
}

// Transform functions to convert backend format to frontend format
const transformCategory = (backendCategory: BackendCategory): Category => ({
  id: backendCategory._id,
  name: backendCategory.name,
});

const transformSubcategory = (
  backendSubcategory: BackendSubcategory
): Subcategory => {
  const categoryId =
    typeof backendSubcategory.categoryId === "string"
      ? backendSubcategory.categoryId
      : backendSubcategory.categoryId._id;

  return {
    id: backendSubcategory._id,
    name: backendSubcategory.name,
    categoryId: categoryId,
  };
};

const transformProduct = (backendProduct: BackendProduct): Product => ({
  id: backendProduct._id,
  name: backendProduct.name,
  description: backendProduct.description,
  price: backendProduct.price,
  images:
    backendProduct.images.length > 0
      ? backendProduct.images
      : [`https://picsum.photos/seed/${backendProduct._id}/600/400`],
  category: {
    id: backendProduct.categoryId._id,
    name: backendProduct.categoryId.name,
  },
  subcategory: {
    id: backendProduct.subcategoryId._id,
    name: backendProduct.subcategoryId.name,
    categoryId: backendProduct.categoryId._id,
  },
  createdAt: backendProduct.createdAt,
});

// API Functions
export const fetchProducts = async (
  filters: ProductFilters = {}
): Promise<PaginatedResponse<Product>> => {
  try {
    const {
      search = "",
      categoryId = "",
      subcategoryId = "",
      page = 1,
      limit = 50,
    } = filters;

    // Build query parameters
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (categoryId) params.append("categoryId", categoryId);
    if (subcategoryId) params.append("subcategoryId", subcategoryId);

    const response = await fetch(
      `${API_BASE_URL}/products?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const backendResponse: BackendPaginatedResponse<BackendProduct> =
      await response.json();

    return {
      data: backendResponse.data.map(transformProduct),
      pagination: backendResponse.pagination,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return empty response on error
    return {
      data: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 10,
      },
    };
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const backendResponse: BackendResponse<BackendCategory> =
      await response.json();
    const categories = Array.isArray(backendResponse.data)
      ? backendResponse.data
      : [backendResponse.data];

    return categories.map(transformCategory);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const fetchSubcategories = async (
  categoryId?: string
): Promise<Subcategory[]> => {
  try {
    const params = categoryId ? `?categoryId=${categoryId}` : "";
    const response = await fetch(`${API_BASE_URL}/subcategories${params}`);

    if (!response.ok) {
      throw new Error("Failed to fetch subcategories");
    }

    const backendResponse: BackendResponse<BackendSubcategory> =
      await response.json();
    const subcategories = Array.isArray(backendResponse.data)
      ? backendResponse.data
      : [backendResponse.data];

    return subcategories.map(transformSubcategory);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  }
};

// Create Category
export const createCategory = async (data: {
  name: string;
  description?: string;
}): Promise<{ success: boolean; data?: Category; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to create category",
      };
    }

    const result = await response.json();
    return { success: true, data: transformCategory(result.data) };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Network error" };
  }
};

// Update Category
export const updateCategory = async (
  id: string,
  data: { name?: string; description?: string; isActive?: boolean }
): Promise<{ success: boolean; data?: Category; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to update category",
      };
    }

    const result = await response.json();
    return { success: true, data: transformCategory(result.data) };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Network error" };
  }
};

// Delete Category
export const deleteCategory = async (
  id: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to delete category",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Network error" };
  }
};

// Create Subcategory
export const createSubcategory = async (data: {
  name: string;
  description?: string;
  categoryId: string;
}): Promise<{ success: boolean; data?: Subcategory; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/subcategories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to create subcategory",
      };
    }

    const result = await response.json();
    return { success: true, data: transformSubcategory(result.data) };
  } catch (error) {
    console.error("Error creating subcategory:", error);
    return { success: false, error: "Network error" };
  }
};

// Update Subcategory
export const updateSubcategory = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    categoryId?: string;
    isActive?: boolean;
  }
): Promise<{ success: boolean; data?: Subcategory; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/subcategories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to update subcategory",
      };
    }

    const result = await response.json();
    return { success: true, data: transformSubcategory(result.data) };
  } catch (error) {
    console.error("Error updating subcategory:", error);
    return { success: false, error: "Network error" };
  }
};

// Delete Subcategory
export const deleteSubcategory = async (
  id: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/subcategories/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to delete subcategory",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    return { success: false, error: "Network error" };
  }
};

// Create Product with File Upload
export const createProduct = async (
  data: {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    subcategoryId: string;
    stock?: number;
  },
  imageFiles: File[]
): Promise<{ success: boolean; data?: Product; error?: string }> => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("categoryId", data.categoryId);
    formData.append("subcategoryId", data.subcategoryId);
    if (data.stock !== undefined) {
      formData.append("stock", data.stock.toString());
    }

    // Append all image files
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to create product",
      };
    }

    const result = await response.json();
    return { success: true, data: transformProduct(result.data) };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Network error" };
  }
};

// Update Product with File Upload
export const updateProduct = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    categoryId?: string;
    subcategoryId?: string;
    stock?: number;
    isActive?: boolean;
    keepExistingImages?: boolean;
  },
  imageFiles?: File[]
): Promise<{ success: boolean; data?: Product; error?: string }> => {
  try {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.price !== undefined)
      formData.append("price", data.price.toString());
    if (data.categoryId) formData.append("categoryId", data.categoryId);
    if (data.subcategoryId)
      formData.append("subcategoryId", data.subcategoryId);
    if (data.stock !== undefined)
      formData.append("stock", data.stock.toString());
    if (data.isActive !== undefined)
      formData.append("isActive", data.isActive.toString());
    if (data.keepExistingImages !== undefined) {
      formData.append("keepExistingImages", data.keepExistingImages.toString());
    }

    // Append all image files if provided
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to update product",
      };
    }

    const result = await response.json();
    return { success: true, data: transformProduct(result.data) };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Network error" };
  }
};

// Delete Product
export const deleteProduct = async (
  id: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to delete product",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Network error" };
  }
};
