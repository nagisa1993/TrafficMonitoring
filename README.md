# TrafficMonitoring

A website to retrieve historic traffic pattern over certain areas, provide statistics about traffic severity levels and offering detour suggestion to user choosen driving route based on A* algorithm using historic traffic pattern as heuristic.

## Before Starting
This application is implemented in MongoDB, Node.js, Express and AngularJS. For running this project, we recommend using macOS or Linux which can take advantage of powerful tools like: homebrew.

## Installation
To keep the project organized well, there's a list of tools to pick up:
- [brew](http://brew.sh): package manager application for maxOS.
- [npm](https://www.npmjs.com/): node package manager.
- [mongodb](https://docs.mongodb.com/v3.2/tutorial/install-mongodb-on-os-x/): MongoDB database.

## Quick Start
* Use brew to install [npm](https://docs.npmjs.com/getting-started/installing-node):
``` 
brew install npm
````
* Installing [MongoDB](https://docs.mongodb.com/v3.2/tutorial/install-mongodb-on-os-x/):
```
brew install mongodb
````
* Go to project directory, installing dependencies via npm: 
```
npm install
````

## Dependencies
Please check Package.json. It list all node package dependencies and usually more up to date than this readme file!
Here provide a list of current major dependencies: 
- [angular](https://github.com/angular/angular.js)
- [chart.js](https://github.com/jtblin/angular-chart.js)
- [angular-google-map](https://github.com/angular-ui/angular-google-maps)
- [mongoose](https://github.com/Automattic/mongoose)
- [express](http://expressjs.com/)

## Application Structure and Organization
This project follows a typical structure for Angular Application ([Example](https://scotch.io/tutorials/node-and-angular-to-do-app-application-organization-and-structure)), here's the skeleton for reference:
```
- app               // holds all our files for node components (routes, models)
    -- models       // all mongodb schema
    -- route.js     // router for REST services   
- server.js         // node configuration & main entry for this application
- public            // holds all our files for frontend angular applications
    -- images
    -- index.html   // base template for rendering
    -- javascripts  // holds main angular application and controllers
    -- partials     // html templates
    -- stylesheets  // css files
- scripts           // scripts to collect traffic data periodically
- bin               // system configuration
- data              // database configuration               
- node_modules      // node packages installed by npm
- dump              // example data dump for demo
- package.json      // npm configuration to install dependencies/modules
- README.md
````

## Sample testing
For testing on REST API: we recommend a chrome plug-in - [POSTMAN](https://www.getpostman.com/) 

## Contributions 
