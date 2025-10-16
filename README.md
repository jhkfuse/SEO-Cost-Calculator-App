# Next.js & Tailwind CSS Project with Custom Server

This is a boilerplate project featuring a Next.js frontend with Tailwind CSS and shadcn/ui, powered by a custom TypeScript server.

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:
*   [Node.js](https://nodejs.org/) (v18.0.0 or higher is recommended)
*   [npm](https://www.npmjs.com/) (Node Package Manager)

---

## Getting Started

Follow these steps to get your development environment set up and running.

### 1. Clone the Repository
First, clone the project from GitHub to your local machine.
```bash
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name

(Remember to replace your-username/your-repository-name with the actual path to your repository.)

**### 2. Install Dependencies**

Install all the necessary project dependencies using npm. This command reads the package.json file and downloads the required libraries into the node_modules folder.
```bash
npm install

**### 3. Running the Application**
This project includes scripts for both development and production modes.

**For Development**
This command starts the server in development mode using nodemon for automatic restarts when files are changed. This is the command you should use for daily development work.

```bash
npm run dev

The application will be available at http://localhost:3000.

**For Production**
To run the application in a production-like environment, you must first build the optimized Next.js assets, and then start the server.

# 1. Build the project
npm run build

# 2. Start the production server
npm start

The server will now run in production mode, serving the optimized files.


**Scripts Overview**
npm run dev: Starts the development server with hot-reloading. Ideal for coding and testing.
npm run build: Compiles and optimizes the Next.js application for production. This must be run before npm start.
npm start: Starts the custom server in production mode. This script uses cross-env to ensure cross-platform compatibility.
This project's scripts have been configured to be platform-agnostic and will run correctly on Windows, macOS, and Linux systems.
