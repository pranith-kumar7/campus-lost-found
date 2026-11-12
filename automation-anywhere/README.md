# Automation Anywhere: Pending Claim Review & Reporting Bot

This folder contains a practical RPA exercise designed around the Campus Lost and Found application's existing administrator claim-review workflow.

## What the bot is intended to do

1. Open the Campus Lost and Found web application in a browser.
2. Allow an administrator to sign in (use Automation Anywhere Credential Vault; never store credentials in the bot or repository).
3. Navigate to the administrator's **Pending Claims** screen.
4. Read the visible pending-claim cards and capture the claim ID, item name, claimant details, contact information, reason, and status.
5. Validate required fields and classify incomplete records for manual review.
6. Write the collected records to an Excel workbook with separate **Claims** and **Exceptions** worksheets.
7. Save a timestamped execution log and a summary report.

**Safety boundary:** The bot is read-only. It must not click Approve or Reject, submit forms, alter claim statuses, or message claimants. An administrator makes all claim decisions.

## Why this workflow matches the application

The backend exposes an admin-protected pending-claims endpoint at `GET /api/claims/pending`. Claims have `Pending`, `Approved`, and `Rejected` statuses and include claimant, item, proof, contact, reason, and claim date fields. The frontend's admin claim-review page displays pending claims and provides separate Approve and Reject actions. The bot deliberately extracts information only and avoids those decision buttons.

## Files in this exercise

- `bot-build-guide.md` — step-by-step Automation Anywhere bot design and actions.
- `test-cases.md` — positive, negative, and recovery test scenarios.
- `sample_pending_claims.csv` — synthetic test data for validating the reporting and exception logic.
- `execution-log-template.csv` — blank template; populate it only after an actual bot run.

## Prerequisites

- Automation Anywhere Community Edition / Automation 360 access.
- Campus Lost and Found running locally or in a test environment.
- A dedicated test administrator account.
- Browser supported by your Automation Anywhere installation.
- Microsoft Excel or a compatible spreadsheet application.

Do not test against real student data. Use synthetic test accounts and claims.

## Completion checklist

- [ ] Build the bot in Automation Anywhere using the guide.
- [ ] Store the test admin credential in Credential Vault.
- [ ] Run the bot against synthetic pending claims.
- [ ] Verify the Excel report and exception worksheet.
- [ ] Test browser timeout, empty queue, and missing-field scenarios.
- [ ] Record actual run date, record counts, and observed exceptions in the execution log.
- [ ] Capture screenshots of the bot workflow and output workbook.
- [ ] Update this README with only results you personally observed.

## Resume guidance

Do not list this as completed RPA experience until you have built and run the bot in Automation Anywhere. After successful execution, a defensible project entry could be:

**Pending Claim Review & Reporting Bot | Automation Anywhere**
- Automated extraction and validation of pending claim records from a web-based lost-and-found application.
- Generated structured Excel reports and exception logs for incomplete records, while keeping approval/rejection decisions with the administrator.

Add actual record counts or run metrics only after measuring them yourself.
