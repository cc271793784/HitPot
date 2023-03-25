import cx from 'classnames'

import styles from './layout.module.css'

import VideoCardForTimeline from 'components/VideoCardForTimeline'
import VideoCardOptBtnsForTimeline from 'components/VideoCardOptBtnsForTimeline'

import defaultAvatar from 'statics/images/default-avatar.svg'

const FeedEventPostNewVideo = () => {
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
        <p className={cx('mb-0')}>
          <span className={cx('', styles.nickname)}>Tom Ford</span>
          <span className={cx('', styles.time)}>3 hour ago</span>
        </p>
        <p className={cx('mb-0', styles.content)}>Post new video</p>
        <VideoCardForTimeline
          style={{
            marginTop: '10px',
          }}
          opts={<VideoCardOptBtnsForTimeline />}
          videoInfo={{
            id: 0,
            title: '',
            description: '',
            duration: 0,
            creator: {
              nickname: '',
            },
          }}
        />
      </div>
    </div>
  )
}

export default FeedEventPostNewVideo
