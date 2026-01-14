import { APIsHelper } from "../../support/helpers/apis-helper";
import { LeavePageHelper } from "../../support/helpers/leave-page-helper";
import { PIMPageHelper } from "../../support/helpers/pim-page-helpers";
import { LeavePage } from "../../support/page-object/leave-page";
import { IEmployeeInfo } from "../../support/types/employee";
import { ILeaveRequestData } from "../../support/types/leave";

describe("Leave page test cases", () => {
  let leavePageInfo: ILeaveRequestData;
  let employeeMockData: IEmployeeInfo;
  let employeeInfo: IEmployeeInfo;

  const employeeIds: number[] = [];
  const leaveTypeIds: number[] = [];
  const credentialsList: Array<{ username: string; password: string }> = [];
  const createdEmployees: IEmployeeInfo[] = [];

  before(() => {
    cy.fixture("leave-page-mock").then((leavePageData) => {
      leavePageInfo = leavePageData;
    });
    cy.fixture("employee-page-mock").then((addEmployeeData) => {
      employeeMockData = addEmployeeData;
      employeeInfo = structuredClone(employeeMockData);
    });
  });

  beforeEach(() => {
    employeeIds.length = 0;
    leaveTypeIds.length = 0;
    credentialsList.length = 0;

    cy.login();
    PIMPageHelper.createMultipleEmployees(employeeInfo, employeeIds, 1).then(
      (employees) => {
        createdEmployees.push(...employees);
        const empNumbers = employees.map((e) => e.empNumber);

        PIMPageHelper.createUsersForEachEmployee(createdEmployees).then(
          (credentials) => {
            credentialsList.push(...credentials);
          },
        );
        LeavePageHelper.addLeaveType(leavePageInfo).then((response) => {
          const leaveId = response.body.data.id;
          leaveTypeIds.push(leaveId);

          LeavePageHelper.addLeaveEntitlementsForEachEmployee(
            leavePageInfo,
            empNumbers,
            leaveId,
          );
        });
      },
    );
    cy.logout();
  });

  it("Apply for leave request and admin approve the leave", () => {
    cy.wrap(credentialsList)
      .each((credential: { username: string; password: string }) => {
        APIsHelper.interceptPostFeeds("getBuzzFeed");
        cy.login(credential.username, credential.password);
        cy.wait("@getBuzzFeed");
        LeavePage.goToLeavePage();
        LeavePage.clickApply();
        LeavePage.selectLeaveType(leavePageInfo.leaveTypeName);
        LeavePage.selectFromDate(leavePageInfo.leaveRequestFromDate);
        LeavePage.clickApplyForm();
        cy.wait(4000);
        cy.logout();
      })
      .then(() => {
        cy.login();

        LeavePage.goToLeavePage();
        LeavePage.approveAllLeaveRequests(createdEmployees);
      });
  });

  afterEach(() => {
    cy.logout();
    cy.login();
    PIMPageHelper.deleteUsers(employeeIds).then(() => {
      LeavePageHelper.deleteLeaveType(leaveTypeIds);
    });
  });
});
