import styles from './layout.module.css'

import VideoCardOptBtns from '../VideoCardOptBtns'
import { VideoDetailInfo } from 'web-api/video'

interface Props {
  videoInfo: VideoDetailInfo
}

const VideoCardOptBtnsForFavorited = (props: Props) => {
  return <VideoCardOptBtns {...props} />
}

export default VideoCardOptBtnsForFavorited
