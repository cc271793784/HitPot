import cx from 'classnames'
import { useCallback } from 'react'

import styles from './layout.module.css'

import iconPlay from 'statics/images/icon-play.svg'

import { UserLevel } from 'typings/UserLevel'

import VipBadge from 'components/VipBadge'

interface Props {
  videoId: number
  hitCount: number
  userLevel: UserLevel
  rewardPercentForViewer: number
  rewardPercentForSharing: number
  onClickPlay: (videoId: number) => void
}

const VideoPlayTipMask = (props: Props) => {
  const { videoId, hitCount, userLevel, rewardPercentForViewer, rewardPercentForSharing, onClickPlay } = props

  const handleClickPlayButton = useCallback(() => {
    onClickPlay(videoId)
  }, [onClickPlay, videoId])

  return (
    <div
      className={cx(
        'w-100 h-100 position-absolute top-0 left-0 d-flex flex-column justify-content-center align-items-center',
        styles.playTip,
      )}
    >
      <img
        className={cx(styles.playIcon)}
        src={iconPlay}
        width={72}
        height={72}
        alt='play'
        onClick={handleClickPlayButton}
      />
      <div className={styles.mintTip}>Watch to minting</div>
      <div className={cx('d-flex align-items-center gap-2 mt-1')}>
        <span className={cx('h4 mb-0', styles.hitCount)}>{hitCount} HIT</span>
        <VipBadge level={userLevel} />
      </div>
      <div className={cx('mt-1', styles.rewards)}>
        Reward: {rewardPercentForViewer * 100}% Viewer / {rewardPercentForSharing * 100}% Influencer sharing
      </div>
    </div>
  )
}

export default VideoPlayTipMask
