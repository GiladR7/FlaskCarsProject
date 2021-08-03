import { Form, InputGroup } from "react-bootstrap";

export default function DateInput({
  name,
  maxDate,
  minDate,
  labelText,
  htmlFor,
  changeInput,
  value,
  updateLocal,
  errors,
  valid,
  validation,
}) {
  return (
    <Form.Group controlId={htmlFor}>
      <Form.Label>{labelText}</Form.Label>
      <InputGroup hasValidation>
        <Form.Control
          type="date"
          onChange={(e) => {
            changeInput(e.target);
          }}
          onBlur={(e) => {
            const isDisable = validation(e.target);
            updateLocal = updateLocal ? updateLocal(isDisable) : null;
          }}
          isInvalid={!valid}
          value={value}
          name={name}
          min={minDate}
          max={maxDate}
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
