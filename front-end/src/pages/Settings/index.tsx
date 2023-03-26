import { LoadingOutlined, UploadOutlined } from '@ant-design/icons'
import { Upload, Button as AntdButton, message } from 'antd'
import { UploadChangeParam, UploadFile } from 'antd/es/upload'
import cx from 'classnames'
import { observer } from 'mobx-react-lite'
import { ChangeEvent, useCallback, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import _ from 'lodash'

import userStore from 'stores/user'
import * as materialApi from 'web-api/material'
import * as userApi from 'web-api/user'

import styles from './layout.module.css'

const Settings = () => {
  const [nickname, setNickname] = useState(userStore.userInfo.nickname)
  const [avatarUrl, setAvatarUrl] = useState(userStore.userInfo.avatarImgUrl)
  const [uploadedAvatarFilename, setUploadedAvatarFilename] = useState('')
  const [feedRecommendStrategy, setFeedRecommendStrategy] = useState(userStore.userInfo.feedSettingType ?? 0)
  const [avatarUploadState, setAvatarUploadState] = useState<'waiting' | 'uploading' | 'uploaded'>('waiting')
  const [hasValidatedForm, setHasValidatedForm] = useState(false)
  const [isNicknameValid, setIsNicknameValid] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleUploadAvatarSelected = useCallback((info: UploadChangeParam<UploadFile>) => {
    setAvatarUploadState('uploading')
    materialApi
      // @ts-ignore
      .materialUpload(info.file, 1)
      .then((result) => {
        setAvatarUrl(result.url)
        setUploadedAvatarFilename(result.filename)
        setAvatarUploadState('uploaded')
      })
      .catch(() => {
        message.error('Image upload failed')
        setAvatarUploadState('waiting')
      })
  }, [])

  const handleInputNickname = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = _.trim(e.currentTarget.value)
    setNickname(currentValue)
  }, [])

  const handleClickConfirmSaveButton = useCallback(() => {
    setHasValidatedForm(true)

    if (nickname === '') {
      setIsNicknameValid(false)
    } else {
      setIsNicknameValid(true)
    }

    setIsSaving(true)
    userApi
      .update(uploadedAvatarFilename, nickname, feedRecommendStrategy)
      .then((result) => {
        message.success('Updated')
        userStore.updateUserInfo({
          ...result,
        })
      })
      .catch(() => {
        message.error('Update failed')
      })
      .finally(() => {
        setIsSaving(false)
      })
  }, [feedRecommendStrategy, nickname, uploadedAvatarFilename])

  return (
    <div className={cx(styles.wrap)}>
      <Form
        noValidate
        validated={hasValidatedForm}
        className={cx('', styles.depositPotFormWrap)}
      >
        <div className={cx('h2 mb-0', styles.pageTitle)}>Profile Settings</div>
        <div className={cx(styles.profileSettingsWrap)}>
          <Form.Group className={cx('w-100', styles.formItem)}>
            <Form.Label className={cx(styles.inputDepositPotTitle)}>Profile Image</Form.Label>
            <div className={cx('d-flex align-items-end gap-3')}>
              {(avatarUploadState === 'waiting' || avatarUploadState === 'uploaded') && (
                <img
                  className={cx(styles.avatar)}
                  src={avatarUrl}
                  alt=''
                />
              )}
              {avatarUploadState === 'uploading' && (
                <div className={cx('position-relative')}>
                  <img
                    className={cx(styles.avatar)}
                    src={avatarUrl}
                    alt=''
                  />
                  <div className={cx('d-flex justify-content-center align-items-center', styles.loadingMask)}>
                    <LoadingOutlined className={cx('', styles.loadingIcon)} />
                  </div>
                </div>
              )}
              <Upload
                accept={'.jpg,.jpeg,.png'}
                multiple={false}
                showUploadList={false}
                beforeUpload={() => false}
                fileList={[]}
                disabled={isSaving}
                onChange={handleUploadAvatarSelected}
              >
                <AntdButton
                  className={cx(styles.uploadButton)}
                  type='primary'
                  disabled={isSaving}
                >
                  <div className={cx('d-flex align-items-center gap-2')}>
                    <UploadOutlined />
                    <span>Upload</span>
                  </div>
                </AntdButton>
              </Upload>
            </div>
          </Form.Group>
          <Form.Group className={cx('w-100', styles.formItem)}>
            <Form.Label
              htmlFor='input-nickname'
              className={cx(styles.inputDepositPotTitle)}
            >
              Username
            </Form.Label>
            <Form.Control
              id='input-nickname'
              value={nickname}
              placeholder=''
              required
              autoComplete='off'
              disabled={isSaving}
              onChange={handleInputNickname}
            />
            {isNicknameValid === false && (
              <Form.Control.Feedback type='invalid'>Please input the username</Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group className={cx('w-100', styles.formItem)}>
            <Form.Label
              htmlFor='input-wallet-address'
              className={cx(styles.inputDepositPotTitle)}
            >
              Wallet Address
            </Form.Label>
            <Form.Control
              id='input-wallet-address'
              value={userStore.walletAddress}
              placeholder=''
              disabled={true}
            />
          </Form.Group>
        </div>
        <div className={cx('h2 mb-0', styles.pageTitle, styles.feedSettingsTitle)}>Feed Settings</div>
        <div className={cx(styles.recommendSettingsWrap)}>
          <Form.Group className={cx('w-100')}>
            <Form.Label
              htmlFor='input-nickname'
              className={cx(styles.inputDepositPotTitle)}
            >
              Recommend strategy
            </Form.Label>
            <Form.Check
              type='radio'
              label='Latest'
              name='recommendStrategy'
              id='recommend-latest'
              checked={feedRecommendStrategy === 0}
              onChange={() => {
                setFeedRecommendStrategy(0)
              }}
            />
            <Form.Check
              type='radio'
              label='Location based'
              name='recommendStrategy'
              id='recommend-location-based'
              checked={feedRecommendStrategy === 1}
              onChange={() => {
                setFeedRecommendStrategy(1)
              }}
            />
            <Form.Check
              type='radio'
              label='Social linkage'
              name='recommendStrategy'
              id='recommend-social-linkage'
              checked={feedRecommendStrategy === 2}
              onChange={() => {
                setFeedRecommendStrategy(2)
              }}
            />
          </Form.Group>
        </div>
        <Button
          type='submit'
          className={cx(styles.saveButton)}
          onClick={handleClickConfirmSaveButton}
          disabled={isSaving}
        >
          {isSaving ? 'Saving' : 'Save'}
        </Button>
      </Form>
    </div>
  )
}

export default observer(Settings)
