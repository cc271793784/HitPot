import cx from 'classnames'

import styles from './layout.module.css'

import VideoCardForTimeline from 'components/VideoCardForTimeline'
import VideoCardOptBtnsForTimeline from 'components/VideoCardOptBtnsForTimeline'

import defaultAvatar from 'statics/images/default-avatar.svg'
import { FeedEvent } from 'web-api/video'

interface Props {
  event: FeedEvent
}

const FeedEventForTimeline = (props: Props) => {
  const { event } = props

  return (
    <div className={cx('d-flex w-100')}>
      <img
        className={cx(styles.avatar)}
        src={event.user.avatarImgUrl || defaultAvatar}
        width={32}
        height={32}
        alt=''
      />
      <div className={cx('d-flex flex-grow-1 flex-column', styles.eventDetailWrap)}>
        <p className={cx('mb-0', styles.content)}>
          {event.shareType === 0
            ? event.comment
            : event.shareType === 1
            ? 'Share to Facebook'
            : event.shareType === 2
            ? 'Share to Twitter'
            : 'Post new video'}
        </p>
        <p className={cx('mb-0', styles.time)}>{event.createTime}</p>
        <VideoCardForTimeline
          style={{
            marginTop: '10px',
          }}
          opts={<VideoCardOptBtnsForTimeline videoInfo={event.content} />}
          videoInfo={event.content}
        />
      </div>
    </div>
  )
}

export default FeedEventForTimeline
