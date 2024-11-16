import useFormHandler from "../../hooks/useFormHandler";
import Button from "./Button";
import InputBox from "./InputBox";

function GenericForm({ inputFields, apiFunction }) {
  const { inputData, handleChange, handleSubmit } = useFormHandler(inputFields);
  return (
    <>
      <form onSubmit={(e) => handleSubmit(e, apiFunction)}>
        {inputFields.map((field, index) => (
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
        <Button type={"submit"} buttonName={"submit"} />
      </form>
    </>
  );
}

export default GenericForm;
