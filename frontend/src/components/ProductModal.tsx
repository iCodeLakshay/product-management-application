import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { IoCloseCircle } from "react-icons/io5";
import { Category, Subcategory, Product } from "@/types";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product | null;
  mode: "create" | "edit";
  categories: Category[];
  subcategories: Subcategory[];
}

export default function ProductModal({
  isOpen,
  onClose,
  onSuccess,
  product,
  mode,
  categories,
  subcategories,
}: ProductModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    Subcategory[]
  >([]);

  useEffect(() => {
    if (categoryId) {
      const filtered = subcategories.filter(
        (sub) => sub.categoryId === categoryId
      );
      setFilteredSubcategories(filtered);
      if (mode === "create" || !filtered.find((s) => s.id === subcategoryId)) {
        setSubcategoryId(filtered[0]?.id || "");
      }
    } else {
      setFilteredSubcategories([]);
      setSubcategoryId("");
    }
  }, [categoryId, subcategories, mode, subcategoryId]);

  useEffect(() => {
    if (isOpen && mode === "edit" && product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setStock("0");
      setCategoryId(product.category.id);
      setSubcategoryId(product.subcategory.id);
      setExistingImages(product.images);
      setImagePreviews(product.images);
      setImageFiles([]);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setStock("0");
      setCategoryId(categories[0]?.id || "");
      setSubcategoryId("");
      setExistingImages([]);
      setImagePreviews([]);
      setImageFiles([]);
    }
  }, [isOpen, mode, product, categories]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    fileArray.forEach((file) => {
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Max size is 5MB`);
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      validFiles.push(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validFiles.length) {
          setImageFiles((prev) => [...prev, ...validFiles]);
          setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const isExistingImage = index < existingImages.length;

    if (isExistingImage) {
      // Remove from existing images
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Remove from new image files
      const fileIndex = index - existingImages.length;
      setImageFiles((prev) => prev.filter((_, i) => i !== fileIndex));
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { createProduct, updateProduct } = await import("@/services/api");

      const productData = {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        categoryId,
        subcategoryId,
      };

      if (mode === "create") {
        if (imageFiles.length === 0) {
          toast.error("Please upload at least one product image");
          setLoading(false);
          return;
        }

        const result = await createProduct(productData, imageFiles);
        if (result.success) {
          toast.success("Product created successfully!");
          onSuccess();
          onClose();
        } else {
          toast.error(result.error || "Failed to create product");
        }
      } else if (product) {
        // For edit mode, only send new images if uploaded
        const keepExistingImages =
          existingImages.length > 0 && imageFiles.length > 0;

        const result = await updateProduct(
          product.id,
          { ...productData, keepExistingImages },
          imageFiles.length > 0 ? imageFiles : undefined
        );

        if (result.success) {
          toast.success("Product updated successfully!");
          onSuccess();
          onClose();
        } else {
          toast.error(result.error || "Failed to update product");
        }
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl my-8">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {mode === "create" ? "Add Product" : "Edit Product"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter product description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subcategory *
                </label>
                <select
                  value={subcategoryId}
                  onChange={(e) => setSubcategoryId(e.target.value)}
                  required
                  disabled={!categoryId || filteredSubcategories.length === 0}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                >
                  <option value="">Select Subcategory</option>
                  {filteredSubcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Stock
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Images
              </label>

              {/* Image Upload Input */}
              <div className="mb-4">
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Click to upload images
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Image Preview Grid */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {imagePreviews.map((image, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600"
                    >
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                        aria-label="Remove image"
                      >
                        <IoCloseCircle className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2 text-center">
                        {index < existingImages.length ? "Existing" : "New"}{" "}
                        Image {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : mode === "create"
                    ? "Create"
                    : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
