import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToggleButton } from "react-bootstrap";
export default function ToggleButtonItem({ text, variant, icon, value }) {
  return (
    <ToggleButton
      value={value}
      className="sortByBtn"
      variant={variant}
      name="sortBy"
      type="radio"
    >
      {text} <FontAwesomeIcon icon={icon} />
    </ToggleButton>
  );
}
