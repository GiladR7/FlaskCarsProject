import { Form } from "react-bootstrap";

export default function TextArea({
  htmlFor,
  labelText,
  placeholderText,
  maxCharacters,
  name,
  value,
  inputOnChange,
  updateLocal,
}) {
  return (
    <Form.Group controlId={htmlFor}>
      <Form.Label>{labelText}</Form.Label>

      <Form.Control
        name={name}
        as="textarea"
        value={value}
        rows={4}
        placeholder={placeholderText}
        maxLength="255"
        onChange={(e) => {
          inputOnChange(e.target);
          updateLocal = updateLocal ? updateLocal() : null;
        }}
      />
      <p className="text-left mt-1">
        {value.length}/{maxCharacters}
      </p>
    </Form.Group>
  );
}
