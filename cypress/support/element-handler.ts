import { COMMON_BUTTONS, HTML_TAGS } from "./helpers/constants";

const COMMON_LOCATORS = {
  menuItems: "span.oxd-main-menu-item--name",
  submitBtn: `${HTML_TAGS.button}[type='submit']`,
  dropDownList: ".oxd-userdropdown-name",
  dropDownMenu: ".oxd-dropdown-menu",
};

enum DROP_DOWN {
  ABOUT = "About",
  SUPPORT = "Support",
  CHANGE_PASSWORD = "Change Password",
  LOGOUT = "Logout",
}

class ElementHandler {
  private static LOCATORS = {
    inputGroup: '.oxd-input-group',
    selectField: '.oxd-select-text',
    dropdownOption: '.oxd-select-dropdown',
    dateInput: `${HTML_TAGS.input}[placeholder='yyyy-dd-mm']`,
    closeCalenderBtn: '.--close',
  }

  /**
   * click on the selected page
   * @param {string} label - label name
   */
  static clickMenuItem(label: string) {
    cy.get(COMMON_LOCATORS.menuItems).contains(label).click();
  }

  /**
   * click on buttons
   * @param {string} label - name of button needed
   */
  static clickButton(label: string, index: number = 0) {
    cy.get(HTML_TAGS.button).contains(label).eq(index).click();
  }

  /**
   * type value for given field
   * @param {string} selector
   * @param {string} value
   */
  static typeIntoField(selector: string, value: string) {
    cy.get(selector).type(value);
  }

  /**
   * get input using label
   * @param {string} labelText - label for input box
   * @returns - label user want
   */
  static findInputByLabel(labelText: string) {
    return cy
      .contains(HTML_TAGS.label, labelText)
      .parent()
      .next()
      .find(HTML_TAGS.input);
  }

  /**
   * clear the written and type the required text
   * @param {string} label
   * @param {string} text
   */
  static clearAndFill(label: string, text: string) {
    this.findInputByLabel(label).clear().type(text);
  }

  /**
    * select option from dropdown
    * @param {string} label - label for input text
    * @param {string} option - option to select
    */
  static selectDropdownByLabel(label: string, option: string) {
    cy.contains(HTML_TAGS.label, label).parents(this.LOCATORS.inputGroup).find(this.LOCATORS.selectField).click()
    cy.get(this.LOCATORS.dropdownOption).contains(option).click()
  }

  /**
   * select date from calender and close it
   * @param {string} date
   * @param {number} index
   */
  static selectDate(date: string, index: number = 0) {
    cy.get(this.LOCATORS.dateInput).eq(index).should('be.visible').clear().type(date)
    cy.get(this.LOCATORS.closeCalenderBtn).should('be.visible').click()
  }

  /**
   * save information user entered
   * @param index
   */
  static clickSave(
    index: number = 0,
    buttonText: string = COMMON_BUTTONS.SAVE
  ) {
    cy.get(COMMON_LOCATORS.submitBtn).eq(index).click().contains(buttonText);
  }
}
export { ElementHandler, COMMON_LOCATORS, DROP_DOWN };
