import { useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import to from 'await-to-js'
import cx from 'classnames'
import { LoadingOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

import './App.css'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { createPromiseReadyUtil } from 'utils/promiseReadyUtil'
import * as userApi from 'web-api/user'
import * as walletApi from 'web-api/wallet'
import config from 'web-api/config'

import userStore from 'stores/user'
import walletStore from 'stores/wallet'
import uiStore from 'stores/ui'
import { getWallet } from 'wallets/walletProvider'

import Header from 'components/Header'
import Footer from 'components/Footer'
import { ProtectedRoute } from 'components/ProtectedRoute'

import Landing from 'pages/Landing'
import PostVideo from 'pages/PostVideo'
import Wallet from 'pages/Wallet'
import Home from 'pages/Home'
import VideoDetail from 'pages/VideoDetail'
import Settings from 'pages/Settings'
import persist from 'stores/persist'

function App() {
  const navigate = useNavigate()
  const appInitPromiseUtil = useRef(createPromiseReadyUtil())
  const [isAppInited, setIsAppInited] = useState(false)

  useEffect(() => {
    const handleWalletAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        navigate('/')
        persist.removeAccessToken(userStore.walletAddress)
        userStore.reset()
        uiStore.reset()
        walletStore.reset()
      }
    }

    getWallet().on('accountsChanged', handleWalletAccountsChanged)

    return () => {
      getWallet().off('accountsChanged', handleWalletAccountsChanged)
    }
  }, [navigate])

  useEffect(() => {
    appInitPromiseUtil.current.promise.finally(() => {
      setIsAppInited(true)
    })

    const walletTasks = async () => {
      const wallet = getWallet()
      const installed = wallet.isExtensionInstalled()
      console.log('installed', installed)
      if (installed === false) {
        appInitPromiseUtil.current.resolve()
        return
      }

      const [initWalletError] = await to(wallet.init())
      console.log('initWalletError', initWalletError)
      if (initWalletError !== null) {
        appInitPromiseUtil.current.resolve()
        return
      }

      const accounts = await wallet.ethAccounts()
      console.log('accounts', accounts)
      if (accounts.length === 0) {
        appInitPromiseUtil.current.resolve()
        return
      }

      const address = accounts[0]
      userStore.walletAddress = address

      const accessToken = persist.getAccessToken(address)
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

    walletTasks()
  }, [])

  return (
    <div className={cx('App d-flex flex-column min-vh-100 app-wrap')}>
      {isAppInited === false && (
        <div className={cx('min-w-100 min-vh-100 d-flex justify-content-center align-items-center')}>
          <LoadingOutlined style={{ fontSize: 48 }} />
        </div>
      )}
      {isAppInited && (
        <>
          <Header />
          <Routes>
            <Route
              path='/'
              element={<Landing />}
            />
            <Route
              path='/post-video'
              element={
                <ProtectedRoute>
                  <PostVideo />
                </ProtectedRoute>
              }
            />
            <Route
              path='/home'
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path='/settings'
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path='/wallet'
              element={
                <ProtectedRoute>
                  <Wallet />
                </ProtectedRoute>
              }
            />
            <Route
              path='/video/:vid'
              element={
                <ProtectedRoute>
                  <VideoDetail />
                </ProtectedRoute>
              }
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
        </>
      )}
    </div>
  )
}

export default App
