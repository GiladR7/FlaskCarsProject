import { ListGroup } from "react-bootstrap";

export default function SearchList({
  filterList,
  setFilter,
  dataID,
  valueData,
  searchResults,
  updateSeacrhValue,
  setResults,
  getModelsByManufacturers,
}) {
  const listItemClick = (id, value) => {
    filterList.push({
      [dataID]: id,
      [valueData]: value,
    });

    setFilter([...filterList]);
    setResults([]);
    updateSeacrhValue({
      name: valueData.split("Name")[0],
      value: "",
    });
    if (getModelsByManufacturers) getModelsByManufacturers(filterList);
  };
  return (
    <ListGroup className="searchContainer">
      {searchResults.map(({ [dataID]: id, [valueData]: value }) => {
        return (
          <ListGroup.Item
            className="searchInput pointer"
            key={id}
            value={value}
            onClick={() => listItemClick(id, value)}
          >
            {value}
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
}
