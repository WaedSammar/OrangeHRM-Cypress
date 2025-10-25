import { ElementHandler } from "../element-handler";
import { COMMON_BUTTONS, PAGES } from "../helpers/constants";
import { IEmployeeInfo } from "../types/employee";

enum LABELS {
  EMPLOYEE_NAME = "Employee Name",
  LEAVE_TYPE = "Leave Type",
  ENTITLEMENT = "Entitlement"
}

class LeavePage {
  private static LOCATORS = {
    topbarNav: '.oxd-topbar-body-nav',
    autoCompleteDropdown: '.oxd-autocomplete-dropdown',
  }

  static goToLeavePage() {
    ElementHandler.clickMenuItem(PAGES.LEAVE)
  }

  static clickApply() {
    cy.get(this.LOCATORS.topbarNav).contains(COMMON_BUTTONS.APPLY).click();
  }

  static selectLeaveType(leaveType: string) {
    ElementHandler.selectDropdownByLabel(LABELS.LEAVE_TYPE, leaveType);
  }

  static selectFromDate(fromDate: string) {
    ElementHandler.selectDate(fromDate);
  }

  static clickApplyForm() {
    ElementHandler.clickButton(COMMON_BUTTONS.APPLY);
  }

  static typeEmployeeHint(firstName: string) {
    ElementHandler.findInputByLabel(LABELS.EMPLOYEE_NAME).type(firstName);
    cy.get(this.LOCATORS.autoCompleteDropdown).contains(firstName).click();
  }

  static clickSearch() {
    ElementHandler.clickButton(COMMON_BUTTONS.SEARCH);
  }

  static approveLeaveRequest() {
    ElementHandler.clickButton(COMMON_BUTTONS.APPROVE);
  }

  static approveAllLeaveRequests(employeesData: IEmployeeInfo[]) {
    cy.wrap(employeesData).each((employee: IEmployeeInfo) => {
      this.typeEmployeeHint(employee.firstName);
      this.clickSearch();
      this.approveLeaveRequest();
    });
  }
}
export { LeavePage };