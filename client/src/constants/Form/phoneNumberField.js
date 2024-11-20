export const phoneNumberField = [
  {
    label: "Enter Your Phone Number",
    name: "phoneNumber",
    type: "number",
    validations: {
      required: "Phone number is required",
      pattern: {
        value: /^[6-9]\d{9}$/,
        message: "Enter a valid phone number",
      },
    },
  },
];
