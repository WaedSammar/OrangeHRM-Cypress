import { APIsHelper } from "../../support/helpers/apis-helper";
import { LeavePageHelper } from "../../support/helpers/leave-page-helper";
import { PIMPageHelper } from "../../support/helpers/pim-page-helpers";
import { IEmployeeInfo } from "../../support/types/employee";
import { ILeaveRequestData } from "../../support/types/leave";

describe("Leave page test cases", () => {
  let leavePageInfo: ILeaveRequestData,
    employeeMockData: IEmployeeInfo,
    employeeInfo: IEmployeeInfo;
  let employeeIds: number[] = [];
  let leaveTypeIds: number[] = [];
  let entitlementIds: number[] = [];
  let credentialsList: { username: string; password: string }[] = [];
  let createdEmployeesMap: Record<string, IEmployeeInfo> = {};

  before(() => {
    cy.fixture("leave-page-mock").then((leavePageData) => {
      leavePageInfo = leavePageData;
    });
    cy.fixture("employee-page-mock").then((addEmployeeData) => {
      employeeMockData = addEmployeeData;
      employeeInfo = { ...employeeMockData };
    });
  });

  beforeEach(() => {
    employeeIds = [];
    leaveTypeIds = [];
    entitlementIds = [];

    cy.login();
    PIMPageHelper.createEmployeeViaAPI(employeeInfo).then((response) => {
      const empNumber = response.body.data.empNumber.toString();
      employeeIds.push(Number(empNumber));
      createdEmployeesMap[empNumber] = response.body.data;

      PIMPageHelper.createUserViaAPI(employeeInfo, empNumber).then(
        ({ credentials }) => {
          credentialsList.push({
            username: credentials.username,
            password: credentials.password,
          });
          LeavePageHelper.addLeaveType(leavePageInfo).then((response) => {
            const leaveId = response.body.data.id;
            leaveTypeIds.push(leaveId);

            LeavePageHelper.selectLeavePeriod(leavePageInfo).then(() => {
              LeavePageHelper.addLeaveEntitlements(
                leavePageInfo,
                empNumber,
                leaveId
              ).then((response) => {
                const entitlementId = response.body.data.id;
                entitlementIds.push(entitlementId);
              });
            });
          });
        }
      );
    });
  });

  it("Apply for leave request and admin approve the leave", () => {
    cy.logout();
    APIsHelper.interceptPostFeeds("getBuzzFeed");
    cy.login(credentialsList[0].username, credentialsList[0].password);
    cy.wait("@getBuzzFeed");

    LeavePageHelper.applyLeaveRequest(leavePageInfo, leaveTypeIds[0]).then(
      (response) => {
        const requestId = response.body.data.id;
        cy.logout();
        APIsHelper.interceptPostFeeds("getBuzzFeed");
        cy.login();
        cy.wait("@getBuzzFeed");

        LeavePageHelper.approveLeaveRequest(leavePageInfo, requestId)
      }
    );
  });

  afterEach(() => {
    cy.logout()
    cy.login()
    PIMPageHelper.deleteUsers(employeeIds)
    LeavePageHelper.deleteLeaveType(leaveTypeIds)
  })
});
