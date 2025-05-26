import { FFPage } from "../../assets/Types";

const csvHelpMarkdown = `
## Getting started

To help you migrate existing data from an external service, we've created the ability for you to import expense or invoice data.

To get started, click the menu button on the budget page, and select 'bulk import data' from the list of options. Selecting this button will open up the menu, and allow you to select **income** or **expenses** from the dropdown list.

Once an option is selected from the list, you can select a CSV file from your file explorer. **Please not that the file must be a .csv file**.

After you've selected a file, you will see a preview showing the first 5 lines of data and their categories.
On this screen you can also use the toggle to indicate whether or not we should look for headers in your data.

Press **Choose Columns** to continue importing [expense](#import-expense-data) or [income](#import-income-data) data.

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
        <th>Amount*</th>
        <td>The amount of income from the item. This can be a number (34.20) or a dollar amount ($34.20).</td>
        <td>*must be provided*</td>
        <td>$56</td>
    </tr>
    <tr>
        <th>Project*</th>
        <td>The name of the project. This is important because FreeFlex always links invoices to projects. When importing invoices FreeFlex will create new projects for any that don't exist.</td>
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
This is a rare error that means something went wrong on our end. Use the import history menu to delete this import and try again, or [contact us](mailto:isaac@freeflex.com.au) for support.`;

