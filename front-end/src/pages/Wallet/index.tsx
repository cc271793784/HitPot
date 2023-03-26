import cx from 'classnames'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './layout.module.css'

import DepositPotModal from 'components/DepositPotModal'
import WithdrawPotModal from 'components/WithdrawPotModal'
import BuyHitModal from 'components/BuyHitModal'

import walletStore from 'stores/wallet'
import userStore from 'stores/user'
import { syncWalletInfoFromWebApi } from 'stores/walletHelpers'

const Wallet = () => {
  const navigate = useNavigate()
  const [showDepositPotModal, setShowDepositPotModal] = useState(false)
  const [showWithdrawPotModal, setShowWithdrawPotModal] = useState(false)
  const [showBuyHitModal, setShowBuyHitModal] = useState(false)

  const handleClickDepositButton = useCallback(() => {
    setShowDepositPotModal(true)
  }, [])

  const handleClickWithdrawButton = useCallback(() => {
    setShowWithdrawPotModal(true)
  }, [])

  const handleClickBuyHitButton = useCallback(() => {
    setShowBuyHitModal(true)
  }, [])

  const handleDepositPotModalClosed = useCallback(() => {
    setShowDepositPotModal(false)
  }, [])

  const handleWithdrawPotModalClosed = useCallback(() => {
    setShowWithdrawPotModal(false)
  }, [])

  const handleBuyHitModalClosed = useCallback(() => {
    setShowBuyHitModal(false)
  }, [])

  const handleClickIPNft = useCallback(
    (contentId: number) => {
      navigate(`/video/${contentId}`)
    },
    [navigate],
  )

  useEffect(() => {
    syncWalletInfoFromWebApi()
    const timer = setInterval(() => {
      syncWalletInfoFromWebApi()
    }, 30 * 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div className={cx(styles.wrap)}>
      <p className={cx('h2', styles.title)}>My wallet</p>
      <p className={cx(styles.address)}>{userStore.walletAddress}</p>
      <Card className={cx(styles.potBalance)}>
        <Card.Header>POT balance</Card.Header>
        <Card.Body>
          <Card.Title className={cx(styles.potCount)}>{walletStore.walletInfo.balancePot} POT</Card.Title>
          <div className={cx('d-flex gap-2', styles.potWalletButtons)}>
            <Button
              variant='primary'
              className={cx(styles.depositPotButton)}
              onClick={handleClickDepositButton}
            >
              Deposit
            </Button>
            <Button
              variant='primary'
              className={cx(styles.withdrawPotButton)}
              onClick={handleClickWithdrawButton}
            >
              Withdraw
            </Button>
          </div>
        </Card.Body>
      </Card>
      <Card className={cx(styles.potBalance)}>
        <Card.Header>HIT balance</Card.Header>
        <Card.Body>
          <Card.Title className={cx(styles.potCount)}>{walletStore.walletInfo.balanceHit} HIT</Card.Title>
          <div className={cx('d-flex gap-2', styles.potWalletButtons)}>
            <Button
              variant='primary'
              className={cx(styles.depositPotButton)}
              onClick={handleClickBuyHitButton}
            >
              Buy HIT
            </Button>
          </div>
        </Card.Body>
      </Card>
      <Card className={cx(styles.nftBalance)}>
        <Card.Header>IP NFT balance</Card.Header>
        <Card.Body>
          <div className={cx('d-flex flex-wrap', styles.nftVideoList)}>
            {walletStore.walletInfo.nfts.map((nftInfo, i) => {
              return (
                <div
                  className={cx('d-flex flex-column align-items-center', styles.nftVideoItem)}
                  key={i}
                >
                  <img
                    className={cx(styles.videoPoster)}
                    src={nftInfo.coverImgUrl}
                    width={209}
                    height={117}
                    alt=''
                    onClick={() => {
                      handleClickIPNft(nftInfo.contentId)
                    }}
                  />
                  <span className={cx('h5 text-nowrap text-truncate', styles.nftCount)}>
                    {nftInfo.amount ?? 0} IP NFTs
                  </span>
                </div>
              )
            })}
          </div>
        </Card.Body>
      </Card>
      {showDepositPotModal && <DepositPotModal onClose={handleDepositPotModalClosed} />}
      {showWithdrawPotModal && <WithdrawPotModal onClose={handleWithdrawPotModalClosed} />}
      {showBuyHitModal && <BuyHitModal onClose={handleBuyHitModalClosed} />}
    </div>
  )
}

export default observer(Wallet)
