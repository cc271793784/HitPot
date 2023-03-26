import cx from 'classnames'
import _ from 'lodash'

import styles from './layout.module.css'

import VideoCardForTimeline from 'components/VideoCardForTimeline'
import VideoCardOptBtnsForTimeline from 'components/VideoCardOptBtnsForTimeline'
import { VideoDetailInfo } from 'web-api/video'

interface Props {
  event: {
    comment: string
    timestamp: number | string
    trigger: {
      avatarUrl: string
      nickname: string
    }
  }
  videoInfo: VideoDetailInfo
}

const FeedEventPostNewVideo = (props: Props) => {
  const { event, videoInfo } = props

  return (
    <div className={cx('d-flex')}>
      <img
        className={cx(styles.avatar)}
        src={event.trigger.avatarUrl}
        width={32}
        height={32}
        alt=''
      />
      <div className={cx(styles.eventDetailWrap)}>
        <p className={cx('mb-0')}>
          <span className={cx('', styles.nickname)}>{event.trigger.nickname}</span>
          <span className={cx('', styles.time)}>{event.timestamp}</span>
        </p>
        {_.isEmpty(event.comment) === false && <p className={cx('mb-0', styles.content)}>{event.comment}</p>}
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

export default FeedEventPostNewVideo
