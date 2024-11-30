import Modal from "@/components/Modal/Modal";
import { useState } from "react";

export default function CreatorPage() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
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
                {/*  */}
                <Modal isOpen={""}>
                  <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="w-full max-w-md space-y-8">
                      <div className="text-center space-y-6">
                        {/* Welcome Text with Decorative Elements */}
                        <div className="relative">
                          <h1 className="text-5xl font-bold text-blue-500 tracking-wide">
                            WELCOME
                          </h1>
                          {/* Decorative elements - orange leaves */}
                          <div className="absolute -right-4 -top-4">
                            <div className="w-6 h-6 bg-orange-400 rounded-full transform rotate-45" />
                          </div>
                          <div className="absolute -left-4 bottom-0">
                            <div className="w-6 h-6 bg-orange-400 rounded-full transform -rotate-45" />
                          </div>
                        </div>

                        {/* Heading */}
                        <h2 className="text-xl font-semibold text-gray-900 max-w-sm mx-auto">
                          Start your journey as one of our creators with simple
                          process
                        </h2>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Password Input */}
                        <div className="space-y-2">
                          <Label htmlFor="password">Enter Your Password</Label>
                          <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full"
                            required
                          />
                          <div className="text-right">
                            <a
                              href="#"
                              className="text-blue-500 hover:text-blue-600 text-sm"
                            >
                              forgot password?
                            </a>
                          </div>
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="terms"
                            checked={agreed}
                            onCheckedChange={(checked) => setAgreed("")}
                          />
                          <Label
                            htmlFor="terms"
                            className="text-sm leading-none"
                          >
                            By checking this you are agreeing to our{" "}
                            <a
                              href="#"
                              className="text-orange-500 hover:text-orange-600"
                            >
                              terms and conditions
                            </a>
                          </Label>
                        </div>

                        {/* Buttons */}
                        <div className="flex space-x-4">
                          <Button
                            type="submit"
                            className="flex-1 bg-blue-500 hover:bg-blue-600"
                            disabled={!agreed}
                          >
                            Proceed
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            className="flex-1"
                            onClick={() => console.log("Cancelled")}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </Modal>
                {/*  */}
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
    </>
  );
}
