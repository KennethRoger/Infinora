import authImage from "../../assets/images/login/auth-image.jpg"

function LeftBox({ heading, description, children }) {
  return (
      <div className="w-auto min-h-[500px] gap-5 flex justify-center">
        <div className="bg-[#F7F23B] p-5 flex flex-col justify-between w-[350px]">
          <div>
            <h1 className="font-bold text-3xl">{heading}</h1>
            <p className="text-2xl mt-3 w-[75%]">{description}</p>
          </div>
          <img className="w-full" src={authImage} alt="A login pic"></img>
        </div>
        <div className="text-xl w-[300px] ">{children}</div>
      </div>
  );
}

export default LeftBox;