const PrivacyPolicyMarkdown = `
## About this page

**Last Updated:** 16/05/2025

FreeFlex (operated by Lightworks Productions, referred to as "we," "us," or "our") is committed to protecting the privacy of our users ("you"). This Privacy Policy outlines how we collect, use, disclose, and store your personal information in accordance with the Australian Privacy Principles (APPs) under the Privacy Act 1988 (Cth).

## 1. Information We Collect

We collect various types of personal information to provide and improve the FreeFlex service. This information includes:

* **Account Information:** When you register for FreeFlex, we collect your name, email address, phone number, business name, and Australian Business Number (ABN).
* **Client Information:** You may input client names, nicknames, phone numbers, and email addresses into the app.
* **Project Information:** We collect details related to your projects, including priorities, statuses, dates, and any notes you add.
* **Invoice and Quote Information:** When you generate invoices and quotes, we collect details such as the total cost and your bank account numbers for displaying payment information. We also collect the email addresses and phone numbers of your clients when included in these documents.
* **Expense Information:** When you record expenses, we collect the date, description, category, and any attached invoice links or files.
* **Usage Data (Collected by Supabase):** Our backend platform, Supabase, automatically collects certain information related to your use of FreeFlex. This may include:
    * **Database Requests:** Logs of your interactions with the FreeFlex database.
    * **User IP Addresses:** Your device's internet protocol address.
    * **Sessions:** Information about your login sessions and activity within the app.
    * **Server Request Logs:** Records of requests sent to our servers.
* **User Activity Analysis (via Meticulous):** We use Meticulous AI to analyze user activity within the app to help us write automated tests and improve the platform. This may involve Meticulous having access to all user activity data within FreeFlex. Please refer to Meticulous AI's Privacy Policy ([https://www.meticulous.ai/privacy-policy](https://www.meticulous.ai/privacy-policy)) for details on their data handling practices.
* **Calendar and Authorization Data (Shared with Google):** If you choose to integrate FreeFlex with your Google Calendar, we will share project dates, project names, and client information (names, potentially email addresses) to populate calendar events. For user authorization via Google login, we will share your email address and a unique identifier with the respective platform.
* **Cookies and Tracking Technologies:** Currently, we do not directly use cookies or other tracking technologies on our website or within the app, other than the usage data collected by Supabase as described above.

## 2. How We Use Your Personal Information

We collect and use your personal information for the following purposes:

* To provide and maintain the FreeFlex service.
* To personalize your user experience.
* To enable core features such as client management, project management, invoicing, quotes, and contract generation.
* To provide customer support.
* To communicate with you about updates, notifications, and important information related to FreeFlex.
* To improve and develop new features for FreeFlex.
* To analyze usage patterns and trends to understand how users interact with our platform.
* To generate tax reports and BAS statements based on your financial data.
* For direct marketing purposes (with your consent, where required by law), such as sending promotional emails about FreeFlex features and updates. You can opt-out of these communications at any time.
* To comply with our legal obligations.

## 3. Data Storage and Security

Your personal information is stored on servers located in Australia, managed by our backend platform provider, Supabase. Supabase implements stringent security measures and data access controls to protect your information from unauthorised access, use, or disclosure. These measures include encryption in transit and at rest.

Within our organisation, team members are trained in data protection laws and are granted access to personal information only on a need-to-know basis to perform their specific duties.

While we take reasonable steps to secure your personal information, please be aware that no method of transmission over the internet or method of electronic storage is completely secure.

## 4. Disclosure of Personal Information

We may disclose your personal information to the following third parties:

* **Stripe:** To process payments related to any paid features we may introduce in the future.
* **Google:** To facilitate calendar integration and user authorization, as described in Section 1.
* **Supabase:** As our backend platform provider, Supabase stores and processes all your data necessary for the functioning of FreeFlex. While their servers are located overseas, they have robust data protection policies in place.
* **Meticulous AI:** To analyse user activity for automated testing and platform improvement. Meticulous is based in the US, and your user activity data will be transferred to the United States. We rely on their SOC2 Type II compliance and aim to only share data necessary for testing purposes.
* **Legal Authorities:** If required to do so by law or in response to a valid legal request.
* **In the event of a business sale or merger:** Your personal information may be transferred to the new owners so that they can continue to provide the services.
* **With your explicit consent:** In situations not otherwise covered by this policy.

Some of these third parties, including Google, Supabase, and Stripe, are located in the United States. When we disclose your personal information to overseas recipients, we take reasonable steps to ensure that the recipient complies with the Australian Privacy Principles or a substantially similar law. However, you acknowledge that we cannot guarantee the data handling practices of these third parties.

## 5. Your Rights and Choices

You have certain rights regarding your personal information:

* **Access:** You have the right to request access to the personal information we hold about you.
* **Correction:** You have the right to request that we correct any inaccurate or incomplete personal information we hold about you.
* **Deletion:** You have the right to request the deletion of your personal information when it is no longer needed for the purposes for which it was collected, or if there is no legal obligation for us to retain it. To make such a request, please email us at isaac@freeflex.com.au.
* **Opt-out of Marketing Communications:** You can opt-out of receiving direct marketing communications from us at any time by following the unsubscribe instructions in our emails or by contacting us directly.

To exercise any of these rights, please contact us at isaac@freeflex.com.au. We will do our best to respond to your request within one week. We may need to verify your identity before processing your request. If we cannot fulfill your request fully, we will explain the reasons to you.

## 6. Data Retention

We will retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, or as required by Australian law.

* Generally, personal information will be retained until you request its deletion.
* Financial records, including invoice details, will be retained for at least five years from the date the record was created or the transaction was completed, in accordance with Australian tax law. Other business records may also be retained for specific periods to comply with legal obligations.
* Usage data may be retained for longer periods for aggregated and anonymized analysis.
* When your account is terminated or you request deletion, we will take reasonable steps to securely delete or de-identify your personal information, unless we are legally required to retain it.

## 7. Cross-Border Data Transfers
As mentioned in Section 3 and 4, your personal information is stored on servers located in Australia (Supabase) and may be accessed by third parties located in the United States (Google, Meticulous). We take reasonable steps to ensure that these overseas recipients handle your personal information in accordance with the Australian Privacy Principles or a substantially similar law. By using FreeFlex, you consent to these overseas transfers.

## 8. Complaints

If you have any concerns or believe that your privacy has been breached, please contact us in the first instance at:

Isaac Drury
isaac@freeflex.com.au

We will investigate your complaint and aim to resolve it in a timely manner. If you are not satisfied with our response, you may lodge a complaint with the Office of the Australian Information Commissioner (OAIC). You can find more information about the OAIC at [www.oaic.gov.au](www.oaic.gov.au).

## 9. Changes to this Privacy Policy

We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by posting the updated policy within the FreeFlex app or on our website. The date of the last update will be indicated at the top of the policy. Your continued use of FreeFlex after any changes to this Privacy Policy constitutes your acceptance of the revised policy.

## 10. Contact Us

If you have any questions about this Privacy Policy or our privacy practices, please contact the developer [Isaac Drury](isaac@freeflex.com.au)`;

