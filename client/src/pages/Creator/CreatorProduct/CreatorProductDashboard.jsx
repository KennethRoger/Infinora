import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SearchBarAdmin from "@/components/Form/SearchBarAdmin";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/Table/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Plus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { fetchVendorProducts } from "@/redux/features/vendorProductsSlice";
import axios from "axios";
import { PRODUCT_TABLE_COLUMNS } from "@/constants/creator/tableColumns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CreatorProductDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.vendorProducts
  );

  const calculateTotalStock = (product) => {
    if (!product) return 0;
    
    if (product.variantCombinations?.length > 0) {
      return product.variantCombinations.reduce(
        (sum, combo) => sum + (parseInt(combo.stock) || 0),
        0
      );
    }
    
    return parseInt(product.stock) || 0;
  };

  useEffect(() => {
    dispatch(fetchVendorProducts());
  }, [dispatch]);

  const handleAddProduct = () => {
    navigate("add");
  };

  const handleToggleListing = async (productId) => {
    try {
      await axios
        .patch(
          `${
            import.meta.env.VITE_USERS_API_BASE_URL
          }/api/products/toggle-listing`,
          { productId }
        )
        .then(() => {
          dispatch(fetchVendorProducts());
        });
    } catch (error) {
      console.error("Error toggling listing:", error);
    }
  };

  const renderVariantCombinations = (combinations) => {
    if (!combinations || combinations.length === 0) return "No variants";

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <span className="text-sm text-blue-600 cursor-pointer">
              {combinations.length} combinations
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <div className="p-2 max-w-sm">
              <div className="text-sm font-medium mb-2">Variant Combinations:</div>
              <div className="space-y-2">
                {combinations.map((combo, index) => (
                  <div key={combo._id || index} className="text-xs">
                    <div className="flex justify-between items-center">
                      <span>
                        {Object.entries(combo.variants)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", ")}
                      </span>
                      <span className="ml-2">
                        Stock: {combo.stock}
                        {combo.priceAdjustment > 0 && 
                          `, +${formatPrice(combo.priceAdjustment)}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const renderVariants = (variants) => {
    if (!variants || variants.length === 0) return "No variants";

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <span className="text-sm text-blue-600 cursor-pointer">
              {variants.length} variant types
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <div className="p-2 max-w-sm">
              <div className="text-sm font-medium mb-2">Available Variants:</div>
              <div className="space-y-2">
                {variants.map((variant) => (
                  <div key={variant._id} className="text-xs">
                    <div className="font-medium">{variant.variantName}:</div>
                    <div className="ml-2">
                      {variant.variantTypes.map((type) => (
                        <span key={type._id} className="inline-block mr-2">
                          {type.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const renderCell = (key, product) => {
    switch (key) {
      case "image":
        return (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-12 w-12 rounded-md object-cover"
          />
        );
      case "category":
        return product.category?.name || "N/A";
      case "subCategory":
        return product.subCategory?.name || "N/A";
      case "price":
        return (
          <div className="whitespace-nowrap">
            {formatPrice(product.price)}
          </div>
        );
      case "stock":
        return (
          <span
            className={`${
              calculateTotalStock(product) > 10
                ? "text-green-600"
                : calculateTotalStock(product) > 0
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {calculateTotalStock(product)}
          </span>
        );
      case "variants":
        return renderVariants(product.variants);
      case "variantCombinations":
        return renderVariantCombinations(product.variantCombinations);
      case "offer":
        return product.discount ? `${product.discount}%` : "No offer";
      case "rating":
        return product.rating || "No ratings";
      case "status":
        return (
          <Badge variant={product.isListed ? "success" : "destructive"}>
            {product.isListed ? "active" : "inactive"}
          </Badge>
        );
      case "actions":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/home/profile/creator/edit-product/${product._id}`)
                }
              >
                Edit product
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={product.isListed ? "text-red-600" : "text-green-600"}
                onClick={() => handleToggleListing(product._id)}
              >
                {product.isListed ? "Unlist product" : "List product"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      default:
        return product[key];
    }
  };

  if (loading) return <div>Loading...</div>;
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your products and inventory
          </p>
        </div>
        <Button onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <SearchBarAdmin placeholder="Search products..." />
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="stock-high">Stock: High to Low</SelectItem>
              <SelectItem value="stock-low">Stock: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={PRODUCT_TABLE_COLUMNS}
        data={products}
        renderCell={renderCell}
      />
    </div>
  );
}
