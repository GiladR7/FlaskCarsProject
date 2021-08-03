import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { deleteAd } from "../DAL/api";

export default function RemoveAd({ adId, removeAd }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const deleteRequest = async () => {
    removeAd(adId);
    await deleteAd(adId);
    setShow(false);
  };

  return (
    <>
      <FontAwesomeIcon
        onClick={handleShow}
        className="remove-item"
        style={{
          cursor: "pointer",
          backgroundColor: "white",
          borderRadius: "50%",
        }}
        icon={faMinusCircle}
      ></FontAwesomeIcon>

      <Modal show={show} onHide={handleClose} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>אתה בטוח שברצונך למחוק את המודעה?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            סגור
          </Button>
          <Button variant="primary" onClick={deleteRequest}>
            מחק
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
