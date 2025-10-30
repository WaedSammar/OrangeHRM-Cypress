import { IEmployeeInfo } from "../../types/employee";
import { faker } from "@faker-js/faker";

export enum UserRole {
  ADMIN = 1,
  ESS = 2,
}

class PIMInitializer {
  /**
   * initializer for create employee payload
   * @param {IEmployeeInfo} employeeData
   * @returns
   */
  static initializerEmployeePayload(employeeData: IEmployeeInfo) {
    const payload = {
      firstName: faker.person.firstName(),
      middleName: faker.person.middleName(),
      lastName: faker.person.lastName(),
      employeeId: faker.number.int({ min: 1000, max: 9999 }).toString(),
    };
    return payload;
  }

  /**
   * initializer for create user payload
   * @param {IEmployeeInfo} employeeData
   * @returns
   */
  static initializerUserPayload(employeeData: IEmployeeInfo) {
    const payload = {
      username: faker.internet.username(),
      password: faker.internet.password({ prefix: "yo12" }),
      status: employeeData.status ?? faker.datatype.boolean(),
      userRoleId: UserRole.ESS,
    };
    return payload;
  }
}
export { PIMInitializer };
