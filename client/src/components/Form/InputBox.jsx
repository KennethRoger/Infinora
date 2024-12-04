import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

function InputBox({
  label,
  name = "textbox",
  type = "text",
  styles,
  onChange,
  value,
}) {
  const [eyeStatus, setEyeStatus] = useState(false)
  const inputType = name === "password" && eyeStatus ? "text" : type;
  return (
    <>
      <div className="flex flex-col relative">
        <label className="text-black text-xl text-opacity-50 mt-2">{label}</label>
        <div className="relative">
          <input
            name={name}
            type={inputType}
            onChange={onChange}
            value={value}
            className={`${styles} w-full border-b-2 border-gray-600 mt-2 focus:outline-none focus:border-blue-500`}
          />
          {name === "password" && (
            eyeStatus ? (
              <FaEye
                className="absolute right-1 top-3 cursor-pointer text-gray-400"
                onClick={() => {
                  setEyeStatus(!eyeStatus);
                }}
              />
            ) : (
              <FaEyeSlash
                className="absolute right-1 top-3 cursor-pointer text-gray-400"
                onClick={() => {
                  setEyeStatus(!eyeStatus);
                }}
              />
            )
          )}
        </div>
      </div>
    </>
  );
}

export default InputBox;
