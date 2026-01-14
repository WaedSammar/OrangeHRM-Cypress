export interface ILeaveRequestData {
  leaveTypeName: string;
  leaveSituational: boolean;
  entitlementDuration: number;
  entitlementFromDate: string;
  entitlementEndDate: string;
  leavePerStartedDay: number;
  leavePerStartedMonth: number;
  leaveRequestComment: string;
  leaveRequestFromDate: string;
  leaveRequestEndDate: string;
  leaveRequestStatus: string;
}
