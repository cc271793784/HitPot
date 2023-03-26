import cx from 'classnames'
import { ChangeEvent, useCallback, useState } from 'react'
import { Button, Form, FormControl, Modal } from 'react-bootstrap'
import _ from 'lodash'
import { message } from 'antd'

import styles from './layout.module.css'

import { share, VideoDetailInfo } from 'web-api/video'

interface Props {
  onClose: () => void
  videoInfo: VideoDetailInfo
}

const ShareToHitPotModal = (props: Props) => {
  const { videoInfo, onClose } = props

  const [comment, setComment] = useState('')
  const [hasValidatedForm, setHasValidatedForm] = useState(false)
  const [isCommentValid, setIsCommentValid] = useState(true)

  const handleInputCommentChanged = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.currentTarget.value)
  }, [])

  const handleConfirmShareToTimeline = useCallback(() => {
    let formValid = true

    if (comment === '') {
      formValid = false
      setIsCommentValid(false)
    }

    setHasValidatedForm(true)
    if (formValid === false) {
      return
    }

    share(comment, videoInfo.contentId, 0)
      .then(() => {
        onClose()
        message.success('Share successful')
      })
      .catch(() => {
        message.error('Share failed')
      })
      .finally(() => {})
  }, [comment, onClose, videoInfo.contentId])

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
          <Form
            noValidate
            validated={hasValidatedForm}
            className={cx('w-100')}
          >
            <Form.Group>
              <Form.Control
                as='textarea'
                placeholder='Comment'
                value={comment}
                rows={4}
                required
                onChange={handleInputCommentChanged}
              />
              {isCommentValid === false && (
                <FormControl.Feedback type='invalid'>Please input comment</FormControl.Feedback>
              )}
            </Form.Group>
          </Form>
          <div className={cx('d-flex w-100', styles.videoInfoWrap)}>
            <img
              className={cx('', styles.videoPoster)}
              src={videoInfo.coverImgUrl}
              alt=''
            />
            <div className={cx('d-flex flex-grow-1 flex-column', styles.videoIntro)}>
              <h4 className={cx('mb-0', styles.videoTitle)}>{videoInfo.title}</h4>
              <h6 className={cx('mb-0', styles.videoPosterName)}>{videoInfo.creator.nickname}</h6>
              <div className={cx(styles.videoDescription)}>{videoInfo.description}</div>
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
