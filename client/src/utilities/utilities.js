export function checkBoxOnChange(inputsValues, setInputsValues, name) {
  return ({ value, checked }) => {
    if (checked) {
      inputsValues[`${name ? name : "chooseCategories"}`].value.push(value);
    } else {
      inputsValues[`${name ? name : "chooseCategories"}`].value = inputsValues[
        `${name ? name : "chooseCategories"}`
      ].value.filter((category) => category !== value);
    }
    setInputsValues({ ...inputsValues });
  };
}

export function createFormData(inputs, files, filesKey) {
  const formData = new FormData();

  for (const key in inputs) {
    formData.append(key, inputs[key].value);
  }
  if (files) {
    for (let i = 0; i < files.length; i++) {
      formData.append(filesKey, files[i]);
    }
  }
  return formData;
}

function reverseString(str) {
  let output = "";
  for (let i = str.length - 1; i >= 0; i--) {
    output += str[i];
  }
  return output;
}

export function formatNumber(number) {
  number = number.toString();
  let output = "";
  let num = reverseString(number);
  for (let i = 0; i < num.length; i++) {
    if (i !== 0 && i % 3 === 0) {
      output += ",";
    }
    output += num[i];
  }
  return reverseString(output);
}

export function updateUserCategories() {
  const categories = {
    chooseCategories: {
      value: [],
    },
  };
  if (localStorage.getItem("currentUser")) {
    const { chooseCategories } = JSON.parse(
      localStorage.getItem("currentUser")
    );

    categories.chooseCategories.value = chooseCategories;
  }
  return categories;
}

export function extractValues(inputs) {
  const sendData = {};
  for (const key in inputs) {
    sendData[key] = inputs[key].value;
  }
  return sendData;
}
