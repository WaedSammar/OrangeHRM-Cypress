import { ElementHandler } from '../element-handler'
import { PAGES, COMMON_BUTTONS, HTML_TAGS } from '../helpers/constants'
import { IClaimRequest } from '../types/claim-request'
import { IClaimRequestData } from '../types/claim-table-data'

export enum CLAIM_TABLE_HEADERS {
  REFERENCE_ID = 'Reference Id',
  EMPLOYEE_NAME = 'Employee Name',
  EVENT_NAME = 'Event Name',
  DESCRIPTION = 'Description',
  CURRENCY = 'Currency',
  SUBMITTED_DATE = 'Submitted Date',
  STATUS = 'Status',
  AMOUNT = 'Amount',
  ACTIONS = 'Actions'
}

enum LABELS {
  EVENT = 'Event',
  CURRENCY = 'Currency',
  EXPENSE_TYPE = 'Expense Type',
  AMOUNT = 'Amount'
}

class ClaimPage {
  /**
   * go to claim page
   */
  static goToClaimPage() {
    ElementHandler.clickMenuItem(PAGES.CLAIM)
  }

  /**
   * click to submit claim
   */
  static clickSubmitBtn() {
    ElementHandler.clickButton(COMMON_BUTTONS.SUBMIT)
  }

  /**
   * select event type
   * @param {string} eventType
   */
  static selectEventType(eventType: string) {
    ElementHandler.selectDropdownByLabel(LABELS.EVENT, eventType)
  }

  /**
   * select currency type
   * @param {string} currencyType
   */
  static selectCurrencyType(currencyType: string) {
    ElementHandler.selectDropdownByLabel(LABELS.CURRENCY, currencyType)
  }

  /**
   * click to create claim
   */
  static clickCreateBtn() {
    ElementHandler.clickButton(COMMON_BUTTONS.CREATE)
  }

  /**
   * apply for claim request
   * @param {string} eventName
   * @param {string} currency
   */
  static applyClaimRequest(eventName: string, currency: string) {
    this.clickSubmitBtn()
    this.selectEventType(eventName)
    this.selectCurrencyType(currency)
    this.clickCreateBtn()
  }

  /**
   * click add to create expense
   */
  static clickAddBtn() {
    ElementHandler.clickButton(COMMON_BUTTONS.ADD)
  }

  /**
   * select currency type
   * @param {string} name
   */
  static selectExpenseType(name: string) {
    ElementHandler.selectDropdownByLabel(LABELS.EXPENSE_TYPE, name)
  }

  /**
   * select expense date
   * @param {string} date
   */
  static selectExpenseDate(date: string) {
    ElementHandler.selectDate(date)
  }

  /**
   * select expense amount
   * @param {string} amount
   */
  static selectExpenseAmount(amount: string) {
    ElementHandler.clearAndFill(LABELS.AMOUNT, amount)
  }

  /**
   * save expense information
   */
  static saveAddedExpenseInfo() {
    ElementHandler.clickSave(0, COMMON_BUTTONS.SAVE)
  }

  /**
   * add expense
   * @param {IClaimRequest} claimPageInfo
   */
  static addExpense(claimPageInfo: IClaimRequest, expenseName: string) {
    this.clickAddBtn()
    this.selectExpenseType(expenseName)
    this.selectExpenseDate(claimPageInfo.expenseDate)
    this.selectExpenseAmount(claimPageInfo.expenseAmount)
    this.saveAddedExpenseInfo()
  }

  /**
   * click allow action in table
   * @param data
   */
  static clickAllowAction(data: IClaimRequestData) {
    ElementHandler.clickActionIconInRow(data, HTML_TAGS.button)
  }

  /**
   * approve the request
   */
  static clickApprove() {
    ElementHandler.clickButton(COMMON_BUTTONS.APPROVE)
  }

  /**
   * approve the request
   */
  static clickReject() {
    ElementHandler.clickButton(COMMON_BUTTONS.REJECT)
  }

  /**
   * verify claim request information
   * @param {IClaimRequestDataTableRowData} claimPageInfo
   */
  static verifyInfoInClaimTable(claimPageInfo: IClaimRequestData) {
    ElementHandler.validateTableRow(claimPageInfo)
  }
}
export { ClaimPage }
