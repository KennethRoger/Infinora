import SearchBarAdmin from "@/components/Form/SearchBarAdmin";
import TableCreator from "@/components/Table/TableCreator";
import React, { useEffect, useState } from "react";
import { categoryTableHead } from "@/constants/admin/categories/category";
import Modal from "@/components/Modal/Modal";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchCategories } from "@/redux/features/categorySlice";

const CategoryListPage = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editData, setEditData] = useState(null); 
  const [isOpen, setIsOpen] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm();

  const addSubModal = () => {
    setEditData(null);
    setIsOpen(true);
  };

  const editModal = (category) => {
    setEditData(category);
    setValue("name", category.name);
    setValue("description", category.description);
    setValue("parent_id", category.parent_id);
    setIsOpen(true);
  };

  const onCreateSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USERS_API_BASE_URL}/api/category/create`,
        data
      );
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      reset();
      setIsOpen(false);
      dispatch(fetchCategories());
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "An error occurred while creating"
      );
      setSuccessMessage("");
    }
  };

  const onEditSubmit = async (data) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_USERS_API_BASE_URL}/api/category/edit/${editData._id}`,
        data
      );
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      reset();
      setIsOpen(false);
      dispatch(fetchCategories());
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "An error occurred while submitting"
      );
      setSuccessMessage("");
    }
  };

  const onDeleteCategory = async () => {
    if (!deleteCategory) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_USERS_API_BASE_URL}/api/category/delete/${deleteCategory._id}`
      );
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      setIsDeleteModalOpen(false);
      dispatch(fetchCategories());
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "An error occurred while deleting"
      );
      setSuccessMessage("");
    }
  };

  const ControlButtons = (category) => (
    <div className="flex gap-5 justify-center">
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded"
        onClick={() => addSubModal()}
      >
        Add SubCategory
      </button>
      <button
        className="bg-yellow-500 text-white px-3 py-1 rounded"
        onClick={() => editModal(category)}
      >
        Edit
      </button>
      <button
        className="bg-red-500 text-white px-3 py-1 rounded"
        onClick={() => {
          setDeleteCategory(category);
          setIsDeleteModalOpen(true);
        }}
      >
        Delete
      </button>
    </div>
  );

  if (loading) return <p className="text-center h-screen">Loading categories...</p>;

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

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
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
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
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

          {successMessage && (
            <p className="text-green-500 mb-4">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="text-red-500 mb-4">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {editData ? "Update Category" : "Create Category"}
          </button>

          <button
            type="button"
            className="w-full bg-gray-300 text-black p-2 rounded hover:bg-gray-400 mt-5"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="p-5">
          <h2 className="text-xl font-semibold text-red-500">Are you sure?</h2>
          <p className="mb-4">Do you really want to delete this category? This action cannot be undone.</p>

          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-sm mb-4">{successMessage}</p>
          )}

          <div className="flex gap-4 justify-end">
            <button
              className="bg-gray-300 text-black px-3 py-1 rounded"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={onDeleteCategory}
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CategoryListPage;
