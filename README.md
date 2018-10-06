[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/AmericanAirlines/AA-Mock-Engine)

# AA Mock Engine
A simple backend to help you get up and running with mock data for flight data, travel info, and reservations to help you get hacking on the next big thing for AmericanAirlines.

## Deploying to Heroku
Click the "Deploy to Heroku" button above to create an instance of the application in Heroku. You can use this instance for web and native app projects. After deploying, open the app and you will be redirected to the [Swagger docs](#swagger).

*Note*: if you plan to make changes to the backend, fork this repo before deploying to Heroku!

#### mLab MongoDB Add-On
If you would like to edit/modify data in your mLab MongoDB instance, navigate to your project's dashboard and click the "mLab MongoDB" link. From their website, you can view collections, search for documents, and add/edit documents.

If you'd like to connect to your DB with a Mongo Client (Like [Robo 3T](https://robomongo.org)), navigate to your Heroku instance's settings tab, click "Reveal Config Vars" and then grab your credentials and config values from the URL with the following format: `mongodb://[User]:[Pass]@[Hostname]:[Port]/[DB Name]`.

## Running Locally
### Dependencies
1. Run `npm install` to download all project devDependencies
1. [Install MongoDB](https://docs.mongodb.com/manual/installation/)

### Configuration
If you would like to customize the port, duplicate `.env.sample` and modify the value for `PORT`. Changes to this file require the app to be restarted

Before the app can be run locally, edit `api/swagger/swagger.yml` and uncomment `http` under `schemes`.

### Start the App
After installing all dependencies and starting the MongoDB daemon (`mongod --dbpath=./data`), simply run `npm start` to start the application.

### Developing Locally
To run the app in dev, start the MongoDB daemon (`mongod --dbpath=./data`) then run `npm run dev`. This will start the app using [Nodemon](https://github.com/remy/nodemon), which will restart the server after changes.

## Mock Data
To populate the DB with mock data (users, flights, airports), either use `npm run mock` or navigate to SwaggerUI (/docs) and execute the `/mock` post request. _Note_: mock data population can take some time, especially if you're running in Heroku. Running `npm run mock` locally, from Heroku's UI, or from the Heroku CLI will let you monitor progress. If you start the process from Swagger, you can see progress by navigating to your app's dashboard and then selecting "View Logs" from the "More" dropdown.

## Swagger
Starting the app will let you investigate the API via Swagger by utilizing the interactive methods found at `/docs`. You can examine different endpoints to see their request/response structure and retrieve/create data.

To add new endpoints or modify existing ones, use Swagger Editor (run `swagger project edit` from the project root after installing Swagger globally with `npm install swagger -g`) to modify `api/swagger/swagger.yml`. To execute commands from the Swagger Editor, uncomment the `host` declaration under `basePath`.


## Contributing
Find a bug? Have a feature you'd like to request? See our [Contributing Guidelines](.github/CONTRIBUTING.md) to get started.
