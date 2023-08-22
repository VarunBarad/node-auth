# List available just recipes for this project
list:
  just --list

# Build the code and run the tests
test:
  npm run test

# Format the code
format:
  npm run format

# Check code formatting
check-format:
	npm run check-format

# Start local database server
db-start:
  docker-compose up --detach

# Stop local database server
db-stop:
  docker-compose stop

# Start Caddy HTTP server
caddy:
  caddy run

# Run the dev server
dev:
	nodemon src/index.js
