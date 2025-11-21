# Marllon's Resume

This repository contains Marllon's resume, developed using LaTeX.

## Main Files

- **resume.tex**: LaTeX source file of the resume.
- **resume.pdf**: Compiled PDF version of the resume.
- **Dockerfile**: Script for creating a Docker environment to compile the resume.
- **compose.yaml**: Configuration file for Docker Compose.

## How to Compile the Resume

To compile the resume, you can use Docker to avoid the need to install LaTeX locally.

### Using Docker Compose

1. **Ensure Docker Compose is installed.** Verify by running:

   ```bash
   docker compose version
   ```

   If Docker Compose is not installed, follow the [official documentation](https://docs.docker.com/compose/install/) for installation instructions.

2. **Execute Docker Compose to compile the resume:**

   ```bash
   docker compose up
   ```

   This command will:

   - Build the Docker image defined in the `Dockerfile`.
   - Create and start the services defined in the `compose.yaml`.
   - Display the services' logs in the terminal.

3. **Check if the `resume.pdf` file has been generated or updated.** This file contains the compiled version of the resume.

4. **To stop the running services (if you used detached mode):**

   ```bash
   docker compose down
   ```

   This command will stop and remove the containers defined in the `compose.yaml`.


