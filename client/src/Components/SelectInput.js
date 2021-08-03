import { Form, InputGroup } from "react-bootstrap";

export default function SelectInput({
  htmlFor,
  textLable,
  showByDefault: [defaultValue, defaultText],
  optionSelect,
  inputChange,
  valid = true,
  errors = [],
  value,
  isDisabled = false,
  updateLocal = false,
  valueKey,
  textKey,
}) {
  return (
    <Form.Group controlId={htmlFor}>
      <Form.Label>{textLable}</Form.Label>
      <InputGroup hasValidation>
        <Form.Control
          as="select"
          className="pointer"
          name={htmlFor}
          isInvalid={!valid}
          onChange={(e) => {
            const isDisabled = inputChange(e.target);
            updateLocal = updateLocal ? updateLocal(isDisabled) : null;
          }}
          value={value}
          disabled={isDisabled}
        >
          <option value={defaultValue}>{defaultText} </option>
          {optionSelect.map((value, index) => {
            return (
              <option key={index} value={value[valueKey]}>
                {value[textKey]}
              </option>
            );
          })}
        </Form.Control>
        <Form.Control.Feedback
          role="alert"
          className="fade alert alert-danger show"
          type="invalid"
        >
          {errors.map((value, index) => {
            return <p key={index}>{value}</p>;
          })}
        </Form.Control.Feedback>
      </InputGroup>
    </Form.Group>
  );
}
