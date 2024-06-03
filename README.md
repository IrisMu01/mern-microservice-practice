# mern-microservice-practice

A mini-game written in MongoDB/Node.js/Express/React.js, with the back-end broken down into multiple microservices each handling:

- authorization
- user registration/deletion
- saving/loading game data
- logging user activity and errors

The back-end services share a REDIS instance for storing session information, and RabbitMQ is used to facilitate communication between LogService and other components. 

The front-end is written as another service, and all 5 can be built into Docker images. 

# Repository structure

- All code and scripts are within the `main` directory.
- `main/back-end`: Source code for the 4 back-end services. Shared utilities like db/rabbitMQ/redis connection are organized into the `common` folder, while the `microservice-*` folders contain the core business logic
- `main/front-end`: Implementation of the React/Redux app.
- `main/docker-compose.yml`: Config for building a stack of all 5 front-end + back-end services and running it locally.
- `main/scripts` contains some scripts streamlining known repetitive steps when deploying to AWS ECS.


# Secret management 
- Protections against leaking credentials free db/redis instances
- When running services from the terminal/IDE, credentials can be stored in .env files
- When building with `docker-compose`, contents for each secret is stored in separate files in `./main/secrets/files`. 
- See root-level `.gitignore` to check where specifically to place the secrets. 
