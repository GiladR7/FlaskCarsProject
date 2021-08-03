import { Carousel } from "react-bootstrap";
import carDefaultPhoto from "../images/buyCar2.jpg";
import { carImageHost } from "../DAL/api";

export default function CarouselCar({ images }) {
  if (images.length) {
    return (
      <Carousel fade>
        {images.map((image, index) => {
          return (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100 img-carusel"
                src={`${carImageHost}${image}`}
                alt="car-img"
              />
            </Carousel.Item>
          );
        })}
      </Carousel>
    );
  }
  return (
    <Carousel fade>
      <Carousel.Item>
        <img
          className="d-block w-100 img-carusel"
          src={carDefaultPhoto}
          alt="car-img"
        />
      </Carousel.Item>
    </Carousel>
  );
}
