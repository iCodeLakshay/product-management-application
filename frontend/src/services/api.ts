import {
  Product,
  Category,
  Subcategory,
  PaginatedResponse,
  ProductFilters,
} from "@/types";

// Mock data for categories
const mockCategories: Category[] = [
  { id: "1", name: "Electronics" },
  { id: "2", name: "Clothing" },
  { id: "3", name: "Home & Garden" },
  { id: "4", name: "Sports & Outdoors" },
  { id: "5", name: "Books" },
];

// Mock data for subcategories
const mockSubcategories: Subcategory[] = [
  { id: "1", name: "Smartphones", categoryId: "1" },
  { id: "2", name: "Laptops", categoryId: "1" },
  { id: "3", name: "Headphones", categoryId: "1" },
  { id: "4", name: "Men's Clothing", categoryId: "2" },
  { id: "5", name: "Women's Clothing", categoryId: "2" },
  { id: "6", name: "Kids Clothing", categoryId: "2" },
  { id: "7", name: "Furniture", categoryId: "3" },
  { id: "8", name: "Kitchen", categoryId: "3" },
  { id: "9", name: "Fitness Equipment", categoryId: "4" },
  { id: "10", name: "Camping Gear", categoryId: "4" },
  { id: "11", name: "Fiction", categoryId: "5" },
  { id: "12", name: "Non-Fiction", categoryId: "5" },
];

// Generate mock products
const generateMockProducts = (): Product[] => {
  const products: Product[] = [];
  const productNames = [
    "Premium Wireless Headphones",
    "Smart Watch Pro",
    "Gaming Laptop Ultra",
    "Professional Camera",
    "Bluetooth Speaker",
    "Fitness Tracker",
    "Wireless Earbuds",
    "Tablet Pro",
    "Mechanical Keyboard",
    "Gaming Mouse",
  ];

  for (let i = 0; i < 150; i++) {
    const category = mockCategories[i % mockCategories.length];
    const subcategories = mockSubcategories.filter(
      (sub) => sub.categoryId === category.id,
    );
    const subcategory = subcategories[i % subcategories.length];

    products.push({
      id: `prod-${i + 1}`,
      name: `${productNames[i % productNames.length]} ${Math.floor(i / 10) + 1}`,
      description: `High-quality ${productNames[i % productNames.length].toLowerCase()} with advanced features and excellent performance. Perfect for both professional and personal use.`,
      price: Math.floor(Math.random() * 1000) + 50,
      images: [
        `https://picsum.photos/seed/${i}-1/600/400`,
        `https://picsum.photos/seed/${i}-2/600/400`,
        `https://picsum.photos/seed/${i}-3/600/400`,
      ],
      category,
      subcategory,
      createdAt: new Date(
        Date.now() - Math.random() * 10000000000,
      ).toISOString(),
    });
  }

  return products;
};

const mockProducts = generateMockProducts();

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// API Functions
export const fetchProducts = async (
  filters: ProductFilters = {},
): Promise<PaginatedResponse<Product>> => {
  await delay(300); // Simulate network delay

  const {
    search = "",
    categoryId = "",
    subcategoryId = "",
    page = 1,
    limit = 50,
  } = filters;

  // Filter products
  let filteredProducts = [...mockProducts];

  // Search filter
  if (search) {
    const searchLower = search.toLowerCase();

    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.name.toLowerCase().includes(searchLower) ||
        product.subcategory.name.toLowerCase().includes(searchLower),
    );
  }

  // Category filter
  if (categoryId) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category.id === categoryId,
    );
  }

  // Subcategory filter
  if (subcategoryId) {
    filteredProducts = filteredProducts.filter(
      (product) => product.subcategory.id === subcategoryId,
    );
  }

  // Pagination
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return {
    data: paginatedProducts,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
    },
  };
};

export const fetchCategories = async (): Promise<Category[]> => {
  await delay(100);

  return mockCategories;
};

export const fetchSubcategories = async (
  categoryId?: string,
): Promise<Subcategory[]> => {
  await delay(100);
  if (categoryId) {
    return mockSubcategories.filter((sub) => sub.categoryId === categoryId);
  }

  return mockSubcategories;
};
