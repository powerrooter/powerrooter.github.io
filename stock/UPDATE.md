# Update the office stock script

Do this so the dashboard can save order links, spare targets, and the van-checklist switch, and so vehicles, part numbers, who paid, and giving parts to a van are stored. The web address does not change. Until you do this, the dashboard still shows what the vans need from the checklists already in the sheet. Order links say "add with script update".

1. Open the Office stock spreadsheet. Click Extensions, then Apps Script.
2. Select all the code and delete it.
3. Open https://raw.githubusercontent.com/powerrooter/powerrooter.github.io/main/stock/apps-script.gs , copy the whole page, paste it into Apps Script, and click Save.
4. Click Deploy, then Manage deployments.
5. Click the pencil on the existing web app.
6. Set Version to New version.
7. Click Deploy.
8. Approve any permission Google asks for.

Who has access stays Anyone. Execute as stays Me. Do not create a second web app. This only adds columns and an Order Sources tab. It does not delete items, the office log, or van checklists.

The first time the new script runs, it adds van XSJJ22 / Chris Aguirre to Vehicles only if that plate is not already there.

To load Chris's Nov 19 checklist again without sending another email, from the repo folder run:

```bash
curl -sS -L \
  -H "Content-Type: text/plain;charset=utf-8" \
  --data-binary @stock/backfill/2026-11-19-XSJJ22.json \
  "https://script.google.com/macros/s/AKfycbzmF5ifybYu5rBY5BpRdhgDS22-wLWB-l_vK2sW47ThvBbQ4jTyoo0qnPDZGOqwPE8t2A/exec"
```

The answer should say `"ok": true` and `"emailed": false`. Sending it again replaces that van and date only.
