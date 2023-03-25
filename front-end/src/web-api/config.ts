class Config {
  private accessToken = ''

  private apiServer = 'http://localhost:4001'

  private successCode = 200

  setAccessToken = (token: string) => {
    this.accessToken = token
  }

  getAccessToken = (): string => {
    return this.accessToken
  }

  setApiServer = (server: string) => {
    this.apiServer = server
  }

  getApiServer = (): string => {
    return this.apiServer
  }

  getSuccessCode = () => {
    return this.successCode
  }
}

const config = new Config()

export default config
