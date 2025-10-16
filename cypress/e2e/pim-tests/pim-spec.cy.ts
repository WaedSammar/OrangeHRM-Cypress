import { APIsHelper } from "../../support/helpers/apis-helper";
import { CommonHelper } from "../../support/helpers/common-helper";
import { PIMPageHelper } from "../../support/helpers/pim-page-helpers";
import { PIMPage } from "../../support/page-object/pim-page";
import { IEmployeeInfo } from "../../support/types/employee";

describe("Employee management - Add and Save Test Cases", () => {
  let employeeMockData: IEmployeeInfo, employeeInfo: IEmployeeInfo;
  let employeeNum: number[] = [];

  before(() => {
    cy.fixture("employee-page-mock").then((addEmployeeData) => {
      employeeMockData = addEmployeeData;
    });
  });

  beforeEach(() => {
    employeeNum = [];
    cy.login();
    employeeInfo = {
      ...employeeMockData,
    };
  });

  it("Adding a new employee", () => {
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

    PIMPageHelper.getEmpNumberByEmployeeId(employeeInfo.employeeId).then(
      (empNumber) => {
        employeeNum.push(empNumber);
      }
    );
  });

  it("Adding five employees via API", () => {
    for (let i = 0; i < 5; i++) {
      PIMPageHelper.createEmployeeViaAPI(employeeInfo).then((response) => {
        employeeNum.push(response.body.data.empNumber);
      });
    }
  });

  afterEach(() => {
    cy.logout();
    cy.login();
    PIMPageHelper.deleteUsers(employeeNum);
  });
});
