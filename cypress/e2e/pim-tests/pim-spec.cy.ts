import { APIsHelper } from "../../support/helpers/apis-helper";
import { CommonHelper } from "../../support/helpers/common-helper";
import { PIMPage } from "../../support/page-object/pim-page";
import { IEmployeeInfo } from "../../support/types/employee";

describe("Employee management - Add and Save Test Cases", () => {
  let employeeMockData: IEmployeeInfo, employeeInfo: IEmployeeInfo;

  before(() => {
    cy.fixture('employee-page-mock').then((addEmployeeData) => {
      employeeMockData = addEmployeeData
    })
  })

  beforeEach(() => {
    cy.login();
  });

  it("Adding a new employee, saving information and verifying it", () => {
    PIMPage.goToPIMPage();
    PIMPage.clickAddBtn();
    PIMPage.fillEmployeeInfo(employeeInfo);

    const createLoadPersonalDetails = CommonHelper.generateRandomString(
      7,
      "loadPersonalDetails"
    );
    APIsHelper.interceptGetEmployeeDetailsRequest(createLoadPersonalDetails);
    PIMPage.clickSave();
    APIsHelper.waitForApiResponse(createLoadPersonalDetails);
  });
});