const TermsAndConditionsMarkdown = `
## About this page

**Last Updated:** 10/05/2025

Welcome to FreeFlex (www.freeflex.com.au), an online platform designed to help Australian freelancers streamline their business management. These Terms of Service ("Terms") govern your access to and use of the FreeFlex service, including our website, mobile applications, and any related services (collectively, the "Service").

By registering for or using the Service, you ("you" or "User") agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Service.

## 1. Service Description

FreeFlex is a software tool designed specifically for Australian freelancers to streamline their administrative tasks. The Service provides features for managing clients, projects (including prioritisation, status tracking, and note-taking), generating invoices and quotes (pre-filled with project and client details, with the ability to convert between them), creating contracts (also pre-filled with relevant details and attachable to invoices/quotes), and providing a budget overview based on entered invoices and expenses, including basic financial reporting. The intended purpose is to eliminate the need for spreadsheets and constant data migration, saving freelancers time and allowing them to focus on their core work.

The Service is solely a software tool. FreeFlex does not offer any advisory, legal, or accounting services. Users are responsible for ensuring their use of the Service complies with all applicable Australian laws. The Service is intended for use by individuals geographically based in Australia. Use of the Service for activities that are against Australian law is strictly prohibited.

## 2. User Accounts

**2.1 Account Creation:** To access and use the Service, you must register for an account. During the registration process, you will be required to provide your email address, first name, and last name. You are responsible for providing accurate and up-to-date information during registration and in your continued use of the Service. We take no responsibility for inaccuracies in the information you provide.

**2.2 Account Types:** FreeFlex offers both free and paid accounts. Free accounts may have limitations, including but not limited to a maximum of five (5) projects, one (1) contract, one (1) invoice, and one (1) quote per project, a limit of five (5) clients, and a limit of ten (10) expenses. Paid accounts offer expanded functionality and may have different subscription terms.

**2.3 User Responsibilities:** You are solely responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You must notify us immediately of any unauthorised access to or use of your account.

**2.4 Account Suspension and Termination by FreeFlex:** We reserve the right to suspend or terminate your account and access to the Service at any time, with or without cause and with or without notice, if we believe you have breached these Terms of Service or engaged in conduct that we deem inappropriate or harmful to FreeFlex, its users, or our business. A breach of these Terms may include, but is not limited to:

* Providing false or misleading information during registration or while using the Service.
* Attempting to interfere with the proper functioning of FreeFlex.
* Using FreeFlex for any illegal or unauthorised purpose.
* Violating the intellectual property rights of FreeFlex or third parties.
* Engaging in conduct that is abusive, harassing, threatening, or otherwise objectionable.
* Attempting to circumvent any limitations or restrictions on your account.
* Using the Service in a way that could damage FreeFlex's reputation or business.
* Breaching the rules regarding user content and conduct as outlined in Section 3.

**2.5 Notification and Appeal:** While we may not always provide notice before suspending or terminating an account, where practicable, we will endeavour to do so. If your account is suspended or terminated and you believe this was done in error, you may appeal by emailing isaac@freeflex.com.au.

## 3. User Content and Conduct

**3.1 User Content:** The Service allows you to create, upload, and store various types of content, including client data (names, nicknames, phone numbers, email addresses), project information (details, priorities, statuses, dates, notes), invoices and quotes (including total costs and your bank account details), contracts, business logos, business information (including ABN and location), and expense details (date, description, category, invoice links/files). You retain ownership of your content. By using the Service, you grant FreeFlex a non-exclusive, worldwide, royalty-free license to access, use, reproduce, process, modify, publish, transmit, display, and distribute your content solely for the purpose of providing you with the Service.

**3.2 Prohibited Conduct:** You agree not to use the Service to:

* Engage in any activity that is illegal under Australian law or breaches the privacy of other users.
* Upload images that are not business logos.
* Upload expense files that include nudity, violence, or other content that could reasonably be considered offensive.
* Upload or transmit content that is defamatory, libelous, or slanderous.
* Upload or transmit content that infringes upon the copyright, trademarks, or other intellectual property rights of any third party.
* Upload or transmit content that is pornographic, sexually explicit, or exploits, abuses, or endangers children.
* Upload or transmit content that promotes discrimination, hatred, or violence based on protected characteristics.
* Transmit spam, unsolicited advertising, or other forms of unauthorised solicitation.
* Misrepresent your affiliation with any person or entity.
* Attempt to interfere with the proper functioning of FreeFlex.

**3.3 Monitoring of Content and Conduct:** While we do not routinely monitor all user content, we reserve the right to do so to ensure compliance with these Terms, investigate complaints, respond to legal requests, protect the safety and security of FreeFlex and its users, and prevent fraud or illegal activities. We may remove or disable access to any content that we believe violates these Terms or is otherwise objectionable.

## 4. Intellectual Property

**4.1 FreeFlex Intellectual Property:** The Service, including its software, design, logo, trademarks, software architecture, and any other proprietary materials, is owned by FreeFlex and is protected by copyright and other intellectual property laws.

**4.2 User License:** Subject to your compliance with these Terms, FreeFlex grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Service solely for your internal business purposes as an Australian freelancer.

**4.3 Restrictions on Use:** You agree not to:

* Reverse engineer, decompile, or disassemble any part of FreeFlex, except as expressly permitted by law.
* Copy, modify, or create derivative works based on FreeFlex, except as expressly permitted within the app for generating invoices, quotes, and contracts.
* Rent, lease, lend, sell, redistribute, sublicense, or otherwise transfer your access to or use of FreeFlex to any third party.
* Use FreeFlex in any way that could damage, disable, overburden, or impair our systems.
* Attempt to gain unauthorised access to any part of FreeFlex.
* Use any automated means to access FreeFlex without our express written permission.
* Remove, obscure, or alter any proprietary notices within FreeFlex.

**4.4 User-Generated Documents:** You are permitted unlimited distribution of contracts, invoices, and quotes that you create using the Service.

## 5. Payment Terms

**5.1 Fees and Subscriptions:** FreeFlex offers a free trial with the limitations described in Section 2.2. Upon upgrading to a paid plan, you can choose between monthly or annual subscriptions. Fees for paid plans will be clearly displayed within the Service.

**5.2 Payment:** When you subscribe to a paid plan, you agree to pay the applicable fees in accordance with the chosen billing cycle. Payments will be processed using our third-party payment processor (Stripe). You authorise us to charge your chosen payment method for the applicable fees.

**5.3 Failure to Pay:** If your payment fails, we will provide a 30-day grace period. If payment is not received within this period, your paid plan may be terminated, and your account may revert to a free plan with its associated limitations.

**5.4 Refunds:** Generally, refunds are not provided. However, refunds may be considered in cases of demonstrable double charges or if you can provide evidence that FreeFlex has failed to fulfil its specified purpose. Refund requests must be submitted to isaac@freeflex.com.au with supporting documentation.

**5.5 Changes to Fees and Plans:** Users on a free plan will receive email receipts upon any payment. If plan details or pricing change, users will be notified via email at least 30 days before the changes take effect.

## 6. Disclaimer of Warranties and Limitation of Liability

To the fullest extent permitted by applicable Australian law:

* FreeFlex is provided on an "as is" and "as available" basis, without any warranties of any kind.
* We do not warrant that FreeFlex will be uninterrupted, error-free, secure, or that all defects will be corrected.
* We make no warranties about the accuracy, completeness, reliability, or timeliness of any content or information available through FreeFlex.
* In no event shall FreeFlex be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of or inability to use FreeFlex.
* Our total cumulative liability to you for any and all claims arising out of or relating to these Terms or your use of FreeFlex shall not exceed the amount you paid (if any) to us for the use of FreeFlex in the twelve (12) months preceding the event giving rise to the liability, or AUD $100.00 if no such payments have been made.
* Nothing in these Terms is intended to exclude or limit any liability that cannot be excluded or limited under Australian law, including the Australian Consumer Law.

You agree to indemnify, defend, and hold harmless FreeFlex from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees arising out of or relating to your use of FreeFlex, your violation of these Terms, your violation of any third-party rights, or any content you submit through FreeFlex.

## 7. Termination

**7.1 Termination by User:** You may terminate your account at any time by emailing isaac@freeflex.com.au. Please note that we may retain financial information as required by law.

**7.2 Termination by FreeFlex:** We may terminate your access to all or any part of the Service at any time, with or without cause, as outlined in Section 2.4.

**7.3 Effects of Termination:** Upon termination of your account, your right to use the Service will immediately cease. You will not be able to retrieve any data you have stored in FreeFlex. We may retain your data for a period necessary to comply with legal obligations and for other legitimate business purposes, in accordance with our Privacy Policy. Specifically, financial information may be retained for at least five years.

## 8. Governing Law and Dispute Resolution

These Terms shall be governed by and construed in accordance with the laws of South Australia, Australia. Any dispute arising out of or relating to these Terms shall be subject to mediation in South Australia. If the dispute cannot be resolved through mediation, the parties submit to the exclusive jurisdiction of the courts of South Australia.

## 9. Changes to the Terms

We may modify these Terms at any time. We will notify you of any material changes by email at least 30 days before they take effect and by displaying a prominent notice within the FreeFlex app. By continuing to use the Service after the effective date of any changes, you agree to be bound by the revised Terms. Your acceptance of the new terms will be indicated by approving the in-browser pop-up.

## 10. Contact Information

If you have any questions or concerns about these Terms of Service, please contact us at:

isaac@freeflex.com.au

By using FreeFlex, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.`;

