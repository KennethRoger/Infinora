import authImage from "../../assets/images/login/auth-image.jpg"

function LeftBox({ heading, description, children }) {
  return (
      <div className="w-auto h-[400px] gap-5 flex justify-center">
        <div className="bg-[#F7F23B] p-5 flex flex-col justify-between">
          <div>
            <h1>{heading}</h1>
            <p>{description}</p>
          </div>
          <img className="w-[200px]" src={authImage} alt="A login pic"></img>
        </div>
        <div>{children}</div>
      </div>
  );
}

export default LeftBox;