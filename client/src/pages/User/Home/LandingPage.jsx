import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import infinoraBlackLogo from "../../../assets/images/logo/Infinora-black-transparent.png";
import placeholder from "../../../assets/images/pexels-kamo11235-667838.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SearchBar from "@/components/Form/SearchBar";
import ProductScroll from "../../../components/Product/ProductScroll";
import CreatorBanner from "@/components/Section/CreatorBanner";
import CraftIdeaSection from "@/components/Section/CraftIdeaSection";
import Footer from "@/components/Footer/Footer";
import { verifyUser } from "@/api/auth/verifyUser";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "@/redux/features/allProductsSlice";
import { getTopRatedProducts } from "@/api/section/sectionApi";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { products, loading: productsLoading, error, pagination } = useSelector(
    (state) => state.allProducts
  );
  const dispatch = useDispatch();

  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const result = await verifyUser();
      setIsAuthenticated(result.authenticated);
    };
    checkAuthentication();
    dispatch(fetchAllProducts({ page: 1, limit: 10 }));
    fetchTopProducts();
  }, [dispatch]);

  const fetchTopProducts = async () => {
    try {
      const data = await getTopRatedProducts();
      setTopProducts(data);
    } catch (error) {
      console.error("Error fetching top products:", error);
    } finally {
      setLoading(false);
    }
  };

  const dummyData = Array.from({ length: 5 }).map(() => ({
    image: placeholder,
    review: "Best creative products",
    userName: "Infinora"
  }));

  const displayData = topProducts.length > 0 ? topProducts : dummyData;

  return (
    <>
      <header className="flex justify-center items-center p-3 bg-white">
        <img
          className="w-[250px] flex justify-center"
          src={infinoraBlackLogo}
          alt="Infinora Logo"
        />
      </header>
      <main>
        <section className="flex justify-center items-center py-12 bg-white">
          <div className="w-[60%] h-[300px] flex justify-between items-center gap-16">
            <Carousel className="w-[400px] h-full">
              <CarouselContent>
                {displayData.map((item, index) => (
                  <CarouselItem key={index}>
                    <div className="relative w-full h-full">
                      <img
                        src={item.image || placeholder}
                        className="w-[400px] h-[300px]"
                        alt="Top Rated Product"
                      />
                      <div className="absolute w-full p-5 bottom-0 text-white bg-gradient-to-b from-transparent via-gray-800 to-black text-center">
                        <p>{item.review}</p>
                        <p className="text-right">- {item.userName}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <div className="w-[400px] flex flex-col gap-10 text-center">
              <div>
                <h2 className="text-3xl font-extrabold mb-4">
                  Infinora: Where Your Creativity Takes Shape
                </h2>
                <p className="mb-4 text-lg">
                  “A creative platform where ideas flourish and talented
                  creators bring your visions to life.”
                </p>
              </div>
              <div className="flex justify-center gap-8">
                {isAuthenticated ? (
                  <button
                    className="bg-[#F7F23B] text-black border px-5 min-w-[130px] rounded h-12 shadow-md text-lg"
                    onClick={() => navigate("/home")}
                  >
                    Browse creations
                  </button>
                ) : (
                  <>
                    <button
                      className="bg-[#F7F23B] text-black border px-5 min-w-[130px] rounded h-12 shadow-md text-lg"
                      onClick={() => navigate("/home")}
                    >
                      Browse creations
                    </button>
                    <button
                      className="bg-black text-white border px-5 min-w-[130px] rounded h-12 shadow-md text-lg"
                      onClick={() => navigate("/login")}
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-10">
          <div className="flex justify-center">
            <div className="w-[50%]">
              <SearchBar placeholder={"Search for your desired product"} />
            </div>
          </div>
          <div className="my-14 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">Bringing Ideas to Life</h2>
              <p className="text-black mt-3 text-xl">
                Empowering creators to bring dreams to reality, one design at a
                time
              </p>
            </div>
          </div>
          {productsLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center h-40 flex items-center justify-center">
              Error loading products. Please try again later.
            </div>
          ) : products?.length > 0 ? (
            <ProductScroll
              products={products || []}
              title="Featured Products"
            />
          ) : (
            <div className="text-gray-500 text-center h-40 flex items-center justify-center">
              No products available.
            </div>
          )}
        </section>
        <CreatorBanner />
        <section className="py-12 px-10">
          <div className="text-4xl my-14 font-extrabold">
            <p>Crafted to Perfection:</p>
            <div className="text-3xl">
              <span>Stories of </span>
              <span className="text-[#FF5722]">Customer Creations</span>
            </div>
          </div>
          <CraftIdeaSection />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
