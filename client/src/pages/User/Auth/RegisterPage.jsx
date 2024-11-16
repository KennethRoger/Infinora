import Button from "../../../components/Form/Button";
import InputBox from "../../../components/Form/InputBox";

import useFormHandler from "../../../hooks/useFormHandler";
import { registerFields } from "../../../constants/Form/registerFields";

function RegisterPage() {
    // const USERS_API = import.meta.env.VITE_USERS_API_BASE_URL;
  const { inputData, handleChange, handleSubmit } = useFormHandler(registerFields);
  return (
    <>
      <form onSubmit={handleSubmit} method="post">
        {registerFields.map((field, index) => (
          <InputBox
            key={index}
            label={field.label}
            name={field.name}
            type={field.type}
            onChange={handleChange}
            value={inputData[field.name]}
            styles={"border-gray-400"}
          />
        ))}
        <p>{JSON.stringify(inputData)}</p>
        <Button type={"submit"} buttonName={"submit"} />
      </form>
    </>
  );
}

export default RegisterPage;
