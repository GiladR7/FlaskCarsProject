import { Container, Form, Button } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import Aos from "aos";
import "aos/dist/aos.css";
import { sendNewUser } from "../DAL/api";
import { validationFunc, inputOnChange } from "../utilities/validationsFunc";
import InputTextInLine from "../Components/InputTextInLine";
import CheckBoxGroup from "../Components/CheckBoxGroup";
import { checkBoxOnChange, extractValues } from "../utilities/utilities";
import { AdsContext } from "../Context/HomePageContext";

export default function Registration() {
  const history = useHistory();
  const [isDisabled, setisDisabled] = useState(true);
  const [serverError, setServerError] = useState("");
  const [inputsValues, setInputsValues] = useState({
    user: {
      value: "",
      isValid: true,
      errors: [],
    },
    email: {
      value: "",
      isValid: true,
      errors: [],
    },
    password: {
      value: "",
      isValid: true,
      errors: [],
    },
    confirmPassword: {
      value: "",
      isValid: true,
      errors: [],
    },
    chooseCategories: {
      value: [],
      isValid: true,
      errors: [],
    },
  });

  const { message, setMessage } = useContext(AdsContext);

  const inputOnBlur = validationFunc(
    inputsValues,
    setInputsValues,
    setisDisabled
  );
  const updateCheckBoxSelected = checkBoxOnChange(
    inputsValues,
    setInputsValues,
    "chooseCategories"
  );

  useEffect(() => {
    Aos.init({ duration: 1500 });
  }, []);

  async function onsubmit(e) {
    e.preventDefault();
    const sendData = extractValues(inputsValues);
    const {
      message,
      inputsValue: inputServerValidtion,
      status,
    } = await sendNewUser(sendData);
    setServerError("");

    if (inputServerValidtion) {
      setInputsValues({ ...inputServerValidtion });
    } else if (message) {
      setServerError(message);
      setisDisabled(true);
    } else if (status === "ok") {
      setMessage(`נרשמת בהצלחה ${inputsValues.user.value}`);
      setTimeout(() => {
        setMessage("");
      }, 4000);
      history.push("/"); //add register sucess page
    }
  }
  const changeInput = inputOnChange(inputsValues, setInputsValues);
  return (
    <Container fluid data-aos="fade-down">
      <Form className="form-register" onSubmit={(e) => onsubmit(e)}>
        <h3 className="mb-4">הירשם לאתר</h3>
        <InputTextInLine
          labelText="שם משתמש"
          placeholderText="הכנס שם משתמש"
          inputType="text"
          htmlFor="user-name"
          name="user"
          valid={inputsValues.user.isValid}
          value={inputsValues.user.value}
          errors={inputsValues.user.errors}
          inputOnChange={changeInput}
          validationFunc={inputOnBlur}
        />
        <InputTextInLine
          labelText="כתובת אימייל"
          placeholderText="הכנס איימיל"
          inputType="email"
          htmlFor="email"
          name="email"
          value={inputsValues.email.value}
          valid={inputsValues.email.isValid}
          errors={inputsValues.email.errors}
          inputOnChange={changeInput}
          validationFunc={inputOnBlur}
        />
        <InputTextInLine
          labelText="סיסמא"
          placeholderText="הכנס סיסמא"
          inputType="password"
          htmlFor="password"
          name="password"
          value={inputsValues.password.value}
          valid={inputsValues.password.isValid}
          errors={inputsValues.password.errors}
          inputOnChange={changeInput}
          validationFunc={inputOnBlur}
        />

        <InputTextInLine
          labelText=" אימות סיסמא"
          placeholderText="אמת את סיסמא"
          inputType="password"
          htmlFor="confirmPassword"
          name="confirmPassword"
          value={inputsValues.confirmPassword.value}
          valid={inputsValues.confirmPassword.isValid}
          errors={inputsValues.confirmPassword.errors}
          inputOnChange={changeInput}
          validationFunc={inputOnBlur}
        />

        <CheckBoxGroup
          labelText="הצג לי מודעות"
          checkBoxValues={inputsValues.chooseCategories.value}
          checkboxsValuesArr={[
            ["רכבים פרטיים", "רכב פרטי"],
            ["אופנועים", "אופנוע"],
            ["ג'יפים", "גיפ"],
          ]}
          name="chooseCategories"
          onChecked={updateCheckBoxSelected}
        />

        <Button variant="primary" type="submit" disabled={isDisabled}>
          הירשם לאתר
        </Button>
        {serverError && (
          <p role="alert" className="fade alert alert-danger show mt-2">
            {serverError}
          </p>
        )}
      </Form>
    </Container>
  );
}
