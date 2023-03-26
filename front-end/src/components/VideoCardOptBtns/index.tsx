import cx from 'classnames'
import { useCallback, useState } from 'react'

import styles from './layout.module.css'

import ShareVideoModal from 'components/ShareVideoModal'
import ShareToHitPotModal from 'components/ShareToHitPotModal'
import DonateToPosterModal from 'components/DonateToPosterModal'
import BuyIPNFTModal from 'components/BuyIPNFTModal'
import AddHitToVideoModal from 'components/AddHitToVideoModal'

import * as videoApi from 'web-api/video'
import userStore from 'stores/user'
import { observer } from 'mobx-react-lite'

interface Props {
  videoId: number
  videoTitle: string
  liked: boolean
  favorited: boolean
}

const VideoCardOptBtns = (props: Props) => {
  const { videoId, liked, favorited, videoTitle } = props

  const [isLiked, setLiked] = useState(liked)
  const [isFavorited, setFavorited] = useState(favorited)
  const [showShareVideoModal, setShowShareVideoModal] = useState(false)
  const [showShareVideoToHitPotModal, setShowShareVideoToHitPotModal] = useState(false)
  const [showDonateToPosterModal, setShowDonateToPosterModal] = useState(false)
  const [showBuyIPNFTModal, setShowBuyIPNFTModal] = useState(false)
  const [showAddHitToVideoModal, setShowAddHitToVideoModal] = useState(false)

  const handleClickLikeButton = useCallback(() => {
    if (isLiked === false) {
      setLiked(true)
      videoApi
        .like(videoId)
        .then((result) => {
          setLiked(result === true)
        })
        .catch((e) => {
          setLiked(false)
        })
    } else {
      setLiked(false)
      videoApi
        .unlike(videoId)
        .then((result) => {
          setLiked(result === false)
        })
        .catch((e) => {
          setLiked(true)
        })
    }
  }, [isLiked, videoId])

  const handleClickFavoriteButton = useCallback(() => {
    if (isFavorited === false) {
      setFavorited(true)
      videoApi
        .mark(videoId)
        .then((result) => {
          setFavorited(result === true)
        })
        .catch((e) => {
          setFavorited(false)
        })
    } else {
      setLiked(false)
      videoApi
        .unmark(videoId)
        .then((result) => {
          setFavorited(result === false)
        })
        .catch((e) => {
          setFavorited(true)
        })
    }
  }, [isFavorited, videoId])

  const handleClickBuyIPNFTButton = useCallback(() => {
    setShowBuyIPNFTModal(true)
  }, [])

  const handleClickAddHitToVideoButton = useCallback(() => {
    setShowAddHitToVideoModal(true)
  }, [])

  const handleClickShareButton = useCallback(() => {
    setShowShareVideoModal(true)
  }, [])

  const handleClickDonateButton = useCallback(() => {
    setShowDonateToPosterModal(true)
  }, [])

  const handleBuyIPNFTModalClosed = useCallback(() => {
    setShowBuyIPNFTModal(false)
  }, [])

  const handleAddHitToVideoModalClosed = useCallback(() => {
    setShowAddHitToVideoModal(false)
  }, [])

  const handleShareVideoModalClosed = useCallback(() => {
    setShowShareVideoModal(false)
  }, [])

  const handleSelectShareToHitPot = useCallback(() => {
    setShowShareVideoModal(false)
    setShowShareVideoToHitPotModal(true)
  }, [])

  const handleShareVideoToHitPotModalClosed = useCallback(() => {
    setShowShareVideoToHitPotModal(false)
  }, [])

  const handleDonateToPosterModalClosed = useCallback(() => {
    setShowDonateToPosterModal(false)
  }, [])

  return (
    <div className={cx('d-flex justify-content-between align-items-center', styles.wrap)}>
      <div className={cx('d-flex gap-2', styles.left)}>
        <button
          className={cx('btn btn-outline-primary')}
          title=''
          onClick={handleClickBuyIPNFTButton}
        >
          <i className='bi bi-cart'></i>
          <span className={cx('ms-2')}>Buy IP NFT</span>
        </button>
        <button
          className={cx('btn btn-outline-primary')}
          title=''
          onClick={handleClickAddHitToVideoButton}
        >
          <i className='bi bi-fire'></i>
          <span className={cx('ms-2')}>Add HIT</span>
        </button>
      </div>
      <div className={cx('d-flex gap-2', styles.right)}>
        <button
          className={cx('btn btn-outline-primary')}
          title='Like'
          onClick={handleClickLikeButton}
        >
          {isLiked ? <i className='bi bi-hand-thumbs-up-fill'></i> : <i className='bi bi-hand-thumbs-up'></i>}
        </button>
        <button
          className={cx('btn btn-outline-primary')}
          title='Favorite'
          onClick={handleClickFavoriteButton}
        >
          {isFavorited ? <i className='bi bi-heart-fill'></i> : <i className='bi bi-heart'></i>}
        </button>
        <button
          className={cx('btn btn-outline-primary')}
          title='Share'
          onClick={handleClickShareButton}
        >
          <i className='bi bi-share-fill'></i>
        </button>
        <button
          className={cx('btn btn-outline-primary')}
          title='Donate'
          onClick={handleClickDonateButton}
        >
          <i className='bi bi-gift'></i>
        </button>
      </div>
      {showBuyIPNFTModal && (
        <BuyIPNFTModal
          onClose={handleBuyIPNFTModalClosed}
          restVolume={0}
          totalVolume={1000}
          price={400}
        />
      )}
      {showAddHitToVideoModal && (
        <AddHitToVideoModal
          onClose={handleAddHitToVideoModalClosed}
          videoId={videoId}
        />
      )}
      {showShareVideoModal && (
        <ShareVideoModal
          onClose={handleShareVideoModalClosed}
          onSelectShareToHitPot={handleSelectShareToHitPot}
          videoId={videoId}
          videoTitle={videoTitle}
        />
      )}
      {showShareVideoToHitPotModal && (
        <ShareToHitPotModal
          onClose={handleShareVideoToHitPotModalClosed}
          videoId={videoId}
          videoTitle={videoTitle}
          videoThumbnail={''}
          videoUploaderNickname={''}
          videoDescription={''}
        />
      )}
      {showDonateToPosterModal && (
        <DonateToPosterModal
          onClose={handleDonateToPosterModalClosed}
          nickname={userStore.userInfo.nickname}
          avatarUrl={userStore.userInfo.avatarImgUrl}
          walletAddress={userStore.walletAddress}
        />
      )}
    </div>
  )
}

export default observer(VideoCardOptBtns)
