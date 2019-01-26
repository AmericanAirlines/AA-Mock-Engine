[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/AmericanAirlines/AA-Mock-Engine)

# AA Mock Engine
A simple backend to help you get up and running with mock data for flight data, travel info, and reservations to help you get hacking on the next big thing for AmericanAirlines.

## Deploying to Heroku
Click the "Deploy to Heroku" button above to create an instance of the application in Heroku. You can use this instance for web and native app projects. After deploying, open the app and you will be redirected to the [Swagger docs](#swagger).

*Note*: if you plan to make changes to the backend, fork this repo before deploying to Heroku!

#### Edit/Modify DB Data
If you would like to edit/modify data in your mLab MongoDB instance, navigate to your project's dashboard, click "Resources" and click the "_mLab MongoDB_" link. From their website, you can view collections, search for documents, and add/edit documents.

If you'd like to connect to your DB with a Mongo Client (Like [Robo 3T](https://robomongo.org)), navigate to your Heroku instance's settings tab, click "Reveal Config Vars" and then grab your credentials and config values from the URL with the following format: `mongodb://[User]:[Pass]@[Hostname]:[Port]/[DB Name]`.

<br/>

## Mock Data
To populate the DB with mock data (users, flights, airports) (Note: you must create reservation data, no mock reservations are included), navigate to SwaggerUI (`/docs`) and execute the `/createMockData` post request. _Note_: mock data population can take some time, especially if you're running in Heroku.

After starting the import process, you can see progress by navigating to your app's dashboard and then selecting "**View Logs**" from the "**More**" dropdown or check your app process output when running locally.

## Swagger
Starting the app will let you investigate the API via Swagger by utilizing the interactive methods found at `/docs`. You can examine different endpoints to see their request/response structure and retrieve/create data.

To add new endpoints or modify existing ones, use Swagger Editor (run `swagger project edit` from the project root after installing Swagger globally with `npm install swagger -g`) to modify `api/swagger/swagger.yml`. To execute commands from the Swagger Editor, uncomment the `host` declaration under `basePath`.

<br/>

## Running Locally
### Dependencies
1. Run `npm install` to download all project devDependencies
1. [Install MongoDB](https://docs.mongodb.com/manual/installation/)

### Configuration
If you would like to customize the port, duplicate `.env.sample` and modify the value for `PORT`. Changes to this file require the app to be restarted

Before the app can be run locally, edit `api/swagger/swagger.yml` and uncomment `http` under `schemes`.

### Start the App
After installing all dependencies and starting the MongoDB daemon (`mongod --dbpath=./data` _or_ `npm run db`), simply run `npm start` to start the application.

### Developing Locally
To run the app in dev, run `npm run dev` from one shell tab and `npm run db` in another. The first task will start the app and then monitor for changes via [Nodemon](https://github.com/remy/nodemon). When a change is detected, Nodemon will restart the application. The second task will start the Mongo daemon.


## Contributing
Find a bug? Have a feature you'd like to request? See our [Contributing Guidelines](.github/CONTRIBUTING.md) to get started.

[Wat](./data/mongoinit.token)
