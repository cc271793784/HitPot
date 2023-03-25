import cx from 'classnames'

import styles from './layout.module.css'

const VideoCardOptBtnsForOwnedIPNFT = (props: any) => {
  return (
    <div className={cx('d-flex justify-content-start align-items-center', styles.wrap)}>
      <div className={cx('d-flex flex-column align-items-start', styles.left)}>
        <div className={cx(styles.nftCountTitle)}>OWNED VOLUME</div>
        <div className={cx('h4 mt-1 mb-0', styles.nftCount)}>400</div>
      </div>
    </div>
  )
}

export default VideoCardOptBtnsForOwnedIPNFT
