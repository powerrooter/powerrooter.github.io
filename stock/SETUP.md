# Office stock setup

The stock page keeps the shared inventory for Power Brooklyn and Power HQ in a Google Sheet. You only do this once.

1. Go to https://sheets.google.com and create a blank spreadsheet. Name it Office stock.
2. In that spreadsheet, click Extensions, then Apps Script. Delete any code that is already there.
3. Open https://raw.githubusercontent.com/powerrooter/powerrooter.github.io/main/stock/apps-script.gs and copy the whole page. Paste it into Apps Script and click Save. If the browser downloads a file instead, open the file and copy all of it.
4. Click the gear icon (Project settings). Under Script properties, click Add script property. Property: PIN. Value: a code you make up. Share that code only with people who may add or take stock. Click Save script properties.
5. Click Deploy, then New deployment. Click the gear next to Select type and choose Web app. Execute as: Me. Who has access: Anyone. Click Deploy and allow the access Google asks for.
6. Copy the Web app URL. It ends in /exec. Send that URL so it can be pasted into API_URL at the top of the stock page. Until that is done, https://powerrooter.github.io/stock/ shows a setup notice.
7. After the URL is saved, open the stock page once. The first visit creates three tabs: Office Stock Log, Van Counts, and Items. The sheet time zone is set to New York. You can delete the empty Sheet1 tab.

The Van Counts tab is filled from the weekly van checklists. You do not type those rows by hand.

Anyone with the stock page can look at the counts. Add stock and Take stock ask for the PIN once on that phone, then remember it.

To add another office later, add its name to the LOCATIONS list at the top of the script. Then click Deploy, Manage deployments, edit the web app, and choose New version.
