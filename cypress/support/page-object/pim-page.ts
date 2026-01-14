import { ElementHandler } from "../element-handler";
import { APIsHelper } from "../helpers/apis-helper";
import { CommonHelper } from "../helpers/common-helper";
import { COMMON_BUTTONS, HTML_TAGS, PAGES } from "../helpers/constants";
import { IEmployeeInfo } from "../types/employee";

enum LABELS {
  EMPLOYEE_ID = "Employee Id",
  USERNAME = "Username",
  PASSWORD = "Password",
  CONFIRM_PASSWORD = "Confirm Password",
}

class PIMPage {
  private static LOCATORS = {
    firstName: ".orangehrm-firstname",
    middleName: ".orangehrm-middlename",
    lastName: ".orangehrm-lastname",
    createLoginCheckbox: `${HTML_TAGS.input}[type='checkbox']`,
    submitBtn: `${HTML_TAGS.button}[type='submit']`,
  };

  /**
   * go to PIM Page
   */
  static goToPIMPage() {
    const loadGetEmployeesList = CommonHelper.generateRandomString(
      7,
      "loadPIM_",
    );
    APIsHelper.interceptGetEmployeesRequest(loadGetEmployeesList);
    ElementHandler.clickMenuItem(PAGES.PIM);
    APIsHelper.waitForApiResponse(loadGetEmployeesList);
  }

  /**
   * go to add employee
   */
  static clickAddBtn() {
    ElementHandler.clickButton(COMMON_BUTTONS.ADD);
  }

  /**
   * enter user first name
   * @param {string} firstName - first name
   */
  static fillFirstName(firstName: string) {
    ElementHandler.typeIntoField(this.LOCATORS.firstName, firstName);
  }

  /**
   * enter user middle name
   * @param {string} middleName - middle name
   */
  static fillMiddleName(middleName: string) {
    ElementHandler.typeIntoField(this.LOCATORS.middleName, middleName);
  }

  /**
   * enter user last name
   * @param {string} lastName - last name
   */
  static fillLastName(lastName: string) {
    ElementHandler.typeIntoField(this.LOCATORS.lastName, lastName);
  }

  /**
   * write employee id
   * @param {string} employeeId - employee id
   */
  static fillEmployeeId(employeeId: string) {
    ElementHandler.clearAndFill(LABELS.EMPLOYEE_ID, employeeId);
  }

  /**
   * make login option active
   */
  static ensureLoginButtonActive() {
    cy.get(this.LOCATORS.createLoginCheckbox).check({ force: true });
  }

  /**
   * fill username
   * @param {string} username - enter username
   */
  static fillUsername(username: string) {
    ElementHandler.clearAndFill(LABELS.USERNAME, username);
  }

  /**
   * fill user password
   * @param {string} password - fill user password
   */
  static fillPassword(password: string) {
    ElementHandler.clearAndFill(LABELS.PASSWORD, password);
  }

  /**
   * confirm user password
   * @param {string} password - user password again
   */
  static fillConfirmPassword(password: string) {
    ElementHandler.clearAndFill(LABELS.CONFIRM_PASSWORD, password);
  }

  /**
   * save button
   */
  static clickSave(index: number = 0) {
    ElementHandler.clickSave(index);
  }

  /**
   * ensure status is enable
   */
  static verifyStatusIsEnabled() {
    cy.get(this.LOCATORS.submitBtn).should("be.enabled");
  }

  /**
   * fill user basic information's
   * @param employeeInfo
   */
  static fillEmployeeInfo(employeeInfo: IEmployeeInfo) {
    this.fillFirstName(employeeInfo.firstName);
    this.fillMiddleName(employeeInfo.middleName);
    this.fillLastName(employeeInfo.lastName);
    this.fillEmployeeId(employeeInfo.employeeId);

    this.ensureLoginButtonActive();
    this.fillUsername(employeeInfo.userName);
    this.fillPassword(employeeInfo.password);
    this.fillConfirmPassword(employeeInfo.password);
    this.verifyStatusIsEnabled();
  }
}
export { PIMPage };
