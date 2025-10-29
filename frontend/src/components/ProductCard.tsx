import { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { AiOutlineEye } from "react-icons/ai";

import { Product } from "@/types";
import ProductDetailsModal from "./ProductDetailsModal";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Image Slider */}
      <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
        <img
          alt={`${product.name} ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
          src={product.images[currentImageIndex]}
        />

        {/* Image Navigation */}
        {product.images.length > 1 && (
          <>
            <button
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              onClick={prevImage}
            >
              <IoChevronBack className="w-5 h-5" />
            </button>
            <button
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              onClick={nextImage}
            >
              <IoChevronForward className="w-5 h-5" />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  aria-label={`Go to image ${index + 1}`}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex
                      ? "bg-white"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {product.category.name}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            {product.subcategory.name}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ₹{product.price.toFixed(2)}
          </span>
          <button
            onClick={() => setIsDetailsModalOpen(true)}
            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <AiOutlineEye className="w-4 h-4" />
            Details
          </button>
        </div>
      </div>

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={product}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  );
}
