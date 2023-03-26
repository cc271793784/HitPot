import cx from 'classnames'
import { useCallback, useEffect, useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons'

import styles from './layout.module.css'

import icoLogo from 'statics/images/icon-logo-dark.svg'

import { VideoDetailInfo } from 'web-api/video'
import * as videoApi from 'web-api/video'

export default function AnonymousLanding() {
  const [isDataInited, setIsDataInited] = useState(false)
  const [videoList, setVideoList] = useState<VideoDetailInfo[]>([])

  const handleClickWatchButton = useCallback(() => {}, [])

  const handleClickSubscribeButton = useCallback(() => {}, [])

  useEffect(() => {
    videoApi
      .listMostPopularContent()
      .then((result) => {
        setVideoList(result)
        setIsDataInited(true)
      })
      .catch(() => {})
      .finally(() => {})
  }, [])

  return (
    <div className={cx('d-flex flex-column align-items-center', styles.wrap)}>
      <img
        src={icoLogo}
        width={64}
        className={styles.logo}
        alt=''
      />
      <p className={cx('text-center', styles.welcome)}>
        Welcome to the
        <br />
        Decentralized Video-sharing Platform
      </p>
      <p className={cx('text-center', styles.intro)}>HitPot is a new decentralize video-sharing platform</p>
      {isDataInited === false && (
        <div className={cx('w-100 d-flex flex-grow-1 justify-content-center align-items-center')}>
          <LoadingOutlined style={{ fontSize: 48 }} />
        </div>
      )}
      {isDataInited && (
        <div className={cx('d-flex justify-content-between', styles.videoCardsWrap)}>
          {videoList.map((videoItem, i) => {
            return (
              <div
                className={cx(styles.videoCard)}
                key={i}
              >
                <div className={cx('position-relative')}>
                  <img
                    className={cx(styles.videoPoster)}
                    src={videoItem.coverImgUrl}
                    width={341}
                    height={192}
                    alt='video cover'
                  />
                  <span className={cx(styles.videoDuration)}>{videoItem.duration}</span>
                </div>
                <div className={cx(styles.videoInfoWrap)}>
                  <div className={cx(styles.videoTitle)}>{videoItem.title}</div>
                  <div className={cx(styles.videoUploader)}>{videoItem.creator.nickname}</div>
                  <div className={cx(styles.videoIntro)}>{videoItem.description}</div>
                  <div className={cx('d-flex justify-content-between', styles.operateButtons)}>
                    <button
                      type='button'
                      className={cx('btn btn-outline-primary')}
                      onClick={handleClickWatchButton}
                    >
                      Watch video
                    </button>
                    <button
                      type='button'
                      className={cx('btn btn-primary')}
                      onClick={handleClickSubscribeButton}
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
