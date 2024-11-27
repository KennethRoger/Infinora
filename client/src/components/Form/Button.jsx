function Button({ styles, buttonType, children, attributes }) {
  return (
    <button className={`${styles} border px-5 min-w-[130px] rounded h-12 shadow-md text-lg`} type={buttonType} disabled={attributes === "disabled"}>
      {children}
    </button>
  );
}

export default Button;
