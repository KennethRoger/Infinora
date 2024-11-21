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
        <label className="text-black text-xl text-opacity-50">{label}</label>
        <input
          name={name}
          type={type}
          onChange={onChange}
          value={value}
          className={`${styles} border-b-2`}
        />
      </div>
    </>
  );
}

export default InputBox;
