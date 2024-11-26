function InputBox({
  label,
  name = "textbox",
  type = "text",
  styles,
  onChange,
  value,
}) {
  return (
    <>
      <div className="flex flex-col">
        <label className="text-black text-xl text-opacity-50 mt-2">{label}</label>
        <input
          name={name}
          type={type}
          onChange={onChange}
          value={value}
          className={`${styles} border-b-2 border-gray-600 mt-2 focus:outline-none focus:border-blue-500`}
        />
      </div>
    </>
  );
}

export default InputBox;
