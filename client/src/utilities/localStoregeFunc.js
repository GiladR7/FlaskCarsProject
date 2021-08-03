export function getItemLocal(
  itemName,
  objName,
  disableBtn,
  inputsValues,
  setIsDisable
) {
  if (
    localStorage.getItem(itemName) &&
    JSON.parse(localStorage.getItem(itemName))[objName]
  ) {
    const { [objName]: inputData, [disableBtn]: canMovePage } = JSON.parse(
      localStorage.getItem(itemName)
    );
    setIsDisable(canMovePage);

    return inputData;
  } else {
    const adData = localStorage.getItem(itemName)
      ? JSON.parse(localStorage.getItem(itemName))
      : {};
    if (objName !== "adDetails") {
      adData[objName] = { ...inputsValues };
      adData[disableBtn] = true;
      localStorage.setItem(itemName, JSON.stringify(adData));
    }

    return inputsValues;
  }
}

export function updateLocalStorege(
  BtnDisable,
  objLocalName,
  updateKey,
  updateWith
) {
  return (isDisable = true) => {
    const localData = JSON.parse(localStorage.getItem(objLocalName));
    localData[updateKey] = { ...updateWith };
    localData[BtnDisable] = isDisable;
    localStorage.setItem(objLocalName, JSON.stringify(localData));
  };
}
