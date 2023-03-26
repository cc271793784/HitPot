import cx from 'classnames'
import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'

import styles from './layout.module.css'

import defaultAvatar from 'statics/images/default-avatar.svg'

import VideoPlayTipMask from '../VideoPlayTipMask'
import { VideoDetailInfo } from 'web-api/video'
import { formatDuration } from 'utils/formatDuration'

interface Props {
  style?: React.CSSProperties
  showPlayTipMask: boolean
  opts: React.ReactElement
  videoInfo: VideoDetailInfo
}

const VideoCard = (props: Props) => {
  const { opts, showPlayTipMask, style, videoInfo } = props

  const navigate = useNavigate()

  const handleClickPlay = useCallback(() => {
    navigate(`/video/${videoInfo.contentId}`)
  }, [navigate, videoInfo.contentId])

  return (
    <div
      className={cx(styles.videoCard)}
      style={style}
    >
      <div className={cx('position-relative')}>
        <img
          className={cx(styles.videoPoster)}
          src={videoInfo.coverImgUrl}
          width={682}
          height={384}
          alt=''
        />
        <span className={cx(styles.videoDuration)}>{formatDuration(videoInfo.duration)}</span>
        {showPlayTipMask && (
          <VideoPlayTipMask
            videoId={videoInfo.contentId}
            userLevel={videoInfo.watcherLevel}
            hitCount={videoInfo.balanceHit}
            rewardPercentForViewer={videoInfo.yieldRateOfViewer}
            rewardPercentForSharing={videoInfo.yieldRateOfInfluencer}
            onClickPlay={handleClickPlay}
          />
        )}
      </div>
      <div className={cx(styles.videoInfoWrap)}>
        <div className={cx(styles.videoTitle)}>{videoInfo.title}</div>
        <div className={cx('d-flex align-items-center gap-2 mt-2', styles.videoUploader)}>
          <img
            className={cx(styles.userAvatar)}
            src={videoInfo.creator.avatarImgUrl || defaultAvatar}
            width={24}
            height={24}
            alt=''
          />
          <span className={cx(styles.uploaderName)}>{videoInfo.creator.nickname}</span>
        </div>
        <div className={cx(styles.videoIntro)}>{videoInfo.description}</div>
        <div className={cx(styles.operateButtons)}>{opts}</div>
      </div>
    </div>
  )
}

VideoCard.defaultProps = {
  style: {},
}

export default VideoCard
