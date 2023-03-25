import cx from 'classnames'
import { useCallback, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import _ from 'lodash'

import styles from './layout.module.css'

import VideoCard from 'components/VideoCard'
import VideoCardOptBtnsForLiked from 'components/VideoCardOptBtnsForLiked'
import VideoCardOptBtnsForFavorited from 'components/VideoCardOptBtnsForSubscription'
import VideoCardOptBtnsForShared from 'components/VideoCardOptBtnsForShared'
import VideoCardOptBtnsForOwnedIPNFT from 'components/VideoCardOptBtnsForOwnedIPNFT'
import VideoCardOptBtnsForMyPost from 'components/VideoCardOptBtnsForMyPost'

import type { VideoList } from 'web-api/video'
import * as videoApi from 'web-api/video'
import userStore from 'stores/user'
import { Empty } from 'antd'
import FeedEventShareVideo from 'components/FeedEventShareVideo'

type VideoListType = 'liked' | 'favorited' | 'timeline' | 'my ipnft' | 'my post' | 'history'

const Home = () => {
  const [videoListType, setVideoListType] = useState<VideoListType>('liked')
  const videoListTypeRef = useRef<VideoListType>('liked')
  const [videoList, setVideoList] = useState<VideoList | null>(null)

  const setVideoListTypeWrap = useCallback((type: VideoListType) => {
    setVideoListType(type)
    videoListTypeRef.current = type
  }, [])

  useEffect(() => {
    if (videoListType === 'liked') {
      videoApi
        .pageContentByLiked(10, 1)
        .then((result) => {
          if (videoListTypeRef.current === 'liked') {
            setVideoList(result)
          }
        })
        .catch(() => {})
    } else if (videoListType === 'favorited') {
      videoApi
        .pageContentByMarked(10, 1)
        .then((result) => {
          if (videoListTypeRef.current === 'favorited') {
            setVideoList(result)
          }
        })
        .catch(() => {})
    } else if (videoListType === 'timeline') {
      videoApi
        .pageContentByShared(10, 1)
        .then((result) => {
          if (videoListTypeRef.current === 'timeline') {
            setVideoList(result)
          }
        })
        .catch(() => {})
    } else if (videoListType === 'my ipnft') {
      videoApi
        .pageContentByStock(10, 1)
        .then((result) => {
          if (videoListTypeRef.current === 'my ipnft') {
            setVideoList(result)
          }
        })
        .catch(() => {})
    } else if (videoListType === 'my post') {
      videoApi
        .pageMyContent(10, 1)
        .then((result) => {
          if (videoListTypeRef.current === 'my post') {
            setVideoList(result)
          }
        })
        .catch(() => {})
    } else if (videoListType === 'history') {
      videoApi
        .pageContentByWatched(10, 1)
        .then((result) => {
          if (videoListTypeRef.current === 'history') {
            setVideoList(result)
          }
        })
        .catch(() => {})
    }
  }, [videoListType])

  return (
    <div className={cx(styles.wrap)}>
      <div className={cx('d-flex justify-content-start align-items-center gap-3', styles.accountInfo)}>
        <img
          src={userStore.userInfo.avatarImgUrl}
          width={64}
          height={64}
          className={styles.avatar}
          alt=''
        />
        <div className={cx('d-flex flex-column')}>
          <p className={cx('h5 mb-0', styles.nickname)}>{userStore.userInfo.nickname}</p>
          <p className={cx('mt-1 mb-0', styles.address)}>{userStore.walletAddress}</p>
        </div>
      </div>
      <ul className={cx('nav nav-tabs', styles.navbar)}>
        <li className='nav-item'>
          <a
            className={cx('nav-link', { active: videoListType === 'liked' })}
            href='/'
            onClick={(e) => {
              e.preventDefault()
              setVideoListTypeWrap('liked')
            }}
          >
            Like
          </a>
        </li>
        <li className='nav-item'>
          <a
            className={cx('nav-link', { active: videoListType === 'favorited' })}
            href='/'
            onClick={(e) => {
              e.preventDefault()
              setVideoListTypeWrap('favorited')
            }}
          >
            Favorite
          </a>
        </li>
        <li className='nav-item'>
          <a
            className={cx('nav-link', { active: videoListType === 'timeline' })}
            href='/'
            onClick={(e) => {
              e.preventDefault()
              setVideoListTypeWrap('timeline')
            }}
          >
            Timeline
          </a>
        </li>
        <li className='nav-item'>
          <a
            className={cx('nav-link', { active: videoListType === 'my ipnft' })}
            href='/'
            onClick={(e) => {
              e.preventDefault()
              setVideoListTypeWrap('my ipnft')
            }}
          >
            My IP NFTs
          </a>
        </li>
        <li className='nav-item'>
          <a
            className={cx('nav-link', { active: videoListType === 'my post' })}
            href='/'
            onClick={(e) => {
              e.preventDefault()
              setVideoListTypeWrap('my post')
            }}
          >
            My Posts
          </a>
        </li>
        <li className='nav-item'>
          <a
            className={cx('nav-link', { active: videoListType === 'history' })}
            href='/'
            onClick={(e) => {
              e.preventDefault()
              setVideoListTypeWrap('history')
            }}
          >
            History
          </a>
        </li>
      </ul>
      <div className={cx('d-flex flex-column', styles.videoList)}>
        {_.isEmpty(videoList?.items) === true && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>暂无视频</span>}
          ></Empty>
        )}
        {videoListType === 'liked' &&
          _.isEmpty(videoList?.items) === false &&
          videoList?.items.map((videoItem, i) => {
            return (
              <VideoCard
                key={`liked-${i}`}
                showPlayTipMask
                videoInfo={{
                  id: videoItem.contentId,
                  title: videoItem.title,
                  description: videoItem.description,
                  watcherLevel: videoItem.watcherLevel,
                  balanceHit: videoItem.balanceHit,
                  duration: videoItem.duration,
                  rewardPercentForViewer: 10,
                  rewardPercentForSharing: 10,
                  creator: {
                    avatarUrl: videoItem.creator.avatarImgUrl,
                    nickname: videoItem.creator.nickname,
                    userId: videoItem.creator.userId,
                  },
                }}
                opts={
                  <VideoCardOptBtnsForLiked
                    videoId={videoItem.contentId}
                    videoTitle={videoItem.title}
                    liked={videoItem.liked}
                    favorited={videoItem.marked}
                  />
                }
              />
            )
          })}
        {videoListType === 'favorited' &&
          _.isEmpty(videoList?.items) === false &&
          videoList?.items.map((videoItem, i) => {
            return (
              <VideoCard
                key={`favorited-${i}`}
                showPlayTipMask
                videoInfo={{
                  id: videoItem.contentId,
                  title: videoItem.title,
                  description: videoItem.description,
                  watcherLevel: videoItem.watcherLevel,
                  balanceHit: videoItem.balanceHit,
                  duration: videoItem.duration,
                  rewardPercentForViewer: 10,
                  rewardPercentForSharing: 10,
                  creator: {
                    avatarUrl: videoItem.creator.avatarImgUrl,
                    nickname: videoItem.creator.nickname,
                    userId: videoItem.creator.userId,
                  },
                }}
                opts={
                  <VideoCardOptBtnsForFavorited
                    videoId={videoItem.contentId}
                    videoTitle={videoItem.title}
                    liked={videoItem.liked}
                    favorited={videoItem.marked}
                  />
                }
              />
            )
          })}
        {videoListType === 'timeline' &&
          _.isEmpty(videoList?.items) === false &&
          videoList?.items.map((videoItem, i) => {
            return <FeedEventShareVideo key={`timeline-${i}`} />
          })}
        {videoListType === 'my ipnft' &&
          _.isEmpty(videoList?.items) === false &&
          videoList?.items.map((videoItem, i) => {
            return (
              <VideoCard
                key={`my-ipnft-${i}`}
                showPlayTipMask
                videoInfo={{
                  id: videoItem.contentId,
                  title: videoItem.title,
                  description: videoItem.description,
                  watcherLevel: videoItem.watcherLevel,
                  balanceHit: videoItem.balanceHit,
                  duration: videoItem.duration,
                  rewardPercentForViewer: 10,
                  rewardPercentForSharing: 10,
                  creator: {
                    avatarUrl: videoItem.creator.avatarImgUrl,
                    nickname: videoItem.creator.nickname,
                    userId: videoItem.creator.userId,
                  },
                }}
                opts={<VideoCardOptBtnsForOwnedIPNFT />}
              />
            )
          })}
        {videoListType === 'my post' &&
          _.isEmpty(videoList?.items) === false &&
          videoList?.items.map((videoItem, i) => {
            return (
              <VideoCard
                key={`my-post-${i}`}
                showPlayTipMask
                videoInfo={{
                  id: videoItem.contentId,
                  title: videoItem.title,
                  description: videoItem.description,
                  watcherLevel: videoItem.watcherLevel,
                  balanceHit: videoItem.balanceHit,
                  duration: videoItem.duration,
                  rewardPercentForViewer: 10,
                  rewardPercentForSharing: 10,
                  creator: {
                    avatarUrl: videoItem.creator.avatarImgUrl,
                    nickname: videoItem.creator.nickname,
                    userId: videoItem.creator.userId,
                  },
                }}
                opts={
                  <VideoCardOptBtnsForMyPost
                    videoId={videoItem.contentId}
                    videoTitle={videoItem.title}
                    liked={videoItem.liked}
                    favorited={videoItem.marked}
                  />
                }
              />
            )
          })}
      </div>
    </div>
  )
}

export default observer(Home)