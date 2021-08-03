import {
  ToggleButtonGroup,
  ToggleButton,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CheckBoxGroup from "./CheckBoxGroup";
import {
  faSortAmountUpAlt,
  faSortAmountDownAlt,
  faMoneyBill,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { faHotjar } from "@fortawesome/free-brands-svg-icons";
import { searchManufacturers, getModelsByManufacturers } from "../DAL/api";
import SearchInput from "./SearchInput";
import FilterDisplay from "./FilterDispaly";
import { AdsContext } from "../Context/HomePageContext";

export default function FilterCars({ checkBoxValues, updateCheckBoxSelected }) {
  const [manufacturerSearch, setManufacturerSearch] = useState([]);
  const [modelSearch, setModelSearch] = useState([]);
  const [serachInputs, setSearchInputs] = useState({
    model: "",
    manufacturer: "",
  });
  const {
    orderBy,
    setOrdetBy,
    orderHeigher,
    setOrderHeigher,
    manufacturerFilter,
    setManufacturerFilter,
    modelFilter,
    setModelFilter,
  } = useContext(AdsContext);

  function updateSeacrhValue({ name, value }) {
    setSearchInputs({
      ...serachInputs,
      [name]: value,
    });
  }
  const toggleObj = [
    { value: "adDate", icon: faCalendarAlt, variant: "info", text: "תאריך" },
    { value: "views", icon: faHotjar, variant: "danger", text: "פופולאריות" },
    { value: "carprice", icon: faMoneyBill, variant: "success", text: "מחיר" },
  ];

  function serachModel(model) {
    const models = JSON.parse(localStorage.getItem("models"));
    const modelsIdsSelected = modelFilter.map(({ modelID }) => {
      return modelID;
    });
    return models.filter(({ modelName, modelID }) => {
      return (
        modelName.toLowerCase().startsWith(model.toLowerCase()) &&
        !modelsIdsSelected.includes(modelID)
      );
    });
  }
  return (
    <>
      <header
        data-aos="fade-down"
        className="mx-auto"
        style={{ maxWidth: "1195px", marginBottom: "20px" }}
      >
        <h1>מודעות שפורסמו</h1>
        <div className="row sory-container">
          <div className="col-md-2">
            <h5>
              הצג מודעות לפי{" "}
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip id="button-tooltip-2">סדר מיון עולה או יורד</Tooltip>
                }
              >
                <FontAwesomeIcon
                  style={{
                    fontSize: "22px",
                    paddingRight: "4px",
                    cursor: "pointer",
                  }}
                  icon={orderHeigher ? faSortAmountDownAlt : faSortAmountUpAlt}
                  onClick={() => setOrderHeigher(!orderHeigher)}
                />
              </OverlayTrigger>
            </h5>
          </div>

          <ToggleButtonGroup
            className=" col-md-6 row sort-btn-container mr-2"
            type="radio"
            name="sortBy"
            value={orderBy}
            onChange={(value) => setOrdetBy(value)}
          >
            {toggleObj.map((data) => {
              return (
                <ToggleButton
                  value={data.value}
                  key={data.value}
                  variant={data.variant}
                  className="sortByBtn"
                >
                  {data.text} <FontAwesomeIcon icon={data.icon} />
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>
        </div>
        <SearchInput
          getResultsApi={searchManufacturers}
          setResults={setManufacturerSearch}
          searchResults={manufacturerSearch}
          disabled={false}
          name="manufacturer"
          value={serachInputs.manufacturer}
          placeholderText="סינון לפי יצרן"
          filterList={manufacturerFilter}
          setFilter={setManufacturerFilter}
          dataID="manufacturerID"
          valueData="manufacturerName"
          inputOnChange={updateSeacrhValue}
          getModelsByManufacturers={getModelsByManufacturers}
        />

        <SearchInput
          disabled={!manufacturerFilter.length}
          getResultsApi={serachModel}
          setResults={setModelSearch}
          searchResults={modelSearch}
          name="model"
          value={serachInputs.model}
          placeholderText="סינון לפי דגם"
          filterList={modelFilter}
          setFilter={setModelFilter}
          dataID="modelID"
          valueData="modelName"
          inputOnChange={updateSeacrhValue}
        />

        <CheckBoxGroup
          labelText="הצג רכבים מסוג"
          checkBoxValues={checkBoxValues.chooseCategories.value}
          checkboxsValuesArr={[
            ["רכבים פרטיים", "רכב פרטי"],
            ["אופנועים", "אופנוע"],
            ["ג'יפים", "גיפ"],
          ]}
          name="chooseCategories"
          onChecked={updateCheckBoxSelected}
        />
      </header>

      {!!manufacturerFilter.length && (
        <FilterDisplay
          title="סינון לפי יצרן"
          filterItems={manufacturerFilter}
          dataID="manufacturerID"
          dataValue="manufacturerName"
          setFilter={setManufacturerFilter}
          modelsFilter={setModelFilter}
        />
      )}

      {!!modelFilter.length && (
        <FilterDisplay
          title="סינון לפי דגם"
          filterItems={modelFilter}
          dataID="modelID"
          dataValue="modelName"
          setFilter={setModelFilter}
        />
      )}
    </>
  );
}
