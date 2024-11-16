// import Button from "../../../components/Form/Button";
// import InputBox from "../../../components/Form/InputBox";

// import useFormHandler from "../../../hooks/useFormHandler";
import GenericForm from "../../../components/Form/GenericForm";

import { loginFields } from "../../../constants/Form/loginFields";

import { registerUser } from "../../../api/auth";

function LoginPage() {
//   const { inputData, handleChange, handleSubmit } = useFormHandler(loginFields);
  return (
    <>
      {/* <form onSubmit={handleSubmit}>
        {loginFields.map((field, index) => (
          <InputBox
            key={index}
            label={field.label}
            name={field.name}
            type={field.type}
            onChange={handleChange}
            value={inputData[field.name]}
          />
        ))}
        <p>{JSON.stringify(inputData)}</p>
        <Button type={"submit"} buttonName={"submit"}/>
      </form> */}
      <GenericForm inputFields={loginFields} apiFunction={registerUser} />
    </>
  );
}

export default LoginPage;
