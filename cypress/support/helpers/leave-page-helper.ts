import { CommonHelper } from "./common-helper";
import { HTTP_METHODS } from "./constants";

const URLs = {
  addLeaveEntitlements: `/web/index.php/api/v2/leave/leave-entitlements`,
};

class LeavePageHelper {
  /**
   * add laeve type
   * @param leavePageInfo
   * @returns
   */
  addLeaveType(leavePageInfo) {
    return CommonHelper.sendAPIRequest(
      HTTP_METHODS.POST,
      URLs.addLeaveEntitlements,
      {
        name: leavePageInfo.leaveTypeName,
        situational: leavePageInfo.leaveSituational,
      }
    ).then((response) => {
      return response;
    });
  }

  /**
   * add leave entitlements
   * @param leavePageInfo
   * @param {number} empNumber
   * @param {number} leaveTypeId
   */
  addLeaveEntitlements(leavePageInfo, empNumber: number, leaveTypeId: number) {
    return CommonHelper.sendAPIRequest(
      HTTP_METHODS.POST,
      URLs.addLeaveEntitlements,
      {
        empNumber,
        entitlement: leavePageInfo.entitlementDuration,
        fromDate: leavePageInfo.entitlementFromDate,
        leaveTypeId,
        toDate: leavePageInfo.entitlementEndDate,
      }
    );
  }
}
export { LeavePageHelper };
