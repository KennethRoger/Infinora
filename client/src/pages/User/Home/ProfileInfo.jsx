import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "@/redux/features/categorySlice";
import axios from "axios";

export default function ProfileInfo({ userData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({});

  const [profileImage, setProfileImage] = useState(null);
  const [idCardFile, setIdCardFile] = useState(null);

  const [userRole, setUserRole] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_USERS_API_BASE_URL}/api/user/me`,
          { withCredentials: true }
        );
        const user = response.data.user
        setUserRole(user.role);
        
      } catch (error) {
        console.error("Failed to fetch user role:", error);
      }
    };
    fetchUserRole();
  }, []);

  const categories = useSelector((state) => state.categories.categories);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name || "",
        email: userData.email || "",
        password: "",
      });
    }
  }, [userData, reset]);

  const handleCancel = () => {
    setIsEditing(false);
    reset(userData);
  };

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
      formData.append('profileImage', data.profileImage[0]);
      formData.append('idCard', data.idCard[0]);
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phoneNumber', data.phoneNumber);
      formData.append('speciality', data.speciality);
      formData.append('bio', data.bio);
      formData.append('socialLink', data.socialLink);
      formData.append('about', data.about);

      const response = await fetch(`${import.meta.env.VITE_USERS_API_BASE_URL}/api/vendor/register`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        history.push('/home/profile/creator-info');
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <>
      {userRole === "user" && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`${
            isEditing ? "opacity-100" : "opacity-100 "
          } transition-opacity duration-300 w-[400px]`}
        >
          <div className="flex gap-2 items-center mb-4">
            <h1 className="text-2xl font-bold">Profile Information</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-[#33A0FF] text-lg hover:underline"
              >
                Edit
              </button>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${
                isEditing ? "bg-white" : "bg-gray-200"
              }`}
              {...register("name", { required: "Name is required" })}
              defaultValue={user.name}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${
                isEditing ? "bg-white" : "bg-gray-200"
              }`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${
                isEditing ? "bg-white" : "bg-gray-200"
              }`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      )}

      {userRole === "vendor" && (
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold mb-6">
            Complete Your Creator Profile
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Profile Image Field */}
          <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Select Image
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="mt-2"
                {...register("profileImage", {
                  required: "Profile image is required",
                })}
                onChange={handleImageChange}
              />
              {errors.profileImage && (
                <p className="text-red-500 text-sm">
                  {errors.profileImage.message}
                </p>
              )}
            </div>

            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value:
                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Number Field */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-gray-700 font-medium"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                {...register("phoneNumber", {
                  required: "Phone number is required",
                })}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            {/* Specialty Field */}
            <div>
              <label
                htmlFor="speciality"
                className="block text-gray-700 font-medium"
              >
                Specialty
              </label>
              <select
                id="speciality"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                {...register("speciality", {
                  required: "Specialty is required",
                })}
              >
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.speciality && (
                <p className="text-red-500 text-sm">
                  {errors.speciality.message}
                </p>
              )}
            </div>

            {/* Bio Field */}
            <div>
              <label
                htmlFor="bio"
                className="block text-gray-700 font-medium"
              >
                Bio
              </label>
              <textarea
                id="bio"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                rows="3"
                {...register("bio", { required: "Bio is required" })}
              ></textarea>
              {errors.bio && (
                <p className="text-red-500 text-sm">{errors.bio.message}</p>
              )}
            </div>

            {/* Social Media Link Field */}
            <div>
              <label
                htmlFor="socialLink"
                className="block text-gray-700 font-medium"
              >
                Social Media Link
              </label>
              <input
                type="url"
                id="socialLink"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
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
                <p className="text-red-500 text-sm">
                  {errors.socialLink.message}
                </p>
              )}
            </div>

            {/* About Field */}
            <div>
              <label
                htmlFor="about"
                className="block text-gray-700 font-medium"
              >
                About
              </label>
              <textarea
                id="about"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                rows="5"
                {...register("about", {
                  required: "About section is required",
                })}
              ></textarea>
              {errors.about && (
                <p className="text-red-500 text-sm">{errors.about.message}</p>
              )}
            </div>

            {/* ID Card Field */}
            <div>
              <label
                htmlFor="idCard"
                className="block text-gray-700 font-medium"
              >
                ID Card
              </label>
              <input
                type="file"
                id="idCard"
                accept="application/pdf"
                className="w-full"
                {...register("idCard", { required: "ID card is required" })}
                onChange={(e) => setIdCardFile(e.target.files[0])}
              />
              {errors.idCard && (
                <p className="text-red-500 text-sm">
                  {errors.idCard.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
