import { Button, Form, InputGroup, Modal } from 'react-bootstrap'
import cx from 'classnames'
import { ChangeEvent, SyntheticEvent, useCallback, useRef, useState } from 'react'
import { message } from 'antd'
import _ from 'lodash'

import styles from './layout.module.css'

import Service from 'contracts/Service'
import { syncWalletInfoFromWebApi } from 'stores/walletHelpers'

interface Props {
  onClose: () => void
}

const DepositPotModal = (props: Props) => {
  const { onClose } = props

  const [depositPotCount, setDepositPotCount] = useState('')
  const [isDepositCountValid, setIsDepositCountValid] = useState(true)
  const [hasValidatedDepositPotCount, setHasValidatedDepositPotCount] = useState(false)
  const contractServiceRef = useRef(new Service())
  const [isDepositing, setIsDepositing] = useState(false)

  const handleInputDepositPotCount = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = _.trim(e.currentTarget.value)
    if (currentValue === '' || /^[1-9]\d*$/.test(currentValue) === true) {
      setDepositPotCount(currentValue)
    }
  }, [])

  const handleClickConfirmDepositPotButton = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault()
      if (depositPotCount === '') {
        setIsDepositCountValid(false)
      } else {
        setIsDepositCountValid(true)
        setIsDepositing(true)
        const count = parseInt(depositPotCount, 10)
        contractServiceRef.current
          .depositPot(count)
          .then(() => {
            onClose()
            message.success('Deposit successful')
            syncWalletInfoFromWebApi()
          })
          .catch((e) => {
            message.error('Deposit failed')
          })
          .finally(() => {})
      }
      setHasValidatedDepositPotCount(true)
    },
    [depositPotCount, onClose],
  )

  const handleModalHide = useCallback(() => {
    onClose()
    setDepositPotCount('')
    setIsDepositCountValid(true)
    setHasValidatedDepositPotCount(false)
  }, [onClose])

  return (
    <Modal
      show={true}
      onHide={handleModalHide}
      centered
      backdrop='static'
      dialogClassName={cx('', styles.depositPotModal)}
    >
      <Modal.Header closeButton>
        <Modal.Title className={cx('h5')}>Deposit POT</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          noValidate
          validated={hasValidatedDepositPotCount}
          className={cx('d-flex flex-column align-items-center', styles.depositPotFormWrap)}
        >
          <Form.Group className={cx('w-100')}>
            <Form.Label
              htmlFor='input-deposit-pot-count'
              className={cx(styles.inputDepositPotTitle)}
            >
              Deposit POT
            </Form.Label>
            <InputGroup>
              <Form.Control
                id='input-deposit-pot-count'
                value={depositPotCount}
                placeholder=''
                required
                pattern='^[1-9]\d*$'
                autoComplete='off'
                disabled={isDepositing}
                onChange={handleInputDepositPotCount}
              />
              <InputGroup.Text>POT</InputGroup.Text>
              {isDepositCountValid === false && (
                <Form.Control.Feedback type='invalid'>Please input the count of POT</Form.Control.Feedback>
              )}
            </InputGroup>
          </Form.Group>
          <Button
            type='submit'
            className={cx(styles.confirmDepositButton)}
            onClick={handleClickConfirmDepositPotButton}
            disabled={isDepositing}
          >
            {isDepositing ? 'Depositing' : 'Deposit'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default DepositPotModal
