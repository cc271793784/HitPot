import { Button, Form, InputGroup, Modal } from 'react-bootstrap'
import cx from 'classnames'
import { ChangeEvent, SyntheticEvent, useCallback, useEffect, useState } from 'react'
import _ from 'lodash'

import styles from './layout.module.css'

import * as walletApi from 'web-api/wallet'
import { message } from 'antd'
import { syncWalletInfoFromWebApi } from 'stores/walletHelpers'

interface Props {
  onClose: () => void
}

const BuyHitModal = (props: Props) => {
  const { onClose } = props

  const [hitCount, setHitCount] = useState('')
  const [hitPrice, setHitPrice] = useState('')
  const [isHitCountValid, setIsHitCountValid] = useState(true)
  const [isHitPriceValid, setIsHitPriceValid] = useState(true)
  const [hasValidatedBuyHit, setHasValidatedBuyHit] = useState(false)
  const [latestPriceOfHit, setLatestPriceOfHit] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [isPurchasing, setIsPurchasing] = useState(false)

  const handleInputHitCount = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newHitCount = _.trim(e.currentTarget.value)
      if (newHitCount === '' || /^[1-9]\d*$/.test(newHitCount) === true) {
        setHitCount(newHitCount)
        setTotalPrice(parseInt(newHitCount || '0', 10) * parseFloat(hitPrice || '0'))
      }
    },
    [hitPrice],
  )

  const handleInputHitPrice = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newHitPrice = _.trim(e.currentTarget.value)
      if (newHitPrice === '' || /^0$|^0\.\d*$|^[1-9]\d*$|^[1-9]\d*\.\d*$/.test(newHitPrice) === true) {
        setHitPrice(newHitPrice)
        setTotalPrice(parseInt(hitCount || '0', 10) * parseFloat(newHitPrice || '0'))
      }
    },
    [hitCount],
  )

  const handleClickConfirmBuyHitButton = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault()

      let isFormInputsValid = true
      if (hitCount === '') {
        isFormInputsValid = false
        setIsHitCountValid(false)
      } else {
        setIsHitCountValid(true)
      }
      if (hitPrice === '') {
        isFormInputsValid = false
        setIsHitPriceValid(false)
      } else {
        setIsHitPriceValid(true)
      }

      setHasValidatedBuyHit(true)
      if (isFormInputsValid === false) {
        return
      }

      setIsPurchasing(true)
      walletApi
        .exchangeHit(parseInt(hitCount, 10), parseFloat(hitPrice))
        .then(() => {
          onClose()
          setTimeout(() => {
            syncWalletInfoFromWebApi()
          }, 1000)
          message.success(`Successfully purchased ${hitCount} HIT`)
        })
        .catch(() => {
          message.success(`Purchase failed`)
        })
        .finally(() => {
          setIsPurchasing(false)
        })
    },
    [hitCount, hitPrice, onClose],
  )

  const handleModalHide = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    const getHitPrice = () => {
      walletApi
        .priceOfHit()
        .then((result) => {
          setLatestPriceOfHit(result.price)
        })
        .catch((e) => {})
    }
    getHitPrice()
    const timer = setInterval(getHitPrice, 5000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <Modal
      show={true}
      onHide={handleModalHide}
      centered
      backdrop='static'
      keyboard={false}
      dialogClassName={cx('', styles.buyHitModal)}
    >
      <Modal.Header closeButton>
        <Modal.Title className={cx('h5')}>Buy HIT</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          noValidate
          validated={hasValidatedBuyHit}
          className={cx('d-flex flex-column align-items-center', styles.buyHitFormWrap)}
        >
          <Form.Group className={cx('w-100')}>
            <Form.Label
              htmlFor='input-hit-count'
              className={cx(styles.inputHitCountTitle)}
            >
              Buy HIT
            </Form.Label>
            <InputGroup>
              <Form.Control
                id='input-hit-count'
                value={hitCount}
                placeholder=''
                required
                pattern='^[1-9]\d*$'
                autoComplete='off'
                disabled={isPurchasing}
                onChange={handleInputHitCount}
              />
              <InputGroup.Text>HIT</InputGroup.Text>
              {isHitCountValid === false && (
                <Form.Control.Feedback type='invalid'>Please input the count of HIT</Form.Control.Feedback>
              )}
            </InputGroup>
          </Form.Group>
          <Form.Group className={cx('w-100 mt-3')}>
            <Form.Label
              htmlFor='input-hit-price'
              className={cx(styles.inputHitPriceTitle)}
            >
              Price
            </Form.Label>
            <InputGroup>
              <Form.Control
                id='input-hit-price'
                value={hitPrice}
                placeholder=''
                required
                pattern='^0$|^0\.\d*$|^[1-9]\d*$|^[1-9]\d*\.\d*$'
                autoComplete='off'
                disabled={isPurchasing}
                onChange={handleInputHitPrice}
              />
              <InputGroup.Text>POT</InputGroup.Text>
              {isHitPriceValid === false && (
                <Form.Control.Feedback type='invalid'>Please input the price of HIT</Form.Control.Feedback>
              )}
              <p className={cx(styles.latestHitPrice)}>Latest price: 1 HIT = {latestPriceOfHit} POT</p>
            </InputGroup>
          </Form.Group>
          <div className={cx('w-100 d-flex justify-content-between align-items-center mt-4')}>
            <span className={cx('h4 mb-0 d-flex align-items-center', styles.buyHitTotalPrice)}>
              {'≈ '}
              <span
                className={cx(styles.totalPriceNumber)}
                title={`${totalPrice}`}
              >
                {totalPrice}
              </span>
              {' POT'}
            </span>
            <Button
              type='submit'
              className={cx(styles.confirmBuyHitButton)}
              onClick={handleClickConfirmBuyHitButton}
              disabled={isPurchasing}
            >
              {isPurchasing ? 'Purchasing' : 'Purchase'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default BuyHitModal
