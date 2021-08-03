import { Container, Form, Button, Col, Row, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Link, useHistory } from "react-router-dom";
import TextArea from "../Components/TextArea";
import InputText from "../Components/InputText";
import SelectInput from "../Components/SelectInput";
import PhoneInput from "../Components/PhoneInput";
import DateInput from "../Components/DateInput";
import { useEffect, useState } from "react";
import { validationFunc, inputOnChange } from "../utilities/validationsFunc";
import { createFormData } from "../utilities/utilities";
import {
  getGears,
  getColorsOptions,
  sendNewAD,
  getAreaCodes,
  validToken,
} from "../DAL/api";
import {
  getItemLocal,
  updateLocalStorege,
} from "../utilities/localStoregeFunc";
import InputNumber from "../Components/InputNumber";
import Aos from "aos";
import "aos/dist/aos.css";
export default function AddCarParse2() {
  const [isDisable, setIsDisable] = useState(true);
  const [chooseCategory, setChooseCategory] = useState("");
  const [selectAreaCodes, setSelectAreaCodes] = useState([]);
  const [serverError, setServerError] = useState();
  const [inputsValues, setInputsValues] = useState(() => {
    return getItemLocal(
      "adCarData",
      "adDetails",
      "canSubmit",
      {
        owners: {
          value: "",
          isValid: true,
          errors: [],
        },
        year: {
          value: "",
          isValid: true,
          errors: [],
        },
        km: {
          value: "",
          isValid: true,
          errors: [],
        },
        color: {
          value: "",
          isValid: true,
          errors: [],
          selectList: [
            {
              color: "שחור",
            },
            {
              color: "אדום",
            },
            {
              color: "אפור",
            },
            {
              color: "ורוד",
            },
            {
              color: "חום",
            },
            {
              color: "ירוק",
            },
            {
              color: "כחול",
            },
            {
              color: "כתום",
            },
            {
              color: "לבן",
            },
            {
              color: "סגול",
            },
            {
              color: "צהוב",
            },
          ],
        },
        gear: {
          value: "",
          isValid: true,
          errors: [],
          selectList: [
            {
              gear: "ידני",
            },
            {
              gear: "אוטומטי",
            },
          ],
        },
        codeArea: {
          value: "",
          isValid: true,
          errors: [],
        },
        phone: {
          value: "",
          isValid: true,
          errors: [],
        },
        file: {
          value: "",
          isValid: true,
          errors: [],
        },
        city: {
          value: "",
          isValid: true,
          errors: [],
          cities: [],
        },
        price: {
          value: "",
          isValid: true,
          errors: [],
        },
        moreDetails: {
          value: "",
          isValid: true,
          errors: [],
        },
      },
      setIsDisable
    );
  });
  const validationInput = validationFunc(
    inputsValues,
    setInputsValues,
    setIsDisable,
    chooseCategory
  );

  async function pageOnLoad() {
    const isLogIn = await validToken(histoy);
    if (isLogIn) {
      if (
        !localStorage.getItem("adCarData") ||
        JSON.parse(localStorage.getItem("adCarData")).isDisabled
      ) {
        histoy.push("add-new-car");
      } else {
        const {
          carSelected: {
            cartype: { value: category },
          },
        } = JSON.parse(localStorage.getItem("adCarData"));

        setChooseCategory(category);

        // getGears().then((gear) => {
        //   inputsValues.gear.selectList = gear;
        //   setInputsValues({ ...inputsValues });
        // });

        // getAreaCodes().then((codeArea) => setSelectAreaCodes([...codeArea]));

        // getColorsOptions().then((colors) => {
        //   inputsValues.color.selectList = colors;
        //   setInputsValues({ ...inputsValues });
        // });
        //check if all input ok when move between the pages of the addCar
        const validationInput = validationFunc(
          inputsValues,
          setInputsValues,
          setIsDisable,
          category
        );
        validationInput({
          name: "moreDetails",
          value: inputsValues.moreDetails.value,
        });
      }
    }
  }

  useEffect(() => {
    pageOnLoad();
    Aos.init({ duration: 1500 });
  }, []);

  const updateLocal = updateLocalStorege(
    "canSubmit",
    "adCarData",
    "adDetails",
    inputsValues
  );

  const histoy = useHistory();

  const changeInput = inputOnChange(
    inputsValues,
    setInputsValues,
    setIsDisable
  );

  async function onsubmit(e) {
    e.preventDefault();
    const { carSelected } = JSON.parse(localStorage.getItem("adCarData"));
    const { file, ...carDetails } = inputsValues;
    const carAdForm = createFormData(
      { ...carDetails, ...carSelected },
      file.value,
      "carImages"
    );

    const { message, adId } = await sendNewAD(carAdForm);
    if (message) {
      setServerError(message);
    } else if (adId) {
      localStorage.removeItem("adCarData");
      histoy.push(`/${adId}/car-details`);
    }
  }
  return (
    <Container fluid data-aos="fade-down">
      <Form
        className="add-car-container"
        enctype="multipart/form-data"
        onSubmit={(e) => onsubmit(e)}
      >
        <Row>
          <Col md="6">
            <DateInput
              labelText="תאריך עלייה על הכביש"
              htmlFor="car-year"
              name="year"
              maxDate={new Date().toISOString().slice(0, 10)}
              minDate={"1950-01-01"}
              value={inputsValues.year.value}
              changeInput={changeInput}
              validation={validationInput}
              updateLocal={updateLocal}
              errors={inputsValues.year.errors}
              valid={inputsValues.year.isValid}
            />
          </Col>
          <Col md="6">
            <InputNumber
              htmlFor="km"
              labelText="מספר קילומטרים"
              mixNumber="0"
              maxNumber="10000000"
              placeholderText="הכנס קילומטרז"
              value={inputsValues.km.value}
              errors={inputsValues.km.errors}
              valid={inputsValues.km.isValid}
              changeInput={validationInput}
              name="km"
              updateLocal={updateLocal}
            />
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <InputNumber
              htmlFor="owners"
              labelText="מספר בעלים"
              mixNumber="1"
              maxNumber="10"
              placeholderText="הכנס את יד הרכב"
              errors={inputsValues.owners.errors}
              valid={inputsValues.owners.isValid}
              value={inputsValues.owners.value}
              changeInput={validationInput}
              name="owners"
              updateLocal={updateLocal}
            />
          </Col>
          <Col md="6">
            <div className="city-container">
              <InputText
                htmlFor="city"
                labelText="עיר מגורים"
                maxTextLength="12"
                inputType="text"
                placeholderText={"הכנס עיר מגורים"}
                value={inputsValues.city.value}
                inputOnChange={changeInput}
                valid={inputsValues.city.isValid}
                errors={inputsValues.city.errors}
                name="city"
                autocomplete="off"
                updateLocal={updateLocal}
                className="city-field"
              />
              <ListGroup className="list-cietis">
                {inputsValues.city.cities.map((city, index) => {
                  return (
                    <ListGroup.Item
                      className="pointer"
                      key={index}
                      onClick={() => {
                        inputsValues.city.cities = [];
                        inputsValues.city.errors = [];
                        const isDisabled = validationInput({
                          name: "city",
                          value: city,
                        });

                        updateLocal(isDisabled);
                      }}
                    >
                      {city}
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Form.Group>
              <Form.File
                className={`position-relative ${
                  inputsValues.file.isValid ? "" : "is-invalid"
                }`}
                name="file"
                multiple
                accept="image/png, image/jpeg"
                label="העלאה תמונות של הרכב"
                id="validationFormik107"
                placeholder="בחר קובץ"
                onChange={(e) => {
                  const isDisable = validationInput({
                    value: e.target.files,
                    name: "file",
                  });
                  updateLocal(isDisable);
                }}
              />
              <Form.Control.Feedback
                role="alert"
                className="fade alert alert-danger show"
                type="invalid"
              >
                {inputsValues.file.errors.map((error, index) => {
                  return <p key={index}>{error}</p>;
                })}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md="6">
            <PhoneInput
              phoneErr={inputsValues.phone.errors}
              areaCodeErr={inputsValues.codeArea.errors}
              areaCodeValid={inputsValues.codeArea.isValid}
              phoneValid={inputsValues.phone.isValid}
              validationInput={validationInput}
              inputChange={changeInput}
              updateLocal={updateLocal}
              areaValue={inputsValues.codeArea.value}
              phoneValue={inputsValues.phone.value}
              phoneCodeAreaSelect={[
                { code: "050" },
                { code: "054" },
                { code: "053" },
                { code: "052" },
              ]}
            />
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <SelectInput
              htmlFor="color"
              textLable="צבע הרכב"
              showByDefault={["", "בחר את צבע הרכב"]}
              optionSelect={inputsValues.color.selectList}
              inputChange={validationInput}
              value={inputsValues.color.value}
              errors={inputsValues.color.errors}
              valid={inputsValues.color.isValid}
              updateLocal={updateLocal}
              valueKey="color"
              textKey="color"
            />
          </Col>
          <Col md="6">
            <InputNumber
              htmlFor="price"
              labelText="מחיר הרכב"
              mixNumber="1"
              maxNumber="10000000"
              placeholderText="הכנס את מחיר הרכב"
              value={inputsValues.price.value}
              errors={inputsValues.price.errors}
              valid={inputsValues.price.isValid}
              changeInput={validationInput}
              name="price"
              updateLocal={updateLocal}
            />
          </Col>
        </Row>
        <Row>
          <Col md="6">
            {+chooseCategory !== 3 && (
              <SelectInput
                htmlFor="gear"
                textLable="סוג תיבת הילוכים"
                showByDefault={["", "בחר סוג תיבה"]}
                optionSelect={inputsValues.gear.selectList}
                inputChange={validationInput}
                value={inputsValues.gear.value}
                errors={inputsValues.gear.errors}
                valid={inputsValues.gear.isValid}
                updateLocal={updateLocal}
                valueKey="gear"
                textKey="gear"
              />
            )}
          </Col>
        </Row>
        <TextArea
          htmlFor="more-details"
          placeholderText="הכנס פרטים נוספים על הרכב"
          labelText="פרטים נוספים"
          name="moreDetails"
          maxCharacters="255"
          value={inputsValues.moreDetails.value}
          inputOnChange={changeInput}
          updateLocal={updateLocal}
        />
        <div className="d-flex btn-parse2">
          <Link className="btn btn-warning" to="/add-new-car">
            <FontAwesomeIcon icon={faEdit} /> חזור
          </Link>

          <Button variant="primary" type="submit" disabled={isDisable}>
            פרסם מודעה
          </Button>
        </div>
        {serverError && (
          <p role="alert" className="fade alert alert-danger show mt-2">
            {serverError}
          </p>
        )}
      </Form>
    </Container>
  );
}
