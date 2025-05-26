## Getting started

To help you migrate existing data from an external service, we've created the ability for you to import expense or invoice data.

To get started, click the menu button on the budget page, and select 'bulk import data' from the list of options. Selecting this button will open up the menu, and allow you to select **income** or **expenses** from the dropdown list.

Once an option is selected from the list, you can select a CSV file from your file explorer. **Please not that the file must be a .csv file**.

After you've selected a file, you will see a preview showing the first 5 lines of data and their categories.
On this screen you can also use the toggle to indicate whether or not we should look for headers in your data.

Press **Choose Columns** to continue importing [expense](#import-expense-data) or [invoice](#import-invoice-data) data.

## Import expense data
### What is expense data?
Expense data is a list of items which represent things you have purchased. Adding this data will allow us to give you accurate insights into how you are spending your money!

### Columns you can import

<table>
    <thead>
    <th>Name</th>
    <th>Data description</th>
    <th>Default value</th>
    <th>Example</th>
    </thead>
    <tbody>
    <tr>
        <th>Date*</th>
        <td>A date in one of the following formats:<br/>
        'd/M/yyyy' (17/3/2025)<br/>
        'd-M-yyyy' (17-3-2025)<br/>
        'yyyy/M/d' (2025/17/3)<br/>
        'yyyy-M-d' (2025/17/3)<br/>
        'MMM d yyyy' (Mar 17 2025)<br/>
        'MMMM d yyyy' (Mar 17 2025)<br/>
        'd MMM yyyy' (17 Mar 2025)<br/>
        'd MMM yyyy' (17 March 2025)</td>
        <td>*must be provided*</td>
        <td>17/3/2025</td>
    </tr>
    <tr>
        <th>Description*</th>
        <td>A description about the expense. This can be any text.</td>
        <td>*must be provided*</td>
        <td>New gear</td>
    </tr>
    <tr>
        <th>Amount*</th>
        <td>The cost of the item. This can be a number (34.20) or a dollar amount ($34.20).</td>
        <td>*must be provided*</td>
        <td>$56</td>
    </tr>
    <tr>
        <th>Tax Deductible</th>
        <td>Whether or not the item is tax deductable. Must be some version of true or false. (T t, 1, True or true)</td>
        <td>'False'</td>
        <td>True</td>
    </tr>
    <tr>
        <th>Category</th>
        <td>The category the expense falls into. This can be any string, however please note that Freeflex currently only supports specific categories ( but we plan to allow users to work with custom categories sometime in the future)</td>
        <td>'Other'</td>
        <td>Legal</td>
    </tr>
        <tr>
        <th>Link</th>
        <td>A link to an invoice for the expense. Can technically be any text, but you should provide a real url for this to work</td>
        <td>none</td>
        <td>https://url.com/my-invoice</td>
    </tr>
    </tbody>
</table>

## Import income data
### What is income data?
Income data is a list of items which represent money you have earnt. Importing this data will allow us to give you insights into what you have earnt.

### Columns you can import

<table>
    <thead>
    <th>Name</th>
    <th>Data description</th>
    <th>Default value</th>
    <th>Example</th>
    </thead>
    <tbody>
    <tr>
        <th>Date*</th>
        <td>A date in one of the following formats:<br/>
        'd/M/yyyy' (17/3/2025)<br/>
        'd-M-yyyy' (17-3-2025)<br/>
        'yyyy/M/d' (2025/17/3)<br/>
        'yyyy-M-d' (2025/17/3)<br/>
        'MMM d yyyy' (Mar 17 2025)<br/>
        'MMMM d yyyy' (Mar 17 2025)<br/>
        'd MMM yyyy' (17 Mar 2025)<br/>
        'd MMM yyyy' (17 March 2025)</td>
        <td>*must be provided*</td>
        <td>17/3/2025</td>
    </tr>
     <tr>
        <th>Total amount*</th>
        <td>The amount of income from the item. This can be a number (34.20) or a dollar amount ($34.20).</td>
        <td>*must be provided*</td>
        <td>$56</td>
    </tr>
    <tr>
        <th>Project</th>
        <td>The name of the project. This is important because FreeFlex always links invoices to projects. Not providing this column will cause FreeFlex to attach invoices to a project titled 'new project'</td>
        <td>New Project</td>
        <td>'Filming for Bob'</td>
    </tr>
    <tr>
        <th>Client</th>
        <td>The client who provided the income. This helps us to provide you with more valuable insights into your data.</td>
        <td>none</td>
        <td>'Bob'</td>
    </tr>
    <tr>
        <th>Invoice Number</th>
        <td>A unique identifier for the invoice. This is not essential, this is to help you keep track of invoices you have sent.</td>
        <td>none</td>
        <td>INV #200</td>
    </tr>
    <tr>
        <th>Date due</th>
        <td>A date when this invoice should have been paid by the client. Must fulfill the same requirements as teh 'date' column.</td>
        <td>none</td>
        <td>INV #200</td>
    </tr>
    <tr>
        <th>Description</th>
        <td>A description about the income line. This can be any text.</td>
        <td>none</td>
        <td>New gear</td>
    </tr>
    <tr>
        <th>Includes GST</th>
        <td>Whether or not you charged GST on this item. Must be some version of true or false (True, true, t and T are all acceptable values)</td>
        <td>'False'</td>
        <td>F</td>
    </tr>
    <tr>
        <th>Is paid</th>
        <td>Whether or not the client has paid this invoice. Must be some version of true or false (True, true, t and T are all acceptable values)</td>
        <td>'False'</td>
        <td>true</td>
    </tr>
    </tbody>
</table>

## Errors
### Some dates were invalid
If you see this message. It means some of your date columns were empty or had invalid formats. (see above for required date formats).

### Some amounts were not numbers or were in an invalid format
If you see this message. It means some of your 'amount' values were not numbers, were empty, or had a number format we don't recognise. See above for valid amount values.

### An error occured linking invoices to projects
This is a rare error that means something went wrong on our end. Use the import history menu to delete this import and try again, or [contact us](mailto:isaac@freeflex.com.au) for support.