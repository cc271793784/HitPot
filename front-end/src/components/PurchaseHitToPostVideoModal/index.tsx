import { Button, Form, InputGroup, Modal } from 'react-bootstrap'
import cx from 'classnames'

import styles from './layout.module.css'

interface Props {
  onClose: () => void
}

const PurchaseHitToPostVideoModal = (props: Props) => {
  const { onClose } = props

  return (
    <Modal
      show={true}
      onHide={onClose}
      centered
      dialogClassName={cx('', styles.purchaseHitModal)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Purchase to post</Modal.Title>
      </Modal.Header>
      <Modal.Body className={cx('d-flex flex-column align-items-center')}>
        <div
          className={cx('d-flex flex-column justify-content-between align-items-center', styles.purchaseHitBodyWrap)}
        >
          <div
            className={cx('d-flex flex-column justify-content-between align-items-start', styles.purchaseHitInputWrap)}
          >
            <Form.Label
              htmlFor='input-hit-count'
              className={cx(styles.inputTitle)}
            >
              Purchase to post
            </Form.Label>
            <InputGroup className=''>
              <Form.Control
                id='input-hit-count'
                placeholder=''
              />
              <InputGroup.Text>HIT</InputGroup.Text>
            </InputGroup>
            <span className={cx('', styles.hitCountInBalance)}>Balance : 317284 HIT</span>
          </div>
          <Button
            className={cx(styles.purchaseButton)}
            onClick={() => {}}
            disabled={false}
          >
            Purchase
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default PurchaseHitToPostVideoModal
