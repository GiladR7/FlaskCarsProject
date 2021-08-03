import { useContext, useEffect, useState } from "react";
import { Container, Alert } from "react-bootstrap";
import { getAds, getIDsOfFaivoritesAds } from "../DAL/api";
import CarItem from "../Components/CarItem";
import { checkBoxOnChange } from "../utilities/utilities";
import FilterCars from "../Components/FilterCars";
import { AdsContext } from "../Context/HomePageContext";
import { Spinner } from "react-bootstrap";
import { updateUserCategories } from "../utilities/utilities";
import Aos from "aos";
import "aos/dist/aos.css";
export default function HomePage({ setCountFavoritesAds, isLogIn }) {
  const [spiner, setSpiner] = useState(true);
  const [ads, setAds] = useState([]);
  const {
    orderHeigher,
    orderBy,
    modelFilter,
    manufacturerFilter,
    checkBoxValues,
    setCheckBoxValues,
    message,
  } = useContext(AdsContext);

  useEffect(() => {
    Aos.init({ duration: 1500 });
  }, []);

  const [likeAds, setLikeAds] = useState([]);

  function removeAd(adId) {
    const adsAfterRemove = ads.filter(({ adid: adIdFromState }) => {
      return adIdFromState !== adId;
    });
    setAds([...adsAfterRemove]);
  }

  useEffect(() => {
    if (isLogIn) {
      const {
        chooseCategories: { value },
      } = updateUserCategories();
      checkBoxValues.chooseCategories.value = value;
      setCheckBoxValues((checkBoxValues) => {
        return { ...checkBoxValues };
      });
      getLikeAdsIds();
    }
  }, [isLogIn]);

  useEffect(() => {
    async function showAds() {
      setSpiner(true);
      setAds([]);
      const manufacturerIDs = manufacturerFilter.map(({ manufacturerID }) => {
        return manufacturerID;
      });
      const modelIDs = modelFilter.map(({ modelID }) => {
        return modelID;
      });
      const respone = await getAds(
        orderBy,
        orderHeigher,
        checkBoxValues.chooseCategories.value,
        manufacturerIDs,
        modelIDs
      );

      if (respone.status === "ok") {
        setAds([...respone.data]);
      } else {
        setAds([]);
      }
      setSpiner(false);
    }
    showAds();
  }, [
    orderBy,
    orderHeigher,
    checkBoxValues,
    manufacturerFilter,
    modelFilter,
    isLogIn,
  ]);

  async function getLikeAdsIds() {
    const adsIds = await getIDsOfFaivoritesAds();

    setLikeAds([...adsIds]);
    setCountFavoritesAds(adsIds.length);
  }
  const updateCheckBoxSelected = checkBoxOnChange(
    checkBoxValues,
    setCheckBoxValues
  );

  return (
    <Container className="homep-page-container">
      {message && (
        <Alert data-aos="zoom-in" className="regiser-message" variant="success">
          {message}
        </Alert>
      )}
      <FilterCars
        checkBoxValues={checkBoxValues}
        updateCheckBoxSelected={updateCheckBoxSelected}
      />

      <div className="d-flex flex-wrap  car-items-container">
        {ads.map((ad, index) => {
          return (
            <CarItem
              key={index}
              cardDetails={ad}
              likesIDs={likeAds}
              setLikeAdsIDs={setLikeAds}
              updateLikesNav={setCountFavoritesAds}
              removeAd={removeAd}
            />
          );
        })}
      </div>

      {!ads.length && !spiner && (
        <div
          className="message-like-ads"
          style={{ maxWidth: "1195px", margin: "0px auto" }}
        >
          <h2>לא נמצאו תוצאות</h2>
        </div>
      )}
      {spiner && (
        <div className="text-center">
          <Spinner animation="border" role="status"></Spinner>
        </div>
      )}
    </Container>
  );
}
