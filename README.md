
# Invoice Generator

This project is a simple, user-friendly web-based **Invoice Generator** designed for creating invoices with or without tax calculations. It supports dynamic row management, editable fields, and PDF export functionality.

---

## Features

- **Editable Fields**: Modify client details, invoice items, and totals directly on the page.
- **Dynamic Rows**: Add or remove rows for itemized billing.
- **Automatic Calculations**: Calculates line totals and grand totals dynamically.
- **Two Modes**: Supports tax-inclusive and non-tax invoices with seamless navigation between the two.
- **PDF Export**: Export the invoice as a professional-looking PDF.
- **Total in Words**: Converts the grand total into words for better clarity.

---

## Installation and Setup

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd invoice-generator
   ```

2. **Directory Structure**:
   - `tax-invoice/`: Contains files for tax-inclusive invoices.
   - `invoice/`: Contains files for non-tax invoices.
   - Common files:
     - `Logo.png`: Company logo.
     - `style.css`: Shared styling for both invoice types.
     - `script.js`: JavaScript file for logic and dynamic updates.

3. **Run Locally**:
   - Open the `index.html` file from either the `tax-invoice` or `invoice` folder in your browser.

---

## Usage

1. **Invoice Modes**:
   - **Non-Tax Invoice**:
     - Navigate to `invoice/index.html`.
     - Modify the fields and rows as needed.
   - **Tax-Inclusive Invoice**:
     - Navigate to `tax-invoice/index.html`.
     - Additional tax-related fields are available.
   
2. **Field Editing**:
   - Click on editable fields (e.g., item description, quantity, unit price) to modify.

3. **Add/Remove Rows**:
   - Use the `Add Row` and `Remove Row` buttons to manage itemized billing.

4. **Export as PDF**:
   - Click the `Export to PDF` button to download the invoice.

5. **Switch Modes**:
   - Use the button at the top-right corner to navigate between tax and non-tax invoice pages.

---

## File Descriptions

- `index.html`: Main HTML file for the invoice page.
- `style.css`: Contains the styles for the invoice layout and design.
- `script.js`: Contains JavaScript for dynamic calculations, event handling, and PDF generation.
- `Logo.png`: Placeholder logo used in the invoice header.

---

## Example Screenshot

(Insert a screenshot of the invoice interface here.)

---

## Dependencies

- **Bootstrap**: For layout and styling.
- **html2pdf.js**: For PDF generation.
- **Custom JavaScript**: For dynamic updates and calculations.

---

## Future Enhancements

- Add support for saving and loading invoices locally.
- Enhance the design for better user experience.
- Add support for multiple currencies and languages.

---

## License

This project is licensed under the MIT License. Feel free to use and modify it as needed.

---

This structure provides clarity to users about the purpose, functionality, and setup of your project. You can expand or simplify sections based on the project's complexity and intended audience.
