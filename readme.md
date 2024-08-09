# Node.js Boilerplate

This project is for backend developers with node js. It create the "Mongoose models, routers and controllers" with cli command line.


## Developer

- Thanks [@bilalyaver](https://www.github.com/bilalyaver) for developer.

  
## Badges


[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## Support

For support send email to address bilal@thejs.app
  
## Install 

- @bilalyaver/nodejs-boilerplate install with use npm

```bash 
  npm install -g @bilalyaver/nodejs-boilerplate
```

- For new project

```bash 
  yvr -p
```

- For new model, route and controller
    
```bash 
  yvr -n <name>
```

## Changelog

v1.0.0 - 2024-08-09

	-	Schema Import Feature:
	-	Added a new schemasImport function that allows you to easily retrieve all Mongoose schemas in JSON format.
	-	The type values in the schema files are now converted and displayed as strings.
	-	Tailwind CSS with EJS Templating:
	-	Added support for Tailwind CSS to render schema arrays in an aesthetically pleasing manner within EJS files.
	-	Introduced a new modelsSchemaDetails table to display the schema details for each model.
	-	Implemented dynamic listing of schema details using EJS, allowing users to visualize their models and fields directly within their web application.
	-	CLI Command Enhancements:
	-	The yvr -p command now automatically adds basic configurations when creating a new project.
	-	The yvr -n <name> command has been enhanced with advanced features and improved error handling for invalid inputs when creating new models, routes, and controllers.

v0.0.40 - Initial Release

	-	Basic CLI Commands:
	-	The yvr -p command allows you to create a new Node.js project.
	-	The yvr -n <name> command automatically generates a Mongoose model, router, and controller.