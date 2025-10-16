import { PIMInitializer } from "../initializers/pim-page/pim-page-initializer";
import { IEmployeeInfo } from "../types/employee";
import { CommonHelper } from "./common-helper";
import { HTTP_METHODS } from "./constants";

const URLs = {
  employees: `/web/index.php/api/v2/pim/employees`,
  users: `/web/index.php/api/v2/admin/users`,
};

class PIMPageHelper {
  /**
   * get empNumber By EmployeeId
   * @param {string} employeeId
   * @returns
   */
  static getEmpNumberByEmployeeId(
    employeeId: string
  ): Cypress.Chainable<number | null> {
    return CommonHelper.sendAPIRequest(HTTP_METHODS.GET, URLs.employees).then(
      (response) => {
        const employees = response.body.data;
        const matchedEmployee = employees.find(
          (emp) => emp.employeeId === employeeId
        );
        return matchedEmployee ? matchedEmployee.empNumber : null;
      }
    );
  }

  /**
   *
   * @param {IEmployeeInfo} employeeInfo
   * @returns
   */
  static createEmployeeViaAPI(employeeInfo: IEmployeeInfo) {
    const payload = PIMInitializer.initializerEmployeePayload(employeeInfo);
    return CommonHelper.sendAPIRequest(
      HTTP_METHODS.POST,
      URLs.employees,
      payload
    ).then((response) => {
      return response;
    });
  }

  /**
   * add username and password for the employee
   * @param {IEmployeeInfo} employeeInfo
   * @param {number} empNumber
   * @returns
   */
  static createUserViaAPI(employeeInfo: IEmployeeInfo, empNumber: number) {
    const payload = PIMInitializer.initializerUserPayload(employeeInfo);
    return CommonHelper.sendAPIRequest(HTTP_METHODS.POST, URLs.users, {
      ...payload,
      empNumber,
    }).then((response) => {
      return {
        response,
        credentials: {
          username: payload.username,
          password: payload.password,
        },
      };
    });
  }

  /**
   * delete created user
   * @param {number []} empNumbers
   */
  static deleteUsers(empNumbers: number[]) {
    return CommonHelper.cleanup(URLs.employees, empNumbers);
  }
}
export { PIMPageHelper };
