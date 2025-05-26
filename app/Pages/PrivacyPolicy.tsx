import IonIcon from "@reacticons/ionicons";
import React from "react";
import { reRouteTo } from "../Functions/commonFunctions";

export default function PrivacyPolicy({
  menuVisible,
  inShrink,
  authorized,
}) {

  return (
    <div className="leftRow" style={{ marginTop: 20 }}>
      <div
        className=""
        style={{
          maxWidth: "1200px",
          marginLeft: `${
            inShrink ? 10 :( menuVisible && authorized) ? 250 : 200
          }px`,
        }}
      >
        <button
          className="leftRow middle p0 pl2 pr2"
          onClick={() => reRouteTo("/")}
        >
          <IonIcon name="arrow-back" /> <p>Back</p>
        </button>
        <br />
        <div className="boxed">
          <h3 className="m2">Privacy Policy for FreeFlex</h3>
          <br />
          <div className="leftRow middle m2">
            <IonIcon
              name="document-sharp"
              style={{ width: "2em", height: "100%" }}
            />
            <h1 className="m0 ml2">
              Here's how we keep your data safe!
            </h1>
          </div>
          <br />
          <p>
            <strong>Last Updated:</strong> 29/04/2025
          </p>
        </div>
        <br />
        <p>
          FreeFlex (operated by Lightworks Productions, referred to as
          &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is
          committed to protecting the privacy of our users
          (&quot;you&quot;). This Privacy Policy outlines how we
          collect, use, disclose, and store your personal information
          in accordance with the Australian Privacy Principles (APPs)
          under the Privacy Act 1988 (Cth).
        </p>
        <br />
        <p>
          <strong>1. Information We Collect</strong>
        </p>
        <p>
          We collect various types of personal information to provide
          and improve the FreeFlex service. This information includes:
        </p>
        <ul>
          <li>
            <strong>Account Information:</strong> When you register
            for FreeFlex, we collect your name, email address, phone
            number, business name, and Australian Business Number
            (ABN).
          </li>
          <li>
            <strong>Client Information:</strong> You may input client
            names, nicknames, phone numbers, and email addresses into
            the app.
          </li>
          <li>
            <strong>Project Information:</strong> We collect details
            related to your projects, including priorities, statuses,
            dates, and any notes you add.
          </li>
          <li>
            <strong>Invoice and Quote Information:</strong> When you
            generate invoices and quotes, we collect details such as
            the total cost and your bank account numbers for
            displaying payment information. We also collect the email
            addresses and phone numbers of your clients when included
            in these documents.
          </li>
          <li>
            <strong>Expense Information:</strong> When you record
            expenses, we collect the date, description, category, and
            any attached invoice links or files.
          </li>
          <li>
            <strong>Usage Data (Collected by Supabase):</strong> Our
            backend platform, Supabase, automatically collects certain
            information related to your use of FreeFlex. This may
            include:
            <ul>
              <li>
                <strong>Database Requests:</strong> Logs of your
                interactions with the FreeFlex database.
              </li>
              <li>
                <strong>User IP Addresses:</strong> Your device&#39;s
                internet protocol address.
              </li>
              <li>
                <strong>Sessions:</strong> Information about your
                login sessions and activity within the app.
              </li>
              <li>
                <strong>Server Request Logs:</strong> Records of
                requests sent to our servers.
              </li>
            </ul>
          </li>
          <li>
            <strong>User Activity Analysis (via Meticulous):</strong>{" "}
            We use Meticulous AI to analyze user activity within the
            app to help us write automated tests and improve the
            platform. This may involve Meticulous having access to all
            user activity data within FreeFlex. Please refer to
            Meticulous AI&#39;s Privacy Policy (
            <a    target="_blank"
            rel="noopener noreferrer" href="https://www.meticulous.ai/privacy-policy">
              https://www.meticulous.ai/privacy-policy
            </a>
            ) for details on their data handling practices.
          </li>
          <li>
            <strong>
              Calendar and Authorization Data (Shared with Google):
            </strong>{" "}
            If you choose to integrate FreeFlex with your Google
            Calendar, we will share project dates, project names, and
            names of your clients with google, in order to populate
            calendar events. In this scenario, FreeFlex will also
            insert, update and delete events which you create in
            FreeFlex. We will not read, delete or modify any events
            from your Google calendar which you did not create through
            the FreeFlex platform. For user authorization via Google
            login, FreeFlex will access your email address and account
            settings you use with google.
          </li>
          <li>
            <strong>Cookies and Tracking Technologies:</strong>{" "}
            Currently, we do not directly use cookies or other
            tracking technologies on our website or within the app,
            other than the usage data collected by Supabase as
            described above.
          </li>
        </ul>
        <br />
        <p>
          <strong>2. How We Use Your Personal Information</strong>
        </p>
        <p>
          We collect and use your personal information for the
          following purposes:
        </p>
        <ul>
          <li>To provide and maintain the FreeFlex service.</li>
          <li>To personalize your user experience.</li>
          <li>
            To enable core features such as client management, project
            management, invoicing, quotes, and contract generation.
          </li>
          <li>To provide customer support.</li>
          <li>
            To communicate with you about updates, notifications, and
            important information related to FreeFlex.
          </li>
          <li>To improve and develop new features for FreeFlex.</li>
          <li>
            To analyze usage patterns and trends to understand how
            users interact with our platform.
          </li>
          <li>
            To generate tax reports and BAS statements based on your
            financial data.
          </li>
          <li>
            For direct marketing purposes (with your consent, where
            required by law), such as sending promotional emails about
            FreeFlex features and updates. You can opt-out of these
            communications at any time.
          </li>
          <li>To comply with our legal obligations.</li>
        </ul>
        <br />
        <p>
          <strong>3. Data Storage and Security</strong>
        </p>
        <p>
          Your personal information is stored on servers located in
          Singapore, managed by our backend platform provider,
          Supabase. Supabase implements stringent security measures
          and data access controls to protect your information from
          unauthorised access, use, or disclosure. These measures
          include encryption in transit and at rest.
        </p>
        <p>
          Within our organisation, team members are trained in data
          protection laws and are granted access to personal
          information only on a need-to-know basis to perform their
          specific duties.
        </p>
        <p>
          While we take reasonable steps to secure your personal
          information, please be aware that no method of transmission
          over the internet or method of electronic storage is
          completely secure.
        </p>
        <br />
        <p>
          <strong>4. Disclosure of Personal Information</strong>
        </p>
        <p>
          We may disclose your personal information to the following
          third parties:
        </p>
        <ul>
          <li>
            <strong>Stripe:</strong> To process payments related to
            any paid features we may introduce in the future.
          </li>
          <li>
            <strong>Google and Apple:</strong> To facilitate calendar
            integration and user authorization, as described in
            Section 1.
          </li>
          <li>
            <strong>Supabase:</strong> As our backend platform
            provider, Supabase stores and processes all your data
            necessary for the functioning of FreeFlex. While their
            servers are located overseas, they have robust data
            protection policies in place.
          </li>
          <li>
            <strong>Meticulous AI:</strong> To analyse user activity
            for automated testing and platform improvement. Meticulous
            is based in the US, and your user activity data will be
            transferred to the United States. We rely on their SOC2
            Type II compliance and aim to only share data necessary
            for testing purposes.
          </li>
          <li>
            <strong>Legal Authorities:</strong> If required to do so
            by law or in response to a valid legal request.
          </li>
          <li>
            <strong>
              In the event of a business sale or merger:
            </strong>{" "}
            Your personal information may be transferred to the new
            owners so that they can continue to provide the services.
          </li>
          <li>
            <strong>With your explicit consent:</strong> In situations
            not otherwise covered by this policy.
          </li>
        </ul>
        <p>
          Some of these third parties, including Google, Supabase, and
          Stripe, are located in the United States. When we disclose
          your personal information to overseas recipients, we take
          reasonable steps to ensure that the recipient complies with
          the Australian Privacy Principles or a substantially similar
          law. However, you acknowledge that we cannot guarantee the
          data handling practices of these third parties.
        </p>
        <br />
        <p>
          <strong>5. Your Rights and Choices</strong>
        </p>
        <p>
          You have certain rights regarding your personal information:
        </p>
        <ul>
          <li>
            <strong>Access:</strong> You have the right to request
            access to the personal information we hold about you.
          </li>
          <li>
            <strong>Correction:</strong> You have the right to request
            that we correct any inaccurate or incomplete personal
            information we hold about you.
          </li>
          <li>
            <strong>Deletion:</strong> You have the right to request
            the deletion of your personal information when it is no
            longer needed for the purposes for which it was collected,
            or if there is no legal obligation for us to retain it. To
            make such a request, please email us at
            isaac@freeflex.com.au.
          </li>
          <li>
            <strong>Opt-out of Marketing Communications:</strong> You
            can opt-out of receiving direct marketing communications
            from us at any time by following the unsubscribe
            instructions in our emails or by contacting us directly.
          </li>
        </ul>
        <p>
          To exercise any of these rights, please contact us at
          isaac@freeflex.com.au. We will do our best to respond to
          your request within one week. We may need to verify your
          identity before processing your request. If we cannot
          fulfill your request fully, we will explain the reasons to
          you.
        </p>
        <br />
        <p>
          <strong>6. Data Retention</strong>
        </p>
        <p>
          We will retain your personal information only for as long as
          necessary to fulfill the purposes for which it was
          collected, or as required by Australian law.
        </p>
        <ul>
          <li>
            Generally, personal information will be retained until you
            request its deletion.
          </li>
          <li>
            Financial records, including invoice details, will be
            retained for at least five years from the date the record
            was created or the transaction was completed, in
            accordance with Australian tax law. Other business records
            may also be retained for specific periods to comply with
            legal obligations.
          </li>
          <li>
            Usage data may be retained for longer periods for
            aggregated and anonymized analysis.
          </li>
          <li>
            When your account is terminated or you request deletion,
            we will take reasonable steps to securely delete or
            de-identify your personal information, unless we are
            legally required to retain it.
          </li>
        </ul>
        <br />
        <p>
          <strong>7. Cross-Border Data Transfers</strong>
        </p>
        <p>
          As mentioned in Section 3 and 4, your personal information
          may be transferred to and stored on servers located in
          Singapore (Supabase) and may be accessed by third parties
          located in the United States (Google, Apple, Meticulous). We
          take reasonable steps to ensure that these overseas
          recipients handle your personal information in accordance
          with the Australian Privacy Principles or a substantially
          similar law. By using FreeFlex, you consent to these
          overseas transfers.
        </p>
        <br />
        <p>
          <strong>8. Complaints</strong>
        </p>
        <p>
          If you have any concerns or believe that your privacy has
          been breached, please contact us in the first instance at:
        </p>
        <p>Isaac Drury isaac@freeflex.com.au</p>
        <p>
          We will investigate your complaint and aim to resolve it in
          a timely manner. If you are not satisfied with our response,
          you may lodge a complaint with the Office of the Australian
          Information Commissioner (OAIC). You can find more
          information about the OAIC at{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.oaic.gov.au"
          >
            www.oaic.gov.au
          </a>
          .
        </p>
        <br />
        <p>
          <strong>9. Changes to this Privacy Policy</strong>
        </p>
        <p>
          We may update this Privacy Policy from time to time to
          reflect changes in our practices or legal requirements. We
          will notify you of any significant changes by posting the
          updated policy within the FreeFlex app or on our website.
          The date of the last update will be indicated at the top of
          the policy. Your continued use of FreeFlex after any changes
          to this Privacy Policy constitutes your acceptance of the
          revised policy.
        </p>
        <br />
        <p>
          <strong>10. Contact Us</strong>
        </p>
        <p>
          If you have any questions about this Privacy Policy or our
          privacy practices, please contact us at:
        </p>
        <p>isaac@freeflex.com.au</p>
      </div>
    </div>
  );
}
