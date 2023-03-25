import cx from 'classnames'
import { ChangeEvent, useCallback, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

import styles from './layout.module.css'

interface Props {
  onClose: () => void
  price: number
  restVolume: number
  totalVolume: number
}

const BuyIPNFTModal = (props: Props) => {
  const { price, restVolume, totalVolume, onClose } = props

  const [nftCount, setNFTCount] = useState('')
  const [hasValidatedNFTCount, setHasValidatedNFTCount] = useState(false)
  const [isNFTCountValid, setIsNFTCountValid] = useState(true)
  const [totalPrice, setTotalPrice] = useState(0)

  const handleInputNFTCount = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const currentValue = e.currentTarget.value
      if (currentValue === '' || /^[1-9]\d*$/.test(currentValue) === true) {
        setNFTCount(currentValue)
        if (currentValue !== '') {
          setTotalPrice(parseInt(currentValue, 10) * price)
        } else {
          setTotalPrice(0)
        }
      }
    },
    [price],
  )

  const handleClickConfirmPurchaseButton = useCallback(() => {
    setHasValidatedNFTCount(true)
    setIsNFTCountValid(false)
  }, [])

  return (
    <Modal
      show={true}
      onHide={onClose}
      centered
      dialogClassName={cx(styles.buyNftModal)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Donate</Modal.Title>
      </Modal.Header>
      <Modal.Body className={cx('')}>
        <div
          className={cx('d-flex flex-column justify-content-between align-items-center', styles.modalBodyContentWrap)}
        >
          <div className={cx('w-100 d-flex justify-content-between')}>
            <div className={cx('d-flex flex-column align-items-start', styles.nftPriceWrap)}>
              <div className={cx(styles.floorPriceTitle)}>floor price</div>
              <div className={cx('h4 mt-1 mb-0', styles.floorPrice)}>400 POT</div>
            </div>
            <div className={cx('d-flex flex-column align-items-start', styles.nftVolumeWrap)}>
              <div className={cx(styles.volumeTitle)}>volume</div>
              <div className={cx('d-flex  mt-1', styles.volume)}>
                {restVolume === 0 ? (
                  <div className={cx('h4 mb-0', styles.totalVolume)}>SOLD OUT</div>
                ) : (
                  <>
                    <div className={cx('h4 mb-0', styles.restVolume)}>{restVolume}</div>
                    <div className={cx('h4 mb-0', styles.restVolume)}>&nbsp;/&nbsp;</div>
                    <div className={cx('h4 mb-0', styles.totalVolume)}>{totalVolume}</div>
                  </>
                )}
              </div>
            </div>
          </div>
          <Form
            noValidate
            validated={hasValidatedNFTCount}
            className={cx('w-100', styles.formWrap)}
          >
            <Form.Group className={cx('')}>
              <Form.Label htmlFor='input-eth-count'>
                <span className={cx('f-flex align-items-center')}>
                  IP NFT volume (max <span className={cx(styles.maxVolume)}>50</span>)
                </span>
              </Form.Label>
              <Form.Control
                id='input-eth-count'
                value={nftCount}
                placeholder=''
                required
                pattern='^[1-9]\d*$'
                autoComplete='off'
                disabled={restVolume === 0}
                onChange={handleInputNFTCount}
              />
              {isNFTCountValid === false && (
                <Form.Control.Feedback type='invalid'>Please input the count of POT</Form.Control.Feedback>
              )}
            </Form.Group>
          </Form>
          <div className={cx('w-100 d-flex justify-content-between align-items-center', styles.buttonsWrap)}>
            <span>{totalPrice}&nbsp;POT</span>
            <Button
              variant='primary'
              className={cx(styles.purchaseButton)}
              onClick={handleClickConfirmPurchaseButton}
              disabled={restVolume === 0}
            >
              Purchase
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default BuyIPNFTModal
