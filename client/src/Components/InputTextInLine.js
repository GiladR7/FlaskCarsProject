import { Form, Row, Col, InputGroup } from "react-bootstrap";

export default function InputGroupInLine({
  name,
  labelText,
  placeholderText,
  inputType,
  htmlFor,
  value,
  inputOnChange,
  valid,
  validationFunc,
  errors,
}) {
  return (
    <Form.Group as={Row} controlId={htmlFor}>
      <Form.Label column sm={3}>
        {labelText}
      </Form.Label>
      <Col sm={9}>
        <InputGroup hasValidation>
          <Form.Control
            type={inputType}
            name={name}
            placeholder={placeholderText}
            value={value}
            column
            onChange={(e) => inputOnChange(e.target)}
            isInvalid={!valid}
            onBlur={(e) => validationFunc(e.target)}
          />

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
      </Col>
    </Form.Group>
  );
}
