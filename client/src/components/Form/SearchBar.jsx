import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { 
  searchProducts, 
  setSearchTerm, 
  addRecentSearch,
  getSearchSuggestions 
} from "@/redux/features/searchSlice";
import useDebounce from "@/hooks/useDebounce";

export default function SearchBar({ placeholder }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const { 
    searchTerm, 
    results, 
    suggestions,
    loading,
    recentSearches 
  } = useSelector(state => state.search);
  
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  useEffect(() => {
    if (debouncedSearch.trim()) {
      dispatch(searchProducts(debouncedSearch));
      dispatch(getSearchSuggestions(debouncedSearch));
    }
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (term) => {
    dispatch(addRecentSearch(term));
    navigate("/home/products", { 
      state: { 
        searchTerm: term,
        products: results
      } 
    });
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className="relative flex-1">
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full rounded-full pl-5 pr-12 p-2 border border-black text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchTerm && (
          <button
            onClick={() => dispatch(setSearchTerm(""))}
            className="absolute right-12 text-gray-500 hover:text-gray-700"
          >
            <IoClose className="w-5 h-5" />
          </button>
        )}
        <button 
          onClick={() => handleSearch(searchTerm)}
          className="absolute right-1 text-white bg-black rounded-full p-2"
        >
          <FaSearch />
        </button>
      </div>

      {showSuggestions && (searchTerm || recentSearches.length > 0) && (
        <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : (
            <>
              {searchTerm && suggestions.products?.length > 0 && (
                <div className="p-2">
                  <h3 className="text-sm font-semibold text-gray-500 px-3 py-2">
                    Products
                  </h3>
                  {suggestions.products.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleSearch(product.name)}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="font-medium text-black">{product.name}</div>
                      <div className="text-sm text-gray-500">
                        in {product.category?.name || 'Uncategorized'}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {searchTerm && suggestions.categories?.length > 0 && (
                <div className="p-2 border-t">
                  <h3 className="text-sm font-semibold text-gray-500 px-3 py-2">
                    Categories
                  </h3>
                  {suggestions.categories.map((category) => (
                    <div
                      key={category._id}
                      onClick={() => handleSearch(category._id?.name || '')}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-black"
                    >
                      <div className="flex items-center justify-between">
                        <span>{category._id?.name || 'Unknown Category'}</span>
                        <span className="text-sm text-gray-500">{category.count} products</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {recentSearches.length > 0 && (
                <div className="p-2 border-t">
                  <h3 className="text-sm font-semibold text-gray-500 px-3 py-2">
                    Recent Searches
                  </h3>
                  {recentSearches.map((term, index) => (
                    <div
                      key={index}
                      onClick={() => handleSearch(term)}
                      className="px-3 py-2 hover:bg-gray-100 text-black cursor-pointer flex items-center"
                    >
                      <FaSearch className="w-4 h-4 text-gray-400 mr-2" />
                      {term}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}