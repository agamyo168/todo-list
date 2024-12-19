# Todo List API

This is a backend API for a Todo List application, built using Node.js, TypeScript, Express, Jasmine tests, Sequelize, and PostgreSQL. The project includes user authorization with JWT (JSON Web Tokens) and authentication with bcrypt. It is also set up with Docker Compose for easy deployment and includes a Swagger UI for API documentation.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Deployment](#deployment)
- [Technologies](#technologies)
- [API Endpoints](#api-endpoints)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

```
git clone https://github.com/agamyo168/todo-list.git
```

2. Navigate to the project directory:

```
cd todo-list
```

3. Install dependencies:

```
npm install
```

4. Set up the environment variables:
   - Create a `.env` file in the root directory of the project.
   - Add the necessary environment variables, such as database connection details and any other required configuration.

```.env
# Node
PORT=5000

# DB
DB_HOST=
DB_USERNAME=
DB_PASSWORD=
DB_DIALECT=postgres
DB_NAME=
DB_NAME_TEST=

# BCRYPT
BCRYPT_SALT_ROUNDS=
BCRYPT_SECRET_PEPPER=

# JWT
JWT_SECRET=
JWT_EXPIRE=
```

## Usage

1. Start the development server:

```
npm run dev
```

This will start the server and watch for changes in the code.

2. Access the API at `http://localhost:5000/api/v1`.

## Testing

To run the Jasmine tests:

To test it on a test database add `NODE_ENV=test`.

```
npm test
```

## Deployment

The project is set up with Docker Compose for easy deployment. To deploy the application:

1. Build the Docker image:

```
docker-compose build
```

2. Start the containers:

```
docker-compose up -d
```

This will start the API and the PostgreSQL database in separate containers.

## Technologies

- **Node.js**: JavaScript runtime environment for server-side development.
- **TypeScript**: Superset of JavaScript that adds static typing.
- **Express**: Web application framework for Node.js.
- **Jasmine**: Testing framework for JavaScript.
- **Sequelize**: ORM (Object-Relational Mapping) library for PostgreSQL.
- **PostgreSQL**: Open-source relational database management system.
- **Docker**: Containerization platform for building, deploying, and running applications.
- **Swagger UI**: API documentation tool.

## API Endpoints

The Todo List API provides the following endpoints:

- `POST /api/v1/auth/signup`: Register a new user
- `POST /api/v1/auth/login`: Log in a user
- `GET /api/v1/todos`: Retrieve all todos (authenticated users only)
- `GET /api/v1/todos/:id`: Retrieve a specific todo by ID (authenticated users only)
- `POST /api/v1/todos`: Create a new todo (authenticated users only)
- `PATCH /api/v1/todos/:id`: Update an existing todo (authenticated users only)
- `DELETE /api/v1/todos/:id`: Delete a todo (authenticated users only)

## API Documentation

The API documentation is available through the Swagger UI, which can be accessed at `http://localhost:5000/api-docs` when the server is running.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
