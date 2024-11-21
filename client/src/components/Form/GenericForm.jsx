import useFormHandler from "../../hooks/useFormHandler";
import Button from "./Button";
import InputBox from "./InputBox";

function GenericForm({ inputFields, apiFunction, buttonName, onClick }) {
  const { inputData, errors, handleChange, handleSubmit } =
    useFormHandler(inputFields);
  return (
    <>
      <form onSubmit={(e) => handleSubmit(e, apiFunction)}>
        {inputFields.map((field, index) => (
          <div key={index}>
            <InputBox
              label={field.label}
              name={field.name}
              type={field.type}
              onChange={handleChange}
              value={inputData[field.name]}
            />
            {errors[field.name] && <p className="text-red-600">{errors[field.name]}</p>}
          </div>
        ))}
        <p>{JSON.stringify(inputData)}</p>
        <Button type={"submit"} buttonName={buttonName} onClick={onClick} />
      </form>
    </>
  );
}

export default GenericForm;
