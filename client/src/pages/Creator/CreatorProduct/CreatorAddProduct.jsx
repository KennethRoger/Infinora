import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FiUpload } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/redux/features/categorySlice";
import { FaArrowLeft } from "react-icons/fa";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useNavigate } from "react-router-dom";
import { useLoading } from "@/hooks/useLoading";
import Spinner from "@/components/Spinner/Spinner";

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  const cropWidth = Math.min(mediaWidth, mediaHeight);
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: (cropWidth / mediaWidth) * 100,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function CreatorAddProduct() {
  const dispatch = useDispatch();
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );
  const { loading, startLoading, stopLoading } = useLoading();
  const [imageFiles, setImageFiles] = useState({
    main: null,
    additional: [null, null, null],
  });
  const [imagePreview, setImagePreview] = useState({
    main: null,
    additional: [null, null, null],
  });
  const [imageError, setImageError] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [showCropModal, setShowCropModal] = useState(false);
  const [currentImageType, setCurrentImageType] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      stock: "",
      discount: 0,
      category: "",
      status: "available",
      tags: "",
    },
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleImageChange = (e, type, index = null) => {
    const file = e.target.files[0];
    if (!file) return;
    setCurrentImageType(type);
    setCurrentImageIndex(index);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview((prev) => ({
        ...prev,
        [type]:
          type === "main"
            ? reader.result
            : prev[type].map((p, i) => (i === index ? reader.result : p)),
      }));
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const crop = centerAspectCrop(width, height, 1 / 1);
    setCrop(crop);
  };

  const canvasPreview = async (image, canvas, crop) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  };

  useEffect(() => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
    }
  }, [completedCrop]);

  const handleCropComplete = () => {
    if (!previewCanvasRef.current) return;

    const croppedImageUrl = previewCanvasRef.current.toDataURL();
    previewCanvasRef.current.toBlob((blob) => {
      if (!blob) return;

      if (currentImageType === "main") {
        setImageFiles((prev) => ({ ...prev, main: blob }));
        setImagePreview((prev) => ({ ...prev, main: croppedImageUrl }));
      } else {
        setImageFiles((prev) => ({
          ...prev,
          additional: prev.additional.map((f, i) =>
            i === currentImageIndex ? blob : f
          ),
        }));
        setImagePreview((prev) => ({
          ...prev,
          additional: prev.additional.map((p, i) =>
            i === currentImageIndex ? croppedImageUrl : p
          ),
        }));
      }
    });

    setShowCropModal(false);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  const onSubmit = async (data) => {
    if (!imageFiles.main) {
      setImageError("Main product image is required");
      return;
    }

    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      formData.append("images", imageFiles.main);

      imageFiles.additional.forEach((file) => {
        if (file) {
          formData.append("images", file);
        }
      });
      console.log(formData);
      startLoading();
      const response = await axios.post("/api/vendor/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.data.success) {
        stopLoading();
        toast.success("Product added successfully!");
        reset();
        setImageFiles({ main: null, additional: [null, null, null] });
        setImagePreview({ main: null, additional: [null, null, null] });
        navigate("/home/profile/creator/products");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(error.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <>
      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <h3 className="text-lg font-semibold mb-4">Crop Image</h3>
            <p className="text-sm text-gray-500 mb-4">
              Create a square crop for optimal product display
            </p>
            <div className="mb-4">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1 / 1}
                circularCrop={false}
                className="max-h-[500px] overflow-auto"
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={
                    currentImageType === "main"
                      ? imagePreview.main
                      : imagePreview.additional[currentImageIndex]
                  }
                  onLoad={onImageLoad}
                  className="max-w-full"
                />
              </ReactCrop>
            </div>
            <canvas ref={previewCanvasRef} className="hidden" />
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                {currentImageType === "main"
                  ? "Main Product Image"
                  : `Additional Image ${currentImageIndex + 1}`}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCropModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCropComplete}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 items-start">
        <div
          className="border-2 rounded-full p-4 cursor-pointer w-fit h-fit"
          onClick={() => window.history.back()}
        >
          <FaArrowLeft />
        </div>

        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Add New Product
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                {...register("name", { required: "Product name is required" })}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                rows={4}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images
              </label>
              {imageError && (
                <p className="text-red-500 text-sm mb-2">{imageError}</p>
              )}

              {/* Main Image */}
              <div className="border-2 border-dashed rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Image
                </label>
                <div className="relative flex items-center justify-center h-48 bg-gray-50 rounded-lg overflow-hidden">
                  {imagePreview.main ? (
                    <img
                      src={imagePreview.main}
                      alt="Main preview"
                      className="h-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        Click to upload main image
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "main")}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Additional Images */}
              <div className="grid grid-cols-3 gap-4">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="border-2 border-dashed rounded-lg p-4"
                  >
                    <div className="relative flex items-center justify-center h-32 bg-gray-50 rounded-lg overflow-hidden">
                      {imagePreview.additional[index] ? (
                        <img
                          src={imagePreview.additional[index]}
                          alt={`Preview ${index + 1}`}
                          className="h-full object-contain"
                        />
                      ) : (
                        <div className="text-center">
                          <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
                          <p className="mt-1 text-xs text-gray-500">
                            Image {index + 1}
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageChange(e, "additional", index)
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price, Stock, and Discount Row */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("price", {
                    required: "Price is required",
                    min: 0,
                  })}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  {...register("stock", {
                    required: "Stock is required",
                    min: 0,
                  })}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.stock.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount (%)
                </label>
                <input
                  type="number"
                  {...register("discount", { min: 0, max: 100 })}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {errors.discount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.discount.message}
                  </p>
                )}
              </div>
            </div>

            {/* Category and Status Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  disabled={categoriesLoading}
                >
                  <option value="">Select a category</option>
                  {categories?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category.message}
                  </p>
                )}
                {categoriesLoading && (
                  <p className="text-gray-500 text-sm mt-1">
                    Loading categories...
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  {...register("status")}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            {/* Tags Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                {...register("tags")}
                placeholder="e.g. organic, handmade, eco-friendly"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate tags with commas
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? <Spinner /> : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
