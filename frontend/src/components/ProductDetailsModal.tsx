import { useState } from "react";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { MdCategory, MdSubdirectoryArrowRight } from "react-icons/md";
import { AiOutlineCalendar } from "react-icons/ai";
import { Product } from "@/types";

interface ProductDetailsModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailsModal({
  product,
  isOpen,
  onClose,
}: ProductDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl my-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Product Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <IoClose className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Carousel */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={product.images[currentImageIndex]}
                  alt={`${product.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                      aria-label="Previous image"
                    >
                      <IoChevronBack className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                      aria-label="Next image"
                    >
                      <IoChevronForward className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {product.images.length}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? "border-blue-600 dark:border-blue-400 scale-105"
                          : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
                  Description
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Category & Subcategory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <MdCategory className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Category
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.category.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <MdSubdirectoryArrowRight className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Subcategory
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.subcategory.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <AiOutlineCalendar className="w-4 h-4" />
                  <span>
                    Added on{" "}
                    {new Date(product.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
