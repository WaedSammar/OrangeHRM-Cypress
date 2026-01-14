import {
  IEventType,
  IExpenseType,
} from "../../support/apis/response/claim-page/claim";
import { ClaimPageHelper } from "../../support/helpers/claim-page-helper";
import { PIMPageHelper } from "../../support/helpers/pim-page-helpers";
import { CLAIM_TABLE_HEADERS, ClaimPage } from "../../support/page-object/claim-page";
import { IClaimRequest } from "../../support/types/claim-request";
import { IEmployeeInfo } from "../../support/types/employee";

describe("Claim Page Test Cases: employee submits 3 claims (different currencies & expenses), admin approves/rejects/ignores", () => {
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

  let employeeData: IEmployeeInfo;
  let currencies: string[];
  let expenses: { name: string; }[];
  let eventName: string;

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
        const empNumber = employeeResponse.body.data.empNumber;
        employeeIds.push(empNumber);
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

                    employeeData = createdEmployeesMap[employeeIds[0].toString()];
                    currencies = claimPageInfo.multipleCurrencies!;
                    expenses = claimPageInfo.multipleExpenses!;
                    eventName = createdEventMap[eventIds[0]].name;
                    cy.logout();
                  });
              });
          });
      });
  });

  it("employee submits 3 claims (different currencies & expenses)", () => {
    const employeeData = createdEmployeesMap[employeeIds[0].toString()];
    const currencies = claimPageInfo.multipleCurrencies!;
    const expenses = claimPageInfo.multipleExpenses!;
    const eventName = createdEventMap[eventIds[0]].name;

    cy.login(credentialsList[0].username, credentialsList[0].password);

    ClaimPage.applyMultipleClaimRequests(
      eventName,
      claimPageInfo,
      currencies,
      expenses
    )
  })

  const action = [
    { status: "Approve", clickAction: () => ClaimPage.clickApprove() },
    { status: "Reject", clickAction: () => ClaimPage.clickReject() }
  ]
  action.forEach(({ status, clickAction }) => {
    it(`employee submits claim and admin ${status.toLowerCase()}s it`, () => {
      cy.login(credentialsList[0].username, credentialsList[0].password);

      ClaimPage.goToClaimPage();
      ClaimPage.applyClaimRequest(eventName, currencies[0]);
      ClaimPage.addExpense(claimPageInfo, expenses[0].name);
      ClaimPage.clickSubmitBtn();

      cy.logout();
      cy.login();
      ClaimPage.goToClaimPage();

      const data = {
        [CLAIM_TABLE_HEADERS.EMPLOYEE_NAME]: `${employeeData.firstName} ${employeeData.lastName}`,
        [CLAIM_TABLE_HEADERS.EVENT_NAME]: eventName,
        [CLAIM_TABLE_HEADERS.CURRENCY]: currencies[0],
        [CLAIM_TABLE_HEADERS.STATUS]: claimPageInfo.claimRequestStatus,
      };
      ClaimPage.clickAllowAction(data);
      clickAction();
    });
  })

  afterEach(() => {
    cy.logout();
    cy.login();
    PIMPageHelper.deleteUsers(employeeIds)
    ClaimPageHelper.deleteEventType(eventIds)
    ClaimPageHelper.deleteExpenseType(expenseIds)
  })
});
