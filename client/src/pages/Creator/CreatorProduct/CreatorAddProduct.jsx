import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FiUpload, FiTrash2, FiAlertTriangle } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/redux/features/categorySlice";
import { FaArrowLeft } from "react-icons/fa";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useNavigate } from "react-router-dom";
import { useLoading } from "@/hooks/useLoading";
import Spinner from "@/components/Spinner/Spinner";
import { useFieldArray } from "react-hook-form";
import Modal from "@/components/Modal/Modal";

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

// Component for variant type input fields
const VariantTypesForm = ({ control, register, variantIndex, errors }) => {
  const {
    fields: variantTypes,
    append: addVariantType,
    remove: removeVariantType,
  } = useFieldArray({
    control,
    name: `variants.${variantIndex}.variantTypes`,
  });

  return (
    <div className="grid grid-cols-2 gap-4">
      {variantTypes.map((field, typeIndex) => (
        <div key={field.id} className="relative">
          <input
            type="text"
            {...register(`variants.${variantIndex}.variantTypes.${typeIndex}`)}
            className="w-full px-4 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Small, Red"
          />
          <button
            type="button"
            onClick={() => removeVariantType(typeIndex)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
            title="Remove Type"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
          {errors.variants?.[variantIndex]?.variantTypes?.[typeIndex] && (
            <p className="text-red-500 text-xs mt-1">
              {errors.variants[variantIndex].variantTypes[typeIndex].message}
            </p>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => addVariantType("")}
        className="px-4 py-2 border border-dashed border-gray-300 rounded-md text-gray-500 hover:border-indigo-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1"
      >
        <span className="text-lg">+</span>
        Add Type
      </button>
    </div>
  );
};

export default function CreatorAddProduct() {
  const dispatch = useDispatch();
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );
  const { loading, startLoading, stopLoading } = useLoading();
  const [imageFiles, setImageFiles] = useState({
    main: null,
    additional: [],
  });
  const [imagePreview, setImagePreview] = useState({
    main: null,
    additional: [],
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
  const [images, setImages] = useState([]);

  const [variantSections, setVariantSections] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    control,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      category: "",
      subCategory: "",
      status: "available",
      tags: "",
      discount: 0,
      customizable: false,
      variants: [{ variantName: "", variantTypes: [] }],
      variantCombinations: [],
      price: "",
      stock: "",
      shipping: {
        weight: "",
        dimensions: {
          length: "",
          width: "",
          height: "",
        },
      },
      additionalDetails: "",
    },
  });

  const selectedCategory = watch("category");
  const [subcategories, setSubcategories] = useState([]);

  const parentCategories = categories;

  useEffect(() => {
    if (selectedCategory) {
      const findCategory = (cats) => {
        for (const cat of cats) {
          if (cat._id === selectedCategory) {
            return cat;
          }
        }
        return null;
      };

      const selectedCategoryObj = findCategory(categories);

      if (selectedCategoryObj && selectedCategoryObj.children) {
        setSubcategories(selectedCategoryObj.children);
      } else {
        setSubcategories([]);
      }
      setValue("subCategory", "");
    }
  }, [selectedCategory, categories, setValue]);

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
            : prev.additional.map((p, i) => (i === index ? reader.result : p)),
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

  const handleAddSlot = () => {
    if (images.length < 7) {
      setImages([...images, null]);
      setImageFiles((prev) => ({
        ...prev,
        additional: [...prev.additional, null],
      }));
      setImagePreview((prev) => ({
        ...prev,
        additional: [...prev.additional, null],
      }));
    }
  };

  const handleRemoveSlot = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImageFiles((prev) => ({
      ...prev,
      additional: prev.additional.filter((_, i) => i !== index),
    }));
    setImagePreview((prev) => ({
      ...prev,
      additional: prev.additional.filter((_, i) => i !== index),
    }));
  };

  // Variant management
  const {
    fields: variantFields,
    append: addVariantFields,
    remove: removeVariantFields,
  } = useFieldArray({ control, name: "variants" });

  // Variant combination management
  const {
    fields: variantCombinationFields,
    append: addVariantCombination,
    remove: removeVariantCombination,
  } = useFieldArray({ control, name: "variantCombinations" });

  const watchVariants = watch("variants");

  const onSubmit = async (data) => {
    if (!imageFiles.main) {
      setImageError("Main product image is required");
      return;
    }

    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "productVariants" || key === "shipping") {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });

      formData.append("images", imageFiles.main);
      imageFiles.additional.forEach((file) => {
        if (file) {
          formData.append("images", file);
        }
      });
      console.log("FormData: ", formData);

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
        setImageFiles({
          main: null,
          additional: [],
        });
        setImagePreview({
          main: null,
          additional: [],
        });
        navigate("/home/profile/creator/products");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      stopLoading();
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      stopLoading();
    }
  };

  return (
    <>
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

      <div className="flex gap-4 items-start w-full">
        <button
          className="border-2 rounded-full p-4 cursor-pointer w-fit h-fit hover:bg-gray-100 transition-colors"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
        </button>

        <div className="flex-1 max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Add New Product
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information Section */}
              <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Basic Information
                </h3>

                {/* Name and Category Row */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      {...register("name", {
                        required: "Product name is required",
                      })}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        {...register("category", {
                          required: "Category is required",
                        })}
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Category</option>
                        {parentCategories.map((category) => (
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
                    </div>

                    {/* Subcategory Selection */}
                    {selectedCategory && subcategories.length > 0 && (
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Subcategory
                        </label>
                        <select
                          {...register("subCategory", {
                            required: "Subcategory is required",
                          })}
                          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Subcategory</option>
                          {subcategories.map((subcategory) => (
                            <option
                              key={subcategory._id}
                              value={subcategory._id}
                            >
                              {subcategory.name}
                            </option>
                          ))}
                        </select>
                        {errors.subCategory && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.subCategory.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
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

                {/* Status and Discount Row */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      {...register("status")}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="available">Available</option>
                      <option value="outOfStock">Out of Stock</option>
                      <option value="comingSoon">Coming Soon</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      {...register("discount", {
                        min: {
                          value: 0,
                          message: "Discount cannot be negative",
                        },
                        max: {
                          value: 100,
                          message: "Discount cannot exceed 100%",
                        },
                        validate: (value) =>
                          Number.isInteger(Number(value)) ||
                          "Discount must be a whole number",
                      })}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.discount && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.discount.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Customizable Option */}
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register("customizable")}
                      className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Allow product customization
                    </span>
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    Enable this option if customers can have customization for
                    this product
                  </p>
                </div>
              </div>

              {/* Images Section */}
              <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Product Images
                </h3>

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
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className="border-2 border-dashed rounded-lg p-4 relative"
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
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot(index)}
                        className="absolute top-1 right-1 bg-red-50 text-red-600 p-1 rounded-full hover:bg-red-100 transition-colors flex items-center gap-2 font-medium"
                        title="Remove Image"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {images.length < 7 && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleAddSlot}
                      className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                    >
                      + Add Image
                    </button>
                  </div>
                )}
              </div>

              {/* Variant Section */}
              <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Product Variants
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Add variants if your product comes in different options
                      (e.g., sizes, colors)
                    </p>
                  </div>
                </div>
                {variantSections ? (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">Product Variants</h3>
                        <p className="text-sm text-gray-600">Define different variations of your product</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setVariantSections(false)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
                      >
                        <FiTrash2 className="h-4 w-4" />
                        Remove All Variants
                      </button>
                    </div>

                    {/* Variant Fields */}
                    <div className="space-y-6">
                      {variantFields?.map((field, index) => {
                        return (
                          <div
                            key={field.id}
                            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                          >
                            {/* Variant Header */}
                            <div className="flex justify-between items-center mb-6 pb-4 border-b">
                              <div>
                                <h4 className="text-lg font-medium text-gray-800">
                                  Variant {index + 1}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  Define the properties for this variant
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setVariantToDelete(index);
                                  setIsDeleteModalOpen(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                title="Remove this variant and its combinations"
                              >
                                <FiTrash2 className="h-4 w-4" />
                                <span className="text-sm font-medium">Remove Variant</span>
                              </button>
                            </div>

                            {/* Variant Name Section */}
                            <div className="mb-6">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Variant Name
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  {...register(`variants.${index}.variantName`, {
                                    required: "Variant name is required",
                                    validate: value => {
                                      // Check for duplicate variant names
                                      const otherVariants = variantFields
                                        .map((f, i) => i !== index ? watch(`variants.${i}.variantName`) : null)
                                        .filter(Boolean);
                                      return !otherVariants.includes(value) || "This variant type already exists";
                                    }
                                  })}
                                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                  placeholder="e.g., Size, Color, Material"
                                />
                              </div>
                              {errors.variants?.[index]?.variantName && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.variants[index].variantName.message}
                                </p>
                              )}
                            </div>

                            {/* Variant Types Section */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Variant Types
                              </label>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="space-y-3">
                                  <VariantTypesForm
                                    control={control}
                                    register={register}
                                    variantIndex={index}
                                    errors={errors}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add Variant Button */}
                    <div className="flex justify-center mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          addVariantFields({
                            variantName: "",
                            variantTypes: [""],
                          });
                        }}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
                      >
                        <span className="text-xl">+</span>
                        Add New Variant
                      </button>
                    </div>

                    {/* Variant Combinations Section */}
                    <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">Variant Combinations</h3>
                          <p className="text-sm text-gray-600">Define stock and pricing for each combination</p>
                        </div>
                      </div>

                      {variantFields.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          Add variants above to create combinations
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {variantCombinationFields.map((combinationField, combinationIndex) => (
                            <div 
                              key={combinationField.id}
                              className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                            >
                              <div className="flex justify-between items-center mb-4 pb-3 border-b">
                                <h4 className="font-medium text-gray-700">Combination {combinationIndex + 1}</h4>
                                <button
                                  type="button"
                                  onClick={() => removeVariantCombination(combinationIndex)}
                                  className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                                >
                                  <FiTrash2 className="h-4 w-4" />
                                  Remove
                                </button>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                {watchVariants.map((variant, variantIndex) => (
                                  <div key={variantIndex}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      {variant.variantName || 'Variant'}
                                    </label>
                                    <select
                                      {...register(
                                        `variantCombinations.${combinationIndex}.variants.${variant.variantName}`,
                                        {
                                          required: "Please select a value"
                                        }
                                      )}
                                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                    >
                                      <option value="">Select {variant.variantName}</option>
                                      {variant.variantTypes &&
                                        variant.variantTypes.map((type, typeIndex) => (
                                          <option key={typeIndex} value={type}>
                                            {type}
                                          </option>
                                        ))}
                                    </select>
                                    {errors.variantCombinations?.[combinationIndex]?.variants?.[variant.variantName] && (
                                      <p className="text-red-500 text-xs mt-1">
                                        {errors.variantCombinations[combinationIndex].variants[variant.variantName].message}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Stock
                                  </label>
                                  <input
                                    type="number"
                                    {...register(
                                      `variantCombinations.${combinationIndex}.stock`,
                                      {
                                        required: "Stock is required",
                                        min: { value: 0, message: "Stock cannot be negative" }
                                      }
                                    )}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                  />
                                  {errors.variantCombinations?.[combinationIndex]?.stock && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {errors.variantCombinations[combinationIndex].stock.message}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price Adjustment
                                  </label>
                                  <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-500">₹</span>
                                    <input
                                      type="number"
                                      {...register(
                                        `variantCombinations.${combinationIndex}.priceAdjustment`,
                                        {
                                          required: "Price adjustment is required",
                                          validate: value => !isNaN(value) || "Must be a valid number"
                                        }
                                      )}
                                      className="w-full pl-8 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                      placeholder="0.00"
                                    />
                                  </div>
                                  {errors.variantCombinations?.[combinationIndex]?.priceAdjustment && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {errors.variantCombinations[combinationIndex].priceAdjustment.message}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => {
                              // Check if all variants have at least one type
                              const hasEmptyVariants = variantFields.some(
                                (_, idx) => !watch(`variants.${idx}.variantTypes`)?.length
                              );
                              
                              if (hasEmptyVariants) {
                                toast.error("All variants must have at least one type before creating combinations");
                                return;
                              }
                              
                              addVariantCombination({
                                variants: {},
                                stock: 0,
                                priceAdjustment: 0,
                              });
                            }}
                            className="mt-4 w-full py-3 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                          >
                            <span className="text-xl">+</span>
                            Add New Combination
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Add Variant Button */}
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => setVariantSections(true)}
                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
                      >
                        Add Variant
                      </button>
                    </div>
                    {/* Product Details if no variants */}
                    {[].length === 0 && (
                      <div className="bg-gray-50 rounded-lg space-y-6">
                        <h1 className="text-xl font-semibold text-gray-800 mb-4">
                          Product Details
                        </h1>
                        <span className="text-sm font-medium text-gray-700">
                          Fill in if the product have no variants
                        </span>
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">
                            Price
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500">
                              ₹
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              {...register("price", {
                                required: "Price is required",
                                min: {
                                  value: 0,
                                  message: "Price must be greater than 0",
                                },
                              })}
                              className="w-full pl-8 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          {errors.price && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.price.message}
                            </p>
                          )}
                        </div>

                        {/* Stock */}
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">
                            Stock
                          </label>
                          <input
                            type="number"
                            {...register("stock", {
                              required: "Stock is required",
                              min: {
                                value: 0,
                                message: "Stock must be 0 or greater",
                              },
                              validate: {
                                integer: (v) =>
                                  Number.isInteger(Number(v)) ||
                                  "Stock must be a whole number",
                              },
                            })}
                            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                          {errors.stock && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.stock.message}
                            </p>
                          )}
                        </div>

                        {/* Shipping */}
                        <div className="space-y-4">
                          {/* Weight */}
                          <div>
                            <label className="block text-sm text-gray-700 mb-1">
                              Weight
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                {...register("shipping.weight", {
                                  required: "Weight is required",
                                })}
                                placeholder="0.5"
                                className="w-full px-4 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                kg
                              </span>
                            </div>
                          </div>

                          {/* Dimensions */}
                          <div>
                            <label className="block text-sm text-gray-700 mb-1">
                              Dimensions (L × W × H)
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="relative">
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  {...register("shipping.dimensions.length", {
                                    required: "Length is required",
                                    min: {
                                      value: 0,
                                      message: "Length must be positive",
                                    },
                                  })}
                                  placeholder="Length"
                                  className="w-full px-4 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                  cm
                                </span>
                              </div>
                              <div className="relative">
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  {...register("shipping.dimensions.width", {
                                    required: "Width is required",
                                    min: {
                                      value: 0,
                                      message: "Width must be positive",
                                    },
                                  })}
                                  placeholder="Width"
                                  className="w-full px-4 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                  cm
                                </span>
                              </div>
                              <div className="relative">
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  {...register("shipping.dimensions.height", {
                                    required: "Height is required",
                                    min: {
                                      value: 0,
                                      message: "Height must be positive",
                                    },
                                  })}
                                  placeholder="Height"
                                  className="w-full px-4 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                  cm
                                </span>
                              </div>
                            </div>
                            {(errors.shipping?.dimensions?.length ||
                              errors.shipping?.dimensions?.width ||
                              errors.shipping?.dimensions?.height) && (
                              <p className="text-red-500 text-sm mt-1">
                                All dimensions are required and must be positive
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Enter dimensions in centimeters
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Additional Details */}
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Additional Information
                </h3>

                {/* Tags Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    {...register("tags")}
                    placeholder="e.g. organic, handmade, eco-friendly"
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Separate tags with commas
                  </p>
                </div>

                {/* Additional Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Details (Optional)
                  </label>
                  <textarea
                    {...register("additionalDetails")}
                    rows={4}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter any additional details about the product..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md"
                >
                  {loading ? <Spinner /> : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen}>
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <FiAlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Variant</h3>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to delete this variant? This will also remove all combinations using this variant.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setVariantToDelete(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (variantToDelete !== null) {
                  removeVariantFields(variantToDelete);
                }
                setIsDeleteModalOpen(false);
                setVariantToDelete(null);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
