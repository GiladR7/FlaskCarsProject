import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { Container } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

import EditCarAd from "./Components/EditCarAd";
import MyProfile from "./MyProfilePage/MyProfile";
import MyAds from "./MyAdsPage/MyAds";
import Registration from "./RegisterPage/RegistrationPage";
import AddCarParse1 from "./AddCarPostPage/AddCar";
import AddCarParse2 from "./AddCarPostPage/AddCarParse2";
import LogIn from "./LogIn";
import FavoritesAdsPage from "./FavoritesPage/FavoritesAds";
import MyNavbar from "./Components/NavBar";
import HomePage from "./HomePage/HomePage";
import CarDetails from "../src/Components/CarDetails";
import { useCookies } from "react-cookie";
import { useTransition, animated } from "react-spring";
import { tokenValidtion } from "./utilities/validationsFunc";

function App() {
  const [showLogIng, setShowLogIn] = useState(false);
  const [isLogIn, setIsLogIn] = useState(false);
  const [cookies, setCookie] = useCookies(["token"]);
  const { token } = cookies;

  async function checkIfLogIn() {
    if (token) {
      const logIn = await tokenValidtion();
      if (logIn) {
        setIsLogIn(true);
      } else {
        localStorage.clear();
        setIsLogIn(false);
      }
    }
  }
  useEffect(() => {
    checkIfLogIn();
  }, []);

  function closePopUp() {
    setShowLogIn(false);
  }

  const transition = useTransition(showLogIng, {
    from: { opacity: 0, y: -200 },
    enter: { opacity: 1, y: 30 },
    leave: { opacity: 0, y: -200 },
  });
  const [countFavoritesAds, setCountFavoritesAds] = useState(0);

  const NavBar = withRouter(MyNavbar);
  return (
    <>
      <Router>
        <NavBar
          isLogIn={isLogIn}
          setIsLogIn={setIsLogIn}
          setShowLogIn={setShowLogIn}
          numberOfFavorites={countFavoritesAds}
          setNumberOfFavories={setCountFavoritesAds}
        />
        <Container>
          {transition((style, item) =>
            item ? (
              <animated.div style={style} className="log-in-pop">
                <LogIn closePopUp={closePopUp} setIsLogIn={setIsLogIn} />
              </animated.div>
            ) : (
              ""
            )
          )}
        </Container>
        <Switch>
          <Route exact path="/">
            <HomePage
              setCountFavoritesAds={setCountFavoritesAds}
              isLogIn={isLogIn}
            />
          </Route>
          <Route path="/:id/car-details">
            <CarDetails />
          </Route>
          <Route path="/:id/editAd">
            <EditCarAd />
          </Route>
          <Route path="/register">
            <Registration />
          </Route>
          <Route path="/add-new-car">
            <AddCarParse1 />
          </Route>
          <Route path="/add-new-car2">
            <AddCarParse2 />
          </Route>
          <Route path="/myFavorites">
            <FavoritesAdsPage setCountFavoritesAds={setCountFavoritesAds} />
          </Route>
          <Route path="/myProfile">
            <MyProfile />
          </Route>
          <Route path="/myAds">
            <MyAds />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
