import { Form, InputGroup } from "react-bootstrap";

export default function InputText({
  htmlFor,
  labelText,
  inputType,
  placeholderText,
  value,
  inputOnChange,
  valid,
  errors,
  name,
  updateLocal,
  className = "",
  autocomplete = "",
}) {
  return (
    <Form.Group className={className} controlId={htmlFor}>
      <Form.Label>{labelText}</Form.Label>
      <InputGroup hasValidation>
        <Form.Control
          autoComplete={autocomplete}
          type={inputType}
          placeholder={placeholderText}
          isInvalid={!valid}
          value={value}
          name={name}
          onChange={(e) => {
            const isDisabled = inputOnChange(e.target);
            updateLocal = updateLocal
              ? updateLocal(isDisabled === undefined ? true : isDisabled)
              : null;
          }}
        />
        <Form.Control.Feedback
          role="alert"
          className="fade alert alert-danger show"
          type="invalid"
        >
          {errors.map((error, index) => {
            return <p key={index}>{error}</p>;
          })}
        </Form.Control.Feedback>
      </InputGroup>
    </Form.Group>
  );
}
