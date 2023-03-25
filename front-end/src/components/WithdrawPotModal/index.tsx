import { Button, Form, InputGroup, Modal } from 'react-bootstrap'
import cx from 'classnames'
import { ChangeEvent, SyntheticEvent, useCallback, useState } from 'react'
import { message } from 'antd'

import styles from './layout.module.css'

import * as walletApi from 'web-api/wallet'
import { syncWalletInfoFromWebApi } from 'stores/walletHelpers'

interface Props {
  onClose: () => void
}

const WithdrawPotModal = (props: Props) => {
  const { onClose } = props

  const [withdrawPotCount, setWithdrawPotCount] = useState('')
  const [isWithdrawCountValid, setIsWithdrawCountValid] = useState(true)
  const [hasValidatedWithdrawPotCount, setHasValidatedWithdrawPotCount] = useState(false)

  const handleInputWithdrawPotCount = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.currentTarget.value
    if (currentValue === '' || /^[1-9]\d*$/.test(currentValue) === true) {
      setWithdrawPotCount(currentValue)
    }
  }, [])

  const handleClickConfirmWithdrawPotButton = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault()
      if (withdrawPotCount === '') {
        setIsWithdrawCountValid(false)
      } else {
        setIsWithdrawCountValid(true)
        walletApi
          .withdraw(parseInt(withdrawPotCount, 10))
          .then(() => {
            message.success('Withdraw successfully')
            syncWalletInfoFromWebApi()
          })
          .catch(() => {
            message.error('Withdraw failed')
          })
          .finally(() => {
            onClose()
          })
      }
      setHasValidatedWithdrawPotCount(true)
    },
    [onClose, withdrawPotCount],
  )

  const handleModalHide = useCallback(() => {
    onClose()
    setWithdrawPotCount('')
    setIsWithdrawCountValid(true)
    setHasValidatedWithdrawPotCount(false)
  }, [onClose])

  return (
    <Modal
      show={true}
      onHide={handleModalHide}
      centered
      dialogClassName={cx('', styles.withdrawPotModal)}
    >
      <Modal.Header closeButton>
        <Modal.Title className={cx('h5')}>Withdraw POT</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          noValidate
          validated={hasValidatedWithdrawPotCount}
          className={cx('d-flex flex-column align-items-center', styles.withdrawPotFormWrap)}
        >
          <Form.Group className={cx('w-100')}>
            <Form.Label
              htmlFor='input-withdraw-pot-count'
              className={cx(styles.inputWithdrawPotTitle)}
            >
              Withdraw POT
            </Form.Label>
            <InputGroup>
              <Form.Control
                id='input-withdraw-pot-count'
                value={withdrawPotCount}
                placeholder=''
                required
                pattern='^[1-9]\d*$'
                autoComplete='off'
                onChange={handleInputWithdrawPotCount}
              />
              <InputGroup.Text>POT</InputGroup.Text>
              {isWithdrawCountValid === false && (
                <Form.Control.Feedback type='invalid'>Please input the count of POT</Form.Control.Feedback>
              )}
            </InputGroup>
          </Form.Group>
          <Button
            type='submit'
            className={cx(styles.confirmWithdrawButton)}
            onClick={handleClickConfirmWithdrawPotButton}
            disabled={false}
          >
            Withdraw
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default WithdrawPotModal
