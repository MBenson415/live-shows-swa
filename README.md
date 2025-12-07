# Vue Basic

[Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/overview) allows you to easily build [Vue.js](https://vuejs.org/) apps in minutes. Use this repo with the [Vue quickstart](https://docs.microsoft.com/azure/static-web-apps/getting-started?tabs=vue) to build and customize a new static site.

## Project setup

```bash
npm install
```

### Compiles and hot-reloads for development

```bash
npm run serve
```

### Compiles and minifies for production

```bash
npm run build
```

### Lints and fixes files

```bash
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

# Useful VS Code Extensions

Azure Static Web Apps: ms-azuretools.vscode-azurestaticwebapps

SQL Server (msssql): ms-mssql.mssql

Vue - Official: Vue.volar

Azure Resources: ms-azuretools.vscode-azureresourcegroups


# CLI tools

```bash
npm install -g @azure/static-web-apps-cli
```

```bash
brew install az
```

# Dev environment

## Using Azure Static Web Apps CLI (Recommended for testing data API locally)

The SWA CLI provides a complete local development environment including the Vue app and the data API backend.

See https://learn.microsoft.com/en-us/azure/static-web-apps/local-development#how-it-works

### Setup

```bash
az login
swa login
```

### Run with SWA CLI

```bash
swa start
```

The application will be available at:
- **App**: http://localhost:4280/ 
- **Data API**: http://localhost:4280/data-api/rest/Bands

## Using npm run serve (Development only, no data API)

To run just the Vue development server without the data API backend:

```bash
npm run serve
```

Development server will start at:
  - Local:   http://localhost:8081/
  - Network: http://192.168.1.73:8081/

**Note**: When using `npm run serve` alone, you cannot test data API calls. Use `swa start` instead to test the full application with the data API.