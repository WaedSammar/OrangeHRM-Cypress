import { CommonHelper } from "./common-helper";
import { HTTP_METHODS, HTTP_STATUS_CODE } from "./constants";

const URLs = {
  employees: `/api/v2/pim/employees`,
  personalDetails: `/pim/employees/**/personal-details`,
  feed: `/web/index.php/api/v2/buzz/feed**`,
};

class APIsHelper {
  static interceptGetEmployeeDetailsRequest(aliasName: string) {
    CommonHelper.interceptRequests(
      URLs.personalDetails,
      HTTP_METHODS.GET,
      aliasName
    );
  }

  static interceptGetEmployeesRequest(aliasName: string) {
    CommonHelper.interceptRequests(URLs.employees, HTTP_METHODS.GET, aliasName);
  }

  static waitForApiResponse(
    aliasName: string,
    expectedStatus: number = HTTP_STATUS_CODE.success
  ) {
    cy.wait(`@${aliasName}`).then((interception) => {
      expect(interception.response.statusCode).to.equal(expectedStatus);
    });
  }

  static interceptPostFeeds(aliasName: string) {
    CommonHelper.interceptRequests(URLs.feed, HTTP_METHODS.GET, aliasName);
  }
}
export { APIsHelper };
