import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Category } from "@/types";

interface SubcategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  subcategory?: { id: string; name: string; categoryId: string } | null;
  mode: "create" | "edit";
  categories: Category[];
}

export default function SubcategoryModal({
  isOpen,
  onClose,
  onSuccess,
  subcategory,
  mode,
  categories,
}: SubcategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && mode === "edit" && subcategory) {
      setName(subcategory.name);
      setCategoryId(subcategory.categoryId);
      setDescription("");
    } else {
      setName("");
      setDescription("");
      setCategoryId(categories[0]?.id || "");
    }
  }, [isOpen, mode, subcategory, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { createSubcategory, updateSubcategory } = await import(
        "@/services/api"
      );

      if (mode === "create") {
        const result = await createSubcategory({
          name,
          description,
          categoryId,
        });
        if (result.success) {
          toast.success("Subcategory created successfully!");
          onSuccess();
          onClose();
        } else {
          toast.error(result.error || "Failed to create subcategory");
        }
      } else if (subcategory) {
        const result = await updateSubcategory(subcategory.id, {
          name,
          description,
          categoryId,
        });
        if (result.success) {
          toast.success("Subcategory updated successfully!");
          onSuccess();
          onClose();
        } else {
          toast.error(result.error || "Failed to update subcategory");
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {mode === "create" ? "Add Subcategory" : "Edit Subcategory"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                Subcategory Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter subcategory name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter description (optional)"
              />
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
