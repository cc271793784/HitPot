import cx from 'classnames'
import { ChangeEvent, useCallback, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { message } from 'antd'
import _ from 'lodash'

import styles from './layout.module.css'

import walletStore from 'stores/wallet'
import * as walletApi from 'web-api/wallet'
import { VideoDetailInfo } from 'web-api/video'

interface Props {
  onClose: () => void
  videoInfo: VideoDetailInfo
}

const AddHitToVideoModal = (props: Props) => {
  const { videoInfo, onClose } = props

  const [hitCount, setHitCount] = useState('')
  const [adLink, setAdLink] = useState('')
  const [adTitle, setAdTitle] = useState('')
  const [isHitCountValid, setIsHitCountValid] = useState(true)
  const [isAdLinkValid, setIsAdLinkValid] = useState(true)
  const [isAdTitleValid, setIsAdTitleValid] = useState(true)
  const [hasValidatedForm, setHasValidatedNFTCount] = useState(false)

  const handleInputHitCount = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = _.trim(e.currentTarget.value)
    if (currentValue === '' || /^[1-9]\d*$/.test(currentValue) === true) {
      setHitCount(currentValue)
    }
  }, [])

  const handleInputAdLink = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = _.trim(e.currentTarget.value)
    setAdLink(currentValue)
  }, [])

  const handleInputAdTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = _.trim(e.currentTarget.value)
    setAdTitle(currentValue)
  }, [])

  const handleClickConfirmPurchaseButton = useCallback(() => {
    setHasValidatedNFTCount(true)
    setIsHitCountValid(true)
    setIsAdLinkValid(true)
    setIsAdTitleValid(true)

    walletApi
      .depositToContent(adLink, adTitle, parseInt(hitCount, 10), videoInfo.contentId)
      .then(() => {
        onClose()
        message.success('Added')
      })
      .catch(() => {
        message.error('Add failed')
      })
      .finally(() => {})
  }, [adLink, adTitle, hitCount, onClose, videoInfo.contentId])

  return (
    <Modal
      show={true}
      onHide={onClose}
      centered
      dialogClassName={cx(styles.addHitToVideoModal)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add HIT to video</Modal.Title>
      </Modal.Header>
      <Modal.Body className={cx('')}>
        <div
          className={cx('d-flex flex-column justify-content-between align-items-center', styles.modalBodyContentWrap)}
        >
          <Form
            noValidate
            validated={hasValidatedForm}
            className={cx('w-100', styles.formWrap)}
          >
            <Form.Group className={cx('')}>
              <Form.Label htmlFor='input-hit-count'>Add HIT</Form.Label>
              <Form.Control
                id='input-hit-count'
                value={hitCount}
                placeholder=''
                required
                pattern='^[1-9]\d*$'
                autoComplete='off'
                onChange={handleInputHitCount}
              />
              {isHitCountValid === false && (
                <Form.Control.Feedback type='invalid'>Please input the count of HIT</Form.Control.Feedback>
              )}
              <p className={cx('mt-1 mb-0', styles.balanceHit)}>Balance : {walletStore.walletInfo.balanceHit} HIT</p>
            </Form.Group>
            <Form.Group className={cx('mt-3')}>
              <Form.Label htmlFor='input-link'>Add link</Form.Label>
              <Form.Control
                id='input-link'
                value={adLink}
                placeholder=''
                required
                pattern='^.*$'
                autoComplete='off'
                onChange={handleInputAdLink}
              />
              {isAdLinkValid === false && (
                <Form.Control.Feedback type='invalid'>Please input the link</Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className={cx('mt-3')}>
              <Form.Label htmlFor='input-title'>Add title</Form.Label>
              <Form.Control
                id='input-title'
                value={adTitle}
                placeholder=''
                required
                pattern='^.*$'
                autoComplete='off'
                onChange={handleInputAdTitle}
              />
              {isAdTitleValid === false && (
                <Form.Control.Feedback type='invalid'>Please input the title</Form.Control.Feedback>
              )}
            </Form.Group>
          </Form>
          <Button
            variant='primary'
            className={cx(styles.addHitButton)}
            onClick={handleClickConfirmPurchaseButton}
          >
            Add HIT
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default AddHitToVideoModal
