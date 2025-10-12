import { CommonHelper } from "./common-helper";
import { HTTP_METHODS } from "./constants";

const URLs = {
  employees: `/web/index.php/api/v2/pim/employees`,
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
   * delete created user
   * @param {number []} empNumbers
   */
  static deleteUsers(empNumbers: number[]) {
    return CommonHelper.cleanup(URLs.employees, empNumbers);
  }
}
export { PIMPageHelper };
