import { LeaveInitializer } from "../initializers/leave-page/leave-page-initializer";
import { ILeaveRequestData } from "../types/leave";
import { CommonHelper } from "./common-helper";
import { HTTP_METHODS } from "./constants";

const leaveBaseURL = "/web/index.php/api/v2/leave";
const URLs = {
  addLeaveEntitlements: `${leaveBaseURL}/leave-entitlements`,
  addLeaveTypes: `${leaveBaseURL}/leave-types`,
  leavePeriod: `${leaveBaseURL}/leave-period`,
  leaveRequest: `${leaveBaseURL}/leave-requests`,
  employeeRequest: `${leaveBaseURL}/employees/leave-requests`,
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

  /**
   * select leave period
   * @param {ILeaveRequestData} leavePageInfo
   * @returns
   */
  static selectLeavePeriod(leavePageInfo: ILeaveRequestData) {
    const payload =
      LeaveInitializer.initializerSelectLeavePeriod(leavePageInfo);
    return CommonHelper.sendAPIRequest(
      HTTP_METHODS.PUT,
      URLs.leavePeriod,
      payload
    ).then((response) => {
      return response;
    });
  }

  /**
   * apply leave request
   * @param {ILeaveRequestData} leavePageInfo
   * @param {number} leaveTypeId
   * @returns
   */
  static applyLeaveRequest(
    leavePageInfo: ILeaveRequestData,
    leaveTypeId: number
  ) {
    const payload = LeaveInitializer.initializerApplyLeaveRequest(
      leavePageInfo,
      leaveTypeId
    );
    return CommonHelper.sendAPIRequest(
      HTTP_METHODS.POST,
      URLs.leaveRequest,
      payload
    ).then((response) => {
      return response;
    });
  }

  /**
   * approve leave request by admin
   * @param {ILeaveRequestData} leavePageInfo
   * @param {number} requestId
   * @returns
   */
  static approveLeaveRequest(
    leavePageInfo: ILeaveRequestData,
    requestId: number
  ) {
    return CommonHelper.sendAPIRequest(
      HTTP_METHODS.PUT,
      `${URLs.employeeRequest}/${requestId}`,
      {
        action: leavePageInfo.leaveRequestStatus,
      }
    );
  }
}
export { LeavePageHelper };
