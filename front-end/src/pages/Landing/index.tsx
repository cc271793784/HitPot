import { observer } from 'mobx-react-lite'

import OnymousLanding from 'components/OnymousLanding'
import AnonymousLanding from 'components/AnonymousLanding'

import userStore from 'stores/user'

const Landing = () => {
  return userStore.isLoggedIn ? <OnymousLanding /> : <AnonymousLanding />
}

export default observer(Landing)
