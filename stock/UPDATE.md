# Update the office stock script

The stock page already shows Chris Aguirre's Nov 19 checklist for van XSJJ22. Do this once so new checklists update the sheet and email the office. The web app address stays the same.

1. Open the Office stock spreadsheet. Click Extensions, then Apps Script.
2. Select all the code and delete it.
3. Open https://raw.githubusercontent.com/powerrooter/powerrooter.github.io/main/stock/apps-script.gs , copy the whole page, paste it into Apps Script, and click Save.
4. Click Deploy, then Manage deployments.
5. Click the pencil on the existing web app.
6. Set Version to New version.
7. Click Deploy.
8. Approve the new email permission when Google asks. The script sends the van-needs email as you.

Who has access stays Anyone. Execute as stays Me. Do not create a second web app.

The page already shows the Nov 19 XSJJ22 checklist from a file in this repo. After the script is updated, load that same checklist into the sheet without sending the email again. From the repo folder, run:

```bash
curl -sS -L \
  -H "Content-Type: text/plain;charset=utf-8" \
  --data-binary @stock/backfill/2026-11-19-XSJJ22.json \
  "https://script.google.com/macros/s/AKfycbzmF5ifybYu5rBY5BpRdhgDS22-wLWB-l_vK2sW47ThvBbQ4jTyoo0qnPDZGOqwPE8t2A/exec"
```

The answer should say `"ok": true` and `"emailed": false`. After that, the stock page reads XSJJ22 from the sheet instead of the file.

Resubmitting the weekly form also writes the checklist, and that one does email the office.
