import cx from 'classnames'
import React, { useCallback, useState } from 'react'
import Form from 'react-bootstrap/Form'
import { message, Upload } from 'antd'
import { UploadChangeParam, UploadFile } from 'antd/es/upload'
import { LoadingOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'

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
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [recommendUserLevel, setRecommendUserLevel] = useState<UserLevel>(2)
  const [mintingHitCount, setMintingHitCount] = useState(2000)
  const [rewardForInfluencerSharing, setRewardForInfluencerSharing] = useState(25)
  const [rewardForViewer, setRewardForViewer] = useState(25)
  const [enableIPNFT, setEnableIPNFT] = useState(true)
  const [nftCount, setNFTCount] = useState(1000)
  const [nftFloorPrice, setNFTFloorPrice] = useState(400)
  const [nftReservedForInvestor, setNftReservedForInvestor] = useState(25)
  const [nftMaximumVolumeForInvestor, setNftMaximumVolumeForInvestor] = useState(50)
  const [uploadVideoState, setUploadVideoState] = useState<'waiting' | 'uploading' | 'uploaded'>('waiting')
  const [uploadThumbnailState, setUploadThumbnailState] = useState<'waiting' | 'uploading' | 'uploaded'>('waiting')
  const [videoPreview, setVideoPreview] = useState('')
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [showPurchaseHitModal, setShowPurchaseHitModal] = useState(false)
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

  const handleInputTitleChanged = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }, [])

  const handleInputDescriptionChanged = useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
    setDescription(e.currentTarget.value)
  }, [])

  const handleInputMintingHitCountChanged = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setMintingHitCount(parseInt(e.currentTarget.value, 0))
  }, [])

  const handleRewardForInfluencerSharingChanged = useCallback((e: React.FormEvent<HTMLSelectElement>) => {
    setRewardForInfluencerSharing(parseInt(e.currentTarget.value, 10))
  }, [])

  const handleRewardForViewer = useCallback((e: React.FormEvent<HTMLSelectElement>) => {
    setRewardForViewer(parseInt(e.currentTarget.value, 10))
  }, [])

  const handleEnableIPNFTChanged = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setEnableIPNFT(e.currentTarget.value === 'true')
  }, [])

  const handleInputIPNFTCountChanged = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setNFTCount(parseInt(e.currentTarget.value, 10))
  }, [])

  const handleInputIPNFTFloorPriceChanged = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setNFTFloorPrice(parseInt(e.currentTarget.value, 10))
  }, [])

  const handleNftReservedForInvestorChanged = useCallback((e: React.FormEvent<HTMLSelectElement>) => {
    setNftReservedForInvestor(parseInt(e.currentTarget.value, 10))
  }, [])

  const handleInputNftMaximumVolumeForInvestorChanged = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setNftMaximumVolumeForInvestor(parseInt(e.currentTarget.value, 10))
  }, [])

  const handleClickRemoveUploadedVideo = useCallback(() => {
    setUploadVideoState('waiting')
  }, [])

  const handleClickRemoveUploadedVideoThumbnail = useCallback(() => {
    setUploadThumbnailState('waiting')
  }, [])

  const sendPostVideoRequest = useCallback(() => {
    videoApi
      .release(
        uploadedVideoInfo.filename,
        uploadedVideoThumbnailInfo.filename,
        title,
        description,
        recommendUserLevel,
        mintingHitCount,
        rewardForInfluencerSharing,
        rewardForViewer,
        enableIPNFT,
        nftCount,
        nftFloorPrice,
        nftReservedForInvestor,
        nftMaximumVolumeForInvestor,
      )
      .then((result) => {
        console.log('video release then', result)
      })
      .catch((e) => {
        console.log('video release catch', e)
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

  const handleClickConfirmPost = useCallback(() => {
    if (walletStore.walletInfo.balanceHit < mintingHitCount) {
      setShowPurchaseHitModal(true)
      return
    }

    sendPostVideoRequest()
  }, [mintingHitCount, sendPostVideoRequest])

  const handlePurchaseHitModalClosed = useCallback(() => {
    setShowPurchaseHitModal(false)
  }, [])

  return (
    <>
      <div className={cx(styles.wrap)}>
        <div className={cx('h2 mb-0', styles.pageTitle)}>Post Video</div>
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
              onChange={(info) => {
                console.log('video dragger onchange', info.file)
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
                  })
                  .catch((e) => {
                    message.error('Upload video failed')
                    console.log('upload video catch', e)
                  })
              }}
            >
              {uploadVideoState === 'waiting' && (
                <>
                  <img
                    src={iconArrowUp}
                    width={48}
                    className={styles.uploadVideoIcon}
                    alt=''
                  />
                  <div className={cx(styles.uploadVideoClickTip)}>Click or drag file to this area to upload</div>
                  <div className={cx(styles.uploadVideoFileLimit)}>Support MP4 only. Maximum file size 1G.</div>
                </>
              )}
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
                className={cx('d-flex flex-column justify-content-center align-items-center', styles.uploadingVideoTip)}
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
                className={cx('d-flex flex-column justify-content-center align-items-center', styles.uploadedVideoTip)}
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
              onChange={(info: UploadChangeParam<UploadFile>) => {
                console.log('image dragger onchange', info.file)
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
                  })
                  .catch((e) => {
                    console.log('upload thumbnail catch', e)
                    message.error('Upload thumbnail failed')
                  })
              }}
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
                <span className={cx('', styles.thumbnailFileName)}>{uploadedVideoThumbnailInfo.originalFilename}</span>
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
                <span className={cx('', styles.thumbnailFileName)}>{uploadedVideoThumbnailInfo.originalFilename}</span>
                <span className={cx('', styles.thumbnailFileSize)}>
                  {formatFileSize(uploadedVideoThumbnailInfo.size)}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className={cx('d-flex flex-column gap-2 mt-3')}>
          <div className={cx(styles.formItemTitle)}>Title</div>
          <input
            className={cx('form-control', styles.inputTitle)}
            placeholder=''
            value={title}
            onChange={handleInputTitleChanged}
          />
        </div>
        <div className={cx('d-flex flex-column gap-2 mt-3')}>
          <div className={cx(styles.formItemTitle)}>Description</div>
          <textarea
            className={cx('form-control', styles.inputDescription)}
            placeholder=''
            value={description}
            onChange={handleInputDescriptionChanged}
          />
        </div>
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
        <div className={cx('d-flex flex-column gap-2 mt-3')}>
          <div className={cx(styles.formItemTitle)}>Minting supply</div>
          <div className={cx('input-group', styles.inputMintingSupply)}>
            <input
              type='text'
              className='form-control'
              placeholder=''
              value={mintingHitCount}
              onChange={handleInputMintingHitCountChanged}
            />
            <span
              className='input-group-text'
              id='basic-addon2'
            >
              HIT
            </span>
          </div>
        </div>
        <p className={cx('mt-1 mb-0', styles.balanceHit)}>Balance : {walletStore.walletInfo.balanceHit} HIT</p>
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
            <div className={cx('d-flex flex-column gap-2 mt-3')}>
              <div className={cx(styles.formItemTitle)}>IP NFT supply</div>
              <input
                className={cx('form-control', styles.inputIPNFTSupply)}
                placeholder=''
                value={nftCount}
                onChange={handleInputIPNFTCountChanged}
              />
            </div>
            <div className={cx('d-flex flex-column gap-2 mt-3')}>
              <div className={cx(styles.formItemTitle)}>IP NFT floor price</div>
              <div className={cx('input-group', styles.inputIPNFTFloorPrice)}>
                <input
                  type='text'
                  className='form-control'
                  placeholder=''
                  value={nftFloorPrice}
                  onChange={handleInputIPNFTFloorPriceChanged}
                />
                <span
                  className='input-group-text'
                  id='basic-addon2'
                >
                  POT
                </span>
              </div>
            </div>
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
            <div className={cx('d-flex flex-column gap-2 mt-3')}>
              <div className={cx(styles.formItemTitle)}>IP NFT maximum volume for investor</div>
              <input
                className={cx('form-control', styles.inputIPNFTMaximumVolumeForInvestor)}
                placeholder=''
                value={nftMaximumVolumeForInvestor}
                onChange={handleInputNftMaximumVolumeForInvestorChanged}
              />
            </div>
          </>
        )}
        <button
          className={cx('btn btn-primary', styles.postButton)}
          onClick={handleClickConfirmPost}
        >
          POST
        </button>
      </div>
      {showPurchaseHitModal && <PurchaseHitToPostVideoModal onClose={handlePurchaseHitModalClosed} />}
    </>
  )
}

export default observer(PostVideo)
