import { FaSearch } from "react-icons/fa";

import { ButtonGroup, Button } from "@material-tailwind/react";
import HeadAndSideAdmin from "../../../components/Section/HeadAndSideAdmin";

export default function ProductListPage() {
  const products = [
    {
      image: "https://placehold.co/100x100?text=Image",
      name: "Lungarian Hoodied Tshirt",
      category: "Fashion",
      price: "₹352.80",
      creator: "Kevin Hart",
      rating: "3.9",
    },
    {
      image: "https://placehold.co/100x100?text=Artwork",
      name: "The wonder castle",
      category: "Artwork",
      price: "₹1900.00",
      creator: "Sage Emerson",
      rating: "4.1",
    },
    {
      image: "https://placehold.co/100x100?text=Fashion",
      name: "Women's Dress",
      category: "Fashion",
      price: "₹6400.00",
      creator: "Ezra Wilder",
      rating: "4.0",
    },
    {
      image: "https://placehold.co/100x100?text=Artwork",
      name: "The wonder castle",
      category: "Artwork",
      price: "₹1900.00",
      creator: "Sage Emerson",
      rating: "4.1",
    },
    {
      image: "https://placehold.co/100x100?text=Fashion",
      name: "Women's Dress",
      category: "Fashion",
      price: "₹6400.00",
      creator: "Ezra Wilder",
      rating: "4.0",
    },
    {
      image: "https://placehold.co/100x100?text=Accessories",
      name: "Apple watch custom colored",
      category: "Accessories",
      price: "₹2000.00",
      creator: "Luna Harper",
      rating: "4.0",
    },
  ];
  return (
    <>
      <HeadAndSideAdmin>
        <ButtonGroup>
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
        <div className="flex w-[500px] mt-5 items-center">
          <input
            type="text"
            placeholder="Search product"
            className="rounded-s-full p-2 border border-gray-300 flex w-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="border border-black outline-1 bg-black text-white rounded-r-full p-3">
            <FaSearch />
          </div>
        </div>
        <div className="container mx-auto pt-4">
          <table className="min-w-full bg-white border border-gray-200 ">
            <thead>
              <tr>
                <th className="py-2 border-b">Image</th>
                <th className="py-2 border-b">Product Name</th>
                <th className="py-2 border-b">Category</th>
                <th className="py-2 border-b">Price</th>
                <th className="py-2 border-b">Creator</th>
                <th className="py-2 border-b">Rating</th>
                <th className="py-2 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover"
                    />
                  </td>
                  <td className="py-2 px-10 border-b">{product.name}</td>
                  <td className="py-2 px-10 border-b">{product.category}</td>
                  <td className="py-2 px-10 border-b">{product.price}</td>
                  <td className="py-2 px-10 border-b">{product.creator}</td>
                  <td className="py-2 px-10 border-b">{product.rating}</td>
                  <td className="py-2 px-10 border-b">
                    <button className="text-blue-500 hover:text-blue-700 mx-2">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="text-red-500 hover:text-red-700 mx-2">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
              <div className="w-full h-[50px]"></div>
            </tbody>
          </table>
        </div>
      </HeadAndSideAdmin>
    </>
  );
}
