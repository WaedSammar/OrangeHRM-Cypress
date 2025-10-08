import { HTTP_METHODS } from "./constants"

class CommonHelper {
  static generateRandomString(length: number = 7, prefix: string = '', suffix: string = ''): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let text = ''

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return `${prefix} ${text} ${suffix}`
  }

  static interceptRequests(requestURL: string, httpRequestMethod: HTTP_METHODS, aliasName: string) {
    return new Cypress.Promise((resolve) => {
      cy.intercept({
        url: `**${requestURL}*`,
        method: httpRequestMethod
      })
        .as(aliasName)
        .then(resolve)
    })
  }
}
export { CommonHelper }