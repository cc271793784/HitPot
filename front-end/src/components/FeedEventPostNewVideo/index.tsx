import cx from 'classnames'

import styles from './layout.module.css'

import VideoCardForTimeline from 'components/VideoCardForTimeline'
import VideoCardOptBtnsForTimeline from 'components/VideoCardOptBtnsForTimeline'

interface Props {
  event: {
    content: string
    timestamp: number
    trigger: {
      avatarUrl: string
      nickname: string
    }
  }
  videoInfo: {
    id: number
    title: string
    thumbnail: string
    description: string
    duration: number
    creator: {
      nickname: string
    }
  }
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
        <p className={cx('mb-0', styles.content)}>{event.content}</p>
        <VideoCardForTimeline
          style={{
            marginTop: '10px',
          }}
          opts={<VideoCardOptBtnsForTimeline />}
          videoInfo={{
            id: videoInfo.id,
            title: videoInfo.title,
            description: videoInfo.description,
            duration: videoInfo.duration,
            creator: {
              nickname: videoInfo.creator.nickname,
            },
          }}
        />
      </div>
    </div>
  )
}

export default FeedEventPostNewVideo
