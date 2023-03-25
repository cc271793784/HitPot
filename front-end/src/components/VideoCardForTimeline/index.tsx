import cx from 'classnames'
import { CSSProperties } from 'react'

import styles from './layout.module.css'

import testVideoPoster from 'statics/images/test-video-poster.png'

interface Props {
  style?: CSSProperties
  opts: React.ReactElement
  videoInfo: {
    id: number
    title: string
    description: string
    duration: number
    creator: {
      nickname: string
    }
  }
}

const VideoCardForTimeline = (props: Props) => {
  const { opts, style } = props

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
          <span className={cx(styles.videoDuration)}>22:23</span>
        </div>
        <div className={cx('d-flex flex-grow-1 flex-column', styles.videoIntro)}>
          <h4 className={cx('mb-0', styles.videoTitle)}>I Built a Split wheel Motorcycle, But will it work?</h4>
          <h6 className={cx('mb-0', styles.videoPosterName)}>Bikes and Beards</h6>
          <div className={cx(styles.videoDescription)}>
            Some quick example text to build on the card title and make up the bulk of the card's content.
          </div>
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
