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
      situational: leavePageInfo.leaveSituational ?? faker.datatype.boolean(),
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
  static initializerAddEntitlements(leavePageInfo: ILeaveRequestData, empNumber: number, leaveTypeId: number) {
    const payload = {
      empNumber,
      entitlement: leavePageInfo.entitlementDuration || faker.number.int({ min: 1, max: 30 }),
      fromDate: leavePageInfo.entitlementFromDate || CHANGE_DATE_FORMAT(faker.date.future()),
      leaveTypeId,
      toDate: leavePageInfo.entitlementEndDate || CHANGE_DATE_FORMAT(faker.date.future())
    }
    return payload
  }
}
export { LeaveInitializer };
