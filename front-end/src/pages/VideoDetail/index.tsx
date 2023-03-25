import { useCallback, useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { LoadingOutlined } from '@ant-design/icons'
import videojs from 'video.js'
import Player from 'video.js/dist/types/player'
import { useParams } from 'react-router-dom'
import { message } from 'antd'

import 'video.js/dist/video-js.css'
import styles from './layout.module.css'

import VideoPlayTipMask from 'components/VideoPlayTipMask'

import { VideoDetailInfo } from 'web-api/video'
import * as videoApi from 'web-api/video'

const VideoDetail = () => {
  const routeParams = useParams<{ vid: string }>()
  const videoElementRef = useRef<HTMLDivElement | null>(null)
  const videoPlayerInstanceRef = useRef<Player | null>(null)
  const [isAppInited, setIsAppInited] = useState(false)
  const [videoDetailInfo, setVideoDetailInfo] = useState<VideoDetailInfo | null>(null)
  const [isLiked, setLiked] = useState(false)
  const [isFavorited, setFavorited] = useState(false)

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

  useEffect(() => {
    const { vid } = routeParams
    if (vid === undefined) {
      return
    }
    videoApi
      .detail(vid)
      .then((info) => {
        setVideoDetailInfo(info)
        setLiked(info.liked)
        setFavorited(info.marked)
        setIsAppInited(true)
      })
      .catch(() => {
        message.error('Failed to retrieve video details')
      })
  }, [routeParams])

  useEffect(() => {
    if (videoPlayerInstanceRef.current === null) {
      if (videoElementRef.current !== null) {
        const videoElement = document.createElement('video-js')

        videoElement.classList.add('vjs-big-play-centered')
        videoElementRef.current.appendChild(videoElement)

        const player = videojs(
          videoElement,
          {
            autoplay: false,
            controls: true,
            responsive: true,
            fluid: true,
            sources: [
              {
                src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                type: 'video/mp4',
              },
            ],
          },
          () => {
            videojs.log('player is ready')
            const vjsPlayButton = document.querySelector('.vjs-big-play-button') as HTMLDivElement
            if (vjsPlayButton !== null) {
              vjsPlayButton.style.display = 'none'
            }
          },
        )

        videoPlayerInstanceRef.current = player
      }
    }
  }, [])

  useEffect(() => {
    const player = videoPlayerInstanceRef.current

    return () => {
      if (player !== null && player.isDisposed() === false) {
        player.dispose()
        videoPlayerInstanceRef.current = null
      }
    }
  }, [])

  return (
    <>
      {isAppInited === false && (
        <div className={cx('w-100 d-flex flex-grow-1 justify-content-center align-items-center')}>
          <LoadingOutlined style={{ fontSize: 48 }} />
        </div>
      )}
      {isAppInited && videoDetailInfo !== null && (
        <div className={cx(styles.wrap)}>
          <div className={cx('position-relative', styles.videoPlayerContainer)}>
            <div
              className={cx('w-100 h-100')}
              ref={videoElementRef}
            />
            <VideoPlayTipMask
              videoId={videoDetailInfo.contentId}
              hitCount={videoDetailInfo.balanceHit}
              userLevel={videoDetailInfo.watcherLevel}
              rewardPercentForViewer={videoDetailInfo.yieldRateOfViewer}
              rewardPercentForSharing={videoDetailInfo.yieldRateOfInfluencer}
            />
          </div>
          <div className={cx('h4 mt-4 mb-0', styles.videoTitle)}>{videoDetailInfo.title}</div>
          <div className={cx('d-flex justify-content-between align-items-center mt-3', styles.uploaderInfo)}>
            <div className={cx('d-flex justify-content-between align-items-center gap-2', styles.uploaderAvatar)}>
              <img
                className={cx(styles.uploaderAvatar)}
                src={videoDetailInfo.creator.avatarImgUrl}
                width={38}
                height={38}
                alt='avatar'
              />
              <div className={cx('text-nowrap text-truncate', styles.uploaderName)}>
                {videoDetailInfo.creator.nickname}
              </div>
              <button className={cx('btn btn-primary rounded-pill', styles.subscribeButton)}>Subscribe</button>
            </div>
            <div className={cx('d-flex gap-2', styles.optButtons)}>
              <button
                className={cx('btn btn-outline-primary')}
                title=''
              >
                <i className='bi bi-cart'></i>
                <span className={cx('ms-2')}>Buy IP NFT</span>
              </button>
              <button
                className={cx('btn btn-outline-primary')}
                title=''
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
              >
                <i className='bi bi-share-fill'></i>
              </button>
              <button
                className={cx('btn btn-outline-primary')}
                title='Donate'
              >
                <i className='bi bi-gift'></i>
              </button>
            </div>
          </div>
          <div className={cx('mt-4', styles.videoIntro)}>{videoDetailInfo.description}</div>
        </div>
      )}
    </>
  )
}

export default VideoDetail