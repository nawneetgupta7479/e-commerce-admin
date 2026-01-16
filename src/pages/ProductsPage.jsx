import { useState } from "react";
import { PlusIcon, PencilIcon, Trash2Icon, XIcon, ImageIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../lib/api";
import { getStockStatusBadge } from "../lib/utils";

function ProductsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const queryClient = useQueryClient();

  // fetch some data
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAll,
  });

  // creating, update, deleting
  const createProductMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: productApi.update,
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const closeModal = () => {
    // reset the state
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
    });
    setImages([]);
    setImagePreviews([]);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
    });
    setImagePreviews(product.images);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) return alert("Maximum 3 images allowed");

    // revoke previous blob URLs to free memory
    imagePreviews.forEach((url) => {
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    });

    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // for new products, require images
    if (!editingProduct && imagePreviews.length === 0) {
      return alert("Please upload at least one image");
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append("category", formData.category);

    // only append new images if they were selected
    if (images.length > 0) images.forEach((image) => formDataToSend.append("images", image));

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct._id, formData: formDataToSend });
    } else {
      createProductMutation.mutate(formDataToSend);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Products</h1>
          <p className="text-base-content/70 mt-1 text-sm sm:text-base">Manage your product inventory</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary gap-2 btn-sm sm:btn-md w-full sm:w-auto">
          <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          Add Product
        </button>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 gap-4">
        {products?.map((product) => {
          const status = getStockStatusBadge(product.stock);

          return (
            <div key={product._id} className="card bg-base-100 shadow-xl">
              <div className="card-body p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  {/* Image and Badge - Mobile Layout */}
                  <div className="flex items-start justify-between sm:hidden">
                    <div className="avatar">
                      <div className="w-16 rounded-xl">
                        <img src={product.images[0]} alt={product.name} />
                      </div>
                    </div>
                    <div className={`badge badge-sm ${status.class}`}>{status.text}</div>
                  </div>

                  {/* Image - Desktop */}
                  <div className="avatar hidden sm:block">
                    <div className="w-20 rounded-xl">
                      <img src={product.images[0]} alt={product.name} />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="card-title text-base sm:text-lg">{product.name}</h3>
                        <p className="text-base-content/70 text-xs sm:text-sm">{product.category}</p>
                      </div>
                      {/* Badge - Desktop */}
                      <div className={`badge hidden sm:flex ${status.class}`}>{status.text}</div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6 mt-3 sm:mt-4">
                      <div>
                        <p className="text-xs text-base-content/70">Price</p>
                        <p className="font-bold text-base sm:text-lg">${product.price}</p>
                      </div>
                      <div>
                        <p className="text-xs text-base-content/70">Stock</p>
                        <p className="font-bold text-base sm:text-lg">{product.stock} units</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="card-actions justify-end sm:justify-start border-t sm:border-t-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                    <button
                      className="btn btn-sm sm:btn-md btn-square btn-ghost"
                      onClick={() => handleEdit(product)}
                    >
                      <PencilIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      className="btn btn-sm sm:btn-md btn-square btn-ghost text-error"
                      onClick={() => deleteProductMutation.mutate(product._id)}
                    >
                      {deleteProductMutation.isPending ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <Trash2Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD/EDIT PRODUCT MODAL */}

      <input type="checkbox" className="modal-toggle" checked={showModal} />

      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-2xl max-h-[90vh] sm:max-h-[85vh]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xl sm:text-2xl">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>

            <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost">
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="text-sm sm:text-base">Product Name</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter product name"
                  className="input input-bordered input-sm sm:input-md"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="text-sm sm:text-base">Category</span>
                </label>
                <select
                  className="select select-bordered select-sm sm:select-md"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="text-sm sm:text-base">Price ($)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="input input-bordered input-sm sm:input-md"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="text-sm sm:text-base">Stock</span>
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="input input-bordered input-sm sm:input-md"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-control flex flex-col gap-2">
              <label className="label">
                <span className="text-sm sm:text-base">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-20 sm:h-24 w-full text-sm sm:text-base"
                placeholder="Enter product description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-sm sm:text-base flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  Product Images
                </span>
                <span className="label-text-alt text-xs opacity-60">Max 3 images</span>
              </label>

              <div className="bg-base-200 rounded-xl p-3 sm:p-4 border-2 border-dashed border-base-300 hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="file-input file-input-bordered file-input-primary file-input-sm sm:file-input-md w-full"
                  required={!editingProduct}
                />

                {editingProduct && (
                  <p className="text-xs text-base-content/60 mt-2 text-center">
                    Leave empty to keep current images
                  </p>
                )}
              </div>

              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="avatar">
                      <div className="w-14 sm:w-20 rounded-lg">
                        <img src={preview} alt={`Preview ${index + 1}`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-action flex-col sm:flex-row gap-2 sm:gap-0">
              <button
                type="button"
                onClick={closeModal}
                className="btn btn-sm sm:btn-md w-full sm:w-auto"
                disabled={createProductMutation.isPending || updateProductMutation.isPending}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto"
                disabled={createProductMutation.isPending || updateProductMutation.isPending}
              >
                {createProductMutation.isPending || updateProductMutation.isPending ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : editingProduct ? (
                  "Update Product"
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
