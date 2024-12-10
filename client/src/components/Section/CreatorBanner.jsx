import { useNavigate } from "react-router-dom";

export default function CreatorBanner() {
  const navigate = useNavigate()
  return (
    <>
      <div className="py-12 bg-custom-gradient text-center flex justify-center items-center gap-36">
        <div className="w-[400px] flex flex-col gap-3">
          <h2 className="text-4xl font-bold mb-4">
            Unleash Your <span className="text-[#F7F23B]">Creativity</span>
          </h2>
          <p className="mb-4 text-xl">
            Got unique creations? Join our creator community and showcase your
            talent to the world
          </p>
          <div>
            <button className="bg-[#F7F23B] text-black border-none px-4 py-2 rounded" onClick={() => navigate("/home/creator")}>
              Take me to Creator
            </button>
          </div>
        </div>
        <img
          src="/creation-depicted.jpeg"
          alt="Creative items"
          className="rounded-lg shadow-lg w-[350px]"
        />
      </div>
    </>
  );
}
