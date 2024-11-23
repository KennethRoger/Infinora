import infinoraBlackLogo from "../../assets/images/logo/Infinora-black-transparent.png";

function AuthPage({ children }) {
  return (
    <main className="h-screen">
      <div className="flex justify-center mt-3">
        <img className="w-[250px] flex justify-center" src={infinoraBlackLogo} alt="Infinora Logo"></img>
      </div>
      <div className="flex justify-center mt-[80px]">{children}</div>
    </main>
  );
}

export default AuthPage;
