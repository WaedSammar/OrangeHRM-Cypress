import { LeaveInitializer } from "../initializers/leave-page/leave-page-initializer";
import { ILeaveRequestData } from "../types/leave";
import { CommonHelper } from "./common-helper";
import { HTTP_METHODS } from "./constants";

const URLs = {
  addLeaveEntitlements: `/web/index.php/api/v2/leave/leave-entitlements`,
  addLeaveTypes: `/web/index.php/api/v2/leave/leave-types`,
};

class LeavePageHelper {
  /**
   * add laeve type
   * @param {ILeaveRequestData} leavePageInfo
   * @returns
   */
  static addLeaveType(leavePageInfo: ILeaveRequestData) {
    const payload = LeaveInitializer.initializerAddLeaveType(leavePageInfo);
    return CommonHelper.sendAPIRequest(
      HTTP_METHODS.POST,
      URLs.addLeaveTypes,
      payload
    ).then((response) => {
      return response;
    });
  }

  /**
   * add leave entitlements
   * @param {ILeaveRequestData} leavePageInfo
   * @param {number} empNumber
   * @param {number} leaveTypeId
   */
  static addLeaveEntitlements(
    leavePageInfo: ILeaveRequestData,
    empNumber: number,
    leaveTypeId: number
  ) {
    const payload = LeaveInitializer.initializerAddEntitlements(
      leavePageInfo,
      empNumber,
      leaveTypeId
    );
    return CommonHelper.sendAPIRequest(
      HTTP_METHODS.POST,
      URLs.addLeaveEntitlements,
      payload
    ).then((response) => {
      return response;
    });
  }
}
export { LeavePageHelper };
