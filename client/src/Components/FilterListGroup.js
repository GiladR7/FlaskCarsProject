import { ListGroup } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";

import { getModelsByManufacturers } from "../DAL/api";

export default function FilterListGroup({
  id,
  value,
  filterList,
  valueData,
  setFilterList,
  setModelList,
}) {
  return (
    <ListGroup.Item
      className="filterItem"
      key={id}
      value={id}
      data-aos="fade-dwon"
    >
      <FontAwesomeIcon
        onClick={() => {
          const removeManufacturer = filterList.filter(
            ({ [valueData]: currentManufcturer }) => {
              return currentManufcturer !== value;
            }
          );
          if (setModelList) {
            if (removeManufacturer.length) {
              getModelsByManufacturers(removeManufacturer);
            } else {
              setModelList([]);
            }
          }
          setFilterList([...removeManufacturer]);
        }}
        icon={faWindowClose}
        style={{
          marginLeft: "4px",
          color: "red",
          cursor: "pointer",
        }}
      />
      {value}
    </ListGroup.Item>
  );
}
