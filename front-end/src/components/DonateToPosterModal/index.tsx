import cx from 'classnames'
import { ChangeEvent, useCallback, useState } from 'react'
import { Button, Form, InputGroup, Modal } from 'react-bootstrap'

import styles from './layout.module.css'

interface Props {
  onClose: () => void
  nickname: string
  avatarUrl: string
  walletAddress: string
}

const DonateToPosterModal = (props: Props) => {
  const { nickname, avatarUrl, walletAddress, onClose } = props

  const [ethCount, setEthCount] = useState('')
  const [hasValidatedEthCount, setHasValidatedEthCount] = useState(false)
  const [isEthCountValid, setIsEthCountValid] = useState(true)

  const handleInputEthCount = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.currentTarget.value
    if (currentValue === '' || /^[1-9]\d*$/.test(currentValue) === true) {
      setEthCount(currentValue)
    }
  }, [])

  const handleClickConfirmDonateButton = useCallback(() => {
    setHasValidatedEthCount(true)
    setIsEthCountValid(false)
  }, [])

  return (
    <Modal
      show={true}
      onHide={onClose}
      centered
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
                    src={avatarUrl}
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
                  pattern='^[1-9]\d*$'
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
          >
            Donate
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default DonateToPosterModal
