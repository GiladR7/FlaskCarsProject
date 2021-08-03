import { ListGroup } from "react-bootstrap";
import FilterListGroup from "./FilterListGroup";

export default function FilterDisplay({
  title,
  filterItems,
  dataID,
  dataValue,
  setFilter,
  modelsFilter,
}) {
  return (
    <div data-aos="fade-down">
      <h4
        style={{ maxWidth: "1195px", margin: "0px auto 20px auto" }}
        className="filter-header"
      >
        {title}
      </h4>
      <ListGroup
        horizontal
        style={{
          maxWidth: "1195px",
          margin: "0px  auto 20px auto",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {filterItems.map(({ [dataID]: id, [dataValue]: value }) => {
          return (
            <FilterListGroup
              id={id}
              key={id}
              value={value}
              filterList={filterItems}
              valueData={dataValue}
              setFilterList={setFilter}
              setModelList={modelsFilter}
            />
          );
        })}
      </ListGroup>
    </div>
  );
}
