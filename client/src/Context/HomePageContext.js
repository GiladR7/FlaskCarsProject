import { createContext, useState } from "react";
import { updateUserCategories } from "../utilities/utilities";
export const AdsContext = createContext();

export function HomePageAdsProvider(props) {
  const [checkBoxValues, setCheckBoxValues] = useState(() => {
    return updateUserCategories();
  });

  const [orderHeigher, setOrderHeigher] = useState("true");
  const [orderBy, setOrdetBy] = useState("adDate");
  const [manufacturerFilter, setManufacturerFilter] = useState([]);
  const [modelFilter, setModelFilter] = useState([]);
  const [message, setMessage] = useState("");

  return (
    <AdsContext.Provider
      value={{
        orderHeigher,
        setOrderHeigher,
        orderBy,
        setOrdetBy,
        modelFilter,
        setModelFilter,
        manufacturerFilter,
        setManufacturerFilter,
        checkBoxValues,
        setCheckBoxValues,
        message,
        setMessage,
      }}
    >
      {props.children}
    </AdsContext.Provider>
  );
}
