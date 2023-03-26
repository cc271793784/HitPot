import cx from 'classnames'
import { ChangeEvent, useCallback, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import _ from 'lodash'

import styles from './layout.module.css'

import { VideoDetailInfo } from 'web-api/video'
import { purchaseContentNFT } from 'web-api/wallet'
import { message } from 'antd'

interface Props {
  onClose: () => void
  videoInfo: VideoDetailInfo
}

const BuyIPNFTModal = (props: Props) => {
  const { videoInfo, onClose } = props

  const [nftCount, setNFTCount] = useState('')
  const [hasValidatedForm, setHasValidatedForm] = useState(false)
  const [isNFTCountValid, setIsNFTCountValid] = useState(true)
  const [totalPrice, setTotalPrice] = useState(0)
  const [isPurchasing, setIsPurchasing] = useState(false)

  const handleInputNFTCount = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const currentValue = _.trim(e.currentTarget.value)
      if (currentValue === '' || /^[1-9]\d*$/.test(currentValue) === true) {
        setNFTCount(currentValue)
        if (currentValue !== '') {
          setTotalPrice(parseInt(currentValue, 10) * videoInfo.priceIpNft)
        } else {
          setTotalPrice(0)
        }
      }
    },
    [videoInfo.priceIpNft],
  )

  const handleClickConfirmPurchaseButton = useCallback(() => {
    let isFormValid = true
    if (nftCount === '') {
      isFormValid = false
      setIsNFTCountValid(false)
    }

    setHasValidatedForm(true)
    if (isFormValid === false) {
      return
    }

    setIsPurchasing(true)
    purchaseContentNFT(totalPrice, videoInfo.contentId, parseInt(nftCount, 10))
      .then(() => {
        onClose()
        message.success('Buy successful')
      })
      .catch(() => {
        message.error('Buy failed')
      })
      .finally(() => {
        setIsPurchasing(false)
      })
  }, [nftCount, onClose, totalPrice, videoInfo.contentId])

  return (
    <Modal
      show={true}
      onHide={onClose}
      centered
      dialogClassName={cx(styles.buyNftModal)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Buy IP NFT</Modal.Title>
      </Modal.Header>
      <Modal.Body className={cx('')}>
        <div
          className={cx('d-flex flex-column justify-content-between align-items-center', styles.modalBodyContentWrap)}
        >
          <div className={cx('w-100 d-flex justify-content-between')}>
            <div className={cx('d-flex flex-column align-items-start', styles.nftPriceWrap)}>
              <div className={cx(styles.floorPriceTitle)}>floor price</div>
              <div className={cx('h4 mt-1 mb-0', styles.floorPrice)}>{videoInfo.priceIpNft} POT</div>
            </div>
            <div className={cx('d-flex flex-column align-items-start', styles.nftVolumeWrap)}>
              <div className={cx(styles.volumeTitle)}>volume</div>
              <div className={cx('d-flex  mt-1', styles.volume)}>
                {videoInfo.countIpNftLeft === 0 ? (
                  <div className={cx('h4 mb-0', styles.totalVolume)}>SOLD OUT</div>
                ) : (
                  <>
                    <div className={cx('h4 mb-0', styles.restVolume)}>{videoInfo.countIpNftLeft}</div>
                    <div className={cx('h4 mb-0', styles.restVolume)}>&nbsp;/&nbsp;</div>
                    <div className={cx('h4 mb-0', styles.totalVolume)}>{videoInfo.countIpNft}</div>
                  </>
                )}
              </div>
            </div>
          </div>
          <Form
            noValidate
            validated={hasValidatedForm}
            className={cx('w-100', styles.formWrap)}
          >
            <Form.Group className={cx('')}>
              <Form.Label htmlFor='input-eth-count'>
                <span className={cx('f-flex align-items-center')}>
                  IP NFT volume (max <span className={cx(styles.maxVolume)}>{videoInfo.countMaxLimitPerInvestor}</span>)
                </span>
              </Form.Label>
              <Form.Control
                id='input-eth-count'
                value={nftCount}
                placeholder=''
                required
                pattern='^[1-9]\d*$'
                autoComplete='off'
                disabled={videoInfo.countIpNftLeft === 0 || isPurchasing}
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
              disabled={videoInfo.countIpNftLeft === 0 || isPurchasing}
            >
              {isPurchasing ? 'Purchasing' : 'Purchase'}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default BuyIPNFTModal
