import { UserLevel } from 'typings/UserLevel'
import cx from 'classnames'

import styles from './layout.module.css'

interface Props {
  level: UserLevel
}

const VipBadge = (props: Props) => {
  const { level } = props
  if (level === 2) {
    return <span className={cx('badge text-bg-warning', styles.badge)}>GOLD</span>
  }
  if (level === 1) {
    return <span className={cx('badge text-bg-secondary', styles.badge)}>SILVER</span>
  }
  return null
}

export default VipBadge
