# Contributing to OctoCAT Supply Demo

Thank you for your interest in contributing to the OctoCAT Supply Chain Management demo! This demo is designed to showcase GitHub Platform capabilities including GitHub Copilot, GitHub Advanced Security (GHAS), GitHub Actions, and other enterprise features.

## 🎯 About This Demo

If you are viewing this from a demo-instance, please navigate to the main repository for the demo template in **[octodemo-framework/demo_octocat_supply](https://github.com/octodemo-framework/demo_octocat_supply)**

> [!NOTE]
> **Additional Documentation:**
> For a full explanation of how this demo is structured and set up, please refer to the [Octodemo Readme](.octodemo/README.md).
>
> For the central documentation for Octodemo itself, and for foundations of a template repository, refer to [docs.octodemo.com](https://docs.octodemo.com).

## 🤝 How to Contribute

### Contribution Process

If you have access to the `octodemo-framework` organization:

1. Create a branch in this repository
2. Make your changes following the guidelines below
3. Submit a pull request for review

> [!IMPORTANT]
> This is a demonstration application, not a production system. The primary objective is to effectively showcase GitHub Platform capabilities to customers and prospects. All contributions should keep this goal in mind.

#### 1. Demo Application Code

Contributions to the actual application code (frontend and API) should:

- Be realistic and representative of typical enterprise applications
- Support existing or new demo scenarios
- Follow existing patterns and coding standards. Please refer to the specific guidelines:
  - **[API Instructions](./.github/instructions/api.instructions.md)**
  - **[Frontend Instructions](./.github/instructions/frontend.instructions.md)**
  - **[Database Instructions](./.github/instructions/database.instructions.md)**
- Include tests where appropriate

> [!IMPORTANT]
> When implementing backend changes, you must ensure parity across all supported backend implementations (e.g., Node.js and Python).
>
> - If you add a feature to `api-nodejs/`, you must also add it to `api-python/`.
> - If you fix a bug in one, check if it exists in the other.

#### 2. Demo Features and Walkthroughs

Demo narrative scripts live in the [`demo/walkthroughs/`](./demo/walkthroughs/) directory with one file or folder per feature (depending on the amount of features, e.g. Copilot has it's own folder).

When contributing to demo scripts:

- Keep scenarios realistic and relevant to enterprise customers
- Ensure steps are clear and reproducible
- Update related documentation if you change application behavior
- Test your walkthrough end-to-end before submitting

#### 3. Other Demo Resources

If you want or need to contribute by creating any other, non-file resources (issues, rulesets etc.) or changes to the adjacent repositories (e.g. resuable workflows), please check the [.octodemo/README.md](./.octodemo/README.md) for the locations and places of these resources.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 22 or higher
- **Python** 3.12 or higher
- **Java** 21 or higher
- **npm** (comes with Node.js)
- **Git**
- **(Optional)** Docker for containerized development
- **(Optional)** GitHub Personal Access Token (PAT) for MCP server demos

### Initial Setup

1. **Clone the repository** (or your fork if you're an external contributor):

   ```bash
   # For octodemo-framework organization members:
   git clone https://github.com/octodemo-framework/demo_octocat_supply.git
   cd demo_octocat_supply
   
   # For external contributors (fork first, then):
   git clone https://github.com/YOUR-USERNAME/demo_octocat_supply.git
   cd demo_octocat_supply
   ```

2. **Install dependencies:**

   ```bash
   make install
   ```

3. **Build the projects:**

   ```bash
   make build
   ```

4. **Initialize the database:**

   ```bash
   make db-seed
   ```

5. **Start the development servers:**

   ```bash
   make dev
   ```

   This starts both the API (port 3000) and frontend (port 5173).

### Using the Demo Builder Agent

For a faster and easier development experience, you can leverage the **Octodemo Builder Agent**. This AI-powered tool is designed with specific Octodemo knowledge and automatically ingests both the [Code of Conduct & Demo Creator Guide](https://github.com/octodemo-framework/docs) as well as the documentation for this specific demo.

It can assist you with:

- Scaffolding new demo scenarios or features across multiple backends.
- Updating documentation and walkthroughs.
- Identifying gaps or inconsistencies between backends.

Refer to the internal Octodemo framework documentation for instructions on how to access and use the Demo Builder Agent.

### Development Workflow

1. **Choose your branch strategy:**

    - **For general improvements or fixes to the main application:**
      Create a feature branch off `main`:

      ```bash
      git checkout main
      git pull
      git checkout -b feature/your-feature-name
      ```

    - **For changes targeting specific demo feature branches (`feature-add-tos-download`, `feature-add-cart-page`):**
      **You MUST branch off the target feature branch.** Do NOT branch off `main` if your changes are intended for these specific demo scenarios.

      ```bash
      git checkout feature-add-tos-download  # or feature-add-cart-page
      git pull
      git checkout -b fix/your-fix-name
      ```

      Open your Pull Request against the specific feature branch (e.g., `feature-add-tos-download`), not `main`.

2. **Make your changes** following the guidelines below

3. **Test your changes:**

   ```bash
   # Run all tests
   make test
   
   # Run API tests only
   make test-api
   
   # Run frontend tests only
   make test-frontend
   
   # Lint all code
   make lint
   ```

4. **Build to ensure no errors:**

   ```bash
   make build
   ```

5. **Commit your changes** with a clear, descriptive commit message:

   ```bash
   git add .
   git commit -m "feat: Add shopping cart demo scenario"
   ```

6. **Push to your fork and create a Pull Request:**

   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Commit Message Guidelines

Use conventional commit format:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Test additions or updates
- `refactor:` - Code refactoring
- `chore:` - Build process or auxiliary tool changes

Example:

```
feat: Add product filtering to catalog page

- Implement filter by category
- Add price range slider
- Update API endpoint to support filtering
```

## 🔍 Review Process

All contributions go through a review process:

1. **Automated checks** - Linting, tests, and builds must pass
2. **Code review** - At least one maintainer will review your changes
3. **Demo validation** - Changes that affect demo scenarios will be tested
4. **Documentation review** - Ensure docs are updated for behavioral changes

## ❓ Questions or Issues?

Visit us in Slack: [#octodemo](https://github-grid.enterprise.slack.com/archives/C07FE7UQPNF) for any questions, bug reports or feature proposals.

To see which features we need contributions for, visit [gh.io/octocat-backlog](https://gh.io/octocat-backlog).

## 📚 Additional Resources

- [Main README](./README.md) - Project overview and setup
- [Demo Template README](./.octodemo/README.md) - Explanation about the structure of the demo and adjacent repositories
- [Demo Walkthroughs](./demo/walkthroughs/README.md) - Complete demo scenarios
- [Architecture Documentation](./docs/architecture.md) - System design details
- [Demo Creator Guide](https://github.com/octodemo-framework/docs/blob/main/demo-creators/README.md) - Octodemo Framework documentation
- [Custom Instructions](./.github/copilot-instructions.md) - Copilot configuration for this repo

## 🙏 Thank You

Your contributions help make this demo better for everyone using it to showcase GitHub's capabilities. We appreciate your time and effort!
