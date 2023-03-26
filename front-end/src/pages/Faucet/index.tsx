import cx from 'classnames'
import _ from 'lodash'
import { ChangeEvent, useCallback, useState } from 'react'
import { Button, Form } from 'react-bootstrap'

import styles from './layout.module.css'

import { faucet } from 'web-api/wallet'
import { message } from 'antd'

const Faucet = () => {
  const [walletAddress, setWalletAddress] = useState('')
  const [hasValidatedForm, setHasValidatedForm] = useState(false)
  const [isWalletAddressValid, setIsWalletAddressValid] = useState(true)
  const [isClaiming, setIsClaiming] = useState(false)

  const handleInputWalletAddress = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = _.trim(e.currentTarget.value)
    setWalletAddress(currentValue)
  }, [])

  const handleClickClaimButton = useCallback(() => {
    let isFormValid = true

    if (walletAddress === '') {
      isFormValid = false
      setIsWalletAddressValid(false)
    }

    setHasValidatedForm(true)
    if (isFormValid === false) {
      return
    }

    setIsClaiming(true)
    faucet(walletAddress)
      .then(() => {
        message.success('Claim successful')
      })
      .catch((e) => {
        message.error('Claim failed')
      })
      .finally(() => {
        setIsClaiming(false)
      })
  }, [walletAddress])

  return (
    <div className={cx(styles.wrap)}>
      <h1 className={cx('mt-4 mb-0')}>POT Faucet</h1>
      <Form
        noValidate
        validated={hasValidatedForm}
        className={cx('mt-4', styles.form)}
      >
        <Form.Group>
          <Form.Control
            id='input-wallet-address'
            value={walletAddress}
            placeholder='input your wallet address'
            required
            pattern='^.*$'
            autoComplete='off'
            disabled={isClaiming}
            onChange={handleInputWalletAddress}
          />
          {isWalletAddressValid === false && (
            <Form.Control.Feedback type='invalid'>Please input the wallet address</Form.Control.Feedback>
          )}
        </Form.Group>
      </Form>
      <Button
        className={cx('mt-4')}
        onClick={handleClickClaimButton}
        disabled={isClaiming}
      >
        {isClaiming ? 'Claiming' : 'Claim free POT'}
      </Button>
    </div>
  )
}

export default Faucet
