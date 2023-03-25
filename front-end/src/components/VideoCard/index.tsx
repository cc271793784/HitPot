import cx from 'classnames'

import styles from './layout.module.css'

import testVideoPoster from 'statics/images/test-video-poster.png'
import defaultAvatar from 'statics/images/default-avatar.svg'

import VideoPlayTipMask from '../VideoPlayTipMask'
import { UserLevel } from 'typings/UserLevel'

interface Props {
  style?: React.CSSProperties
  showPlayTipMask: boolean
  opts: React.ReactElement
  videoInfo: {
    id: number
    title: string
    description: string
    watcherLevel: UserLevel
    balanceHit: number
    duration: number
    rewardPercentForViewer: number
    rewardPercentForSharing: number
    creator: {
      avatarUrl: string
      userId: string
      nickname: string
    }
  }
}

const VideoCard = (props: Props) => {
  const { opts, showPlayTipMask, style, videoInfo } = props

  return (
    <div
      className={cx(styles.videoCard)}
      style={style}
    >
      <div className={cx('position-relative')}>
        <img
          className={cx(styles.videoPoster)}
          src={testVideoPoster}
          width={682}
          height={384}
          alt=''
        />
        <span className={cx(styles.videoDuration)}>{videoInfo.duration}</span>
        {showPlayTipMask && (
          <VideoPlayTipMask
            videoId={videoInfo?.id}
            userLevel={videoInfo?.watcherLevel}
            hitCount={videoInfo.balanceHit}
            rewardPercentForViewer={videoInfo.rewardPercentForViewer}
            rewardPercentForSharing={videoInfo.rewardPercentForSharing}
          />
        )}
      </div>
      <div className={cx(styles.videoInfoWrap)}>
        <div className={cx(styles.videoTitle)}>{videoInfo?.title}</div>
        <div className={cx('d-flex align-items-center gap-2 mt-2', styles.videoUploader)}>
          <img
            className={cx(styles.userAvatar)}
            src={videoInfo.creator.avatarUrl || defaultAvatar}
            width={24}
            height={24}
            alt=''
          />
          <span className={cx(styles.uploaderName)}>{videoInfo.creator.nickname}</span>
        </div>
        <div className={cx(styles.videoIntro)}>{videoInfo?.description}</div>
        <div className={cx(styles.operateButtons)}>{opts}</div>
      </div>
    </div>
  )
}

VideoCard.defaultProps = {
  style: {},
}

export default VideoCard
