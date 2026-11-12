# Test Cases — Pending Claim Review Bot

Use only synthetic test accounts and claims. Record actual outcomes after running the Automation Anywhere bot.

| ID | Scenario | Test setup | Expected result |
|---|---|---|---|
| TC-01 | Normal extraction | 3 complete Pending claims | 3 rows in Claims; 0 Exceptions; Success |
| TC-02 | Empty queue | No pending claims | Empty Claims sheet; No pending claims event; Success |
| TC-03 | Missing contact | One Pending claim with blank contact | Row appears in Exceptions with REQUIRED_FIELD_MISSING |
| TC-04 | Missing reason | One Pending claim with blank reason | Row appears in Exceptions with REQUIRED_FIELD_MISSING |
| TC-05 | Unexpected status | A non-Pending card appears in the captured area | Row is not treated as a pending claim; exception logged |
| TC-06 | Application unavailable | Stop local server or use an unavailable test URL | Retry twice, then stop with APP_UNAVAILABLE |
| TC-07 | Authentication failure | Use an invalid test credential in a controlled test | Stop safely with AUTHENTICATION_FAILED |
| TC-08 | UI element changes | Change a test selector / use a page variant | Capture error and stop or log the affected card; no wrong-field mapping |
| TC-09 | Output file locked | Open the target workbook and prevent overwrite | Retry with a unique filename or log OUTPUT_WRITE_FAILED |
| TC-10 | Multiple cards | Use 5 or more synthetic pending claims | Each card is captured once; no duplicated or cross-mapped fields |

## Run record

For every test, record:
- Actual result (Pass / Fail).
- Run date and time.
- Number of claims detected.
- Number of valid rows.
- Number of exceptions.
- Screenshot or output filename.
- Notes on any selector or timing issue.

Do not mark a test as passed until it has been executed and checked.
