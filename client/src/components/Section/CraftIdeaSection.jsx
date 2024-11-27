import holdingShoes from "../../assets/images/holding-shoes.jpg";
import Button from "../Form/Button";

function CraftIdeaSection() {
  return (
    <div className="flex justify-center">
      <div className="relative w-[70%]">
        <img
          src="/yellow-painting.png"
          className="absolute -z-10 w-full h-full"
        />
        <div className="flex justify-between items-center p-10">
          <div className="p-3 w-[350px] bg-white">
            <img src={holdingShoes} className="w-full h-[300px] border-2 border-black" />
            <p className="mt-5">
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua..."
            </p>
            <p className="text-right">Creator Name</p>
          </div>
          <div className="mr-10">
            <div className="w-[300px] flex flex-col gap-10 text-center">
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
                <Button styles={"bg-[#FF5722] border-0 text-white"}>Craft My Idea</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CraftIdeaSection;
