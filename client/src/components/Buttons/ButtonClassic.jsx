function ButtonClassic({ buttonType, onClick, children, attributes }) {
    return (
      <button className="border px-5 py-2 shadow-md text-lg border-black text-black rounded" type={buttonType} onClick={onClick} disabled={attributes === "disabled"}>
        {children}
      </button>
    );
  }
  
  export default ButtonClassic;
  