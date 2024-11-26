function Button({ styles, buttonType, children, attributes }) {
  return (
    <button className={`${styles} border px-5 py-2 rounded h-12`} type={buttonType} disabled={attributes === "disabled"}>
      {children}
    </button>
  );
}

export default Button;
