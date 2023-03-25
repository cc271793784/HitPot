import { FeedRecommendStrategy } from './FeedRecommendStrategy'
import { UserLevel } from './UserLevel'

export interface UserInfo {
  avatarImgUrl: string
  feedSettingType: FeedRecommendStrategy
  level: UserLevel
  nickname: string
  userId: string
}
