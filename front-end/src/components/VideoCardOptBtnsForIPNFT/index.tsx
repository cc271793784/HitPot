import cx from 'classnames'

import styles from './layout.module.css'

const VideoCardOptBtnsForIPNFT = () => {
  return (
    <div className={cx('d-flex justify-content-between align-items-center', styles.wrap)}>
      <div className={cx('d-flex flex-column align-items-start', styles.left)}>
        <div className={cx(styles.floorPriceTitle)}>floor price</div>
        <div className={cx('h4 mt-1 mb-0', styles.floorPrice)}>400 POT</div>
      </div>
      <div className={cx('d-flex flex-column align-items-start', styles.middle)}>
        <div className={cx(styles.volumeTitle)}>volume</div>
        <div className={cx('d-flex  mt-1', styles.volume)}>
          {true ? (
            <div className={cx('h4 mb-0', styles.totalVolume)}>SOLD OUT</div>
          ) : (
            <>
              <div className={cx('h4 mb-0', styles.restVolume)}>300</div>
              <div className={cx('h4 mb-0', styles.restVolume)}>&nbsp;/&nbsp;</div>
              <div className={cx('h4 mb-0', styles.totalVolume)}>1000</div>
            </>
          )}
        </div>
      </div>
      <button
        className={cx('btn btn-primary btn-lg')}
        title=''
      >
        <i className='bi bi-cart'></i>
        <span className={cx('ms-2')}>Buy IP NFT</span>
      </button>
    </div>
  )
}

export default VideoCardOptBtnsForIPNFT
