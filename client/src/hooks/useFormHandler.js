import axios from "axios";
import { useState } from "react";

const useFormHandler = (inititalFields) => {
  // Set initial form state
  const [inputData, setInputData] = useState(
    inititalFields.reduce((acc, curr) => {
      acc[curr.name] = "";
      return acc;
    }, {})
  );

  // set state based on changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  //   Submit data
  const handleSubmit = async (e, callback) => {
    e.preventDefault();
    console.log("Form Data:", inputData);
    callback(inputData);
  };

  return { inputData, handleChange, handleSubmit };
};

export default useFormHandler;