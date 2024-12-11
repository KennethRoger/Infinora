export default function ButtonPrimary({ buttonType, onClick, children, attributes }) {
  return (
    <button
      className="border px-5 py-2 shadow-md text-lg bg-blue-500 text-white rounded hover:bg-blue-600"
      type={buttonType}
      onClick={onClick}
      disabled={attributes === "disabled"}
    >
      {children}
    </button>
  );
}


