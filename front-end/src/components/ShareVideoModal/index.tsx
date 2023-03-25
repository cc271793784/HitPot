import { Modal } from 'react-bootstrap'
import cx from 'classnames'
import { useCallback } from 'react'
import { message } from 'antd'

import styles from './layout.module.css'

import iconLogoDark from 'statics/images/icon-logo-dark.svg'
import iconUrlLink from 'statics/images/icon-url-link.svg'
import logoTwitter from 'statics/images/icon-twitter-logo.svg'
import logoFb from 'statics/images/icon-facebook-logo.svg'

interface Props {
  onClose: () => void
  onSelectShareToHitPot: () => void
  videoId: number
  videoTitle: string
}

const ShareVideoModal = (props: Props) => {
  const { videoId, videoTitle, onClose, onSelectShareToHitPot } = props

  const handleClickCopyLink = useCallback(() => {
    onClose()
    message.success('Link copied to clipboard!')
  }, [onClose])

  const handleClickShareToTwitter = useCallback(() => {
    window.open(
      `https://twitter.com/intent/tweet?text=${videoTitle}%0Ahttps://${window.location.host}/video/${videoId}`,
      '_blank',
    )
  }, [videoId, videoTitle])

  const handleClickShareToFacebook = useCallback(() => {
    onClose()
    message.success('Link copied to clipboard!')
  }, [onClose])

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
              onClick={onSelectShareToHitPot}
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
