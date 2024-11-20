import React, { useEffect } from "react";

const Modal = ({ isOpen, onClose, children }) => {

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("overflow-hidden")
        } else {
            document.body.classList.remove("overflow-hidden")
        }

        return (() => {
            document.body.classList.remove("overflow-hidden")
        })
    })

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-lg p-6">
        <div className="flex justify-end items-center pb-2 mb-4">
          <button
            className="text-gray-400 hover:text-gray-800"
            onClick={onClose}
          >
            &#x2715;
          </button>
        </div>

        <div>{children}</div>

        <div className="flex justify-end pt-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
