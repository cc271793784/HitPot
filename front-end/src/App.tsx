import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import to from 'await-to-js'
import cx from 'classnames'
import { LoadingOutlined } from '@ant-design/icons'

import './App.css'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { createPromiseReadyUtil } from 'utils/promiseReadyUtil'
import metamask from 'wallets/metamask'
import * as userApi from 'web-api/user'
import * as walletApi from 'web-api/wallet'
import config from 'web-api/config'
import userStore from 'stores/user'
import walletStore from 'stores/wallet'

import Header from 'components/Header'
import Footer from 'components/Footer'

import Landing from 'pages/Landing'
import PostVideo from 'pages/PostVideo'
import Wallet from 'pages/Wallet'
import Home from 'pages/Home'
import VideoDetail from 'pages/VideoDetail'
import Settings from 'pages/Settings'

function App() {
  const appInitPromiseUtil = useRef(createPromiseReadyUtil())

  const [isAppInited, setIsAppInited] = useState(false)

  useEffect(() => {
    appInitPromiseUtil.current.promise.finally(() => {
      setIsAppInited(true)
    })

    const metamaskTasks = async () => {
      const installed = metamask.isMetaMaskInstalled()
      console.log('installed', installed)
      if (installed === false) {
        appInitPromiseUtil.current.resolve()
        return
      }

      const [initMetaMaskError] = await to(metamask.initProvider())
      console.log('initMetaMaskError', initMetaMaskError)
      if (initMetaMaskError !== null) {
        appInitPromiseUtil.current.resolve()
        return
      }

      const accounts = await metamask.ethAccounts()
      console.log('accounts', accounts)
      if (accounts.length === 0) {
        appInitPromiseUtil.current.resolve()
        return
      }

      const address = accounts[0]
      userStore.walletAddress = address

      const accessToken = localStorage.getItem(`ACCESS_TOKEN_${address}`)
      console.log('accessToken', accessToken)
      if (accessToken === null) {
        appInitPromiseUtil.current.resolve()
        return
      }

      config.setAccessToken(accessToken)
      const [getUserDetailError, userInfo] = await to(userApi.detail(address))
      console.log('getUserDetailError', getUserDetailError)
      if (getUserDetailError !== null) {
        config.setAccessToken('')
        appInitPromiseUtil.current.resolve()
        return
      }

      const [getWalletDetailError, walletInfo] = await to(walletApi.detail(address))
      console.log('getWalletDetailError', getUserDetailError)
      if (getWalletDetailError !== null) {
        appInitPromiseUtil.current.resolve()
        return
      }

      userStore.updateUserInfo(userInfo)
      walletStore.updateWalletInfo(walletInfo)
      userStore.isLoggedIn = true
      appInitPromiseUtil.current.resolve()
    }

    metamaskTasks()
  }, [])

  return (
    <div className={cx('App d-flex flex-column min-vh-100 app-wrap')}>
      {isAppInited === false && (
        <div className={cx('min-w-100 min-vh-100 d-flex justify-content-center align-items-center')}>
          <LoadingOutlined style={{ fontSize: 48 }} />
        </div>
      )}
      {isAppInited && (
        <BrowserRouter>
          <Header />
          <Routes>
            <Route
              path='/'
              element={<Landing />}
            />
            <Route
              path='/post-video'
              element={<PostVideo />}
            />
            <Route
              path='/home'
              element={<Home />}
            />
            <Route
              path='/settings'
              element={<Settings />}
            />
            <Route
              path='/wallet'
              element={<Wallet />}
            />
            <Route
              path='/video/:vid'
              element={<VideoDetail />}
            />
            <Route
              path='*'
              element={
                <Navigate
                  replace
                  to='/'
                />
              }
            />
          </Routes>
          <Footer />
        </BrowserRouter>
      )}
    </div>
  )
}

export default App
