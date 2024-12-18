export const registerFields = [
  {
    label: "Enter Your Email",
    name: "email",
    type: "email",
    validations: {
      required: "Email is required",
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Email is not valid",
      },
    },
  },
  {
    label: "Enter Your Phone Number",
    name: "phoneNumber",
    type: "text",
    validations: {
      required: "Phone number is required",
      pattern: {
        value: /^[6-9]\d{9}$/,
        message: "Enter a valid phone number",
      },
    },
  },
  {
    label: "Enter Your Password",
    name: "password",
    type: "password",
    validations: {
      required: "Password is required",
      pattern: {
        value:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        message:
          "Password must be atleast 8 characters long and only include an uppercase, lowercase, number, and special character",
      },
    },
  },
  {
    label: "Confirm Password",
    name: "confirmPassword",
    type: "password",
    validations: {
      required: "Please confirm your password",
      validate: (value, formValues) =>
        value === formValues.password || "Passwords do not match",
    },
  },
];
