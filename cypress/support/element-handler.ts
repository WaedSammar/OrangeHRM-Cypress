import { COMMON_BUTTONS, HTML_TAGS } from "./helpers/constants";

const COMMON_LOCATORS = {
  menuItems: "span.oxd-main-menu-item--name",
  submitBtn: `${HTML_TAGS.button}[type='submit']`,
};

class ElementHandler {
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
export { ElementHandler };
