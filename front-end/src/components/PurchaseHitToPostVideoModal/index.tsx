import { Button, Form, InputGroup, Modal } from 'react-bootstrap'
import cx from 'classnames'
import { ChangeEvent, useCallback, useState } from 'react'
import _ from 'lodash'

import styles from './layout.module.css'
import { message } from 'antd'

interface Props {
  hitCount: number
  balanceHit: number
  onClose: () => void
  onConfirm: () => void
}

const PurchaseHitToPostVideoModal = (props: Props) => {
  const { hitCount, balanceHit, onClose, onConfirm } = props

  const [inputHitCount, setInputHitCount] = useState('')
  const [isHitCountValid, setIsHitCountValid] = useState(true)
  const [hasValidatedForm, setHasValidatedForm] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)

  const handleInputHitCount = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = _.trim(e.currentTarget.value)
    if (currentValue === '' || /^[1-9]\d*$/.test(currentValue) === true) {
      setInputHitCount(currentValue)
    }
  }, [])

  const handleClickConfirmPurchaseButton = useCallback(() => {
    // let isFormValid = true

    // if (inputHitCount !== '') {
    //   setIsHitCountValid(false)
    //   isFormValid = false
    // } else {
    //   setIsHitCountValid(true)
    // }

    // setHasValidatedForm(true)
    // if (isFormValid === false) {
    //   return
    // }

    setIsPurchasing(true)

    if (hitCount > balanceHit) {
      onClose()
      message.warning('HIT is not enough')
      return
    }

    onConfirm()
  }, [balanceHit, hitCount, onClose, onConfirm])

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
          <Form
            noValidate
            validated={hasValidatedForm}
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
                required
                pattern='^[1-9]\d*$'
                autoComplete='off'
                disabled={true}
                value={hitCount}
                onChange={handleInputHitCount}
              />
              <InputGroup.Text>HIT</InputGroup.Text>
            </InputGroup>
            {isHitCountValid === false && (
              <Form.Control.Feedback type='invalid'>Please input the count of POT</Form.Control.Feedback>
            )}
            <span className={cx('', styles.hitCountInBalance)}>Balance: {balanceHit} HIT</span>
          </Form>
          <Button
            className={cx(styles.purchaseButton)}
            onClick={handleClickConfirmPurchaseButton}
            disabled={isPurchasing}
          >
            {isPurchasing ? 'Purchasing' : 'Purchase'}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default PurchaseHitToPostVideoModal
