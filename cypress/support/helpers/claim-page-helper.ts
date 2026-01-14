import { IExpenseType } from "../apis/response/claim-page/claim";
import { IClaimRequest } from "../types/claim-request";
import { CommonHelper } from "./common-helper";
import { HTTP_METHODS } from "./constants";

const claimBaseURL = `/web/index.php/api/v2/claim`;
const URLs = {
  eventType: `${claimBaseURL}/events`,
  expenseType: `${claimBaseURL}/expenses/types`,
  expenseRequest: `${claimBaseURL}/requests`,
};

class ClaimPageHelper {
  /**
   * crate event type
   * @param {IClaimRequest} claimPageInfo
   * @returns
   */
  static createEventType(claimPageInfo: IClaimRequest) {
    const payload = {
      description: claimPageInfo.eventTypeDescription,
      name: claimPageInfo.eventTypeName,
      status: claimPageInfo.eventTypeStatus,
    };
    return CommonHelper.sendAPIRequest(
      HTTP_METHODS.POST,
      URLs.eventType,
      payload,
    );
  }

  /***
   * create multiple expense types
   * @param {IClaimRequest} claimPageInfo
   */
  static createMultipleExpenseTypes(claimPageInfo: IClaimRequest) {
    const createdExpenseMap: Record<string, IExpenseType> = {};
    const expenseIds: number[] = [];
    const expenses = claimPageInfo.multipleExpenses ?? [];

    let chain: Cypress.Chainable<any> = cy.wrap(null);

    expenses.forEach(exp => {
      chain = chain.then(() => {
        return ClaimPageHelper.createExpenseType({
          ...claimPageInfo,
          expenseTypeName: exp.name,
          expenseTypeDesc: exp.desc,
        }).then(res => {
          const id = res.body.data.id;
          expenseIds.push(id);
          createdExpenseMap[id] = res.body.data;
        });
      });
    });

    return chain.then(() => ({ createdExpenseMap, expenseIds }));
  }


  /**
   * create expense type
   * @param {IClaimRequest} claimPageInfo
   * @returns
   */
  static createExpenseType(claimPageInfo: IClaimRequest) {
    const payload = {
      description: claimPageInfo.expenseTypeDesc,
      name: claimPageInfo.expenseTypeName,
      status: claimPageInfo.expenseTypeStatus,
    };
    return CommonHelper.sendAPIRequest(
      HTTP_METHODS.POST,
      URLs.expenseType,
      payload,
    );
  }

  /**
   * delete created event type
   * @param {number []} eventIds
   */
  static deleteEventType(eventIds: number[]) {
    CommonHelper.cleanup(URLs.eventType, eventIds);
  }

  /**
   * delete created expense type
   * @param {number []} expenseIds
   */
  static deleteExpenseType(expenseIds: number[]) {
    CommonHelper.cleanup(URLs.expenseType, expenseIds);
  }
}
export { ClaimPageHelper };
