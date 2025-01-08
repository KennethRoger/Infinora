import { useUser } from "@/context/UserContext";
import imagePlaceholder from "../../assets/images/banner-img.jpg";
import profilePlaceHolder from "../../assets/images/holding-shoes.jpg";

export default function CreatorOverview() {
  const { user } = useUser();
  console.log(user)
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
        {/* profile image */}
        <img
          src={user.profileImagePath}
          alt="Profile pic"
          width={120}
          height={120}
          className="absolute top-20 left-8 transform translate-y-1/2 rounded-full border-4 border-white object-cover"
        />
        <div className="flex">
          <div className="h-[100px] w-[100px]"></div>
          <div className="pl-[70px] pt-3 w-full p-10">
            <div className="flex justify-between items-center mb-6">
              <div>
                {/* name */}
                <h2 className="text-2xl font-bold">{user.name}</h2>
                {/* bio */}
                <p className="text-gray-600">{user.bio}</p>
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
