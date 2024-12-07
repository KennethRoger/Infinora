import SearchBarAdmin from "@/components/Form/SearchBarAdmin";
import TableCreator from "@/components/Table/TableCreator";
import React, { useEffect, useState } from "react";
import { categoryTableHead } from "@/constants/admin/categories/category";
import Modal from "@/components/Modal/Modal";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchCategories } from "@/redux/features/categorySlice";
import { toast } from "react-hot-toast";

const CategoryListPage = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const addSubModal = () => {
    setEditData(null);
    reset({
      name: "",
      description: "",
      parent_id: "",
    });
    setIsOpen(true);
  };

  const editModal = (category) => {
    setEditData(category);
    reset({
      name: category.name,
      description: category.description,
      parent_id: category.parent_id || "",
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditData(null);
    reset({
      name: "",
      description: "",
      parent_id: "",
    });
  };

  const onCreateSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USERS_API_BASE_URL}/api/category/create`,
        data
      );
      toast.success(response.data.message);
      reset();
      setIsOpen(false);
      dispatch(fetchCategories());
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred while creating"
      );
    }
  };

  const onEditSubmit = async (data) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_USERS_API_BASE_URL}/api/category/edit/${
          editData._id
        }`,
        data
      );
      toast.success(response.data.message);
      reset();
      setIsOpen(false);
      dispatch(fetchCategories());
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred while submitting"
      );
    }
  };

  const onToggleStatus = async (category) => {
    try {
      const response = await axios.patch(
        `${
          import.meta.env.VITE_USERS_API_BASE_URL
        }/api/category/toggle-status/${category._id}`
      );
      toast.success(response.data.message);
      dispatch(fetchCategories());
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while toggling status"
      );
    }
  };

  const ControlButtons = (category) => (
    <div className="flex gap-5 justify-center">
      <button
        className="bg-yellow-500 text-white px-3 py-1 rounded"
        onClick={() => editModal(category)}
      >
        Edit
      </button>
      <button
        className={`${
          category.isActive ? "bg-red-500" : "bg-green-500"
        } text-white px-3 py-1 rounded`}
        onClick={() => onToggleStatus(category)}
      >
        {category.isActive ? "Disable" : "Enable"}
      </button>
    </div>
  );

  if (loading)
    return <p className="text-center h-screen">Loading categories...</p>;

  return (
    <>
      <h1 className="text-2xl font-bold">Category</h1>
      <SearchBarAdmin />
      <button
        className="float-end bg-blue-500 text-white px-3 py-1 rounded"
        onClick={addSubModal}
      >
        Add Category
      </button>
      <TableCreator
        tableHead={categoryTableHead}
        tableBody={categories}
        actionsRenderer={ControlButtons}
      />

      <Modal isOpen={isOpen} onClose={closeModal}>
        <form onSubmit={handleSubmit(editData ? onEditSubmit : onCreateSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              {...register("name", {
                required: "Category name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              className={`w-full border p-2 rounded ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              {...register("description", {
                maxLength: {
                  value: 200,
                  message: "Description can't exceed 200 characters",
                },
              })}
              rows="4"
              className={`w-full border p-2 rounded ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="parent_id"
            >
              Parent Category
            </label>
            <select
              id="parent_id"
              {...register("parent_id")}
              className="w-full border-gray-300 border p-2 rounded"
            >
              <option value="">None</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {editData ? "Update Category" : "Create Category"}
          </button>

          <button
            type="button"
            className="w-full bg-gray-300 text-black p-2 rounded hover:bg-gray-400 mt-5"
            onClick={closeModal}
          >
            Cancel
          </button>
        </form>
      </Modal>
    </>
  );
};

export default CategoryListPage;
