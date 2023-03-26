import cx from 'classnames'
import { ChangeEvent, useCallback, useState } from 'react'
import { Button, Form, InputGroup, Modal } from 'react-bootstrap'
import _ from 'lodash'
import { message } from 'antd'
import { parseEther } from 'ethers'

import styles from './layout.module.css'

import defaultAvatar from 'statics/images/default-avatar.svg'
import metamask from 'wallets/metamask'

interface Props {
  onClose: () => void
  nickname: string
  avatarUrl: string
  walletAddress: string
}

const DonateToUploaderModal = (props: Props) => {
  const { nickname, avatarUrl, walletAddress, onClose } = props

  const [ethCount, setEthCount] = useState('')
  const [hasValidatedEthCount, setHasValidatedEthCount] = useState(false)
  const [isEthCountValid, setIsEthCountValid] = useState(true)
  const [isDonating, setIsDonating] = useState(false)

  const handleInputEthCount = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = _.trim(e.currentTarget.value)
    if (currentValue === '' || /^0$|^0\.\d*$|^[1-9]\d*$|^[1-9]\d*\.\d*/.test(currentValue) === true) {
      setEthCount(currentValue)
    }
  }, [])

  const handleClickConfirmDonateButton = useCallback(() => {
    let isFormValid = true
    if (ethCount === '') {
      isFormValid = false
      setIsEthCountValid(false)
    }

    setHasValidatedEthCount(true)
    if (isFormValid === false) {
      return
    }

    setIsDonating(true)
    metamask
      .sendTransaction(walletAddress, parseEther(ethCount).toString())
      .then(() => {
        onClose()
        message.success('Donate successful')
      })
      .catch(() => {
        message.error('Donate failed')
      })
      .finally(() => {
        setIsDonating(false)
      })
  }, [ethCount, onClose, walletAddress])

  return (
    <Modal
      show={true}
      onHide={onClose}
      centered
      backdrop='static'
      keyboard={false}
      dialogClassName={cx(styles.donateToPosterModal)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Donate</Modal.Title>
      </Modal.Header>
      <Modal.Body className={cx('')}>
        <div
          className={cx('d-flex flex-column justify-content-between align-items-center', styles.modalBodyContentWrap)}
        >
          <Form
            noValidate
            validated={hasValidatedEthCount}
            className={cx('w-100', styles.donateFormWrap)}
          >
            <Form.Group className={cx('')}>
              <Form.Label
                htmlFor='input-eth-count'
                className={cx('d-flex align-items-center')}
              >
                <span>Donate to</span>
                <div className={cx('d-flex align-items-center', styles.posterInfo)}>
                  <img
                    className={cx('', styles.avatar)}
                    src={avatarUrl || defaultAvatar}
                    alt=''
                  />
                  <span className={cx('', styles.nickname)}>{nickname}</span>
                </div>
              </Form.Label>
              <InputGroup>
                <Form.Control
                  id='input-eth-count'
                  value={ethCount}
                  placeholder=''
                  required
                  pattern='^0$|^0\.\d*$|^[1-9]\d*$|^[1-9]\d*\.\d*'
                  autoComplete='off'
                  onChange={handleInputEthCount}
                />
                <InputGroup.Text>ETH</InputGroup.Text>
                {isEthCountValid === false && (
                  <Form.Control.Feedback type='invalid'>Please input the count of ETH</Form.Control.Feedback>
                )}
              </InputGroup>
            </Form.Group>
          </Form>
          <Button
            variant='primary'
            className={cx(styles.donateButton)}
            onClick={handleClickConfirmDonateButton}
            disabled={isDonating}
          >
            {isDonating ? 'Donating' : 'Donate'}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default DonateToUploaderModal
