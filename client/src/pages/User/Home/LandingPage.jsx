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

const LandingPage = () => {
  return (
    <>
      <header className="flex justify-center items-center p-6 bg-white">
        <img
          className="w-[250px] flex justify-center"
          src={infinoraBlackLogo}
          alt="Infinora Logo"
        ></img>
      </header>
      <main className="px-10">
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
                <Button styles={"bg-[#F7F23B] text-black"}>
                  Browse creations
                </Button>
                <Button styles={"bg-black text-white"}>Sign in</Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="flex justify-center">
            <div className="w-[50%]">
              <SearchBar placeholder={"Search for your desired product"} />
            </div>
          </div>
          <div className="my-14 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">Bringing Ideas to Life</h2>
              <p className="text-gray-600">
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
          <div className="flex space-x-4 overflow-scroll">
            {Array(4)
              .fill()
              .map((_, i) => (
                <ProductCard />
              ))}
          </div>
        </section>

        <section className="py-12 bg-blue-100 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Unleash Your <span className="text-yellow-400">Creativity</span>
          </h2>
          <p className="mb-4">
            Got unique creations? Join our creator community and showcase your
            talent to the world
          </p>
          <button className="bg-yellow-400 text-black px-4 py-2 rounded">
            Take me to Creator
          </button>
          <div className="mt-8">
            <img
              src="https://placehold.co/600x300"
              alt="Creative items"
              className="mx-auto rounded-lg shadow-lg"
            />
          </div>
        </section>

        <section className="py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">
              Crafted to Perfection:{" "}
              <span className="text-orange-500">
                Stories of Customer Creations
              </span>
            </h2>
          </div>
          <div className="flex justify-center items-center">
            <img
              src="https://placehold.co/300x300"
              alt="Customer creation"
              className="w-1/3 rounded-lg shadow-lg"
            />
            <div className="ml-8">
              <h3 className="text-2xl font-bold mb-4">
                Bring Your Vision to Life
              </h3>
              <p className="mb-4">
                Creativity sparks innovation. Whether skill or vision, every
                idea deserves a chance. Let us help make your creative vision a
                reality
              </p>
              <button className="bg-orange-500 text-white px-4 py-2 rounded">
                Craft My Idea
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black text-white py-6">
        <div className="flex justify-center space-x-4">
          <a href="#" className="text-white">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="text-white">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="text-white">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#" className="text-white">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
