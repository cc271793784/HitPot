import cx from 'classnames'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from 'react-bootstrap'
import { LoadingOutlined } from '@ant-design/icons'
import { Empty } from 'antd'
import _ from 'lodash'
import { flushSync } from 'react-dom'

import styles from './layout.module.css'

import defaultAvatar from 'statics/images/default-avatar.svg'

import VideoCard from 'components/VideoCard'
import VideoCardOptBtnsForRecommend from 'components/VideoCardOptBtnsForRecommend'
import VideoCardOptBtnsForIPNFT from 'components/VideoCardOptBtnsForIPNFT'
import FeedEventForSubscription from 'components/FeedEventForSubscription'

import { VideoList, FeedEventList } from 'web-api/video'
import * as videoApi from 'web-api/video'
import { VideoListPageSize } from '../../constants'

type VideoListType = 'recommend' | 'subscription' | 'ipnft'

const OnymousLanding = () => {
  const [videoListType, setVideoListType] = useState<VideoListType>('recommend')
  const videoListTypeRef = useRef<VideoListType>('recommend')
  const lastVideoListTypeRef = useRef<VideoListType>('recommend')
  const [videoList, setVideoList] = useState<VideoList | null>(null)
  const videoListRef = useRef<VideoList | null>(null)
  const [feedEventList, setFeedEventList] = useState<FeedEventList | null>(null)
  const feedEventListRef = useRef<FeedEventList | null>(null)
  const [pageNo, setPageNo] = useState(1)
  const [isLoadingData, setIsLoadingData] = useState(true)

  const setVideoListTypeWrap = useCallback(
    (type: VideoListType) => {
      flushSync(() => {
        setVideoListType(type)
        videoListTypeRef.current = type
        lastVideoListTypeRef.current = videoListType
        setVideoList(null)
        videoListRef.current = null
        setFeedEventList(null)
        feedEventListRef.current = null
        setPageNo(1)
        setIsLoadingData(true)
      })
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

  const updateFeedEventList = useCallback(
    (list: FeedEventList) => {
      if (feedEventListRef.current === null) {
        setFeedEventList(list)
        feedEventListRef.current = list
      } else {
        const newList = {
          ...list,
          items: feedEventListRef.current.items.concat(list.items),
        }
        setFeedEventList(newList)
        feedEventListRef.current = newList
      }
      lastVideoListTypeRef.current = videoListType
    },
    [videoListType],
  )

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
        .finally(() => {
          setIsLoadingData(false)
        })
    } else if (videoListType === 'subscription') {
      videoApi
        .pageContentBySubscribe(VideoListPageSize, pageNo)
        .then((result) => {
          if (videoListTypeRef.current === 'subscription') {
            updateFeedEventList(result)
          }
        })
        .catch(() => {})
        .finally(() => {
          setIsLoadingData(false)
        })
    } else if (videoListType === 'ipnft') {
      videoApi
        .pageContentByStocking(VideoListPageSize, pageNo)
        .then((result) => {
          if (videoListTypeRef.current === 'ipnft') {
            updateVideoList(result, 'ipnft')
          }
        })
        .catch(() => {})
        .finally(() => {
          setIsLoadingData(false)
        })
    }
  }, [pageNo, updateFeedEventList, updateVideoList, videoListType])

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
              setPageNo(1)
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
        {isLoadingData && <LoadingOutlined style={{ fontSize: 48, marginTop: 30 }} />}
        {isLoadingData === false &&
          _.isEmpty(videoList?.items) === true &&
          _.isEmpty(feedEventList?.items) === true && (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span>No Data</span>}
            ></Empty>
          )}
        {videoListType === 'recommend' &&
          videoList?.items.map((item, i) => {
            return (
              <VideoCard
                key={`recommend-${i}`}
                opts={<VideoCardOptBtnsForRecommend videoInfo={item} />}
                showPlayTipMask
                videoInfo={item}
              />
            )
          })}
        {videoListType === 'subscription' &&
          feedEventList?.items.map((item, i) => {
            return (
              <FeedEventForSubscription
                key={`subscription-${i}`}
                event={item}
              />
            )
          })}
        {videoListType === 'ipnft' &&
          videoList?.items.map((item, i) => {
            return (
              <VideoCard
                key={`ipnft-${i}`}
                opts={<VideoCardOptBtnsForIPNFT videoInfo={item} />}
                showPlayTipMask={false}
                videoInfo={item}
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
