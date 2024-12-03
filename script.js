document.addEventListener('DOMContentLoaded', () => {


    // Function to show error messages
    function showError(element, message) {
        const existingError = element.nextElementSibling;
        if (existingError && existingError.classList.contains('error-message')) {
            existingError.remove();
        }

        if (message) {
            const error = document.createElement('span');
            error.textContent = message;
            error.classList.add('error-message');
            error.style.color = 'red';
            error.style.fontSize = '12px';
            element.insertAdjacentElement('afterend', error);
        }
    }

    // Function to validate Fields and Table
    function validateFieldsAndTable() {
        const clientNameElement = document.querySelector('[contenteditable="true"][placeholder="Client Name"]');
        const addressElement = document.querySelector('.client-address');
        const invoiceNumberElement = document.querySelector('[contenteditable="true"][placeholder="Invoice Number"]');
        const invoiceDateElement = document.querySelector('[type="date"]');
        const tableRows = document.querySelectorAll('table tbody tr');

        let isValid = true;

        // Validate Client Name
        const clientName = clientNameElement.textContent.trim();
        if (!/^[a-zA-Z\s]+$/.test(clientName) || clientName.length === 0) {
            showError(clientNameElement, 'Client name must only contain letters and spaces.');
            isValid = false;
        } else {
            showError(clientNameElement, '');
        }

        // Validate Address
        const address = addressElement.textContent.trim();
        if (!/^[a-zA-Z0-9\s\/\-#&,]+$/.test(address) || address.length === 0) {
            showError(addressElement, 'Address must only contain valid characters.');
            isValid = false;
        } else {
            showError(addressElement, '');
        }

        // Validate Invoice Number
        const invoiceNumber = invoiceNumberElement.textContent.trim();
        if (!/^[a-zA-Z0-9\/]+$/.test(invoiceNumber) || invoiceNumber.length === 0) {
            showError(invoiceNumberElement, 'Invoice number must not be empty and can contain letters, numbers, and slashes.');
            isValid = false;
        } else {
            showError(invoiceNumberElement, '');
        }

        // Validate Invoice Date
        const invoiceDate = invoiceDateElement.value.trim();
        if (!Boolean(Date.parse(invoiceDate))) {
            showError(invoiceDateElement, 'Invoice date is invalid or missing.');
            isValid = false;
        } else {
            showError(invoiceDateElement, '');
        }

        // Validate Table Rows
        if (tableRows.length === 0) {
            document.querySelector('.table-error').textContent = 'At least one valid row must be added to the table.';
            isValid = false;
        } else {
            document.querySelector('.table-error').textContent = '';
            tableRows.forEach((row) => {
                const description = row.querySelector('.description').textContent.trim();
                const qty = parseFloat(row.querySelector('.qty').textContent) || 0;
                const unitPrice = parseFloat(row.querySelector('.unit-price').textContent) || 0;

                const descriptionElement = row.querySelector('.description');
                const qtyElement = row.querySelector('.qty');
                const unitPriceElement = row.querySelector('.unit-price');

                if (!description) {
                    showError(descriptionElement, `Description is required.`);
                    isValid = false;
                } else {
                    showError(descriptionElement, '');
                }

                if (qty <= 0) {
                    showError(qtyElement, `Quantity must be greater than 0.`);
                    isValid = false;
                } else {
                    showError(qtyElement, '');
                }

                if (unitPrice <= 0) {
                    showError(unitPriceElement, `Unit price must be greater than 0.`);
                    isValid = false;
                } else {
                    showError(unitPriceElement, '');
                }
            });
        }

        // Enable or disable the Export button based on overall validity
        document.getElementById('exportBtn').disabled = !isValid;
    }

    // Reapply formatting on paste and ensure validation is triggered
    document.addEventListener('paste', (event) => {
        const target = event.target;

        if (target.getAttribute('contenteditable') === 'true') {
            event.preventDefault(); // Stop the default paste behavior

            // Get the plain text from the clipboard
            const text = (event.clipboardData || window.clipboardData).getData('text/plain');

            // Get the current selection
            const selection = window.getSelection();
            if (!selection.rangeCount) return;

            const range = selection.getRangeAt(0);
            range.deleteContents(); // Remove the current selection

            // Insert plain text into the document
            const textNode = document.createTextNode(text.toUpperCase()); // Transform text to uppercase
            range.insertNode(textNode);

            // Move the caret to the end of the inserted text
            range.setStartAfter(textNode);
            range.setEndAfter(textNode);
            selection.removeAllRanges();
            selection.addRange(range);

            // Re-trigger validation after paste
            validateFieldsAndTable();
        }
    });

    // Real-time validation for fields
    document.querySelector('[contenteditable="true"][placeholder="Client Name"]').addEventListener('input', validateFieldsAndTable);
    document.querySelector('.client-address').addEventListener('input', validateFieldsAndTable);
    document.querySelector('[contenteditable="true"][placeholder="Invoice Number"]').addEventListener('input', validateFieldsAndTable);
    document.querySelector('[type="date"]').addEventListener('change', validateFieldsAndTable);

    // Real-time validation for table rows
    document.querySelectorAll('.description, .qty, .unit-price').forEach(cell => {
        cell.addEventListener('input', () => {
            updateCalculations();
            validateFieldsAndTable();
        });
    });

    // For table fields
    document.addEventListener('input', event => {
        if (event.target.matches('.description, .qty, .unit-price')) {
            validateFieldsAndTable();
        }

        const target = event.target;

        if (target.tagName === 'INPUT' || target.getAttribute('contenteditable') === 'true') {
            // For input fields
            if (target.tagName === 'INPUT') {
                const cursorPosition = target.selectionStart; // Save cursor position
                target.value = target.value.toUpperCase(); // Transform to uppercase
                target.setSelectionRange(cursorPosition, cursorPosition); // Restore cursor position
            }

            // For contenteditable elements
            if (target.getAttribute('contenteditable') === 'true') {
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                const cursorOffset = range.startOffset; // Save cursor position in contenteditable element

                target.textContent = target.textContent.toUpperCase(); // Transform to uppercase

                // Restore cursor position
                const newRange = document.createRange();
                newRange.setStart(target.firstChild, Math.min(cursorOffset, target.textContent.length));
                newRange.collapse(true);
                selection.removeAllRanges();
                selection.addRange(newRange);
            }
        }
    });


    // Update calculations
    function updateCalculations() {
        const rows = document.querySelectorAll('tbody tr');
        let totalExclTax = 0, totalGST = 0;

        rows.forEach(row => {
            const qty = parseFloat(row.querySelector('.qty').textContent) || 0;
            const unitPrice = parseFloat(row.querySelector('.unit-price').textContent) || 0;
            const gst = parseFloat(row.querySelector('.gst').textContent) || 0;

            const exclTax = qty * unitPrice;
            const gstAmount = exclTax * (gst / 100);
            const total = exclTax + gstAmount;

            row.querySelector('.line-total').textContent = total.toFixed(2);
            totalExclTax += exclTax;
            totalGST += gstAmount;
        });

        document.getElementById('total-excl-tax').textContent = totalExclTax.toFixed(2);
        document.getElementById('total-gst').textContent = totalGST.toFixed(2);
        document.getElementById('total-cgst').textContent = (totalGST / 2).toFixed(2);
        document.getElementById('total-sgst').textContent = (totalGST / 2).toFixed(2);
        document.getElementById('grand-total').textContent = (totalExclTax + totalGST).toFixed(2);
    }


    // Add event listeners for row input fields
    function addRowListeners(row) {
        row.querySelectorAll('[contenteditable="true"]').forEach(cell => {
            cell.addEventListener('input', () => {
                updateCalculations();
                validateFieldsAndTable();
            });
        });
    }

    // Add Row functionality
    const addRowButton = document.getElementById('addRow');
    addRowButton.addEventListener('click', () => {
        const tableBody = document.querySelector('table tbody');
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td contenteditable="true" class="description">Description</td>
            <td contenteditable="true" class="hsn-code">998361</td>
            <td contenteditable="true" class="qty">01</td>
            <td contenteditable="true" class="unit-price">0</td>
            <td class="gst">18</td>
            <td class="line-total">0.00</td>
        `;
        tableBody.appendChild(newRow);
        addRowListeners(newRow); // Add listeners for instant updates
        updateCalculations();
        validateFieldsAndTable();
    });

    // Remove Row functionality
    const removeRowButton = document.getElementById('removeRow');
    removeRowButton.addEventListener('click', () => {
        const tableBody = document.querySelector('table tbody');
        if (tableBody.lastElementChild) {
            tableBody.lastElementChild.remove();
        }
        updateCalculations();
        validateFieldsAndTable();
    });

    // Export to PDF
    document.getElementById('exportBtn').addEventListener('click', () => {
        document.querySelectorAll('.hide-in-pdf').forEach(button => {
            button.style.display = 'none';
        });

        const fileName = prompt("Enter a name for the PDF file:", "Invoice");
        const addressField = document.querySelector('.client-address');
        addressField.style.whiteSpace = 'pre-wrap';

        if (fileName) {
            const invoiceWrapper = document.getElementById('invoice-wrapper');
            invoiceWrapper.classList.add('pdf-export');

            html2pdf()
                .set({
                    margin: 10,
                    filename: `${fileName}.pdf`,
                    html2canvas: { scale: 2, useCORS: true },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
                })
                .from(invoiceWrapper)
                .toPdf()
                .get('pdf')
                .then(pdf => {
                    const pageCount = pdf.internal.getNumberOfPages();
                    for (let i = 1; i <= pageCount; i++) {
                        pdf.setPage(i);
                        pdf.setDrawColor(0, 0, 0);
                        pdf.rect(10, 10, pdf.internal.pageSize.width - 20, pdf.internal.pageSize.height - 20);
                    }
                })
                .save()
                .finally(() => {
                    invoiceWrapper.classList.remove('pdf-export');
                });
        }

        setTimeout(() => {
            document.querySelectorAll('.hide-in-pdf').forEach(button => {
                button.style.display = 'inline-block';
            });
        }, 1000);
    });

    // Real-time validation for all editable fields
    document.querySelector('[contenteditable="true"][placeholder="Client Name"]').addEventListener('input', validateFieldsAndTable);
    document.querySelector('.client-address').addEventListener('input', validateFieldsAndTable);
    document.querySelector('[contenteditable="true"][placeholder="Invoice Number"]').addEventListener('input', validateFieldsAndTable);
    document.querySelector('[type="date"]').addEventListener('change', validateFieldsAndTable);

    // Attach input event listener to all table cells
    document.querySelectorAll('tbody tr').forEach(row => {
        addRowListeners(row);
    });



});
