export interface IClaimRequest {
  eventTypeName: string;
  eventTypeDescription: string;
  eventTypeStatus: boolean;
  expenseTypeName: string;
  expenseTypeDesc: string;
  expenseTypeStatus: boolean;
  currencyType: string;
  claimRequestStatus: string;
  expenseDate: string;
  expenseAmount: string;
  requestStatusAfterApproved: string;
  requestStatusAfterRejected: string;
  multipleExpenses?: Array<{
    name: string;
    desc: string;
  }>;
  multipleCurrencies?: string[];
}
