import { Form, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { logInCheck } from "./DAL/api";
import { useState } from "react";
import { validationFunc, inputOnChange } from "./utilities/validationsFunc";
import { useHistory } from "react-router";

export default function LogIn({ closePopUp, setIsLogIn }) {
  const [isDisabled, setIsDisabled] = useState(true);
  const [errorLogIn, setErrorLogIn] = useState("");
  const [inputValues, setInputValues] = useState({
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
  });

  const onChange = inputOnChange(inputValues, setInputValues, setIsDisabled);
  const history = useHistory();
  const checkInput = validationFunc(inputValues, setInputValues, setIsDisabled);
  function onLogIn(e) {
    e.preventDefault();
    logInCheck(inputValues.email.value, inputValues.password.value)
      .then((user) => {
        localStorage.setItem("currentUser", JSON.stringify(user));
        console.log(user);
        setIsLogIn(true);
        closePopUp();
        history.push("/");
      })
      .catch((err) => {
        setErrorLogIn(err);
      });
  }
  return (
    <div>
      <FontAwesomeIcon
        icon={faTimes}
        className="close-btn"
        onClick={() => {
          closePopUp();
        }}
      />
      <span style={{ fontSize: "15px", color: "red" }}>{errorLogIn}</span>
      <Form
        onSubmit={(e) => {
          onLogIn(e);
        }}
      >
        <Form.Row>
          <Col md="5">
            <Form.Control
              type="email"
              placeholder="הכנס איימיל"
              name="email"
              value={inputValues.email.value}
              onChange={(e) => onChange(e.target)}
              onBlur={(e) => checkInput(e.target)}
              className={inputValues.email.isValid ? "" : "in-valid-data"}
            />
            <p className="mb-2">{inputValues.email.errors[0]}</p>
          </Col>
          <Col md="5">
            <Form.Control
              type="password"
              placeholder="הכנס סיסמא"
              name="password"
              className={inputValues.password.isValid ? "" : "in-valid-data"}
              value={inputValues.password.value}
              onChange={(e) => onChange(e.target)}
              onBlur={(e) => checkInput(e.target)}
            />
            <p className="mb-2">{inputValues.password.errors[0]}</p>
          </Col>
          <Col md="2">
            <Button variant="primary" type="submit" disabled={isDisabled}>
              התחבר
            </Button>
          </Col>
        </Form.Row>
      </Form>
    </div>
  );
}
