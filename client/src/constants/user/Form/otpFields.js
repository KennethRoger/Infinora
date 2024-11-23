export const otpFields = [
  {
    label: "Enter OTP",
    name: "otp",
    type: "text",
    validations: {
      required: "Enter the OTP send to your email",
      length: {
        value: 6,
        message: "The OTP is only 6 digits",
      },
    },
  },
];
