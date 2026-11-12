# Bot Build Guide — Pending Claim Review & Reporting

## 1. Bot objective

Create a read-only attended or scheduled bot that collects pending claims from the Campus Lost and Found administrator interface and produces a structured Excel report.

**Input:** Pending claim cards displayed in the administrator's Pending Claims page.

**Outputs:**
- `PendingClaims_YYYYMMDD_HHMM.xlsx`
  - `Claims` worksheet: one row per extracted claim.
  - `Exceptions` worksheet: records that could not be fully extracted or failed validation.
- `BotExecution_YYYYMMDD_HHMM.csv`: timestamped execution events and final counts.

The bot must not make claim decisions or modify application data.

## 2. Fields to capture

| Field | Required? | Validation |
|---|---|---|
| Claim ID | Yes | Non-empty; capture the displayed identifier if available |
| Item name | Yes | Non-empty |
| Claimant name | Yes | Non-empty |
| Claimant email | No | If present, check that it contains an `@` |
| Claimant phone | No | Preserve displayed value; do not invent missing data |
| Contact information | Yes | Non-empty |
| Claim reason | Yes | Non-empty |
| Claim status | Yes | Must equal `Pending` for this queue |
| Claimed date | No | Preserve displayed text if date parsing is uncertain |

If the interface does not expose the claim ID or date in a stable way, record the field as unavailable and add an exception rather than guessing.

## 3. Automation Anywhere task outline

Create a Task Bot named `Campus_Pending_Claim_Report`.

### Variables

- `vAppUrl` — test environment URL.
- `vOutputFolder` — output directory.
- `vRunTimestamp` — timestamp for unique output names.
- `vClaimCount` — number of records extracted.
- `vExceptionCount` — number of records sent to exception review.
- `vCurrentClaim` — current claim data.
- `vRunStatus` — Success, Partial Success, or Failed.

Use a Credential Vault entry for the test administrator login. Never place usernames/passwords in source files, screenshots, CSVs, or hard-coded bot variables.

### Suggested actions

1. **Initialize**
   - Generate a timestamp.
   - Create the output folder if it does not exist.
   - Initialize counters and output lists.
   - Create the execution log with a start event.

2. **Open application**
   - Launch the supported browser.
   - Navigate to the test application's URL.
   - Wait for the page to load.
   - If the login page is displayed, retrieve the test credential from Credential Vault and sign in.
   - Confirm that the administrator page is available before continuing.

3. **Navigate to Pending Claims**
   - Use the application's normal navigation to open the Pending Claims page.
   - Confirm the page heading and wait for claim cards to load.
   - If the page indicates there are no pending claims, write an empty report with a successful `No pending claims` outcome and stop the extraction loop.

4. **Extract each claim**
   - Identify the repeating claim-card container using Automation Anywhere Recorder / Object Cloning.
   - Iterate over visible cards.
   - Capture the fields listed in section 2.
   - Do not click any Approve, Reject, delete, or message controls.
   - Add each captured record to the output data table.

5. **Validate**
   - Check required fields.
   - Check that status is exactly `Pending`.
   - If a required field is missing or status is unexpected, add the record to the Exceptions worksheet with a reason.
   - Do not silently discard incomplete records.

6. **Write report**
   - Create the Excel workbook.
   - Write valid records to `Claims`.
   - Write exceptions to `Exceptions`.
   - Save using the timestamped filename.
   - Close the workbook and verify that the file exists.

7. **Finalize**
   - Log start/end time, total cards seen, valid rows, exception rows, and final status.
   - Set status to:
     - `Success` when all visible claims are extracted and validated.
     - `Partial Success` when some claims are extracted but one or more are sent to exception review.
     - `Failed` when the application cannot be accessed or no report can be produced.
   - Close the browser cleanly.

## 4. Exception handling matrix

| Condition | Bot response | Logged outcome |
|---|---|---|
| Application URL unavailable | Retry page load up to 2 times; then stop safely | `APP_UNAVAILABLE` |
| Login rejected / session expired | Stop; do not retry credentials repeatedly | `AUTHENTICATION_FAILED` |
| Pending Claims page not found | Capture screenshot, stop extraction | `PAGE_NOT_FOUND` |
| No pending claims | Produce empty workbook and finish normally | `NO_PENDING_CLAIMS` |
| A claim card is missing a required field | Send that row to Exceptions; continue with next card | `REQUIRED_FIELD_MISSING` |
| Unexpected claim status | Send row to Exceptions; do not process it | `UNEXPECTED_STATUS` |
| Element selector fails for one card | Retry that card once; if still failing, log and continue if safe | `ELEMENT_NOT_FOUND` |
| Excel file is locked / cannot be saved | Retry with a new timestamped filename; if still failing, stop and log | `OUTPUT_WRITE_FAILED` |
| Unexpected bot error | Capture screenshot and error details; close browser safely | `UNEXPECTED_ERROR` |

Do not log passwords, authentication tokens, proof-image contents, or unnecessary personal information.

## 5. Suggested report columns

### Claims worksheet

`Claim ID, Item Name, Claimant Name, Email, Phone, Contact, Reason, Status, Claimed Date, Extracted At`

### Exceptions worksheet

`Claim ID, Item Name, Exception Code, Exception Details, Detected At`

### Execution log

`Timestamp, Level, Event, Claim ID, Details`

Keep exception details concise. Avoid copying sensitive proof data into logs.

## 6. Selector and reliability advice

- Prefer stable labels, accessible names, and container-relative selectors over screen coordinates.
- Use waits for page and element readiness instead of fixed long delays.
- Scope extraction to each individual claim card so values from adjacent cards are not mixed.
- Test with different numbers of cards and with long/short text.
- If the app changes its layout, update and retest selectors.
- Keep the bot read-only; never automate the Approve or Reject buttons.

## 7. Demonstration sequence

For a short portfolio demo:
1. Show the test application with 3–5 synthetic pending claims.
2. Start the bot.
3. Show the bot navigating to Pending Claims and extracting the cards.
4. Open the generated workbook and show the Claims and Exceptions sheets.
5. Run a negative test with one incomplete synthetic claim and show the exception entry.
6. Show the execution log and explain the final status.

Only report execution metrics after a real run. This guide is a build specification, not evidence that the bot has already executed.
