import cx from 'classnames'

import styles from './layout.module.css'

import VideoCardForTimeline from 'components/VideoCardForTimeline'
import VideoCardOptBtnsForTimeline from 'components/VideoCardOptBtnsForTimeline'

import defaultAvatar from 'statics/images/default-avatar.svg'
import { VideoDetailInfo } from 'web-api/video'

interface Props {
  videoInfo: VideoDetailInfo
}

const FeedEventShareVideo = (props: Props) => {
  const { videoInfo } = props

  return (
    <div className={cx('d-flex')}>
      <img
        className={cx(styles.avatar)}
        src={defaultAvatar}
        width={32}
        height={32}
        alt=''
      />
      <div className={cx(styles.eventDetailWrap)}>
        <p className={cx('mb-0', styles.content)}>Shared to Facebook</p>
        <p className={cx('mb-0', styles.time)}>Post new video</p>
        <VideoCardForTimeline
          style={{
            marginTop: '10px',
          }}
          opts={<VideoCardOptBtnsForTimeline videoInfo={videoInfo} />}
          videoInfo={videoInfo}
        />
      </div>
    </div>
  )
}

export default FeedEventShareVideo