const ContractHelpMarkdown = `
## About contracts
Contracts are an important part of projects, and it's a good idea to ask a client to sign a contract before you commence working with them. 

Many businesses choose to send contracts along with a quote (which you can do with FreeFlex), but you can also download a contract and send it as a stand-alone.

If you're technically minded, you might also like to know that we use [React-pdf](https://react-pdf.org/) to generate contracts.

## Getting started
FreeFlex contracts must be copied in as text into the editing panel.

You can copy in an existing contract from microsoft word (or similar), or start from scratch! 

*We hope to have some custom contract templates coming soon*

Use the style bar up the top to customise the style of contracts, and add different types of headings. You can also add lists and use the *Tx* button to remove styling.

***WARNING: Make sure to preview your contract before sending it, as issues can sometimes occur when the contract is converted from doc to pdf form.***

## Previewing and using contracts
To view and download a contract from the contract editing panel, press the '...' menu and select 'Preview'. This will bring up the contract viewer.

***WARNING: Please note that your contract may change slightly when it is converted to a pdf!***

Press the download button in the PDF previewer to download the contract.

Alternatively, you can attach a contract to a quote by selecting it from within the quote or invoice editing page.

## We love your feedback

**Please help us improve the program by [sending through feedback!](/feedback)**`;

export const ALWAYS_ACCESSIBLE_PAGES: FFPage[] = [
  {
    id: 1,
    url: "privacy-policy",
    title: "Our privacy policy",
    description:
      "FreeFlex is committed to protecting your privacy. Read our policy to learn how we handle your data.",
    markdown: PrivacyPolicyMarkdown,
  },
  {
    id: 2,
    url: "terms-of-service-policy",
    title: "Our terms of service",
    description:
      "Read our terms of service to understand your rights and responsibilities when using FreeFlex.",
    markdown: TermsAndConditionsMarkdown,
  },
  {
    id: 3,
    url: "csv-import",
    title: "CSV import invoices and expenses",
    description:
      "Learn how to import invoices and expenses from a CSV file into FreeFlex.",
    markdown: csvHelpMarkdown,
  },

  {
    id: 4,
    url: "contracts",
    title: "FreeFlex Contracts",
    description: "Learn how to create and use contracts in FreeFlex.",
    markdown: ContractHelpMarkdown,
  },
];
