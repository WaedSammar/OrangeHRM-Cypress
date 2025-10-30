import {
  IEventType,
  IExpenseType,
} from "../../support/apis/response/claim-page/claim";
import { ClaimPageHelper } from "../../support/helpers/claim-page-helper";
import { PIMPageHelper } from "../../support/helpers/pim-page-helpers";
import { CLAIM_TABLE_HEADERS, ClaimPage } from "../../support/page-object/claim-page";
import { IClaimRequest } from "../../support/types/claim-request";
import { IEmployeeInfo } from "../../support/types/employee";

describe("Claim Page Test Cases", () => {
  let claimPageInfo: IClaimRequest,
    employeeMockData: IEmployeeInfo,
    employeeInfo: IEmployeeInfo;
  let employeeIds: number[] = [];
  let createdEmployeesMap: Record<string, IEmployeeInfo> = {};
  let createdEventMap: Record<string, IEventType> = {};
  let createdExpenseMap: Record<string, IExpenseType> = {};
  let credentialsList: { username: string; password: string }[] = [];
  let eventIds: number[] = [];
  let expenseIds: number[] = [];

  before(() => {
    cy.fixture("employee-page-mock").then((addEmployeeData) => {
      employeeMockData = addEmployeeData;
      employeeInfo = { ...employeeMockData };
    });
    cy.fixture("claim-page-mock").then((claimPageData) => {
      claimPageInfo = claimPageData;
    });
  });

  beforeEach(() => {
    employeeIds = [];
    eventIds = [];
    expenseIds = [];

    cy.login();
    PIMPageHelper.createEmployeeViaAPI(employeeInfo).then(
      (employeeResponse) => {
        const empNumber = employeeResponse.body.data.empNumber.toString();
        employeeIds.push(Number(empNumber));
        createdEmployeesMap[empNumber] = employeeResponse.body.data;

        PIMPageHelper.createUserViaAPI(employeeInfo, empNumber).then(
          ({ credentials }) => {
            credentialsList.push({
              username: credentials.username,
              password: credentials.password,
            });
            ClaimPageHelper.createEventType(claimPageInfo).then(
              (eventResponse) => {
                const eventId = eventResponse.body.data.id;
                eventIds.push(eventId);
                createdEventMap[eventId] = eventResponse.body.data;

                ClaimPageHelper.createExpenseType(claimPageInfo).then(
                  (expenseResponse) => {
                    const expenseId = expenseResponse.body.data.id;
                    expenseIds.push(expenseId);
                    createdExpenseMap[expenseId] = expenseResponse.body.data;
                  });
              });
          });
      });
  });

  it("submit 3 claims with 3 different currencies, add expense with 3 different types and approve it by admin", () => {
    const employeeData = createdEmployeesMap[employeeIds[0].toString()];
    const eventData = createdEventMap[eventIds[0]];
    const expenseData = createdExpenseMap[expenseIds[0]];

    cy.logout();
    cy.login(credentialsList[0].username, credentialsList[0].password);

    ClaimPage.goToClaimPage();
    ClaimPage.applyClaimRequest(eventData.name, claimPageInfo.currencyType);
    ClaimPage.addExpense(claimPageInfo, expenseData.name);
    ClaimPage.clickSubmitBtn();

    cy.logout();
    cy.login();
    ClaimPage.goToClaimPage();
    const data = {
      [CLAIM_TABLE_HEADERS.EMPLOYEE_NAME]: `${employeeData.firstName} ${employeeData.lastName}`,
      [CLAIM_TABLE_HEADERS.EVENT_NAME]: eventData.name,
      [CLAIM_TABLE_HEADERS.STATUS]: claimPageInfo.claimRequestStatus,
    };
    ClaimPage.clickAllowAction(data);
    ClaimPage.clickApprove();

    cy.logout();
    cy.login(credentialsList[0].username, credentialsList[0].password);
    ClaimPage.goToClaimPage();
    const requestInfo = {
      [CLAIM_TABLE_HEADERS.STATUS]: claimPageInfo.requestStatusAfterApproved,
      [CLAIM_TABLE_HEADERS.AMOUNT]: claimPageInfo.expenseAmount,
    };
    ClaimPage.verifyInfoInClaimTable(requestInfo);
  });

  afterEach(() => {
    cy.logout()
    cy.login()
    PIMPageHelper.deleteUsers(employeeIds)
    ClaimPageHelper.deleteEventType(eventIds)
    ClaimPageHelper.deleteExpenseType(expenseIds)
  })
});
