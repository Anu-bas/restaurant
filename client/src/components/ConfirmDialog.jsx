import { Modal } from 'react-bootstrap';

const ConfirmDialog = ({ show, title, body, confirmLabel = 'Delete', onConfirm, onHide }) => (
  <Modal show={show} onHide={onHide} centered size="sm">
    <Modal.Header closeButton>
      <Modal.Title style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem' }}>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{body}</Modal.Body>
    <Modal.Footer>
      <button className="btn btn-ghost" onClick={onHide}>
        Keep it
      </button>
      <button className="btn btn-brand" onClick={onConfirm}>
        {confirmLabel}
      </button>
    </Modal.Footer>
  </Modal>
);

export default ConfirmDialog;
