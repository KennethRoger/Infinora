import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

export default function CreatorPage() {
  return (
    <>
      <Header />
      <main className="pt-[75px] flex">
        <div className="relative w-[50%] bg-gradient-to-b from-[#FF6B6B] to-[#FFC75F] pb-24 pt-5">
          <img
            src="/creator-representation.png"
            alt="creator representation"
            className="absolute inset-0 w-full opacity-10 pointer-events-none z-0"
          />
          <div className="relative flex flex-col items-center text-center z-10">
            <img
              src="/creating-idea.png"
              alt="a person with many ideas"
              className="w-[400px]"
            />
            <div className="w-[450px] flex flex-col gap-5">
              <h1 className="font-extrabold text-4xl">
                Start your journey as a creator
              </h1>
              <p className="text-2xl text-gray-800">
                Bring your ideas to life with Infinora! Start creating unique,
                inspiring products and let your creativity shine. Showcase your
                vision to the world and make an impact with creations that truly
                stand out.
              </p>
              <div>
                <button className="relative bg-gradient-to-r from-[#FFA500] to-[#E7511A] rounded-xl font-bold px-5 min-w-[130px] h-12 shadow-[0px_3px_4px] shadow-[#000000]/50 text-lg z-20">
                  Start as a creator
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-[50%] bg-gradient-to-b from-[#4169E1] to-[#4682B4] pb-24 pt-5">
          <img
            src="/craft-representation.png"
            alt="craft representation"
            className="absolute inset-0 w-full opacity-10 pointer-events-none z-0"
          />
          <div className="relative flex flex-col items-center text-center z-10">
            <img
              src="/young-man-idea.png"
              alt="a person with many ideas"
              className="w-[270px]"
            />
            <div className="w-[450px] flex flex-col gap-5">
              <h1 className="font-extrabold text-4xl">Make My Creativity</h1>
              <p className="text-2xl text-gray-800 mb-[95px]">
                Turn your vision into reality with our creators' help. Share
                your ideas and let Infinora's skilled artists bring them to life
                just as you imagined.
              </p>
              <div>
                <button className="relative bg-gradient-to-r from-[#396AFC] to-[#2948FF] rounded-xl font-bold px-5 min-w-[130px] h-12 text-lg shadow-[0px_3px_4px] shadow-[#000000]/50 z-20">
                  Craft my vision
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
