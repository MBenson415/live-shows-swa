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

npm install -g @azure/static-web-apps-cli

brew install az

# Dev environment

See https://learn.microsoft.com/en-us/azure/static-web-apps/local-development#how-it-works

Log in to Azure CLI with az login

Log in to swa CLI with swa login

type swa start to spin up local development server. 

Visit http://localhost:4280/data-api/rest/Bands to see API response


```bash
npm run serve
```
Development server will start, App running at:
  - Local:   http://localhost:8080/
  - Network: http://192.168.1.73:8080/

Visit http://localhost:8080/data-api/rest/Bands to see API response

Make sure baseURL is set correctly before running the server. This can be changed within FetchData.js. Soon, this will change automatically based on environment (development server vs production)