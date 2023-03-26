import { useCallback, useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { LoadingOutlined } from '@ant-design/icons'
import videojs from 'video.js'
import Player from 'video.js/dist/types/player'
import { useParams } from 'react-router-dom'
import { message } from 'antd'
import _ from 'lodash'

import 'video.js/dist/video-js.css'
import styles from './layout.module.css'

import defaultAvatar from 'statics/images/default-avatar.svg'
import iconAd from 'statics/images/icon-ad.svg'

import VideoPlayTipMask from 'components/VideoPlayTipMask'
import BuyIPNFTModal from 'components/BuyIPNFTModal'
import AddHitToVideoModal from 'components/AddHitToVideoModal'

import { VideoDetailInfo } from 'web-api/video'
import * as videoApi from 'web-api/video'
import * as userApi from 'web-api/user'
import ShareVideoModal from 'components/ShareVideoModal'
import DonateToUploaderModal from 'components/DonateToUploaderModal'
import ShareToHitPotModal from 'components/ShareToHitPotModal'

const VideoDetail = () => {
  const routeParams = useParams<{ vid: string }>()
  const videoPlayerInstanceRef = useRef<Player | null>(null)
  const [isDataInited, setIsDataInited] = useState(false)
  const [showPlayMask, setShowPlayMask] = useState(true)
  const [videoDetailInfo, setVideoDetailInfo] = useState<VideoDetailInfo | null>(null)
  const videoDetailInfoRef = useRef<VideoDetailInfo | null>(null)
  const [isLiked, setLiked] = useState(false)
  const [isFavorited, setFavorited] = useState(false)
  const urlQueryRef = useRef<URLSearchParams>(new URLSearchParams(window.location.search))
  const watchDurationRef = useRef(0) // 单位为秒
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [showBuyIPNFTModal, setShowBuyIPNFTModal] = useState(false)
  const [showAddHitToVideoModal, setShowAddHitToVideoModal] = useState(false)
  const [showShareVideoModal, setShowShareVideoModal] = useState(false)
  const [showShareVideoToHitPotModal, setShowShareVideoToHitPotModal] = useState(false)
  const [showDonateToPosterModal, setShowDonateToPosterModal] = useState(false)

  const updateWatchDuration = useCallback(
    _.throttle(
      () => {
        watchDurationRef.current += 1
      },
      1000,
      { leading: false },
    ),
    [],
  )

  const setVideoElementContainerRef = useCallback(
    (element: HTMLDivElement) => {
      if (element === null) {
        return
      }

      element.style.display = 'none'

      const videoElement = document.createElement('video-js')

      videoElement.classList.add('vjs-big-play-centered')
      element.appendChild(videoElement)

      const player = videojs(
        videoElement,
        {
          autoplay: false,
          controls: true,
          responsive: true,
          fill: true,
          poster: videoDetailInfoRef.current?.coverImgUrl,
          sources: [
            {
              src: videoDetailInfoRef.current?.videoUrl,
            },
          ],
        },
        () => {
          element.style.display = 'block'
          const vjsPlayButton = document.querySelector('.vjs-big-play-button') as HTMLDivElement
          if (vjsPlayButton !== null) {
            vjsPlayButton.style.display = 'none'
          }
        },
      )

      // @ts-ignore
      player.posterImage.el_.firstChild.style.objectFit = 'cover'

      // @ts-ignore
      player.on('timeupdate', () => {
        updateWatchDuration()
      })

      // @ts-ignore
      window.player = player
      videoPlayerInstanceRef.current = player
    },
    [updateWatchDuration],
  )

  const handleClickSubscribeButton = useCallback(() => {
    if (videoDetailInfo === null) {
      return
    }
    if (isSubscribing) {
      setIsSubscribing(false)
      userApi
        .unsubscribe(videoDetailInfo.creator.userId)
        .then((result) => {
          setIsSubscribing(result === false)
        })
        .catch(() => {
          setIsSubscribing(true)
        })
    } else {
      setIsSubscribing(true)
      userApi
        .subscribe(videoDetailInfo.creator.userId)
        .then((result) => {
          setIsSubscribing(result === true)
        })
        .catch(() => {
          setIsSubscribing(false)
        })
    }
  }, [isSubscribing, videoDetailInfo])

  const handleClickLikeButton = useCallback(() => {
    if (videoDetailInfo === null) {
      return
    }

    if (isLiked === false) {
      setLiked(true)
      videoApi
        .like(videoDetailInfo.contentId)
        .then((result) => {
          setLiked(result === true)
        })
        .catch((e) => {
          setLiked(false)
        })
    } else {
      setLiked(false)
      videoApi
        .unlike(videoDetailInfo.contentId)
        .then((result) => {
          setLiked(result === false)
        })
        .catch((e) => {
          setLiked(true)
        })
    }
  }, [isLiked, videoDetailInfo])

  const handleClickFavoriteButton = useCallback(() => {
    if (videoDetailInfo === null) {
      return
    }

    if (isFavorited === false) {
      setFavorited(true)
      videoApi
        .mark(videoDetailInfo.contentId)
        .then((result) => {
          setFavorited(result === true)
        })
        .catch((e) => {
          setFavorited(false)
        })
    } else {
      setFavorited(false)
      videoApi
        .unmark(videoDetailInfo.contentId)
        .then((result) => {
          setFavorited(result === false)
        })
        .catch((e) => {
          setFavorited(true)
        })
    }
  }, [isFavorited, videoDetailInfo])

  const handleClickBuyIpNFTButton = useCallback(() => {
    setShowBuyIPNFTModal(true)
  }, [])

  const handleClickAddHitButton = useCallback(() => {
    setShowAddHitToVideoModal(true)
  }, [])

  const handleClickShareButton = useCallback(() => {
    setShowShareVideoModal(true)
  }, [])

  const handleClickDonateButton = useCallback(() => {
    setShowDonateToPosterModal(true)
  }, [])

  const handleClickPlay = useCallback(() => {
    setShowPlayMask(false)
    videoPlayerInstanceRef.current?.play()
  }, [])

  useEffect(() => {
    const { vid } = routeParams
    if (vid === undefined) {
      return
    }
    videoApi
      .detail(vid)
      .then((info) => {
        setVideoDetailInfo(info)
        videoDetailInfoRef.current = info
        setLiked(info.liked)
        setFavorited(info.marked)
        setIsSubscribing(info.creator.subscribe)
        setIsDataInited(true)
      })
      .catch(() => {
        message.error('Failed to retrieve video details')
      })
  }, [routeParams])

  useEffect(() => {
    const player = videoPlayerInstanceRef.current

    return () => {
      if (player !== null && player.isDisposed() === false) {
        player.dispose()
        videoPlayerInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const videoInfo = videoDetailInfoRef.current
      if (videoInfo === null) {
        return
      }
      if (watchDurationRef.current === 0) {
        return
      }
      videoApi
        .watch(videoInfo.contentId, watchDurationRef.current, urlQueryRef.current.get('utmContent') ?? '')
        .then((result) => {
          const newInfo = {
            ...videoInfo,
            ads: result.ads,
            balanceHit: result.amountHit,
          }
          setVideoDetailInfo(newInfo)
          videoDetailInfoRef.current = newInfo
        })
        .catch(() => {})
        .finally(() => {})
    }, 60 * 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  console.log('showBuyIPNFTModal && videoDetailInfo', showBuyIPNFTModal, videoDetailInfo)

  return (
    <>
      {isDataInited === false && (
        <div className={cx('w-100 d-flex flex-grow-1 justify-content-center align-items-center')}>
          <LoadingOutlined style={{ fontSize: 48 }} />
        </div>
      )}
      {isDataInited && videoDetailInfo !== null && (
        <div className={cx(styles.wrap)}>
          <div className={cx('position-relative', styles.videoPlayerContainer)}>
            <div
              className={cx('w-100 h-100')}
              ref={setVideoElementContainerRef}
            />
            {showPlayMask && videoDetailInfo !== null && (
              <VideoPlayTipMask
                videoId={videoDetailInfo.contentId}
                hitCount={videoDetailInfo.balanceHit}
                userLevel={videoDetailInfo.watcherLevel}
                rewardPercentForViewer={videoDetailInfo.yieldRateOfViewer}
                rewardPercentForSharing={videoDetailInfo.yieldRateOfInfluencer}
                onClickPlay={handleClickPlay}
              />
            )}
            {showPlayMask === false && videoDetailInfo !== null && videoDetailInfo.ads.length > 0 && (
              <div className={cx('d-flex gap-2 align-items-center', styles.adWrap)}>
                <img
                  className={cx(styles.adIcon)}
                  src={iconAd}
                  width={24}
                  height={18}
                  alt=''
                />
                <a
                  className={cx(styles.adLink)}
                  href={videoDetailInfo.ads[0]?.adLink}
                  target='_blank'
                  rel='noreferrer'
                >
                  {videoDetailInfo.ads[0]?.adTitle}
                </a>
              </div>
            )}
          </div>
          <div className={cx('h4 mt-4 mb-0', styles.videoTitle)}>{videoDetailInfo.title}</div>
          <div className={cx('d-flex justify-content-between align-items-center mt-3', styles.uploaderInfo)}>
            <div className={cx('d-flex justify-content-between align-items-center gap-2', styles.uploaderAvatar)}>
              <img
                className={cx(styles.uploaderAvatar)}
                src={videoDetailInfo.creator.avatarImgUrl || defaultAvatar}
                width={38}
                height={38}
                alt='avatar'
              />
              <div className={cx('text-nowrap text-truncate', styles.uploaderName)}>
                {videoDetailInfo.creator.nickname}
              </div>
              {isSubscribing ? (
                <button
                  className={cx('btn btn-secondary  rounded-pill', styles.subscribeButton)}
                  onClick={handleClickSubscribeButton}
                >
                  Subscribing
                </button>
              ) : (
                <button
                  className={cx('btn btn-primary rounded-pill', styles.subscribeButton)}
                  onClick={handleClickSubscribeButton}
                >
                  Subscribe
                </button>
              )}
            </div>
            <div className={cx('d-flex gap-2', styles.optButtons)}>
              <button
                className={cx('btn btn-outline-primary')}
                title=''
                onClick={handleClickBuyIpNFTButton}
              >
                <i className='bi bi-cart'></i>
                <span className={cx('ms-2')}>Buy IP NFT</span>
              </button>
              <button
                className={cx('btn btn-outline-primary')}
                title=''
                onClick={handleClickAddHitButton}
              >
                <i className='bi bi-fire'></i>
                <span className={cx('ms-2')}>Add HIT</span>
              </button>
              <button
                className={cx('btn btn-outline-primary')}
                title='Like'
                onClick={handleClickLikeButton}
              >
                {isLiked ? <i className='bi bi-hand-thumbs-up-fill'></i> : <i className='bi bi-hand-thumbs-up'></i>}
              </button>
              <button
                className={cx('btn btn-outline-primary')}
                title='Favorite'
                onClick={handleClickFavoriteButton}
              >
                {isFavorited ? <i className='bi bi-heart-fill'></i> : <i className='bi bi-heart'></i>}
              </button>
              <button
                className={cx('btn btn-outline-primary')}
                title='Share'
                onClick={handleClickShareButton}
              >
                <i className='bi bi-share-fill'></i>
              </button>
              <button
                className={cx('btn btn-outline-primary')}
                title='Donate'
                onClick={handleClickDonateButton}
              >
                <i className='bi bi-gift'></i>
              </button>
            </div>
          </div>
          <div className={cx('mt-4', styles.videoIntro)}>{videoDetailInfo.description}</div>
        </div>
      )}
      {showBuyIPNFTModal && videoDetailInfo !== null && (
        <BuyIPNFTModal
          onClose={() => {
            setShowBuyIPNFTModal(false)
          }}
          videoInfo={videoDetailInfo}
        />
      )}
      {showAddHitToVideoModal && videoDetailInfo !== null && (
        <AddHitToVideoModal
          onClose={() => {
            setShowAddHitToVideoModal(false)
          }}
          videoInfo={videoDetailInfo}
        />
      )}
      {showShareVideoModal && videoDetailInfo !== null && (
        <ShareVideoModal
          onClose={() => {
            setShowShareVideoModal(false)
          }}
          onSelectShareToHitPot={() => {
            setShowShareVideoModal(false)
            setShowShareVideoToHitPotModal(true)
          }}
          videoInfo={videoDetailInfo}
        />
      )}
      {showShareVideoToHitPotModal && videoDetailInfo !== null && (
        <ShareToHitPotModal
          onClose={() => {
            setShowShareVideoToHitPotModal(false)
          }}
          videoInfo={videoDetailInfo}
        />
      )}
      {showDonateToPosterModal && videoDetailInfo !== null && (
        <DonateToUploaderModal
          onClose={() => {
            setShowDonateToPosterModal(false)
          }}
          nickname={videoDetailInfo.creator.nickname}
          avatarUrl={videoDetailInfo.creator.avatarImgUrl}
          walletAddress={videoDetailInfo.creator.userId}
        />
      )}
    </>
  )
}

export default VideoDetail
