import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { fetchCategories } from "@/redux/features/categorySlice";

export default function CreatorProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState(null);
  const [idCardFile, setIdCardFile] = useState(null);

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("profileImage", data.profileImage[0]);
      formData.append("idCard", data.idCard[0]);
      formData.append("name", data.name);
      formData.append("speciality", data.speciality);
      formData.append("bio", data.bio);
      formData.append("socialLink", data.socialLink);
      formData.append("about", data.about);

      const response = await fetch(
        `${import.meta.env.VITE_USERS_API_BASE_URL}/api/vendor/register`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const result = await response.json();

      if (result.success) {
        navigate("/home/profile/creator-info");
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Complete Your Creator Profile
            </h2>
            <p className="text-gray-600 mt-2">
              Let's set up your creator profile to help you showcase your work
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center space-y-4 p-6 bg-gray-50 rounded-lg">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-white border-2 border-blue-500 shadow-lg">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  {...register("profileImage", {
                    required: "Profile image is required",
                  })}
                  onChange={handleImageChange}
                />
                {errors.profileImage && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.profileImage.message}
                  </p>
                )}
              </div>
            </div>

            {/* Main Form Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Specialty Field */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialty
                </label>
                {categoriesLoading ? (
                  <div className="w-full px-4 py-2 bg-gray-100 rounded-lg">
                    Loading categories...
                  </div>
                ) : categoriesError ? (
                  <div className="text-red-500">
                    Error loading categories: {categoriesError}
                  </div>
                ) : (
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register("speciality", {
                      required: "Specialty is required",
                    })}
                  >
                    <option value="">Select your specialty</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
                {errors.speciality && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.speciality.message}
                  </p>
                )}
              </div>

              {/* Bio Field */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Write a short bio about yourself"
                  {...register("bio", { required: "Bio is required" })}
                ></textarea>
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.bio.message}
                  </p>
                )}
              </div>

              {/* Social Media Link Field */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Social Media Link
                </label>
                <input
                  type="url"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your social media profile URL"
                  {...register("socialLink", {
                    required: "Social media link is required",
                    pattern: {
                      value:
                        /^(https?:\/\/)?([\w\d\-_]+)\.([\w\d\-_]+)([\w\d\-._~:\/?#[\]@!$&'()*+,;=.]+)?$/,
                      message: "Invalid URL",
                    },
                  })}
                />
                {errors.socialLink && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.socialLink.message}
                  </p>
                )}
              </div>

              {/* About Field */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="5"
                  placeholder="Tell us more about yourself and your work"
                  {...register("about", {
                    required: "About section is required",
                  })}
                ></textarea>
                {errors.about && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.about.message}
                  </p>
                )}
              </div>

              {/* ID Card Field */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Card
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
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
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload ID Card</span>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="sr-only"
                          {...register("idCard", {
                            required: "ID card is required",
                          })}
                          onChange={(e) => setIdCardFile(e.target.files[0])}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                  </div>
                </div>
                {errors.idCard && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.idCard.message}
                  </p>
                )}
                {idCardFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected file: {idCardFile.name}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Complete Registration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
