const serverHost = "http://localhost:5000";
export const carImageHost = "http://localhost:8000/images/";
const serverPython = "http://localhost:8000";

function initFetch(serverHost) {
  return async (
    urlRequest,
    method = "GET",
    data,
    contentType = "application/json",
    credentials = "include"
  ) => {
    const fetchObj = {
      method,
      headers: {
        "Access-Control-Allow-Origin": serverHost,
      },
    };
    if (method !== "GET") fetchObj.body = data;
    if (contentType) fetchObj.headers["Content-type"] = contentType;
    if (credentials) fetchObj.credentials = credentials;

    return fetch(`${serverHost}${urlRequest}`, fetchObj);
  };
}

const setFetch = initFetch(serverHost);
const fecthPython = initFetch(serverPython);

export async function getColorsOptions() {
  const data = await setFetch(`/cars/colors`);
  const colors = await data.json();
  return colors;
}

export async function getCities(serach, inputsValues, setInputsValues) {
  const cities = await fetchCities();
  const filterCities = cities.filter((city) => {
    return serach && city.startsWith(serach);
  });
  let isValid = true;

  inputsValues.city.cities = filterCities.slice(0, 5);
  if (filterCities.length === 0) {
    isValid = false;
  }

  inputsValues.city.isValid = isValid;
  setInputsValues({ ...inputsValues });
}
export async function getAdEditData(adID) {
  const respone = await setFetch(`/ads?adID=${adID}&editData=true`);
  const {
    status,
    data: [
      {
        codeAreaID: codeArea,
        gearID: gear,
        colorID: color,
        carprice: price,
        modelyear: year,
        ...rest
      },
    ],
  } = await respone.json();
  return {
    codeArea,
    gear,
    color,
    price,
    year: year.split("T")[0],
    ...rest,
  };
}
export async function andView(adID) {
  const respone = await fecthPython(`/ads/views/${adID}`, "PUT");
}
export async function getAds(orderBy, desc, categories, manufacturers, models) {
  const categoriesQuery = createQueryList(categories, "category");
  const manufacturersQuery = createQueryList(manufacturers, "manufacturerID");
  const modelsQuery = createQueryList(models, "modelID");

  // const data = await setFetch(
  //   `/ads?orderBy=${orderBy}&desc=${desc}${
  //     categoriesQuery ? `&${categoriesQuery}` : ""
  //   }${manufacturersQuery ? `&${manufacturersQuery}` : ""}${
  //     modelsQuery ? `&${modelsQuery}` : ""
  //   }`
  // );
  const test = await fecthPython(
    `/ads?${categoriesQuery ? `${categoriesQuery}` : ""}`
  );

  const ad = await test.json();
  // const ads = await data.json();
  return ad;
}

// export async function getCategories() {
//   const data = await fecthPython(
//   `/cars` )
//   const categories = await data.json();
//   return categories;
// }

function createQueryList(arrData, queryName) {
  let queryString = "";
  arrData.forEach((data, index, arr) => {
    if ((index === 0 && arr.length === 1) || index + 1 === arr.length) {
      queryString += `${queryName}=${data}`;
    } else {
      queryString += `${queryName}=${data}&`;
    }
  });
  return queryString;
}

export async function getModelsByManufacturers(manufacturers) {
  const manufacturersIds = manufacturers.map(({ manufacturerID }) => {
    return manufacturerID;
  });
  const categoriesQuery = createQueryList(manufacturersIds, "manufacturerID");

  const data = await setFetch(`/cars/models?${categoriesQuery}`);
  const models = await data.json();
  localStorage.setItem("models", JSON.stringify(models));
}

export async function getManufacturer(categoryID) {
  const data = await fecthPython(`/cars?category=${categoryID}`);

  const manufacturers = await data.json();

  return manufacturers;
}

export async function getModels(categoryID, manufacturerID) {
  const data = await fecthPython(
    `/cars?category=${categoryID}&manufacturer=${manufacturerID}`
  );
  const models = await data.json();
  return models;
}

export async function getGears() {
  const data = await setFetch(`/cars/gears`);
  const gears = await data.json();
  return gears;
}

async function getAllManufacturers() {
  const data = await setFetch(`/cars/manufacturers`);
  const manufacturers = await data.json();

  return manufacturers;
}

export async function searchManufacturers(searchText, selectList) {
  let manufacturers;
  if (localStorage.getItem("manufacturers")) {
    manufacturers = JSON.parse(localStorage.getItem("manufacturers"));
  } else {
    manufacturers = await getAllManufacturers();
    localStorage.setItem("manufacturers", JSON.stringify(manufacturers));
  }

  const idsSelected = selectList.map(({ manufacturerID }) => {
    return manufacturerID;
  });
  return manufacturers.filter(({ manufacturerName, manufacturerID }) => {
    return (
      manufacturerName.toLowerCase().startsWith(searchText.toLowerCase()) &&
      !idsSelected.includes(manufacturerID)
    );
  });
}

