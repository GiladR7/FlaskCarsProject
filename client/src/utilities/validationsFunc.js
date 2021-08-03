import { validation } from "../utilities/validationObj";
import { getCities, validToken } from "../DAL/api";

export function validationFunc(
  inputsValues,
  setInputsValues,
  setisDisabled,
  chooseCategory = false
) {
  return ({ name, value }) => {
    const errors = [];

    let isValid = true;
    if (validation[name].required && !value) {
      errors.push(validation[name].requiredError);
      isValid = false;
    }
    if (validation[name].regex && !validation[name].regex.test(value)) {
      errors.push(validation[name].regexError);
      isValid = false;
    }

    if (
      validation[name].funcValidation &&
      validation[name].funcValidation(value, inputsValues?.password?.value)
    ) {
      isValid = false;
      errors.push(validation[name].customError);
    }

    if (
      name === "password" &&
      inputsValues.confirmPassword &&
      inputsValues.confirmPassword.value
    ) {
      passwordConfirmValidtion(value, inputsValues);
    }

    inputsValues[name].isValid = isValid;
    inputsValues[name].errors = errors;
    inputsValues[name].value = value;

    const isDisabled = canSubmit(
      inputsValues,
      setisDisabled,
      chooseCategory ? chooseCategory : ""
    );
    setInputsValues({
      ...inputsValues,
    });
    return isDisabled;
  };
}

function passwordConfirmValidtion(value, inputsValues) {
  const errors = inputsValues.confirmPassword.errors.filter((value) => {
    return value !== "סיסמא לא תואמת";
  });

  if (
    validation.confirmPassword.funcValidation(
      value,
      inputsValues.confirmPassword.value
    )
  ) {
    errors.push(validation.confirmPassword.customError);

    inputsValues.confirmPassword.errors = errors;

    inputsValues.confirmPassword.isValid = false;
  } else {
    inputsValues.confirmPassword.errors = errors;
    if (!inputsValues.confirmPassword.errors.length)
      inputsValues.confirmPassword.isValid = true;
  }
}
function canSubmit(inputsValues, setisDisabled, chooseCategory = false) {
  for (const key in inputsValues) {
    const { value, errors } = inputsValues[key];
    if ((!value && validation[key].required) || errors.length !== 0) {
      if (+chooseCategory === 3 && key === "gear") continue;
      setisDisabled(true);
      return true;
    }
  }
  setisDisabled(false);
  return false;
}

export function inputOnChange(inputsValues, setInputsValues, setBtnDisable) {
  return ({ value, name }) => {
    inputsValues[name].value = value;
    if (name === "city") {
      getCities(value, inputsValues, setInputsValues);
      setBtnDisable(true);
      inputsValues.city.errors = ["הכנס עיר שמופיע ברשימה"];
    }
    setInputsValues({
      ...inputsValues,
    });
  };
}

function checkChooseCategoryChange(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return true;
  }
  for (const value of arr1) {
    if (!arr2.includes(value)) {
      return true;
    }
  }
  return false;
}

export function checkInputChangeBeforeSubmit(inputsValues, userDataFromLocal) {
  for (const key in inputsValues) {
    if (userDataFromLocal[key] !== inputsValues[key].value) {
      if (
        key === "chooseCategories" &&
        !checkChooseCategoryChange(
          userDataFromLocal[key],
          inputsValues[key].value
        )
      ) {
        continue;
      }
      return true;
    }
  }
  return false;
}

export async function tokenValidtion(history) {
  const data = await validToken();
  if (data.status !== "ok") {
    if (history) {
      history.push("/");
    }
    return false;
  }
  return true;
}
