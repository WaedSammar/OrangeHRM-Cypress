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

                ClaimPageHelper.createMultipleExpenseTypes(claimPageInfo).then(
                  ({ createdExpenseMap: map, expenseIds: ids }) => {
                    Object.assign(createdExpenseMap, map);
                    expenseIds.push(...ids);
                  });
              });
          });
      });
  });

  it("employee submits 3 claims (different currencies & expenses), admin approves/rejects/ignores", () => {
    const employeeData = createdEmployeesMap[employeeIds[0].toString()];
    const currencies = claimPageInfo.multipleCurrencies!;
    const expenses = claimPageInfo.multipleExpenses!;

    const results: {
      eventName: string;
      currency: string;
      expense: string;
      statusAfterAdmin: string;
    }[] = [];

    cy.logout();
    cy.login(credentialsList[0].username, credentialsList[0].password);

    //approve claim request
    ClaimPage.goToClaimPage();
    ClaimPage.applyClaimRequest(createdEventMap[eventIds[0]].name, currencies[0]);
    ClaimPage.addExpense(claimPageInfo, expenses[0].name);
    ClaimPage.clickSubmitBtn();
    results.push({
      eventName: createdEventMap[eventIds[0]].name,
      currency: currencies[0],
      expense: expenses[0].name,
      statusAfterAdmin: claimPageInfo.requestStatusAfterApproved,
    });

    //reject claim request
    ClaimPage.goToClaimPage();
    ClaimPage.applyClaimRequest(createdEventMap[eventIds[0]].name, currencies[1]);
    ClaimPage.addExpense(claimPageInfo, expenses[1].name);
    ClaimPage.clickSubmitBtn();
    results.push({
      eventName: createdEventMap[eventIds[0]].name,
      currency: currencies[1],
      expense: expenses[1].name,
      statusAfterAdmin: claimPageInfo.requestStatusAfterRejected,
    });

    //no actions on claim request
    ClaimPage.goToClaimPage();
    ClaimPage.applyClaimRequest(createdEventMap[eventIds[0]].name, currencies[2]);
    ClaimPage.addExpense(claimPageInfo, expenses[2].name);
    ClaimPage.clickSubmitBtn();
    results.push({
      eventName: createdEventMap[eventIds[0]].name,
      currency: currencies[2],
      expense: expenses[2].name,
      statusAfterAdmin: claimPageInfo.claimRequestStatus,
    });

    cy.logout();
    cy.login();
    ClaimPage.goToClaimPage();

    // accept first claim
    const dataApprove = {
      [CLAIM_TABLE_HEADERS.EMPLOYEE_NAME]: `${employeeData.firstName} ${employeeData.lastName}`,
      [CLAIM_TABLE_HEADERS.EVENT_NAME]: results[0].eventName,
      [CLAIM_TABLE_HEADERS.CURRENCY]: results[0].currency,
      [CLAIM_TABLE_HEADERS.STATUS]: claimPageInfo.claimRequestStatus,
    };
    ClaimPage.clickAllowAction(dataApprove);
    ClaimPage.clickApprove();
    ClaimPage.goToClaimPage();

    // reject second claim
    const dataReject = {
      [CLAIM_TABLE_HEADERS.EMPLOYEE_NAME]: `${employeeData.firstName} ${employeeData.lastName}`,
      [CLAIM_TABLE_HEADERS.EVENT_NAME]: results[1].eventName,
      [CLAIM_TABLE_HEADERS.CURRENCY]: results[1].currency,
      [CLAIM_TABLE_HEADERS.STATUS]: claimPageInfo.claimRequestStatus,
    };
    ClaimPage.clickAllowAction(dataReject);
    ClaimPage.clickReject();
  });

  afterEach(() => {
    cy.logout()
    cy.login()
    PIMPageHelper.deleteUsers(employeeIds)
    ClaimPageHelper.deleteEventType(eventIds)
    ClaimPageHelper.deleteExpenseType(expenseIds)
  })
});
