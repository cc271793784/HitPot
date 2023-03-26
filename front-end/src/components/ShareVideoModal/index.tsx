import { Modal } from 'react-bootstrap'
import cx from 'classnames'
import { useCallback } from 'react'
import { message } from 'antd'
import copy from 'copy-text-to-clipboard'

import styles from './layout.module.css'

import iconLogoDark from 'statics/images/icon-logo-dark.svg'
import iconUrlLink from 'statics/images/icon-url-link.svg'
import logoTwitter from 'statics/images/icon-twitter-logo.svg'
import logoFb from 'statics/images/icon-facebook-logo.svg'

import { share, VideoDetailInfo } from 'web-api/video'

interface Props {
  onClose: () => void
  onSelectShareToHitPot: () => void
  videoInfo: VideoDetailInfo
}

const ShareVideoModal = (props: Props) => {
  const { videoInfo, onClose, onSelectShareToHitPot } = props

  const handleClickShareToHitPot = useCallback(() => {
    onSelectShareToHitPot()
  }, [onSelectShareToHitPot])

  const handleClickCopyLink = useCallback(() => {
    copy(`https://${window.location.host}/video/${videoInfo.contentId}`)
    onClose()
    message.success('Link copied to clipboard!')
  }, [onClose, videoInfo.contentId])

  const handleClickShareToTwitter = useCallback(() => {
    share('', videoInfo.contentId, 2)
      .then((result) => {
        const text = `${videoInfo.title}\n${window.location.host}/video/${videoInfo.contentId}?utmContent=${result.utmContent}`
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
      })
      .catch(() => {})
    onClose()
  }, [onClose, videoInfo.contentId, videoInfo.title])

  const handleClickShareToFacebook = useCallback(() => {
    share('', videoInfo.contentId, 1)
      .then((result) => {})
      .catch(() => {})
    copy(`https://${window.location.host}/video/${videoInfo.contentId}`)
    onClose()
    message.success('Link copied to clipboard!')
  }, [onClose, videoInfo.contentId])

  return (
    <Modal
      show={true}
      onHide={onClose}
      centered
      dialogClassName={cx(styles.shareModal)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Share Video</Modal.Title>
      </Modal.Header>
      <Modal.Body className={cx('')}>
        <div className={cx('d-flex justify-content-center gap-5 align-items-center', styles.shareModalBodyContentWrap)}>
          <div className={cx('d-flex flex-column align-items-center', styles.shareWrap)}>
            <img
              src={iconLogoDark}
              width={64}
              className={styles.logo}
              alt=''
              onClick={handleClickShareToHitPot}
            />
            <span className={cx(styles.logoTitle)}>HitPot</span>
          </div>
          <div className={cx('d-flex flex-column align-items-center', styles.shareWrap)}>
            <img
              src={iconUrlLink}
              width={64}
              className={styles.logo}
              alt=''
              onClick={handleClickCopyLink}
            />
            <span className={cx(styles.logoTitle)}>Copy link</span>
          </div>
          <div className={cx('d-flex flex-column align-items-center', styles.shareWrap)}>
            <img
              src={logoTwitter}
              width={64}
              className={styles.logo}
              alt=''
              onClick={handleClickShareToTwitter}
            />
            <span className={cx(styles.logoTitle)}>Twitter</span>
          </div>
          <div className={cx('d-flex flex-column align-items-center', styles.shareWrap)}>
            <img
              src={logoFb}
              width={64}
              className={styles.logo}
              alt=''
              onClick={handleClickShareToFacebook}
            />
            <span className={cx(styles.logoTitle)}>Facebook</span>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ShareVideoModal
