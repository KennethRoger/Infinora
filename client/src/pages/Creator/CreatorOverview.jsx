export default function CreatorOverview() {
  return (
    <>
      <div>
        <div className="relative">
          <div>
            <img alt="Banner" />
          </div>
          <div className="absolute">
            <img alt="profile" />
          </div>
        </div>
        <button className="bg-[#76C9FF] shadow-md text-black border-none px-4 py-2 rounded">
          Edit Profile
        </button>
      </div>
    </>
  );
}
