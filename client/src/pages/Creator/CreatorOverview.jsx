import imagePlaceholder from "../../assets/images/banner-img.jpg";
import profilePlaceHolder from "../../assets/images/holding-shoes.jpg";

export default function CreatorOverview() {
  return (
    <>
      <div className="relative">
        <div className="h-48 bg-gray-200">
          <img
            src={imagePlaceholder || "/path-to-default-banner.jpg"}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>

        <img
          src={profilePlaceHolder}
          alt="Profile"
          width={120}
          height={120}
          className="absolute top-20 left-8 transform translate-y-1/2 rounded-full border-4 border-white object-cover"
        />
        <div className="flex">
          <div className="h-[100px] w-[100px]"></div>
          <div className="pl-[70px] pt-3 w-full p-10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Kevin Hart</h2>
                <p className="text-gray-600">
                  Creator of unique, self-made T-shirts
                </p>
              </div>

              <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 transition">
                Edit profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
