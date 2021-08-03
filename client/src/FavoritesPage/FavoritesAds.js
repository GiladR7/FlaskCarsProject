import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getMyFaivoritesAds } from "../DAL/api";
import CarItem from "../Components/CarItem";
import { tokenValidtion } from "../utilities/validationsFunc";
import { useHistory } from "react-router";
import Aos from "aos";
import "aos/dist/aos.css";
export default function FavoritesAdsPage({ setCountFavoritesAds }) {
  const [spiner, setSpiner] = useState(true);
  const [myFavoriesAds, setMyFavoriesAds] = useState([]);
  const [adsIDs, setAdsIDs] = useState([]);
  const history = useHistory();
  function removeAdFromState(id) {
    const updateFavorites = myFavoriesAds.filter(({ adid: currentAdId }) => {
      return currentAdId !== id;
    });
    setMyFavoriesAds([...updateFavorites]);
  }
  const getFavorites = async () => {
    const isLogIn = await tokenValidtion(history);
    if (isLogIn) {
      const [adsIDs, adsData] = await getMyFaivoritesAds();
      setMyFavoriesAds([...adsData]);
      setAdsIDs([...adsIDs]);
      setSpiner(false);
    }
  };

  useEffect(() => {
    getFavorites();
  }, []);

  useEffect(() => {
    Aos.init({ duration: 1500 });
  }, []);

  return (
    <Container fluid="sm" data-aos="fade-down">
      <div className="header-like-ads mb-3">
        <h1>מודעות שאהבתי</h1>
        <FontAwesomeIcon icon={faHeart} />
      </div>

      {!myFavoriesAds.length && !spiner && (
        <div className="message-like-ads">
          <h2>לא הוספת מודעות לרשימה</h2>
        </div>
      )}
      {spiner && (
        <div className="text-center">
          <Spinner animation="border" role="status"></Spinner>
        </div>
      )}
      <div className="d-flex flex-wrap  car-items-container">
        {myFavoriesAds.map((ad, index) => {
          return (
            <CarItem
              key={index}
              updateLikesNav={setCountFavoritesAds}
              removeAdFromState={removeAdFromState}
              cardDetails={ad}
              setLikeAdsIDs={setAdsIDs}
              likesIDs={adsIDs}
              showLike={true}
            />
          );
        })}
      </div>
    </Container>
  );
}
