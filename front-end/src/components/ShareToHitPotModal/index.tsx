import cx from 'classnames'
import { useCallback, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'

import styles from './layout.module.css'

import * as videoApi from 'web-api/video'

interface Props {
  onClose: () => void
  videoId: number
  videoTitle: string
  videoThumbnail: string
  videoPosterNickname: string
  videoDescription: string
}

const ShareToHitPotModal = (props: Props) => {
  const { videoId, videoTitle, videoThumbnail, videoPosterNickname, videoDescription, onClose } = props

  const [comment, setComment] = useState('')

  const handleInputCommentChanged = useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
    setComment(e.currentTarget.value)
  }, [])

  const handleConfirmShareToTimeline = useCallback(() => {
    // vieoApi.share()
  }, [])

  return (
    <Modal
      show={true}
      onHide={onClose}
      centered
      dialogClassName={cx(styles.shareToHitPotModal)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Share to HitPot</Modal.Title>
      </Modal.Header>
      <Modal.Body className={cx('')}>
        <div
          className={cx(
            'd-flex flex-column justify-content-between align-items-center',
            styles.shareModalBodyContentWrap,
          )}
        >
          <textarea
            className={cx('form-control', styles.inputDescription)}
            placeholder='Comment'
            value={comment}
            rows={4}
            onChange={handleInputCommentChanged}
          />
          <div className={cx('d-flex w-100', styles.videoInfoWrap)}>
            <img
              className={cx('', styles.videoPoster)}
              src={videoThumbnail}
              alt=''
            />
            <div className={cx('d-flex flex-grow-1 flex-column', styles.videoIntro)}>
              <h4 className={cx('mb-0', styles.videoTitle)}>{videoTitle}</h4>
              <h6 className={cx('mb-0', styles.videoPosterName)}>{videoPosterNickname}</h6>
              <div className={cx(styles.videoDescription)}>{videoDescription}</div>
            </div>
          </div>
          <Button
            variant='primary'
            className={cx(styles.shareButton)}
            onClick={handleConfirmShareToTimeline}
          >
            Share to timeline
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ShareToHitPotModal
