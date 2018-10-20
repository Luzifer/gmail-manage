# Luzifer / gmail-manage

This Google Apps-Script project contains two functionalities to automate your Gmail account:

You can define:
- Gmail queries which will be used to delete matching mails
- Your Gmail filters in code, put them into a proper version management and let them get applied by a state-enforcer

## Setup

- Create a `config.js` from the `config.sample.js`
- Get yourself a configured [clasp](https://github.com/google/clasp)
- Create a Google Apps-Script project and activate the Gmail API in the corresponding GCP Project
- Execute `npm ci && npm run build` to generate the App-Script version of the code
- Execute a `clasp push` to upload the source code into your project

If everything went well you now should have your `config.js` and an `app.js` inside your App-Script project. (In the web-UI they are called `.gs` files instead of `.js`.)

Now you can execute the `executeMailCleanup()` and `applyFilterDefinition()` functions to apply your config. If you want a more automated version you can define project triggers inside the `Edit` menu for those two functions. For example you can set up a daily cron for them.
