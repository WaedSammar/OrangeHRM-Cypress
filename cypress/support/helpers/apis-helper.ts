import { CommonHelper } from "./common-helper";
import { HTTP_METHODS, HTTP_STATUS_CODE } from "./constants";

const baseURL = Cypress.config().baseUrl;
const URLs = {
  posts: `${baseURL}/web/index.php/api/v2/buzz/posts`,
  feed: `${baseURL}/web/index.php/api/v2/buzz/feed**`,
  employees: `/api/v2/pim/employees`,
  personalDetails: `/pim/employees/**/personal-details`,
  candidate: `${baseURL}/web/index.php/api/v2/recruitment/candidates/**`,
  interviewerName: `${baseURL}/web/index.php/api/v2/recruitment/interviewers?nameOrId=*`,
  projectName: `/web/index.php/api/v2/time/projects?onlyAllowed=false&model=detailed&customerOrProjectName=*`,
  employeeName: `/web/index.php/api/v2/pim/employees?nameOrId=*&includeEmployees=currentAndPast`,
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
}
export { APIsHelper };
