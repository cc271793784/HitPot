import cx from 'classnames'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from 'react-bootstrap'

import styles from './layout.module.css'

import VideoCard from 'components/VideoCard'
import VideoCardOptBtnsForRecommend from 'components/VideoCardOptBtnsForRecommend'
import VideoCardOptBtnsForIPNFT from 'components/VideoCardOptBtnsForIPNFT'
import FeedEventPostNewVideo from 'components/FeedEventPostNewVideo'

import * as videoApi from 'web-api/video'
import { VideoList } from 'web-api/video'
import { VideoListPageSize } from '../../constants'

type VideoListType = 'recommend' | 'subscription' | 'ipnft'

const OnymousLanding = () => {
  const [videoListType, setVideoListType] = useState<VideoListType>('recommend')
  const videoListTypeRef = useRef<VideoListType>('recommend')
  const lastVideoListTypeRef = useRef<VideoListType>('recommend')
  const [videoList, setVideoList] = useState<VideoList | null>(null)
  const videoListRef = useRef<VideoList | null>(null)
  const [pageNo, setPageNo] = useState(1)

  const setVideoListTypeWrap = useCallback(
    (type: VideoListType) => {
      setVideoListType(type)
      videoListTypeRef.current = type
      lastVideoListTypeRef.current = videoListType
    },
    [videoListType],
  )

  const handleClickLoadMoreButton = useCallback(() => {
    setPageNo((v) => v + 1)
  }, [])

  const updateVideoList = useCallback((list: VideoList, videoListType: VideoListType) => {
    if ((videoListType !== lastVideoListTypeRef.current) === true || videoListRef.current === null) {
      setVideoList(list)
      videoListRef.current = list
    } else {
      const newList = {
        ...list,
        items: videoListRef.current.items.concat(list.items),
      }
      setVideoList(newList)
      videoListRef.current = newList
    }
    lastVideoListTypeRef.current = videoListType
  }, [])

  useEffect(() => {
    if (videoListType === 'recommend') {
      videoApi
        .pageContentByLevel(VideoListPageSize, pageNo)
        .then((result) => {
          if (videoListTypeRef.current === 'recommend') {
            updateVideoList(result, 'recommend')
          }
        })
        .catch(() => {})
    } else if (videoListType === 'subscription') {
      videoApi
        .pageContentBySubscribe(VideoListPageSize, pageNo)
        .then((result) => {
          if (videoListTypeRef.current === 'subscription') {
            updateVideoList(result, 'subscription')
          }
        })
        .catch(() => {})
    } else if (videoListType === 'ipnft') {
      videoApi
        .pageContentByStocking(VideoListPageSize, pageNo)
        .then((result) => {
          if (videoListTypeRef.current === 'ipnft') {
            updateVideoList(result, 'ipnft')
          }
        })
        .catch(() => {})
    }
  }, [pageNo, updateVideoList, videoListType])

  return (
    <div className={cx(styles.wrap)}>
      <ul className={cx('nav nav-tabs', styles.navbar)}>
        <li className='nav-item'>
          <a
            className={cx('nav-link', { active: videoListType === 'recommend' })}
            href='/'
            onClick={(e) => {
              e.preventDefault()
              setVideoListTypeWrap('recommend')
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
              setVideoListTypeWrap('subscription')
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
              setVideoListTypeWrap('ipnft')
            }}
          >
            IP NFTs
          </a>
        </li>
      </ul>
      <div className={cx('d-flex flex-column align-items-center', styles.videoList)}>
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
        {videoListType === 'subscription' &&
          videoList?.items.map((item, i) => {
            return (
              <FeedEventPostNewVideo
                event={{
                  content: 'Post new video',
                  timestamp: Date.now(),
                  trigger: {
                    avatarUrl: '',
                    nickname: '',
                  },
                }}
                videoInfo={{
                  id: 0,
                  title: '',
                  thumbnail: '',
                  description: '',
                  duration: 0,
                  creator: {
                    nickname: '',
                  },
                }}
              />
            )
          })}
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
        {(videoList?.totalPages || 0) > (videoList?.pageNo || 0) && (
          <Button
            className={cx(styles.loadMoreButton)}
            variant='outline-primary'
            onClick={handleClickLoadMoreButton}
          >
            load more
          </Button>
        )}
      </div>
    </div>
  )
}

export default OnymousLanding
