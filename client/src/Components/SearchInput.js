import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form } from "react-bootstrap";
import SearchList from "./SearchList";
export default function SearchInput({
  getResultsApi,
  setResults,
  searchResults,
  name,
  value,
  placeholderText,
  filterList,
  setFilter,
  dataID,
  valueData,
  inputOnChange,
  getModelsByManufacturers,
  disabled,
}) {
  const searchInputOnChange = async (e) => {
    inputOnChange(e.target);
    const results = await getResultsApi(e.target.value, filterList);
    setResults([...results]);
    // if (e.target.value) {
    //   setResults([...results]);
    // } else {
    //   setResults([]);
    // }
  };
  return (
    <div className="serach-container mx-auto">
      <Form.Group>
        <div className="input-home-container">
          <FontAwesomeIcon icon={faSearch} className="filter-icon" />

          <Form.Control
            onFocus={searchInputOnChange}
            onChange={searchInputOnChange}
            autoComplete="off"
            disabled={disabled}
            value={value}
            name={name}
            type="text"
            placeholder={placeholderText}
            className="filter-input"
          />
          <SearchList
            filterList={filterList}
            setFilter={setFilter}
            dataID={dataID}
            valueData={valueData}
            searchResults={searchResults}
            updateSeacrhValue={inputOnChange}
            setResults={setResults}
            getModelsByManufacturers={getModelsByManufacturers}
          />
        </div>
      </Form.Group>
    </div>
  );
}
