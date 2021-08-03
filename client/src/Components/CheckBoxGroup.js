import { Form } from "react-bootstrap";

export default function CheckBoxGroup({
  labelText,
  checkboxsValuesArr,
  inline = true,
  name,
  onChecked,
  checkBoxValues,
}) {
  return (
    <Form.Group>
      <Form.Label>{labelText}</Form.Label>
      {checkboxsValuesArr.map(([text, value], index) => {
        return (
          <Form.Check
            custom
            key={index}
            name={name}
            checked={checkBoxValues.includes(value)}
            value={value}
            inline={inline}
            label={text}
            onChange={(e) => onChecked(e.target)}
            type="checkbox"
            id={value}
          />
        );
      })}
    </Form.Group>
  );
}
