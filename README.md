# Painless Panes

## Repositories

This project consists of three repostitories:

1. Painless Panes (this repo) implements the app itself
2. [Painless Panes CV](https://github.com/Painless-Panes/painless-panes-cv) implements the computer vision API used by the app
3. [Painless Panes Model](https://github.com/Painless-Panes/painless-panes-model) provides scripts for generating and updating the Painless Panes window detection model, which is used by the computer vision API

## Accounts Needed

The following accounts are needed for the app to run at all:

1. A [SendGrid account](https://sendgrid.com/pricing/) ($0+)
2. An AWS S3 Buckets account (pricing??)

Specifically, you will need an API Key for your SendGrid account, as well as a secret access key, an access key ID, and a bucket name for the AWS account (see section on Environment Variables) below.


## Features / Usage

1. Loading the home page prompts the user to enter their email, which sends a
verification link to their inbox. A message encourages them to open the link from their
phone.
2. Clicking the link in their inbox returns them to the app and authenticates them,
starting a cookie session.
3. They are then prompted to enter their zip code and watch an instructional video.
4. Next, they are prompted to take pictures of their windows and enter their desired
frame type. As each picture is taken, the image is sent to the Computer Vision API,
which sends back an annotated image identifying the window and the measured frame along
with the measured width and height (in the response headers). Once received, the
measured width and height are autofilled into the width and height inputs on the page.
The user also must select the desired frame type before completing the process.
5. The user can add as many windows as they wish before clicking "Done" to navigate to
the confirmation page.
6. On the confirmation page, users have the option to edit information for any of the
windows.
7. If everything looks right, they click "Submit" and see a confirmation message. They
also get a confirmation email sent to their inbox.
8. As an additional feature, there is a "Contact" page which allows users to send
questions to the administrator email.

## Known Bugs / Defects

1. Unprotected routes: If he user navigates directly to `<url>/form/4`, they can
navigate to that page of the form without having verified their email or filled in
necessary project information.
It would be better to re-route them to the Not Found page.
2. It would be nice to add an additional "Toast" (small, temporary informational
message) on the "Add Windows" form page to inform the user that their windows are being
measured. This may, however, not be necessary in a production deployment that runs
faster, because the measurement results should be returned very quickly.
3. It might make sense to put the instructional video on the home page, *before* the
user enters their email and goes through the process. For this, you would want an
instructional video specific to the app, though, explaining to the prospective user how
it works.


## Running Locally

### Software Needed

You will need [Node.js](https://nodejs.org/en) and [Postgres](https://www.postgresql.org/) installed.

### Instructions

1. Create a database named `painless_panes`
2. Run the queries in `database.sql` to create the necessary tables
3. Run `npm install` in this directory
4. Figure out your network IP address and set your environment variables below accordingly, following the instructions below.
5. Run `npm run server`
6. Run `npm run client` and navigate to the `Network` address that logs to the screen to use the app
7. By running on the network IP address, you will be able to visit this address on your phone to test out the mobile behavior

Note that you will need the Computer Vision API to be either deployed or running locally in order for the computer vision component to work, although the app will run fine without it.

### Environment Variables

To run locally, the following environment variables must be set in a `.env` file.

```
PORT=8002
CLIENT_URL=https://<your network IP address>:5173
SERVER_URL=http://<your network IP address>:8002
SERVER_SESSION_SECRET=<your session secret>
SENDGRID_API_KEY=<API key for sendgrid>
SENDGRID_EMAIL=<sendgrid sender email address>
AWS_REGION=us-east-1
AWS_SECRET_ACCESS_KEY=<IAM user secret access key>
AWS_ACCESS_KEY_ID=<IAM user access key ID>
AWS_BUCKET=<bucket name>
DATABASE_USER=<postgres username, if your local installation requires authentication>
DATABASE_PASSWORD=<postgres password, if your local installation requires authentication>
```

Additionally, you will need to change the `CV_SERVER_ADDRESS` variable in `src/cv/cv.js` (line 4) to the address of your deployed Painless Panes CV API.

## Deployment

### Accounts Needed for Deployment

To deploy the app, you will need a [Heroku account](https://www.heroku.com/pricing) ($5+) with the [Heroku Postgres add-on](https://elements.heroku.com/addons/heroku-postgresql) ($5+), in addition to the SendGrid and AWS S3 Buckets accounts.

### Heroku Set-up

For first-time deployment, you need to start with the following:
1. Install the heroku CLI
```
npm install -g heroku
```
2. Log in
```
heroku login
```
3. Create the app
```
heroku create painless-panes
```

### Heroku Environment Variables

You will need to set
```
heroku config:set CLIENT_URL=<heroku app URL, no trailing slash>
heroku config:set SERVER_URL=<heroku app URL, no trailing slash>
heroku config:set SERVER_SESSION_SECRET=<your session secret>
heroku config:set SENDGRID_API_KEY=<API key for sendgrid>
heroku config:set SENDGRID_EMAIL=<sendgrid sender email address>
heroku config:set AWS_REGION=us-east-1
heroku config:set AWS_SECRET_ACCESS_KEY=<IAM user secret access key>
heroku config:set AWS_ACCESS_KEY_ID=<IAM user access key ID>
heroku config:set AWS_BUCKET=<bucket name>
heroku config:set DATABASE_URL=<Heroku Postgres database URL>
```

### Instructions

Once the app is created, you will use the following to deploy the current version:
```
git push heroku main
```
To open the app in a browser, you will use:
```
heroku open
```
