import cx from 'classnames'
import _ from 'lodash'

import styles from './layout.module.css'

import defaultAvatar from 'statics/images/default-avatar.svg'

import VideoCardForTimeline from 'components/VideoCardForTimeline'
import VideoCardOptBtnsForTimeline from 'components/VideoCardOptBtnsForTimeline'
import { FeedEvent } from 'web-api/video'

interface Props {
  event: FeedEvent
}

const FeedEventForSubscription = (props: Props) => {
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
        <p className={cx('mb-0')}>
          <span className={cx('', styles.nickname)}>{event.user.nickname}</span>
          <span className={cx('', styles.time)}>{event.createTime}</span>
        </p>
        {event.shareType === 3 && <p className={cx('mb-0', styles.content)}>Post new video</p>}
        {event.shareType !== 3 && _.isEmpty(event.comment) === false && (
          <p className={cx('mb-0', styles.content)}>{event.comment}</p>
        )}
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

export default FeedEventForSubscription
