# Account management application

This application is NodeJs based with microservice architecture and has the following services:

API Gateway: It is managing all the users request and it is redirecting the API calls to the corresponding service. You have to pass API key in the headers in order to generate user. Once your user is generated you can login and that will return you a token. That token should be passed for every other iteration with the gateway like: adding card, sending are receiving transactions and check balances and history.

User service: that is the service that lets you do operations over the user like create, getById or email etc.

Account service: that is the service that lets you do operations over the account like create, increase or decrease balances etc.

Card service: that is the service that lets you do operations over the user like add card, remove, getAccountByCard, etc.

Transaction service: that is the service that lets you do operations over the user like creating transactions or getting transaction history

## Installation

You will need running instance of mongoDB.

Use the npm package manager to install every service.

```bash
cd account-service
npm install
```

### After the installation you should configure your environment variables. Check env.example for each service and create .env file with same variables.

## After configuration you can run one of the following scripts:

```bash
# start the application
npm run start

# check for lint errors
npm run start

# format the project with prettier
npm run format

# start application in development env and listen for changes for rebuild
npm run dev

# start application locally and listen for changes for rebuild
npm run local

# start application locally and listen for changes for rebuild
npm run local

# run the tests
npm run test
```

## Additional
Once API gateway is running you can check the swagger documentation on http://localhost:8000/swagger
If you want to execute the request in swagger you have to authenticate with masterKey: "someSecretString" in the default case.
After the user login you should get the token and authenticate with apiKey in order to use the rest of the requests.

## License

[MIT](https://choosealicense.com/licenses/mit/)