import { APIsHelper } from "../../support/helpers/apis-helper";
import { LeavePageHelper } from "../../support/helpers/leave-page-helper";
import { PIMPageHelper } from "../../support/helpers/pim-page-helpers";
import { IEmployeeInfo } from "../../support/types/employee";
import { ILeaveRequestData } from "../../support/types/leave";

describe("Leave page test cases", () => {
  let leavePageInfo: ILeaveRequestData
  let employeeMockData: IEmployeeInfo
  let employeeInfo: IEmployeeInfo;

  const employeeIds: number[] = [];
  const leaveTypeIds: number[] = [];
  const entitlementIds: number[] = [];
  const credentialsList: Array<{ username: string; password: string }> = [];
  const createdEmployeesMap: Record<string, IEmployeeInfo> = {};

  before(() => {
    cy.fixture("leave-page-mock").then((leavePageData) => {
      leavePageInfo = leavePageData;
    });
    cy.fixture("employee-page-mock").then((addEmployeeData) => {
      employeeMockData = addEmployeeData;
      employeeInfo = structuredClone(employeeMockData);
    });

    cy.login();
    PIMPageHelper.createMultipleEmployees(employeeInfo, employeeIds, 5).then((empNumbers: number[]) => {
      PIMPageHelper.createUsersForEachEmployee(employeeInfo, empNumbers).then((credentials) => {
        credentialsList.push(...credentials);
      })
    });
  });

  beforeEach(() => {
    employeeIds.length = 0;
    leaveTypeIds.length = 0;
    entitlementIds.length = 0;
    credentialsList.length = 0;

    // cy.login();
    // PIMPageHelper.createMultipleEmployees(employeeInfo, employeeIds, 5).then((response) => {
    //   // const empNumber = response.body.data.empNumber.toString();
    //   // employeeIds.push(Number(empNumber));
    //   // createdEmployeesMap[empNumber] = response.body.data;

    //   PIMPageHelper.createUserViaAPI(employeeInfo, empNumber).then(
    //     ({ credentials }) => {
    //       credentialsList.push({
    //         username: credentials.username,
    //         password: credentials.password,
    //       });
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

  it("Apply for leave request and admin approve the leave", () => {

    // Employee apply for leave request
    cy.logout();
    APIsHelper.interceptPostFeeds("getBuzzFeed");
    cy.login(credentialsList[0].username, credentialsList[0].password);
    cy.wait("@getBuzzFeed");

    LeavePageHelper.applyLeaveRequest(leavePageInfo, leaveTypeIds[0]).then(
      (response) => {
        const requestId = response.body?.data?.id;
        expect(requestId, "Leave request ID should exist").to.be.a("number");

        cy.log(`Leave request created with ID: ${requestId}`);

        // Admin approve the leave request
        cy.logout();
        APIsHelper.interceptPostFeeds("getBuzzFeed");
        cy.login();
        cy.wait("@getBuzzFeed");

        return LeavePageHelper.approveLeaveRequest(leavePageInfo, requestId)
      }).then((approveResponse) => {
        cy.log(`Leave request approved successfully`);
        expect(approveResponse.status).to.eq(200);
      })
  });

  afterEach(() => {
    cy.logout()
    cy.login()
    PIMPageHelper.deleteUsers(employeeIds).then(() => {
      LeavePageHelper.deleteLeaveType(leaveTypeIds)
    })
  })
});