function fetchCities() {
  return fetch(
    "https://data.gov.il/api/3/action/datastore_search?resource_id=5c78e9fa-c2e2-4771-93ff-7f400a12f7ba&limit=1271"
  )
    .then((resopne) => resopne.json())
    .then((result) =>
      result.result.records
        .filter((obj) => {
          return !(
            obj["שם_ישוב"].includes("(") || obj["שם_ישוב"].includes(")")
          );
        })
        .map((data) => data["שם_ישוב"])
    );
}

export async function logInCheck(email, password) {
  const respone = await fecthPython(
    `/logIn`,
    "POST",
    JSON.stringify({
      email,
      password,
    })
  );
  const data = await respone.json();
  console.log(data.data);
  if (data.status === "ok") return Promise.resolve(data.data);
  return Promise.reject(data.message);
}

export async function getAdByID(adID, edit = false) {
  const respone = await fecthPython(`/ads?adId=${adID}`);
  const { status, data } = await respone.json();

  const [
    {
      adid: id,
      manufacturername: manufacturer,
      gearname: gear,
      modelname: model,
      colorname: color,
      modelyear: year,
      codeArea,
      carprice: price,
      ...rest
    },
  ] = data;
  const adData = {
    data: {
      id,
      manufacturer,
      gear,
      model,
      color,
      year,
      price,
      ...rest,
    },
    status,
  };
  if (!edit) {
    const phone = `${codeArea}-${rest.phone}`;
    adData.data.phone = phone;
  } else {
    adData.data.codeArea = codeArea;
    adData.data.moreDetails = adData.data.description;
  }

  return adData;
}
export async function deleteAd(adID) {
  const respone = await fecthPython(`/ads/${adID}`, "DELETE");
  return respone.json;
}

export async function sendNewUser(userData) {
  const respone = await fecthPython(
    `/users`,
    "POST",
    JSON.stringify({
      ...userData,
    })
  );

  const data = await respone.json();
  return data;
}

export async function updateUserDeatils(inputsValues) {
  const respone = await fecthPython(
    `/users`,
    "PUT",

    JSON.stringify({ ...inputsValues })
  );

  return respone.json();
}

export async function sendNewAD(adFormData) {
  const respone = await fecthPython(`/ads`, "POST", adFormData, "");

  return respone.json();
}

export async function sendUpdateAdDate(adFormData, adId) {
  const respone = await fecthPython(`/ads/${adId}`, "PUT", adFormData, "");
  return respone.json();
}

export async function getMyAds() {
  try {
    const data = await fecthPython(`/ads/myAds`);
    const myAds = await data.json();
    return myAds;
  } catch (err) {
    console.log(err);
  }
}

export async function getMyFaivoritesAds() {
  const respone = await fecthPython(`/ads/favorites`);

  const data = await respone.json();
  const { adsIds, ads } = data;

  return [adsIds, ads];
}

export async function getUserDetails() {
  const respone = await setFetch("/users");
  const userData = await respone.json();
  return userData;
}

export async function canEditAd(adID) {
  const respone = await setFetch(`/ads/can-edit?adID=${adID}`);
  const data = await respone.json();
  return data;
}

export async function getIDsOfFaivoritesAds() {
  // const respone = await setFetch(`/ads/favorites`);
  const respone = await fecthPython(`/ads/favorites`);
  // const test = await python.json();
  const data = await respone.json();

  if (data.status === "ok") return data.adsIds;
  return [];
}
export async function logOut() {
  await setFetch("/users/logOut");
}
export async function validToken() {
  // const respone = await setFetch("/users/token");
  const test = await fecthPython("/token");
  return test.json();
}

export async function addNewFavoritesAd(adID) {
  const respone = await fecthPython(`/ads/favorites/${adID}`, "PUT");
  // const respone = await setFetch(
  //   `/ads/favorites`,
  //   "POST",
  //   JSON.stringify({
  //     adID,
  //   })
  // );
  const data = await respone.json();

  return data;
}

export async function removeAdFromFavorites(adID) {
  // const respone = await setFetch(
  //   `/ads/favorites`,
  //   "DELETE",
  //   JSON.stringify({
  //     adID,
  //   })
  // );

  const respone = await fecthPython(`/ads/favorites/${adID}`, "DELETE");

  // const data = await respone.json();
  const data = await respone.json();
  return data;
}
