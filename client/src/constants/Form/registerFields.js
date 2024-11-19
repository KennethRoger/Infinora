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
    label: "Enter Your Password",
    name: "password",
    type: "password",
    validations: {
      required: "Password is required",
      pattern: {
        value:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        message:
          "Password must be atleast 8 characters long and include uppercase, lowercase, number, and special character",
      },
    },
  },
  {
    label: "Confirm Your Password",
    name: "confirmPassword",
    type: "password",
    validations: { required: "Confirm the password" },
  },
];
