import cx from 'classnames'
import { useCallback, useState } from 'react'
import to from 'await-to-js'
import { nanoid } from 'nanoid'
import cookie from 'js-cookie'
import { message } from 'antd'
import { AxiosError } from 'axios'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import styles from './layout.module.css'

import iconLogo from 'statics/images/icon-logo-dark.svg'
import iconExchangeArrows from 'statics/images/icon-exchange-arrows.svg'
import iconMetamask from 'statics/images/icon-metamask-logo.svg'

import { UserInfo } from 'typings/UserInfo'
import metamask from 'wallets/metamask'
import * as userApi from 'web-api/user'
import userStore from 'stores/user'
import config from 'web-api/config'
import persist from 'stores/persist'

interface Props {
  onClose: () => void
  onConnect: () => void
}

const ConnectMetaMaskModal = (props: Props) => {
  const { onClose, onConnect } = props

  const [isConnecting, setIsConnecting] = useState(false)

  const handleClickConnect = useCallback(async () => {
    setIsConnecting(true)

    const [ethRequestAccountsError, as] = await to(metamask.ethRequestAccounts())
    console.log('ethRequestAccounts result', ethRequestAccountsError, as)
    if (ethRequestAccountsError !== null) {
      onClose()
      return
    }

    const [ethAccountsError, accounts] = await to(metamask.ethAccounts())
    if (ethAccountsError !== null) {
      onClose()
      return
    }

    const address = accounts[0]
    const nonce = nanoid()
    const signMsg = `Welcome to HitPot!\n\nClick to sign in and accept the HitPot Terms of Service.\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nWallet address:\n${address}\n\nNonce:\n${nonce}`
    const [personalSignError, signature] = await to(metamask.personalSign(signMsg, address))
    if (personalSignError !== null) {
      onClose()
      return
    }
    const [loginError, accessToken] = await to<string, AxiosError>(userApi.login(signMsg, signature, address))
    console.log('login result', loginError, accessToken)
    if (loginError !== null) {
      onClose()
      message.error(`登录失败（${loginError.response?.status ?? 'unknown'}）`)
      return
    }
    config.setAccessToken(accessToken)
    persist.setAccessToken(address, accessToken)
    cookie.set('accessToken', accessToken, {
      expires: 3650,
    })

    const [userDetailError, userDetail] = await to<UserInfo, AxiosError>(userApi.detail(address))
    console.log('user detail result', userDetailError, userDetail)
    if (userDetailError !== null) {
      onClose()
      message.error(`获取账号信息失败（${userDetailError.response?.status ?? 'unknown'}）`)
      return
    }
    userStore.updateUserInfo(userDetail)
    userStore.isLoggedIn = true

    onConnect()
  }, [onClose, onConnect])

  return (
    <Modal
      show={true}
      onHide={onClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Connect your wallet</Modal.Title>
      </Modal.Header>
      <Modal.Body className={cx('d-flex flex-column align-items-center')}>
        <div className={cx('d-flex justify-content-between align-items-center', styles.icons)}>
          <div className={cx('d-flex flex-column align-items-center')}>
            <img
              src={iconLogo}
              className={cx(styles.icon)}
              height={64}
              alt=''
            />
            <span className={styles.iconName}>HitPot</span>
          </div>
          <img
            src={iconExchangeArrows}
            alt=''
          />
          <div className={cx('d-flex flex-column align-items-center')}>
            <img
              src={iconMetamask}
              width={64}
              height={64}
              alt=''
            />
            <span className={styles.iconName}>MetaMask</span>
          </div>
        </div>
        <Button
          className={cx(styles.connectButton)}
          onClick={handleClickConnect}
          disabled={isConnecting === true}
        >
          {isConnecting ? 'Connecting' : 'Connect'}
        </Button>
      </Modal.Body>
    </Modal>
  )
}

export default ConnectMetaMaskModal
