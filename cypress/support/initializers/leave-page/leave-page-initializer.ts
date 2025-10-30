import dayjs from "dayjs";
import { faker } from "@faker-js/faker";
import { ILeaveRequestData } from "../../types/leave";

export const CHANGE_DATE_FORMAT = (date: Date): string =>
  dayjs(date).format("YYYY-DD-MM");

class LeaveInitializer {
  /**
   * create initializer for adding leave type
   * @param {ILeaveRequestData} leavePageInfo
   * @returns
   */
  static initializerAddLeaveType(leavePageInfo: ILeaveRequestData) {
    const payload = {
      name:
        `${leavePageInfo.leaveTypeName} ${Date.now()}` ||
        `${faker.word.adjective()} Leave`,
      situational: leavePageInfo.leaveSituational,
    };
    return payload;
  }

  /**
   * Initializer for add entitlements
   * @param {ILeaveRequestData} leavePageInfo
   * @param {number} empNumber
   * @param {number} leaveTypeId
   * @returns
   */
  static initializerAddEntitlements(
    leavePageInfo: ILeaveRequestData,
    empNumber: number,
    leaveTypeId: number,
  ) {
    const payload = {
      empNumber,
      entitlement:
        leavePageInfo.entitlementDuration ||
        faker.number.int({ min: 1, max: 30 }),
      fromDate:
        leavePageInfo.entitlementFromDate ||
        CHANGE_DATE_FORMAT(faker.date.future()),
      leaveTypeId,
      toDate:
        leavePageInfo.entitlementEndDate ||
        CHANGE_DATE_FORMAT(faker.date.future()),
    };
    return payload;
  }

  /**
   * Initializer for select leave period
   * @param leavePageInfo
   * @returns
   */
  static initializerSelectLeavePeriod(leavePageInfo: ILeaveRequestData) {
    const payload = {
      startDay:
        leavePageInfo.leavePerStartedDay ||
        faker.number.int({ min: 1, max: 28 }),
      startMonth:
        leavePageInfo.leavePerStartedMonth ||
        faker.number.int({ min: 1, max: 12 }),
    };
    return payload;
  }

  /**
   * Initializer for apply leave  request
   * @param {ILeaveRequestData} leavePageInfo
   * @param {number} leaveTypeId
   * @returns
   */
  static initializerApplyLeaveRequest(
    leavePageInfo: ILeaveRequestData,
    leaveTypeId: number,
  ) {
    const payload = {
      comment: leavePageInfo.leaveRequestComment || faker.lorem.sentence(),
      fromDate:
        leavePageInfo.leaveRequestFromDate ||
        CHANGE_DATE_FORMAT(faker.date.future()),
      leaveTypeId,
      toDate:
        leavePageInfo.leaveRequestEndDate ||
        CHANGE_DATE_FORMAT(faker.date.future()),
    };
    return payload;
  }
}
export { LeaveInitializer };
