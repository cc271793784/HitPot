import cx from 'classnames'
import _ from 'lodash'

import styles from './layout.module.css'

import icoLogo from 'statics/images/icon-logo-dark.svg'
import testVideoPoster from 'statics/images/test-video-poster.png'

export default function AnonymousLanding() {
  return (
    <div className={cx('d-flex flex-column align-items-center', styles.wrap)}>
      <img
        src={icoLogo}
        width={64}
        className={styles.logo}
        alt=''
      />
      <p className={cx('text-center', styles.welcome)}>
        Welcome to the
        <br />
        Decentralized Video-sharing Platform
      </p>
      <p className={cx('text-center', styles.intro)}>HitPot is a new decentralize video-sharing platform</p>
      <div className={cx('d-flex justify-content-between', styles.videoCardsWrap)}>
        {_.times(3).map((i) => {
          return (
            <div
              className={cx(styles.videoCard)}
              key={i}
            >
              <div className={cx('position-relative')}>
                <img
                  className={cx(styles.videoPoster)}
                  src={testVideoPoster}
                  width={341}
                  height={192}
                  alt='video cover'
                />
                <span className={cx(styles.videoDuration)}>22:23</span>
              </div>
              <div className={cx(styles.videoInfoWrap)}>
                <div className={cx(styles.videoTitle)}>I Built a Split wheel Motorcycle, But will it work?</div>
                <div className={cx(styles.videoUploader)}>Bikes and Beards</div>
                <div className={cx(styles.videoIntro)}>
                  -Join our super secret Text Group by texting "2023" to 717.670.8555-M1 Moto Gloves, Tank Straps, and
                  Bikes and Beards Apparel: https://bikesandbeardsgear.com/-Want to rent a motorcycle? Check out Riders
                  Share: https://www.riders-share.com/Follow us on Instagram: https://goo.gl/WKsgVX#BikesandBeards
                </div>
                <div className={cx('d-flex justify-content-between', styles.operateButtons)}>
                  <button
                    type='button'
                    className={cx('btn btn-outline-primary')}
                  >
                    Watch video
                  </button>
                  <button
                    type='button'
                    className={cx('btn btn-primary')}
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
