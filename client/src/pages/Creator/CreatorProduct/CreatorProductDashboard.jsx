import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SearchBarAdmin from "@/components/Form/SearchBarAdmin";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export default function CreatorProductDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.vendorProducts
  );

  useEffect(() => {
    dispatch(fetchVendorProducts());
    console.log("products", products);
  }, [dispatch]);

  const handleAddProduct = () => {
    navigate("add");
  };

  const handleToggleListing = (productId) => {
    try {
      axios
        .patch(
          `${import.meta.env.VITE_USERS_API_BASE_URL}/api/products/toggle-listing`,
          { productId }
        )
        .then(() => {
          dispatch(fetchVendorProducts());
        });
    } catch (error) {
      console.error("Error toggling listing:", error);
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
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="stock-high">Stock: High to Low</SelectItem>
              <SelectItem value="stock-low">Stock: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 hover:bg-gray-100">
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Offer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category?.name}</TableCell>
                <TableCell>
                  <span
                    className={`${
                      product.stock > 10
                        ? "text-green-600"
                        : product.stock > 0
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>{`${product.discount}%`}</TableCell>
                <TableCell>{product.rating}</TableCell>
                <TableCell>
                  <Badge variant={product.isListed ? "success" : "destructive"}>
                    {product.isListed ? "active" : "inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
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
                      <DropdownMenuItem>Edit product</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className={
                          product.isListed ? "text-red-600" : "text-green-600"
                        }
                        onClick={() => handleToggleListing(product._id)}
                      >
                        {product.isListed ? "Unlist product" : "List product"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
