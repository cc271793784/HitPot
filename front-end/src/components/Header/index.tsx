import cx from 'classnames'
import { useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import { useNavigate } from 'react-router-dom'

import styles from './layout.module.css'

import iconLogo from 'statics/images/icon-logo-light.svg'
import iconVideo from 'statics/images/icon-post-video.svg'
import iconPerson from 'statics/images/icon-person.svg'
import iconWallet from 'statics/images/icon-wallet.svg'

import ConnectMetaMaskModal from '../ConnectMetaMaskModal'
import VipBadge from '../VipBadge'
import UpgradeMemberCardLevelModal from '../UpgradeMemberCardLevelModal'

import userStore from 'stores/user'
import uiStore from 'stores/ui'

const Header = () => {
  const navigate = useNavigate()

  const handleClickPostVideoButton = useCallback(() => {
    if (userStore.isLoggedIn === false) {
      uiStore.shouldShowConnectWalletModal = true
      return
    }
    navigate('/post-video')
  }, [navigate])

  const handleClickAccountButton = useCallback(() => {
    if (userStore.isLoggedIn === false) {
      uiStore.shouldShowConnectWalletModal = true
      return
    }
  }, [])

  const handleClickWalletButton = useCallback(() => {
    if (userStore.isLoggedIn === false) {
      uiStore.shouldShowConnectWalletModal = true
      return
    }
    navigate('/wallet')
  }, [navigate])

  const handleClickProfileButton = useCallback(() => {
    navigate('/home')
  }, [navigate])

  const handleClickUpgradeLevelButton = useCallback(() => {
    uiStore.shouldShowUpgradeMemberCardLevel = true
  }, [])

  const handleClickSettingsButton = useCallback(() => {
    navigate('/settings')
  }, [navigate])

  return (
    <div className={cx('sticky-top', styles.headerWrap)}>
      <div className={cx('container d-flex justify-content-between align-items-center', styles.headerMain)}>
        <a
          href='/'
          className={cx('d-flex align-items-center', styles.logoWrap)}
        >
          <img
            src={iconLogo}
            width={28}
            height={28}
            alt='logo'
          />
          <span className={cx(styles.logoContent)}>HitPot</span>
        </a>
        <div className={cx('d-flex', styles.navbar)}>
          <div
            className={cx('d-flex align-items-center', styles.navItem)}
            onClick={handleClickPostVideoButton}
          >
            <img
              src={iconVideo}
              width={24}
              height={24}
              alt='logo'
            />
            <span>Post Video</span>
          </div>
          {userStore.isLoggedIn === false && (
            <div
              className={cx('d-flex align-items-center', styles.navItem)}
              onClick={handleClickAccountButton}
            >
              <img
                className={cx(styles.defaultUserAvatar)}
                src={iconPerson}
                width={24}
                height={24}
                alt='logo'
              />
              <span>Account</span>
            </div>
          )}
          {userStore.isLoggedIn === true && (
            <OverlayTrigger
              trigger='click'
              rootClose
              placement='bottom'
              overlay={
                <Popover id='popover-basic'>
                  <Popover.Body>
                    <div className={cx('d-flex flex-column gap-2')}>
                      <div
                        className={cx('d-flex gap-2', styles.accountSettingItem)}
                        onClick={handleClickProfileButton}
                      >
                        <i className={cx('bi bi-person-fill', styles.accountSettingItemIcon)}></i>
                        <span>Profile</span>
                      </div>
                      <div
                        className={cx('d-flex gap-2', styles.accountSettingItem)}
                        onClick={handleClickUpgradeLevelButton}
                      >
                        <i className={cx('bi bi-arrow-up-circle', styles.accountSettingItemIcon)}></i>
                        <span>Upgrade member card </span>
                      </div>
                      <div
                        className={cx('d-flex gap-2', styles.accountSettingItem)}
                        onClick={handleClickSettingsButton}
                      >
                        <i className={cx('bi bi-gear', styles.accountSettingItemIcon)}></i>
                        <span>Settings</span>
                      </div>
                    </div>
                  </Popover.Body>
                </Popover>
              }
            >
              <div className={cx('d-flex gap-2', styles.navItem)}>
                <img
                  className={cx(styles.userAvatar)}
                  src={userStore.userInfo.avatarImgUrl}
                  width={24}
                  height={24}
                  alt='avatar'
                />
                <span>{userStore.userInfo.nickname}</span>
                <VipBadge level={userStore.userInfo.level} />
              </div>
            </OverlayTrigger>
          )}
          <div
            className={cx('d-flex align-items-center', styles.navItem)}
            onClick={handleClickWalletButton}
          >
            <img
              src={iconWallet}
              width={24}
              height={24}
              alt='logo'
            />
            <span>Wallet</span>
          </div>
        </div>
      </div>
      {uiStore.shouldShowConnectWalletModal && (
        <ConnectMetaMaskModal
          onClose={() => {
            uiStore.shouldShowConnectWalletModal = false
          }}
          onConnect={async () => {
            uiStore.shouldShowConnectWalletModal = false
          }}
        />
      )}
      {uiStore.shouldShowUpgradeMemberCardLevel && (
        <UpgradeMemberCardLevelModal
          level={userStore.userInfo.level}
          onClose={() => {
            uiStore.shouldShowUpgradeMemberCardLevel = false
          }}
        />
      )}
    </div>
  )
}

export default observer(Header)
