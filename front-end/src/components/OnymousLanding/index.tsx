import cx from 'classnames'
import { useEffect, useRef, useState } from 'react'

import styles from './layout.module.css'

import VideoCard from 'components/VideoCard'
import VideoCardOptBtnsForRecommend from 'components/VideoCardOptBtnsForRecommend'
import VideoCardOptBtnsForIPNFT from 'components/VideoCardOptBtnsForIPNFT'
import FeedEventPostNewVideo from 'components/FeedEventPostNewVideo'

import * as videoApi from 'web-api/video'
import { VideoList } from 'web-api/video'

type VideoListType = 'recommend' | 'subscription' | 'ipnft'

const OnymousLanding = () => {
  const [videoListType, setVideoListType] = useState<VideoListType>('recommend')
  const videoListTypeRef = useRef<VideoListType>('recommend')
  const [videoList, setVideoList] = useState<VideoList | null>(null)

  useEffect(() => {
    if (videoListType === 'recommend') {
      videoApi
        .pageContentByLevel(10, 1)
        .then((result) => {
          if (videoListTypeRef.current === 'recommend') {
            setVideoList(result)
          }
        })
        .catch(() => {})
    } else if (videoListType === 'subscription') {
      videoApi
        .pageContentBySubscribe(10, 1)
        .then((result) => {
          if (videoListTypeRef.current === 'subscription') {
            setVideoList(result)
          }
        })
        .catch(() => {})
    } else if (videoListType === 'ipnft') {
      videoApi
        .pageContentByStocking(10, 1)
        .then((result) => {
          if (videoListTypeRef.current === 'ipnft') {
            setVideoList(result)
          }
        })
        .catch(() => {})
    }
  }, [videoListType])

  return (
    <div className={cx(styles.wrap)}>
      <ul className={cx('nav nav-tabs', styles.navbar)}>
        <li className='nav-item'>
          <a
            className={cx('nav-link', { active: videoListType === 'recommend' })}
            href='/'
            onClick={(e) => {
              e.preventDefault()
              setVideoListType('recommend')
              videoListTypeRef.current = 'recommend'
            }}
          >
            Recommend
          </a>
        </li>
        <li className='nav-item'>
          <a
            className={cx('nav-link', { active: videoListType === 'subscription' })}
            href='/'
            onClick={(e) => {
              e.preventDefault()
              setVideoListType('subscription')
              videoListTypeRef.current = 'subscription'
            }}
          >
            Subscriptions
          </a>
        </li>
        <li className='nav-item'>
          <a
            className={cx('nav-link', { active: videoListType === 'ipnft' })}
            href='/'
            onClick={(e) => {
              e.preventDefault()
              setVideoListType('ipnft')
              videoListTypeRef.current = 'ipnft'
            }}
          >
            IP NFTs
          </a>
        </li>
      </ul>
      <div className={cx('d-flex flex-column', styles.videoList)}>
        {videoListType === 'recommend' &&
          videoList?.items.map(() => {
            return (
              <VideoCard
                opts={<VideoCardOptBtnsForRecommend />}
                showPlayTipMask
                videoInfo={{
                  id: 0,
                  title: '',
                  description: '',
                  watcherLevel: 0,
                  balanceHit: 0,
                  duration: 0,
                  rewardPercentForViewer: 0,
                  rewardPercentForSharing: 0,
                  creator: {
                    avatarUrl: '',
                    userId: '',
                    nickname: '',
                  },
                }}
              />
            )
          })}
        {videoListType === 'subscription' && (
          // videoList?.items.map(() => {
          //   return <VideoCardForTimeline opts={<VideoCardOptBtnsForFavorited />} />
          // })
          <FeedEventPostNewVideo />
        )}
        {videoListType === 'ipnft' &&
          videoList?.items.map(() => {
            return (
              <VideoCard
                opts={<VideoCardOptBtnsForIPNFT />}
                showPlayTipMask={false}
                videoInfo={{
                  id: 0,
                  title: '',
                  description: '',
                  watcherLevel: 0,
                  balanceHit: 0,
                  duration: 0,
                  rewardPercentForViewer: 0,
                  rewardPercentForSharing: 0,
                  creator: {
                    avatarUrl: '',
                    userId: '',
                    nickname: '',
                  },
                }}
              />
            )
          })}
      </div>
    </div>
  )
}

export default OnymousLanding
