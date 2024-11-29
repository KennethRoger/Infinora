import infinoraBlackLogo from "../../../assets/images/logo/Infinora-black-transparent.png";
import placeholder from "../../../assets/images/pexels-kamo11235-667838.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Button from "@/components/Form/Button";
import SearchBar from "@/components/Form/SearchBar";
import ProductCard from "@/components/Product/ProductCard";
import CreatorBanner from "@/components/Section/CreatorBanner";
import CraftIdeaSection from "@/components/Section/CraftIdeaSection";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate()
  return (
    <>
      <header className="flex justify-center items-center p-6 bg-white">
        <img
          className="w-[250px] flex justify-center"
          src={infinoraBlackLogo}
          alt="Infinora Logo"
        ></img>
      </header>
      <main>
        <section className="flex justify-center items-center py-12 bg-white">
          <div className="w-[60%] h-[300px] flex justify-between items-center gap-16">
            <Carousel className="w-[400px] h-full">
              <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem key={index}>
                    <div className="relative w-full h-full">
                      <img
                        src={placeholder}
                        className="w-[400px] h-[300px]"
                        alt="Carousel Image"
                      />
                      <div className="absolute w-full p-5 bottom-0 text-white bg-gradient-to-b from-transparent via-gray-800 to-black text-center">
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit.
                        </p>
                        <p className="text-right">- Creator Name</p>
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
                <button className="bg-[#F7F23B] text-black border px-5 min-w-[130px] rounded h-12 shadow-md text-lg" onClick={() => navigate("/home")} >
                  Browse creations
                </button>
                <button className="bg-black text-white border px-5 min-w-[130px] rounded h-12 shadow-md text-lg" onClick={() => navigate("/login")}>Sign in</button>
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
            <div className="text-end mt-8">
              <Button styles="border border-black text-black px-4 py-2 rounded">
                View more
              </Button>
            </div>
          </div>
          <div className="flex space-x-4 overflow-x-scroll whitespace-nowrap py-3 no-scrollbar w-full">
            {Array(10)
              .fill()
              .map((_, i) => (
                <ProductCard />
              ))}
          </div>
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
    </>
  );
};

export default LandingPage;
