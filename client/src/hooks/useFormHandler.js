import { useState } from "react";

const useFormHandler = (inititalFields) => {
  // Set initial form data
  const [inputData, setInputData] = useState(
    inititalFields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {})
  );
  // Error state
  const [errors, setErrors] = useState({});

  // Validate field function: Provides error validation based on the active error on a field
  const validateField = (value, validations, fieldName) => {
    if (!validations) return;

    if (validations.required && !value) {
      return validations.required;
    }

    if (validations.pattern && !validations.pattern.value.test(value)) {
      return validations.pattern.message;
    }

    if (validations.length && value.length != validations.length.value) {
      return validations.length.message;
    }

    return null;
  };

  // set state based on changes in input fieldserror={error}
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));

    const field = inititalFields.find((field) => field.name === name);
    const errMessage = validateField(value, field.validations, name);
    console.log(errMessage);
    setErrors((prev) => ({ ...prev, [name]: errMessage }));
  };

  // Revalidation method to check no input submissions
  const hasErrorOrEmptyFields = () => {
    const newErrors = {};

    inititalFields.forEach((field) => {
      const value = inputData[field.name];
      const errMessage = validateField(value, field.validations);
      if (errMessage) {
        newErrors[field.name] = errMessage;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length > 0;
  };

  //   Submit data
  const handleSubmit = (e, callback) => {
    e.preventDefault();
    if (hasErrorOrEmptyFields()) {
      return;
    }
    
    console.log("Form Data:", inputData);
    callback(inputData);
  };

  return { inputData, errors, handleChange, handleSubmit };
};

export default useFormHandler;
