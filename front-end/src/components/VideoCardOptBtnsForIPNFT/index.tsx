import cx from 'classnames'
import { useCallback, useState } from 'react'

import styles from './layout.module.css'

import { VideoDetailInfo } from 'web-api/video'
import BuyIPNFTModal from 'components/BuyIPNFTModal'

interface Props {
  videoInfo: VideoDetailInfo
}

const VideoCardOptBtnsForIPNFT = (props: Props) => {
  const { videoInfo } = props

  const [showBuyIPNFTModal, setShowBuyIPNFTModal] = useState(false)

  const handleClickBuyIPNFTButton = useCallback(() => {
    setShowBuyIPNFTModal(true)
  }, [])

  const handleBuyIPNFTModalClosed = useCallback(() => {
    setShowBuyIPNFTModal(false)
  }, [])

  return (
    <>
      <div className={cx('d-flex justify-content-between align-items-center', styles.wrap)}>
        <div className={cx('d-flex flex-column align-items-start', styles.left)}>
          <div className={cx(styles.floorPriceTitle)}>floor price</div>
          <div className={cx('h4 mt-1 mb-0', styles.floorPrice)}>{videoInfo.priceIpNft} POT</div>
        </div>
        <div className={cx('d-flex flex-column align-items-start', styles.middle)}>
          <div className={cx(styles.volumeTitle)}>volume</div>
          <div className={cx('d-flex  mt-1', styles.volume)}>
            {videoInfo.countIpNftLeft === 0 ? (
              <div className={cx('h4 mb-0', styles.totalVolume)}>SOLD OUT</div>
            ) : (
              <>
                <div className={cx('h4 mb-0', styles.restVolume)}>{videoInfo.countIpNftLeft}</div>
                <div className={cx('h4 mb-0', styles.restVolume)}>&nbsp;/&nbsp;</div>
                <div className={cx('h4 mb-0', styles.totalVolume)}>{videoInfo.countIpNft}</div>
              </>
            )}
          </div>
        </div>
        <button
          className={cx('btn btn-primary btn-lg')}
          title=''
          onClick={handleClickBuyIPNFTButton}
        >
          <i className='bi bi-cart'></i>
          <span className={cx('ms-2')}>Buy IP NFT</span>
        </button>
      </div>
      {showBuyIPNFTModal && (
        <BuyIPNFTModal
          videoInfo={videoInfo}
          onClose={handleBuyIPNFTModalClosed}
        />
      )}
    </>
  )
}

export default VideoCardOptBtnsForIPNFT
