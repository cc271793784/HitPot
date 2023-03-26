import cx from 'classnames'
import { ChangeEvent, useCallback, useState } from 'react'
import Form from 'react-bootstrap/Form'
import { message, Upload } from 'antd'
import { UploadChangeParam, UploadFile } from 'antd/es/upload'
import { LoadingOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import { InputGroup } from 'react-bootstrap'
import _ from 'lodash'

import styles from './layout.module.css'

import iconArrowUp from 'statics/images/icon-up-arrow-circle-fill.svg'
import iconImage from 'statics/images/icon-image.svg'

import { UserLevel } from 'typings/UserLevel'
import * as videoApi from 'web-api/video'
import * as materialApi from 'web-api/material'
import { MaterialUploadedInfo } from 'web-api/material'
import { formatFileSize } from 'utils/formatFileSize'
import walletStore from 'stores/wallet'
import PurchaseHitToPostVideoModal from 'components/PurchaseHitToPostVideoModal'

const PostVideo = () => {
  const [uploadedVideoInfo, setUploadedVideoInfo] = useState<MaterialUploadedInfo>({
    filename: '',
    materialType: 0,
    md5: '',
    originalFilename: '',
    size: 0,
    url: '',
  })
  const [uploadedVideoThumbnailInfo, setUploadedVideoThumbnailInfo] = useState<MaterialUploadedInfo>({
    filename: '',
    materialType: 0,
    md5: '',
    originalFilename: '',
    size: 0,
    url: '',
  })
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [recommendUserLevel, setRecommendUserLevel] = useState<UserLevel>(2)
  const [mintingHitCount, setMintingHitCount] = useState('') // >= 0 或 <= 10000
  const [rewardForInfluencerSharing, setRewardForInfluencerSharing] = useState(25)
  const [rewardForViewer, setRewardForViewer] = useState(25)
  const [enableIPNFT, setEnableIPNFT] = useState(true)
  const [nftCount, setNFTCount] = useState('') // >= 1000 或 <= 10000
  const [nftFloorPrice, setNFTFloorPrice] = useState('') // >= 400 或 <= 2000
  const [nftReservedForInvestor, setNftReservedForInvestor] = useState(25)
  const [nftMaximumVolumeForInvestor, setNftMaximumVolumeForInvestor] = useState('') // > 0 或 <= 200
  const [uploadVideoState, setUploadVideoState] = useState<'waiting' | 'uploading' | 'uploaded'>('waiting')
  const [uploadThumbnailState, setUploadThumbnailState] = useState<'waiting' | 'uploading' | 'uploaded'>('waiting')
  const [videoPreview, setVideoPreview] = useState('')
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [showPurchaseHitToPostVideoModal, setShowPurchaseHitToPostVideoModal] = useState(false)
  const [formValidateResult, setFormValidateResult] = useState<
    Map<
      'video' | 'thumbnail' | 'title' | 'description' | 'mintingHitCount' | 'nftCount' | 'nftPrice' | 'nftCountLimit',
      boolean
    >
  >(new Map())
  const [hasValidatedForm, setHasValidatedForm] = useState(false)
  const [isPosting, setIsPosting] = useState(false)

  const handleSelectVideoFileChanged = useCallback(
    (info: UploadChangeParam<UploadFile>) => {
      setUploadVideoState('uploading')
      // @ts-expect-error ignore
      setVideoPreview(URL.createObjectURL(info.file))
      setUploadedVideoInfo({
        ...uploadedVideoInfo,
        originalFilename: info.file.name ?? '',
        size: info.file.size ?? 0,
      })
      materialApi
        // @ts-expect-error ignore
        .materialUpload(info.file, 0)
        .then((result) => {
          setUploadedVideoInfo({ ...result })
          setUploadVideoState('uploaded')
          formValidateResult.set('video', true)
          setFormValidateResult(new Map(formValidateResult))
        })
        .catch((e) => {
          message.error('Upload video failed')
          console.log('upload video catch', e)
        })
    },
    [formValidateResult, uploadedVideoInfo],
  )

  const handleSelectThumbnailFileChanged = useCallback(
    (info: UploadChangeParam<UploadFile>) => {
      setUploadThumbnailState('uploading')
      // @ts-expect-error ignore
      setThumbnailPreview(URL.createObjectURL(info.file))
      setUploadedVideoThumbnailInfo({
        ...uploadedVideoThumbnailInfo,
        originalFilename: info.file.name ?? '',
        size: info.file.size ?? 0,
      })
      materialApi
        // @ts-expect-error ignore
        .materialUpload(info.file, 1)
        .then((result) => {
          setUploadedVideoThumbnailInfo({ ...result })
          setUploadThumbnailState('uploaded')
          formValidateResult.set('thumbnail', true)
          setFormValidateResult(new Map(formValidateResult))
        })
        .catch((e) => {
          console.log('upload thumbnail catch', e)
          message.error('Upload thumbnail failed')
        })
    },
    [formValidateResult, uploadedVideoThumbnailInfo],
  )

  const handleInputTitleChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }, [])

  const handleInputDescriptionChanged = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.currentTarget.value)
  }, [])

  const handleInputMintingHitCountChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = _.trim(e.currentTarget.value)
    if (currentValue === '' || /^[1-9]\d*$/.test(currentValue)) {
      setMintingHitCount(currentValue)
    }
  }, [])

  const handleRewardForInfluencerSharingChanged = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setRewardForInfluencerSharing(parseInt(_.trim(e.currentTarget.value), 10))
  }, [])

  const handleRewardForViewer = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setRewardForViewer(parseInt(_.trim(e.currentTarget.value), 10))
  }, [])

  const handleEnableIPNFTChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEnableIPNFT(_.trim(e.currentTarget.value) === 'true')
  }, [])

  const handleInputIPNFTCountChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = _.trim(e.currentTarget.value)
    if (currentValue === '' || /^[1-9]\d*$/.test(currentValue)) {
      setNFTCount(currentValue)
    }
  }, [])

  const handleInputIPNFTFloorPriceChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = _.trim(e.currentTarget.value)
    if (currentValue === '' || /^0$|^0\.\d*$|^[1-9]\d*$|^[1-9]\d*\.\d*$/.test(currentValue)) {
      setNFTFloorPrice(currentValue)
    }
  }, [])

  const handleNftReservedForInvestorChanged = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setNftReservedForInvestor(parseInt(_.trim(e.currentTarget.value), 10))
  }, [])

  const handleInputNftMaximumVolumeForInvestorChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = _.trim(e.currentTarget.value)
    if (currentValue === '' || /^[1-9]\d*$/.test(currentValue)) {
      setNftMaximumVolumeForInvestor(currentValue)
    }
  }, [])

  const handleClickRemoveUploadedVideo = useCallback(() => {
    setUploadVideoState('waiting')
    setUploadedVideoInfo({
      ...uploadedVideoInfo,
      filename: '',
    })
  }, [uploadedVideoInfo])

  const handleClickRemoveUploadedVideoThumbnail = useCallback(() => {
    setUploadThumbnailState('waiting')
    setUploadedVideoThumbnailInfo({
      ...uploadedVideoThumbnailInfo,
      filename: '',
    })
  }, [uploadedVideoThumbnailInfo])

  const handleClickPostButton = useCallback(() => {
    let isFormValid = true
    if (uploadedVideoInfo.filename === '') {
      formValidateResult.set('video', false)
      isFormValid = false
    } else {
      formValidateResult.delete('video')
    }
    if (uploadedVideoThumbnailInfo.filename === '') {
      formValidateResult.set('thumbnail', false)
      isFormValid = false
    } else {
      formValidateResult.delete('thumbnail')
    }
    if (title === '') {
      formValidateResult.set('title', false)
      isFormValid = false
    } else {
      formValidateResult.delete('title')
    }
    if (description === '') {
      formValidateResult.set('description', false)
      isFormValid = false
    } else {
      formValidateResult.delete('description')
    }
    if (mintingHitCount === '') {
      formValidateResult.set('mintingHitCount', false)
      isFormValid = false
    } else {
      formValidateResult.delete('mintingHitCount')
    }
    if (nftCount === '') {
      formValidateResult.set('nftCount', false)
      isFormValid = false
    } else {
      formValidateResult.delete('nftCount')
    }
    if (nftFloorPrice === '') {
      formValidateResult.set('nftPrice', false)
      isFormValid = false
    } else {
      formValidateResult.delete('nftPrice')
    }
    if (nftMaximumVolumeForInvestor === '') {
      formValidateResult.set('nftCountLimit', false)
      isFormValid = false
    } else {
      formValidateResult.delete('nftCountLimit')
    }

    setHasValidatedForm(true)
    if (isFormValid === false) {
      setFormValidateResult(new Map(formValidateResult))
      return
    }

    setShowPurchaseHitToPostVideoModal(true)
  }, [
    description,
    formValidateResult,
    mintingHitCount,
    nftCount,
    nftFloorPrice,
    nftMaximumVolumeForInvestor,
    title,
    uploadedVideoInfo.filename,
    uploadedVideoThumbnailInfo.filename,
  ])

  const handlePurchaseHitModalClosed = useCallback(() => {
    setShowPurchaseHitToPostVideoModal(false)
  }, [])

  const handleConfirmPostVideo = useCallback(() => {
    setShowPurchaseHitToPostVideoModal(false)

    setIsPosting(true)
    videoApi
      .release(
        uploadedVideoInfo.filename,
        uploadedVideoThumbnailInfo.filename,
        title,
        description,
        recommendUserLevel,
        parseInt(mintingHitCount, 10),
        rewardForInfluencerSharing / 100,
        rewardForViewer / 100,
        enableIPNFT,
        parseInt(nftCount, 10),
        parseInt(nftFloorPrice, 10),
        nftReservedForInvestor / 100,
        parseInt(nftMaximumVolumeForInvestor, 10),
      )
      .then(() => {
        message.success('Post successful')
      })
      .catch(() => {})
      .finally(() => {
        setIsPosting(false)
      })
  }, [
    description,
    enableIPNFT,
    mintingHitCount,
    nftCount,
    nftFloorPrice,
    nftMaximumVolumeForInvestor,
    nftReservedForInvestor,
    recommendUserLevel,
    rewardForInfluencerSharing,
    rewardForViewer,
    title,
    uploadedVideoInfo.filename,
    uploadedVideoThumbnailInfo.filename,
  ])

  return (
    <>
      <div className={cx(styles.wrap)}>
        <div className={cx('h2 mb-0', styles.pageTitle)}>Post Video</div>
        <Form
          noValidate
          validated={hasValidatedForm}
        >
          <div className={cx('d-flex flex-column gap-2 mt-3')}>
            <div className={cx(styles.formItemTitle)}>Upload video</div>
            {uploadVideoState === 'waiting' && (
              <Upload.Dragger
                className={cx('d-flex flex-column justify-content-center align-items-center', styles.uploadVideoWrap)}
                accept={'.mp4'}
                multiple={false}
                showUploadList={false}
                beforeUpload={() => false}
                fileList={[]}
                disabled={uploadVideoState !== 'waiting'}
                onChange={handleSelectVideoFileChanged}
              >
                <img
                  src={iconArrowUp}
                  width={48}
                  className={styles.uploadVideoIcon}
                  alt=''
                />
                <div className={cx(styles.uploadVideoClickTip)}>Click or drag file to this area to upload</div>
                <div className={cx(styles.uploadVideoFileLimit)}>Support MP4 only. Maximum file size 1G.</div>
              </Upload.Dragger>
            )}
            {uploadVideoState === 'uploading' && (
              <div className={cx('', styles.uploadingVideoWrap)}>
                <video
                  src={videoPreview}
                  className={styles.videoPreview}
                  autoPlay={false}
                  controls={false}
                />
                <div
                  className={cx(
                    'd-flex flex-column justify-content-center align-items-center',
                    styles.uploadingVideoTip,
                  )}
                >
                  <LoadingOutlined style={{ color: '#fff', fontSize: '40px' }} />
                  <span className={cx('', styles.videoFileName)}>{uploadedVideoInfo.originalFilename}</span>
                  <span className={cx('', styles.videoFileSize)}>{formatFileSize(uploadedVideoInfo.size)}</span>
                </div>
              </div>
            )}
            {uploadVideoState === 'uploaded' && (
              <div className={cx('', styles.uploadedVideoWrap)}>
                <video
                  src={videoPreview}
                  className={styles.videoPreview}
                  autoPlay={false}
                  controls={false}
                />
                <div
                  className={cx(
                    'd-flex flex-column justify-content-center align-items-center',
                    styles.uploadedVideoTip,
                  )}
                  onClick={handleClickRemoveUploadedVideo}
                >
                  <i
                    className={cx('bi bi-trash3')}
                    style={{ fontSize: '40px', color: '#fff' }}
                  ></i>
                  <span className={cx('', styles.videoFileName)}>{uploadedVideoInfo.originalFilename}</span>
                  <span className={cx('', styles.videoFileSize)}>{formatFileSize(uploadedVideoInfo.size)}</span>
                </div>
              </div>
            )}
            {formValidateResult.get('video') === false && (
              <>
                <div
                  className='is-invalid'
                  style={{ display: 'none' }}
                />
                <Form.Control.Feedback type='invalid'>Please upload video</Form.Control.Feedback>
              </>
            )}
          </div>

          <div className={cx('d-flex flex-column gap-2', styles.uploadThumbnailWrap)}>
            <div className={cx(styles.formItemTitle)}>Upload video thumbnail</div>
            {uploadThumbnailState === 'waiting' && (
              <Upload.Dragger
                className={cx('d-flex flex-column justify-content-center align-items-center', styles.uploadThumbnail)}
                accept={'.jpg,.png'}
                multiple={false}
                showUploadList={true}
                beforeUpload={() => false}
                fileList={[]}
                disabled={uploadThumbnailState !== 'waiting'}
                onChange={handleSelectThumbnailFileChanged}
              >
                <img
                  src={iconImage}
                  width={48}
                  className={styles.uploadThumbnailIcon}
                  alt=''
                />
                <div className={cx(styles.uploadThumbnailClickTip)}>Click or drag file to this area to upload</div>
                <div className={cx(styles.uploadThumbnailFileLimit)}>
                  Support for a single upload. Maximum file size 10MB.
                </div>
              </Upload.Dragger>
            )}
            {uploadThumbnailState === 'uploading' && (
              <div className={cx('', styles.uploadingThumbnailWrap)}>
                <img
                  src={thumbnailPreview}
                  className={styles.thumbnailPreview}
                  alt=''
                />
                <div
                  className={cx(
                    'd-flex flex-column justify-content-center align-items-center',
                    styles.uploadingThumbnailTip,
                  )}
                >
                  <LoadingOutlined style={{ color: '#fff', fontSize: '40px' }} />
                  <span className={cx('', styles.thumbnailFileName)}>
                    {uploadedVideoThumbnailInfo.originalFilename}
                  </span>
                  <span className={cx('', styles.thumbnailFileSize)}>
                    {formatFileSize(uploadedVideoThumbnailInfo.size)}
                  </span>
                </div>
              </div>
            )}
            {uploadThumbnailState === 'uploaded' && (
              <div className={cx('', styles.uploadedThumbnailWrap)}>
                <img
                  src={thumbnailPreview}
                  className={styles.thumbnailPreview}
                  alt=''
                />
                <div
                  className={cx(
                    'd-flex flex-column justify-content-center align-items-center',
                    styles.uploadedThumbnailTip,
                  )}
                  onClick={handleClickRemoveUploadedVideoThumbnail}
                >
                  <i
                    className={cx('bi bi-trash3')}
                    style={{ fontSize: '40px', color: '#fff' }}
                  ></i>
                  <span className={cx('', styles.thumbnailFileName)}>
                    {uploadedVideoThumbnailInfo.originalFilename}
                  </span>
                  <span className={cx('', styles.thumbnailFileSize)}>
                    {formatFileSize(uploadedVideoThumbnailInfo.size)}
                  </span>
                </div>
              </div>
            )}
            {formValidateResult.get('thumbnail') === false && (
              <>
                <div
                  className='is-invalid'
                  style={{ display: 'none' }}
                />
                <Form.Control.Feedback type='invalid'>Please upload thumbnail</Form.Control.Feedback>
              </>
            )}
          </div>

          <Form.Group className={cx('w-100 mt-3')}>
            <Form.Label htmlFor='input-title'>Title</Form.Label>
            <Form.Control
              id='input-title'
              className={cx(styles.inputTitle)}
              value={title}
              placeholder=''
              required
              pattern='^.*$'
              autoComplete='off'
              disabled={isPosting}
              onChange={handleInputTitleChanged}
            />
            {formValidateResult.get('title') === false && (
              <Form.Control.Feedback type='invalid'>Please input the title</Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className={cx('w-100 mt-3')}>
            <Form.Label htmlFor='input-description'>Description</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              id='input-description'
              className={cx(styles.inputDescription)}
              value={description}
              placeholder=''
              required
              autoComplete='off'
              disabled={isPosting}
              onChange={handleInputDescriptionChanged}
            />
            {formValidateResult.get('description') === false && (
              <Form.Control.Feedback type='invalid'>Please input the description</Form.Control.Feedback>
            )}
          </Form.Group>

          <div className={cx('d-flex flex-column gap-2 mt-3')}>
            <div className={cx(styles.formItemTitle)}>Recommend to</div>
            <div className={cx('d-flex gap-3')}>
              <Form.Check
                type='radio'
                name='recommendTarget'
                id='recommendToGold'
                value='gold'
                label='GOLD'
                checked={recommendUserLevel === 2}
                onChange={() => {
                  setRecommendUserLevel(2)
                }}
              />
              <Form.Check
                type='radio'
                name='recommendTarget'
                id='recommendToSilver'
                value='silver'
                label='SILVER'
                checked={recommendUserLevel === 1}
                onChange={() => {
                  setRecommendUserLevel(1)
                }}
              />
              <Form.Check
                type='radio'
                name='recommendTarget'
                id='recommendToAll'
                value='all'
                label='ALL USERS'
                checked={recommendUserLevel === 0}
                onChange={() => {
                  setRecommendUserLevel(0)
                }}
              />
            </div>
          </div>

          <Form.Group className={cx('w-100 mt-3')}>
            <Form.Label htmlFor='input-minting-hit-count'>Minting supply</Form.Label>
            <InputGroup className={cx(styles.inputMintingSupply)}>
              <Form.Control
                id='input-minting-hit-count'
                className={cx(styles.inputTitle)}
                value={mintingHitCount}
                placeholder=''
                required
                pattern='^[1-9]\d*$'
                autoComplete='off'
                disabled={isPosting}
                onChange={handleInputMintingHitCountChanged}
              />
              <InputGroup.Text>HIT</InputGroup.Text>
              {formValidateResult.get('mintingHitCount') === false && (
                <Form.Control.Feedback type='invalid'>Please input the count of HIT</Form.Control.Feedback>
              )}
            </InputGroup>
            <p className={cx('mt-1 mb-0', styles.balanceHit)}>Balance : {walletStore.walletInfo.balanceHit} HIT</p>
          </Form.Group>

          <div className={cx('d-flex flex-column gap-2', styles.rewardForInfluencerSharingWrap)}>
            <div className={cx(styles.formItemTitle)}>Reward for influencer sharing</div>
            <Form.Select
              className={cx('form-select', styles.selectRewardForInfluencerSharing)}
              value={rewardForInfluencerSharing}
              onChange={handleRewardForInfluencerSharingChanged}
            >
              <option value={25}>25%</option>
              <option value={50}>50%</option>
              <option value={75}>75%</option>
            </Form.Select>
          </div>

          <div className={cx('d-flex flex-column gap-2 mt-3')}>
            <div className={cx(styles.formItemTitle)}>Reward for viewer</div>
            <Form.Select
              className={cx('form-select', styles.selectRewardForViewer)}
              value={rewardForViewer}
              onChange={handleRewardForViewer}
            >
              <option value={25}>25%</option>
              <option value={50}>50%</option>
              <option value={75}>75%</option>
            </Form.Select>
          </div>

          <div className={cx('d-flex flex-column gap-2', styles.enableIPNFTWrap)}>
            <div className={cx(styles.formItemTitle)}>Enable IP NFT </div>
            <div className={cx('d-flex gap-3')}>
              <Form.Check
                type='radio'
                name='enableIPNFT'
                id='enableIPNFTTrue'
                value='true'
                label='Yes'
                checked={enableIPNFT === true}
                onChange={handleEnableIPNFTChanged}
              />
              <Form.Check
                type='radio'
                name='enableIPNFT'
                id='enableIPNFTFalse'
                value='false'
                label='No'
                checked={enableIPNFT === false}
                onChange={handleEnableIPNFTChanged}
              />
            </div>
          </div>

          {enableIPNFT && (
            <>
              <Form.Group className={cx('w-100 mt-3')}>
                <Form.Label htmlFor='input-ip-nft-count'>IP NFT supply</Form.Label>
                <Form.Control
                  id='input-ip-nft-count'
                  className={cx(styles.inputIPNFTSupply)}
                  value={nftCount}
                  placeholder=''
                  required
                  pattern='^[1-9]\d*$'
                  autoComplete='off'
                  disabled={isPosting}
                  onChange={handleInputIPNFTCountChanged}
                />
                {formValidateResult.get('nftCount') === false && (
                  <Form.Control.Feedback type='invalid'>Please input the count of IP NFT</Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group className={cx('w-100 mt-3')}>
                <Form.Label htmlFor='input-nft-price'>IP NFT floor price</Form.Label>
                <InputGroup className={cx(styles.inputIPNFTFloorPrice)}>
                  <Form.Control
                    id='input-nft-price'
                    value={nftFloorPrice}
                    placeholder=''
                    required
                    pattern='^0$|^0\.\d*$|^[1-9]\d*$|^[1-9]\d*\.\d*$'
                    autoComplete='off'
                    disabled={isPosting}
                    onChange={handleInputIPNFTFloorPriceChanged}
                  />
                  <InputGroup.Text>POT</InputGroup.Text>
                  {formValidateResult.get('nftPrice') === false && (
                    <Form.Control.Feedback type='invalid'>Please input the price of IP NFT</Form.Control.Feedback>
                  )}
                </InputGroup>
              </Form.Group>

              <div className={cx('d-flex flex-column gap-2 mt-3')}>
                <div className={cx(styles.formItemTitle)}>IP NFT reserved for investor</div>
                <Form.Select
                  className={cx('form-select', styles.selectIPNFTReservedForInvestor)}
                  value={nftReservedForInvestor}
                  onChange={handleNftReservedForInvestorChanged}
                >
                  <option value={25}>25%</option>
                  <option value={50}>50%</option>
                  <option value={75}>75%</option>
                </Form.Select>
              </div>

              <Form.Group className={cx('w-100 mt-3')}>
                <Form.Label htmlFor='input-ip-nft-count-limit'>IP NFT maximum volume for investor</Form.Label>
                <Form.Control
                  id='input-ip-nft-count-limit'
                  className={cx(styles.inputIPNFTMaximumVolumeForInvestor)}
                  value={nftMaximumVolumeForInvestor}
                  placeholder=''
                  required
                  pattern='^[1-9]\d*$'
                  autoComplete='off'
                  disabled={isPosting}
                  onChange={handleInputNftMaximumVolumeForInvestorChanged}
                />
                {formValidateResult.get('nftCountLimit') === false && (
                  <Form.Control.Feedback type='invalid'>Please input the limit</Form.Control.Feedback>
                )}
              </Form.Group>
            </>
          )}
        </Form>
        <button
          className={cx('btn btn-primary', styles.postButton)}
          onClick={handleClickPostButton}
          disabled={isPosting}
        >
          {isPosting ? 'Posting' : 'Post'}
        </button>
      </div>
      {showPurchaseHitToPostVideoModal && (
        <PurchaseHitToPostVideoModal
          onClose={handlePurchaseHitModalClosed}
          onConfirm={handleConfirmPostVideo}
          hitCount={parseInt(mintingHitCount, 10)}
          balanceHit={walletStore.walletInfo.balanceHit}
        />
      )}
    </>
  )
}

export default observer(PostVideo)
