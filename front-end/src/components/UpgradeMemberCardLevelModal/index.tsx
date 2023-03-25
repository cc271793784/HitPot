import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import cx from 'classnames'
import { useCallback, useState } from 'react'
import { message } from 'antd'

import { UserLevel } from 'typings/UserLevel'

import styles from './layout.module.css'

import VipBadge from '../VipBadge'

import userStore from 'stores/user'
import * as userApi from 'web-api/user'

interface Props {
  onClose: () => void
  level: UserLevel
}

const UpgradeMemberCardLevelModal = (props: Props) => {
  const { onClose, level } = props

  const [userLevel, setUserLevel] = useState<UserLevel>(level)

  const handleClickUpgradeButton = useCallback(() => {
    userApi
      .upgradeLevel(userLevel)
      .then(() => {
        userStore.updateUserInfo({
          level: userLevel,
        })
        onClose()
      })
      .catch((e) => {
        message.error('upgrade member card failed')
        onClose()
      })
  }, [userLevel, onClose])

  return (
    <Modal
      show={true}
      centered
      onHide={onClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Upgrade member card </Modal.Title>
      </Modal.Header>
      <Modal.Body className={cx('d-flex flex-column align-items-center')}>
        <div className={cx('d-flex flex-column gap-2 justify-content-between align-items-start', styles.radiosWrap)}>
          <Form.Check
            className={cx('mb-0')}
            type='radio'
            name='memberCard'
            value='none'
            id='no-card'
            label={
              <div className={cx('d-flex gap-2 align-items-center')}>
                <span className={cx(styles.labelContent)}>No card</span>
              </div>
            }
            checked={userLevel === 0}
            onChange={() => {
              setUserLevel(0)
            }}
          />
          <Form.Check
            className={cx('mb-0')}
            type='radio'
            name='memberCard'
            value='silver'
            id='silver-card'
            label={
              <div className={cx('d-flex gap-2 align-items-center')}>
                <span className={cx(styles.labelContent)}>Silver card</span>
                <VipBadge level={1} />
              </div>
            }
            checked={userLevel === 1}
            onChange={() => {
              setUserLevel(1)
            }}
          />
          <Form.Check
            className={cx('mb-0')}
            type='radio'
            name='memberCard'
            value='gold'
            id='gld-card'
            label={
              <div className={cx('d-flex gap-2 align-items-center')}>
                <span className={cx(styles.labelContent)}>Gold card</span>
                <VipBadge level={2} />
              </div>
            }
            checked={userLevel === 2}
            onChange={() => {
              setUserLevel(2)
            }}
          />
        </div>
        <Button
          className={cx(styles.upgradeButton)}
          onClick={handleClickUpgradeButton}
        >
          Upgrade
        </Button>
      </Modal.Body>
    </Modal>
  )
}

export default UpgradeMemberCardLevelModal
