import { useNavigate } from "react-router-dom";
import infinoraBlackLogo from "../../assets/images/logo/Infinora-black-transparent.png";

function AuthPage({ children }) {
  const navigate = useNavigate()
  return (
    <main className="h-screen">
      <div className="flex justify-center mt-3 cursor-pointer" onClick={() => navigate("/")}>
        <img className="w-[250px] flex justify-center" src={infinoraBlackLogo} alt="Infinora Logo"></img>
      </div>
      <div className="flex justify-center mt-[60px]">{children}</div>
    </main>
  );
}

export default AuthPage;
