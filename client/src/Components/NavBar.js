import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navbar, Nav, Badge } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import {
  faHeart,
  faUserCircle,
  faCarSide,
} from "@fortawesome/free-solid-svg-icons";
import { getIDsOfFaivoritesAds } from "../DAL/api";
import { useEffect, useState } from "react";
import { logOut } from "../DAL/api";
import { useCookies } from "react-cookie";

export default function MyNavbar({
  isLogIn,
  setIsLogIn,
  setShowLogIn,
  numberOfFavorites,
  location,
  setNumberOfFavories,
}) {
  const history = useHistory();
  const [cookies, setCookie] = useCookies(["token"]);
  const [activeLink, setActiveLike] = useState({
    register: {
      active: false,
    },
    home: {
      active: false,
    },
    myFavorites: {
      active: false,
    },
    myAds: {
      active: false,
    },
    "add-new-car": {
      active: false,
    },
    myProfile: {
      active: false,
    },
  });
  const { token } = cookies;
  const localData = JSON.parse(localStorage.getItem("currentUser"));
  async function getNumberOfLikes() {
    if (token) {
      const likes = await getIDsOfFaivoritesAds();
      setNumberOfFavories(likes.length);
    }
  }
  function activeLinkOnChange(path) {
    if (
      Object.keys(activeLink).includes(path.slice(1)) ||
      path === "/" ||
      path === "/add-new-car2"
    ) {
      const curentLocation = path.slice(1).includes("add-new-car")
        ? "add-new-car"
        : path.slice(1) === ""
        ? "home"
        : path.slice(1);

      activeLink[curentLocation].active = true;
    }
    setActiveLike({ ...activeLink });
  }

  function restActive() {
    for (const key in activeLink) {
      activeLink[key].active = false;
    }
  }

  useEffect(() => {
    restActive();
    getNumberOfLikes();
    activeLinkOnChange(location.pathname);
  }, [location.pathname]);
  return (
    <div style={{ backgroundColor: "#a7b9cb" }} className="main-nav">
      <Navbar className="nav-bar-main" collapseOnSelect expand="lg">
        <Navbar.Brand className="ml-3 title-nav">
          <FontAwesomeIcon
            data-aos="slide-left"
            icon={faCarSide}
            className="car-main-icon"
            style={{
              marginLeft: "5px",
              marginRight: "5px",
              color: "black",
              position: "relative",
              top: "4px",
              backgroundColor: "#a7b9cb",
            }}
          />{" "}
          {localData && <span>שלום , {localData.user}</span>}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="pr-3" activeKey={location.pathname}>
            {isLogIn && (
              <Link
                to="/myProfile"
                className={`nav-link ${
                  activeLink.myProfile.active ? "active-link " : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={faUserCircle}
                  style={{ fontSize: "20px", marginLeft: "5px" }}
                />
                הפרופיל שלי
              </Link>
            )}
            <Link
              to="/"
              className={`nav-link ${
                activeLink.home.active ? "active-link " : ""
              }`}
            >
              מודעות שפורסמו
            </Link>
            {isLogIn && (
              <Link
                to="/add-new-car"
                className={`nav-link ${
                  activeLink["add-new-car"].active ? "active-link " : ""
                }`}
              >
                פרסם מודעה חדשה
              </Link>
            )}

            {isLogIn && (
              <Link
                to="/myAds"
                className={`nav-link ${
                  activeLink.myAds.active ? "active-link " : ""
                }`}
              >
                מודעות שפרסמתי
              </Link>
            )}
          </Nav>

          <Nav className="mr-auto ">
            {isLogIn && (
              <Link
                className={`nav-link ${
                  activeLink.myFavorites.active ? "active-link " : ""
                }`}
                to="/myFavorites"
              >
                מודעות שאהבתי{" "}
                <FontAwesomeIcon
                  icon={faHeart}
                  style={{ color: "#dc3545", fontSize: "20px" }}
                />
                {!!numberOfFavorites && (
                  <Badge
                    data-aos="zoom-out"
                    className="count-likes"
                    pill
                    variant="danger"
                    style={{ fontSize: "11px" }}
                  >
                    {numberOfFavorites}
                  </Badge>
                )}
              </Link>
            )}
            {!isLogIn && (
              <Link
                className={`nav-link ${
                  activeLink.register.active ? "active-link " : ""
                }`}
                to="/register"
              >
                הירשם לאתר
              </Link>
            )}

            {!isLogIn && (
              <Nav.Link
                onClick={() => {
                  setShowLogIn(true);
                }}
              >
                התחבר
              </Nav.Link>
            )}
            {isLogIn && (
              <Nav.Link
                onClick={() => {
                  history.push("/");
                  logOut();
                  localStorage.clear();
                  setIsLogIn(false);
                }}
              >
                התנתק
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
