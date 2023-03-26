import cx from 'classnames'
import { CSSProperties } from 'react'

import styles from './layout.module.css'

import testVideoPoster from 'statics/images/test-video-poster.png'
import { VideoDetailInfo } from 'web-api/video'
import { formatDuration } from 'utils/formatDuration'

interface Props {
  style?: CSSProperties
  opts: React.ReactElement
  videoInfo: VideoDetailInfo
}

const VideoCardForTimeline = (props: Props) => {
  const { opts, style, videoInfo } = props

  return (
    <div
      className={cx(styles.wrap)}
      style={style}
    >
      <div className={cx('d-flex w-100', styles.videoInfoWrap)}>
        <div className={cx('position-relative', styles.videoInfoLeft)}>
          <img
            className={cx('', styles.videoPoster)}
            src={testVideoPoster}
            alt=''
          />
          <span className={cx(styles.videoDuration)}>{formatDuration(videoInfo.duration)}</span>
        </div>
        <div className={cx('d-flex flex-grow-1 flex-column', styles.videoIntro)}>
          <h4 className={cx('mb-0', styles.videoTitle)}>{videoInfo.title}</h4>
          <h6 className={cx('mb-0', styles.videoPosterName)}>{videoInfo.creator.nickname}</h6>
          <div className={cx(styles.videoDescription)}>{videoInfo.description}</div>
        </div>
      </div>
      <div className={cx(styles.buttonsWrap)}>{opts}</div>
    </div>
  )
}

VideoCardForTimeline.defaultProps = {
  style: {},
}

export default VideoCardForTimeline
