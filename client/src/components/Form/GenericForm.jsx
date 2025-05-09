import useFormHandler from "../../hooks/useFormHandler";
import Button from "./Button";
import InputBox from "./InputBox";

function GenericForm({ inputFields, apiFunction, serverError, buttonName, buttonStyle, buttonAttributes }) {
  const { inputData, errors, handleChange, handleSubmit } = useFormHandler(inputFields);

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
            {errors[field.name] && (
              <p className="text-red-600 text-lg">{errors[field.name]}</p>
            )}
          </div>
        ))}
        {serverError && <p className="text-red-600 text-lg mt-4">{serverError}</p>}
        <Button
          type={"submit"}
          styles={`mt-8 ${buttonStyle}`}
          attributes={buttonAttributes}
        >
          {buttonName}
        </Button>
      </form>
    </>
  );
}

export default GenericForm;
