import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "@/api/category/categoryApi";
import { MdKeyboardArrowRight } from "react-icons/md";

export default function CategoryDropdown() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    fetchCategories();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = (categoryId) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredCategory(categoryId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 500);
  };

  if (loading) return null;

  return (
    <div className="absolute top-10 left-0 bg-white shadow-xl rounded-lg py-1 w-72 z-50 border border-gray-100 transition-all duration-200 ease-in-out transform">
      {categories.map((category) => (
        <div
          key={category._id}
          className="relative group"
          onMouseEnter={() => handleMouseEnter(category._id)}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            to={`/category/${category.slug}`}
            className="px-6 py-3 hover:bg-gray-50 text-gray-700 flex justify-between items-center group-hover:text-blue-600 transition-colors duration-150"
          >
            <div className="flex items-center space-x-3">
              <span className="font-medium">{category.name}</span>
            </div>
            {category.children?.length > 0 && (
              <MdKeyboardArrowRight className="text-xl text-gray-400 group-hover:text-blue-600 transition-colors duration-150" />
            )}
          </Link>

          {hoveredCategory === category._id &&
            category.children?.length > 0 && (
              <div
                className="absolute left-full top-0 bg-white shadow-xl rounded-lg py-1 w-72 -ml-px border border-gray-100 transition-all duration-200 ease-in-out"
                onMouseEnter={() => handleMouseEnter(category._id)}
                onMouseLeave={handleMouseLeave}
              >
                {category.children.map((child) => (
                  <Link
                    key={child._id}
                    className="block px-6 py-3 hover:bg-gray-50 text-gray-700 hover:text-blue-600 transition-colors duration-150"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{child.name}</span>
                      {child.children?.length > 0 && (
                        <MdKeyboardArrowRight className="text-xl text-gray-400" />
                      )}
                    </div>
                    {child.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {child.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
        </div>
      ))}
    </div>
  );
}
