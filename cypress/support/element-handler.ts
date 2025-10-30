import { COMMON_BUTTONS, HTML_TAGS } from "./helpers/constants";
import { TableRowData } from "./types/table-row";

const COMMON_LOCATORS = {
  menuItems: "span.oxd-main-menu-item--name",
  submitBtn: `${HTML_TAGS.button}[type='submit']`,
  dropDownList: ".oxd-userdropdown-name",
  dropDownMenu: ".oxd-dropdown-menu",
  table: '[role="table"]',
  cell: '[role="cell"]',
  tableCard: '.oxd-table-card'
};

enum DROP_DOWN {
  ABOUT = "About",
  SUPPORT = "Support",
  CHANGE_PASSWORD = "Change Password",
  LOGOUT = "Logout",
}

class ElementHandler {
  private static LOCATORS = {
    columnHeader: '[role="columnheader"]',
    inputGroup: ".oxd-input-group",
    selectField: ".oxd-select-text",
    dropdownOption: ".oxd-select-dropdown",
    dateInput: `${HTML_TAGS.input}[placeholder='yyyy-dd-mm']`,
    closeCalenderBtn: ".--close",
  };

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
    cy.contains(HTML_TAGS.label, label)
      .parents(this.LOCATORS.inputGroup)
      .find(this.LOCATORS.selectField)
      .click();
    cy.get(this.LOCATORS.dropdownOption).contains(option).click();
  }

  /**
   * select date from calender and close it
   * @param {string} date
   * @param {number} index
   */
  static selectDate(date: string, index: number = 0) {
    cy.get(this.LOCATORS.dateInput)
      .eq(index)
      .should("be.visible")
      .clear()
      .type(date);
    cy.get(this.LOCATORS.closeCalenderBtn).should("be.visible").click();
  }

  /**
   * save information user entered
   * @param index
   */
  static clickSave(
    index: number = 0,
    buttonText: string = COMMON_BUTTONS.SAVE,
  ) {
    cy.get(COMMON_LOCATORS.submitBtn).eq(index).click().contains(buttonText);
  }

  /**
   * get the index for column by header name
   * @param {string} headerName
   * @returns
   */
  static getHeaderIndex(headerName: string) {
    return new Cypress.Promise<number>((resolve) => {
      cy.get(COMMON_LOCATORS.table)
        .find(this.LOCATORS.columnHeader)
        .contains(headerName)
        .invoke('index')
        .then((index) => {
          resolve(index)
        })
    })
  }

  /**
   * get Matching Row By Data
   * @param {validateTableRow} data
   * @returns
   */
  static getMatchingRowByData(data: TableRowData) {
    const headers = Object.keys(data)
    const matchesPerColumn: { [key: string]: number[] } = {}

    headers.forEach((key) => {
      matchesPerColumn[key] = []

      // get the index for the column
      this.getHeaderIndex(key).then((headerIndex) => {
        cy.get(COMMON_LOCATORS.table)
          .find(COMMON_LOCATORS.tableCard)
          .each(($row, rowIndex) => {
            cy.wrap($row)
              .find(COMMON_LOCATORS.cell)
              .eq(headerIndex)
              .invoke('text')
              .then((text) => {
                // save row index if it betmatch the expected value
                if (text === data[key]) {
                  matchesPerColumn[key].push(rowIndex)
                }
              })
          })
      })
    })

    return cy.then(() => {
      const matchingIndices = matchesPerColumn[headers[0]].filter((index) =>
        headers.every((key) => matchesPerColumn[key].includes(index))
      )

      if (matchingIndices.length === 0) throw new Error('No matching rows found')
      if (matchingIndices.length > 1) throw new Error('Multiple matching rows found')

      return matchingIndices[0]
    })
  }

  /**
 * validate Table Row
 * @param {TableRowData} data
 */
  static validateTableRow(data: TableRowData) {
    this.getMatchingRowByData(data).then((matchIndex) => {
      // get the row that match by index
      cy.get(COMMON_LOCATORS.table)
        .find(COMMON_LOCATORS.tableCard)
        .eq(matchIndex)
        .find(COMMON_LOCATORS.cell)
        .then(($cells) => {
          //verify each cell betmatch the expected value
          Object.keys(data).forEach((key) => {
            this.getHeaderIndex(key).then((headerIndex) => {
              cy.wrap($cells).eq(headerIndex).should('have.text', data[key])
            })
          })
        })
    })
  }

  /**
   * click on icon on the table
   * @param {TableRowData} data
   * @param {string} locator
   */
  static clickActionIconInRow(data: TableRowData, locator: string) {
    this.getMatchingRowByData(data).then((matchIndex) => {
      cy.get(COMMON_LOCATORS.table).find(COMMON_LOCATORS.tableCard).eq(matchIndex).find(locator).click()
    })
  }
}
export { ElementHandler, COMMON_LOCATORS, DROP_DOWN };
