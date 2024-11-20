export const loginFields = [
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
    validations: { required: "Password is required" },
  },
];
