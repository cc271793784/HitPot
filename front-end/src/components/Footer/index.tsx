import cx from 'classnames'

import styles from './layout.module.css'

import logoImage from 'statics/images/icon-logo-light.svg'

export default function Footer() {
  return (
    <>
      <div className={cx('mt-auto', styles.footerWrap)}>
        <div className={cx('container d-flex justify-content-between align-items-end', styles.footerMain)}>
          <div className={cx('d-flex flex-column align-items-flex-start')}>
            <img
              src={logoImage}
              width={48}
              height={48}
              alt='logo'
            />
            <span className={cx(styles.copyright)}>Copyright 2023 HitPot.</span>
          </div>
          <div className={cx('d-flex justify-content-between', styles.links)}>
            <span className={cx(styles.linkItem)}>Privacy Policy</span>
            <span className={cx(styles.linkItem)}>Terms & Conditions</span>
            <span className={cx(styles.linkItem)}>Cookie Policy</span>
          </div>
        </div>
      </div>
      <script>
        {`
          window.fbAsyncInit = function() {
            FB.init({
              appId            : \'933468061410124\',
              autoLogAppEvents : true,
              xfbml            : true,
              version          : \'v16.0\'
            })
          }   
        `}
      </script>
      <script
        async
        defer
        crossOrigin='anonymous'
        src='https://connect.facebook.net/en_US/sdk.js'
      />
    </>
  )
}
