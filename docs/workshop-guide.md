# GitHub Copilot: Use Case-Driven Workshop

> **Format:** Onsite, instructor-led, scenario-based learning  
> **Environment:** Local VS Code *or* GitHub Codespaces  
> **Audience:** Developers looking to solve real-world problems with GitHub Copilot  
> **Duration:** 3.5–4 hours  
> **Core Goal:** Learn Copilot capabilities through practical, relatable use cases

---

## Why This Workshop Is Different

Instead of learning features in isolation, you'll tackle **real development scenarios** that mirror your daily work. Each use case demonstrates multiple Copilot capabilities working together to solve actual problems.

---

## What You'll Accomplish

By the end of this workshop, you'll have hands-on experience with:

1. **Feature Development** - Build complete features from design to deployment
2. **Code Quality & Testing** - Improve test coverage and code maintainability
3. **Security** - Identify and fix vulnerabilities automatically
4. **Code Review** - Leverage AI-assisted reviews with security scanning
5. **Team Collaboration** - Use custom agents and shared contexts
6. **Async Workflows** - Delegate work to coding agents while you focus elsewhere

---

## Workshop Structure

| Use Case | Real-World Scenario | Time | Copilot Features |
|----------|---------------------|------|------------------|
| [Setup](#-setup-15-min) | Environment preparation | 10 min | Prerequisites |
| [UC1](#use-case-1-im-asked-to-add-a-new-feature) | "Build a shopping cart feature" | 30 min | Planning Agent, Agent Mode, Vision |
| [UC2](#use-case-2-we-need-better-test-coverage) | "Improve our test coverage" | 20 min | Prompt Files, Self-Healing |
| [UC3](#use-case-3-we-need-consistent-standards) | "Enforce team standards" | 30 min | Custom Instructions, Handoffs |
| [UC4](#use-case-4-i-have-too-many-tasks) | "I can't keep up with tickets" | 30 min | Coding Agent, Mission Control, Custom Agents |
| [UC5](#use-case-5-prs-take-forever-to-review) | "Speed up code reviews" | 15 min | Code Review Agent |
| [UC6](#use-case-6-security-keeps-finding-issues) | "Fix vulnerabilities faster" | 20 min | Code Quality, CodeQL, Secret Scanning |
| [UC7](#use-case-7-i-inherited-legacy-code) | "Understand & refactor old code" | 20 min | Ask Mode, Inline Chat, Agent Refactoring |
| [UC8](#use-case-8-customize-copilot-with-skills) | "Customize Copilot with skills" | 15 min | Agent Skills |
| [UC9](#use-case-9-i-need-end-to-end-tests) | "Add browser testing" | 15 min | MCP Playwright |
| [UC10](#use-case-10-i-want-to-build-from-specs-not-vibes) | "Build with specifications, not guesswork" | 30 min | Spec Kit, Spec-Driven Development |
| [UC11](#use-case-11-governance-with-hooks) | "Trigger commands on agent events" | 15 min | Hooks |
| [UC12](#use-case-12-agentic-workflows) | "Intelligent Workflows in GitHub Actions" | 35 min | GitHub Actions, Agentic Workflows |
| [Wrap](#-wrap-up) | Reflection & next steps | 10 min | - |

---

## Setup (15 min)

### Prerequisites

- GitHub account with Copilot enabled
- **Option A:** GitHub Codespace (recommended for consistency)
- **Option B:** Local machine with Node.js 18+, Git, VS Code 

### Quick Start

1. **Fork or clone the demo repository**
   ```bash
   git clone <repo-url> demo_copilot_agent
   cd demo_copilot_agent
   npm install
   ```

2. **Verify the build**
   ```bash
   npm run build
   ```

3. **Initialize the database**
   ```bash
   npm run db:init --workspace=api
   ```

4. **If using Codespaces:** Make ports 3000 and 5137 **Public**
   - Click on the `Ports` tab in the bottom panel, right click on a port and select `Port Visibility → Public`

---

## Use Case 1: "I'm asked to add a new feature"

**Scenario:** Your PM says: *"We need a shopping cart. Users should be able to add products, see a count in the nav bar, and view their cart on a dedicated page."*

**Your Challenge:** Build this feature end-to-end, matching a provided design.

### Step 1: Understand Requirements with Planning Agent

The **planning agent** exists to help build a plan and clarify requirements.  It improves the quality of your prompt and ultimately the output.  

1. Open Copilot Chat, switch to `Plan` mode
2. Drag `docs/design/cart.png` into chat (feel free to open it to review first)
3. Set your model to 'Claude Opus 4.6' or 'Gemini 3.1 Pro'
4. Prompt:
   ```text
   I need to implement a shopping cart feature in this application matching this image including routing, navbar badge with item count, state management, and add/remove interactions.
   ```
5. Copilot will ask clarifying questions like:
   - Should the cart persist across sessions?
   - What data should be stored?
   - Any constraints on UI/UX?
6. Answer the questions or say "Use standard e-commerce patterns"
7. Review the generated plan - iterate if needed

### Step 2: Implement with Agent Mode

1. Switch to `Agent` mode, select `Claude Sonnet 4.6` model
2. Prompt:
   ```text
   Implement the plan you just produced.
   ```
3. **Agent will:**
   - Create Cart component and page
   - Add routing
   - Implement state management (Context/Provider)
   - Add NavBar badge
   - Wire up add/remove functionality

You can follow along as files are created/modified and also in the task list.  If it doesn't run the application to verify it, you should ask the agent to 'start the application and verify the cart works as expected'. 

### Step 3: Test & Iterate

1. Run the application:
   ```bash
   npm run dev
   ```
2. Test in browser - Click on 'Ports' tab to open port 5137:
   - Go to the 'Products' page or click 'Explore Products'
   - Increment a quantity of a product and add to cart
   - Verify badge updates (shows a count next to the cart icon)
   - Click the cart icon to view cart page
3. If issues arise, have Copilot help troubleshoot.  Example prompt:
   ```text
   The badge doesn't update when I add items. Fix this.
   ```
4. When you are all done, click 'Keep' to save the changes.  

### What You Learned

✅ **Planning Agent** - Clarify ambiguous requirements  
✅ **Vision** - Copilot understands UI designs  
✅ **Agent Mode** - Multi-file implementation with iteration  
✅ **Self-correction** - Agent can fix its own mistakes

**Time Investment:** 30 minutes  
**Value:** A complete feature that would normally take 2-3 hours

---

## Use Case 2: "We need better test coverage"

**Scenario:** Your tech lead says: *"Our API test coverage is at 45%. We need to get it above 80% before the release."*

**Your Challenge:** Systematically improve test coverage across all API routes.

### Step 1: Use a Reusable Prompt File

Manually prompting for test coverage improvements can work.  However, it also means that the process may be inconsistent between developers and you never learn from mistakes. Instead, (have Copilot) create a documented prompt file checked into your repository.  Utilize this and enhance it over time based on responses where Copilot struggled.  Here we have provided a starting point (well, Copilot has)!

1. If you haven't already, click the `+` button in the Copilot Chat panel to clear your history.  This is a best practice when switching between use cases or activities to avoid sending unrelated context.
2. Review `.github/prompts/demo-unit-test-coverage.prompt.md`
3. Notice it defines:
   - Objective and routes to focus on
   - Testing patterns to follow (examples)
   - Success Criteria
   - Links to relevant documentation
4. Notice the prompt does not say the percentage desired is greater than 80%.  If that was important it could be added here.

### Step 2: Execute the Prompt

1. Switch to `Agent` mode, select the `Claude Sonnet 4.6` model
2. Run the prompt:
   - **Option A:** Click the play button when the prompt file is open
   - **Option B:** Type `/demo-unit-test-coverage` in chat.  The prompt name automatically becomes a slash command.

### Step 3: Agent Self-Heals Failures

Agent will:
- Analyze current coverage
- Generate new test cases for product and supplier routes
- **Run tests automatically**
- Fix any failures
- Re-run until tests pass

**Important:** Press `q` when coverage report shows to let agent continue.  Otherwise it will wait indefinitely.

### Step 4: Verify Results Yourself

```bash
npm run test:coverage --workspace=api
```

Review the coverage report - it should be significantly improved. 

### What You Learned

✅ **Prompt Files** - Reusable, documented workflows
✅ **Iteration** - Agent iterates to fix failing tests automatically  
✅ **CodeQL Integration** - Agent runs security scans after changes

**Time Investment:** 20 minutes  
**Value:** Comprehensive test suite that would take days to write manually

---

## Use Case 3: "We have standards and Copilot needs to understand and follow them"

**Scenario:** You use an internal observability framework (TAO). New developers keep forgetting to add proper logging/metrics.  Beyond that, they continue to miss compliance requirements which delay releases.

**Your Challenge:** Encode team standards so Copilot enforces them automatically.

One of the most powerful features of Copilot is **Custom Instructions**.  These allow you to define rules that Copilot applies automatically based on file path, type, or other criteria.  This allows you to tune Copilot to your specific needs.  As an example, it's one thing to be an expert in Java.  Another to be an expert in *your team's Java standards*.  Custom instructions bridge that gap.

### Step 1: Review Current Standards

1. Open `.github/copilot-instructions.md`
2. See existing standards for the project.  Note you can reference other files, links, etc.
   - Formatting is just markdown.  Be concise as this takes up context space.  
   - You can reference other files or links for more detail.  
   - For your projects, the more documentation you have in repo the better, as Copilot agent mode can reference it directly.

**Important:** Don't have a `copilot-instructions.md` file yet?  Click the gear icon at the top of the Copilot Chat panel, then **"Generate Chat Instructions"** to generate a starter file from your workspace.  Alternatively, check out [awesome-copilot instructions](https://github.com/github/awesome-copilot/tree/main/instructions) for inspiration. 

### Step 2: Add Custom Instructions

Add this section to `copilot-instructions.md`:

```markdown
## REST API Guidelines

For all REST API endpoints:

* Use descriptive naming following RESTful conventions
* Add Swagger/OpenAPI documentation
* Implement TAO observability (logging, metrics, tracing)
  - Assume TAO package is already installed
  - Follow patterns in existing routes
```

TAO is a fictitious observability framework for this workshop.  You can read about it in `docs/tao.md`.  It is used to show that you can encode your own internal standards that Copilot can reference.

### Step 3: Test the Instructions

1. Clear chat history, switch to `Agent` mode.  Choose any model (Claude Sonnet 4.6 recommended)
2. Prompt:
   ```text
   Add observability to the Supplier route using our internal standards
   ```
3. Notice Copilot:
   - Adds TAO logging
   - Includes metrics
   - Adds tracing
   - **Doesn't try to install TAO** (respects your instruction)

4. Click 'Undo' to revert all changes.  We don't want to keep these changes as TAO is fictitious and it will break our app! 


### Step 4: Create a Handoff

Sometimes you need to pass context to a teammate, a new chat session, or an agent.  Custom prompts can help with this.  Lets create a plan and then use a **handoff** to generate a summary document.

1. Clear chat, switch to `Plan` mode.  Again, consider switching to `Gemini 3.1 Pro` or `Claude Opus 4.6` for planning use cases.
2. Prompt:
   ```text
   Create a plan for a user profile page with edit capability and picture upload
   ```
3. Run the handoff command:
   ```text
   /handoff
   ```
   **NOT** the `/handoff-to-copilot-coding-agent` unless you want to have an agent to implement it right away.  We'll cover that later...
4. Review generated `handoff.md` - contains:
   - Requirements summary
   - Implementation plan
   - Key decisions/assumptions
   - Next steps

The steps are just defined in `.github/prompts/handoff.prompt.md`.  You can of course customize this.  For example, you might want it to automatically create a file in your workspace or create a GitHub issue.  You could always ask a follow up question to do that too. 


### Step 5: Add external documentation as context with Copilot Spaces

Copilot instructions is great for driving behavior in your current repo/workspace.  But what about shared context across multiple repos?  For example, your team may have a shared design system, style guide, or architecture principles.  You can use **Copilot Spaces** to provide this shared context.

Here we will use GitHub's remote Model Context Protocol (MCP) server to retrieve documentation from a shared Copilot Space and use that to check compliance.

1. Start the GitHub Remote Copilot Space 
   - Open the Command Palette (Cmd/Ctrl + Shift + P)
     - Alternatively you can navigate to `.vscode/mcp.json` and click the start button next to the `github-remote` server definition.
   - Select "MCP: List Servers"
   - Select the `github-remote` server
   - Click "Start Server"
   - This will say "The MCP Server Definition 'github-remote' wants to authenticate to GitHub." Click "Allow" to continue
   - You will be redirected to an OAUTH flow.  Click 'Continue' on the account you are using.  
   - If the organization for your repo requires SSO, you may need to authenticate that as well.  If not you can just click 'Continue' again.
2. Check out the `feature-add-tos-download` branch.
   `git checkout feature-add-tos-download` (you may need to `git stash` first)
3. Clear your chat history in Copilot Chat and switch to `Agent` mode, using the `Claude Sonnet 4.6` model.
4. Click on the 'Tools' icon next to the model selector.  You should see `github-remote` checked at the bottom.  You can uncheck things like `Azure MCP Server`, `Bicep`, and `playwright` if they are selected.  Click `OK` to save. 
5. Enter the following prompt:

    ```txt
    Get the contents of the Copilot Space `OD OctoCAT Supply Compliance Docs`. Once you have those, please analyze my current changes in the PR: Did we include all the necessary languages for the Terms of Service download?
    ```

5. Additional prompts at your disposal:

    ```txt
    Check if we have all the necessary legal disclaimers included in our Privacy Policy update.
    ```

    ```txt
    We need to implement a Cookie Banner. Implement it according to the compliance requirements we have in our Copilot Space `OD OctoCAT Supply Compliance Docs`.
    ```

Spaces provided additional compliance context for Copilot to reference when analyzing your code changes.  However, you could also access them directly as a chat bot at https://github.com/copilot/spaces if you just want to ask questions about the content.  

### What You Learned

✅ **Custom Instructions** - Team standards encoded once, applied everywhere  
✅ **Path-Specific Instructions** - Different rules for different file types  
✅ **Handoff Files** - Transfer context between sessions or developers
✅ **Copilot Spaces** - Providing curated, shared context for use with GitHub Copilot

**Time Investment:** 30 minutes  
**Value:** Consistent code quality, faster onboarding, less review friction

---

## Use Case 4: "I have too many tasks"

**Scenario:** You have 5 tickets in your sprint: bug fixes, new features, tech debt. You can't do them all synchronously.

**Your Challenge:** Delegate work to Coding Agent while you focus on high-value tasks.

### Step 1: Use Custom Agents for Specialized Work

**Scenario:** You need BDD tests for the cart feature.

1. Go to your GitHub repository
2. Click **Agents Panel** (top right icon next to Copilot...)
3. Select the main branch for working (should be preselected)
4. Choose **BDD Specialist** agent
5. Prompt:
   ```text
   Add comprehensive BDD tests for the Cart page feature
   ```
6. Click the **Start Task** button
7. Agent starts working - **you can close the tab and do other work**

> If interested, you can look at `.github/agents/bdd-specialist.agent.md` to see how this custom agent is defined.  You can create your own custom agents for your team as well!

### Step 2: Assign Issues to Coding Agent

1. In your IDE, open `.github/prompts/demo-cart-page.prompt.md`
2. The GitHub MCP server should already be started (from Use Case 3).  If not, start it now by hitting Cmd/Ctrl + Shift + P and selecting **MCP: List Servers**, selecting `github-remote`, and clicking `Start Server`.
3. In the Copilot Chat panel, clear your history, ensure you are in agent mode and select a base model like `GPT-5 mini`.  Have Copilot open an issue for you.  Prompt:
   ```text
   Create a GitHub issue with the title "Implement Recommendations Feature" using the contents in the demo-cart-page.prompt.md file as the body.
   ```
4. Click Allow to let Copilot execute the create issue command.  It should return with a new issue URL.  
5. Have Copilot assign the issue to the Coding Agent.  Prompt:
   ```text
   Assign this issue to the Copilot coding agent.
   ```
   Note an alternative approach is do this directly in GitHub by manually creating the issue and then assigning it to `Copilot`.
6. Open the issue in GitHub and you should see the 👀 indicator showing that Copilot saw the issue.  It should also have a link to a work in progress pull request shortly after.

### Step 3: Monitor from Mission Control

1. Navigate to <https://github.com/copilot/agents>
2. See all your active agent sessions (in this case you should have the BDD Specialist session we started first and the cart feature coding session we started second)
3. Click on the BDD session that should be in progress:
   - Note you can view real-time progress and see commands executed
   - Also see the pull request contents
4. **Steer mid-session by prompting Copilot:**
   ```text
   While you're at it, add error handling for network failures
   ```

### Step 4: Use API Specialist for Backend Work

1. Go back to your repository and open the agents panel like we did for the **BDD Specialist**.  This time select **API Specialist**
2. Prompt with the following and click to **Start Task**:
   ```text
   Create CRUD endpoints for user profiles: 
   GET /api/profiles/:id
   POST /api/profiles
   PUT /api/profiles/:id
   DELETE /api/profiles/:id
   ```
3. Copilot Coding Agent will spin up another environment and implement the endpoint with proper error handling, validation, and Swagger docs

### What You Learned

✅ **Custom Agents** - Specialized tools for specific domains  
✅ **Mission Control** - Manage multiple agents like a project manager  
✅ **Async Workflows** - Delegate and move on, check back later  
✅ **Mid-Session Steering** - Guide agents as they work

**Time Investment:** 30 minutes setup, agents work asynchronously  
**Value:** 3-5 tickets completed while you focus on architecture/design

---

## Use Case 5: "PRs take forever to review"

**Scenario:** Your team has a backlog of 15 PRs. Reviews are shallow because reviewers are overwhelmed.

**Your Challenge:** Use agentic AI-assisted code review to catch issues faster and more consistently.

### Step 1: Assign Code Review Agent

1. In your repo, find the pull request `Feature: Add ToS Download` and open it.  
2. Assign **Copilot** as a reviewer 
3. Scroll down to the bottom of the pull request and you should see a message that you requested a review from Copilot.

### Step 2: Review Runs in GitHub Actions

1. Navigate to **Actions → Copilot Code Review**
2. Notice it runs:
   - **CodeQL** security analysis
   - **ESLint** code quality checks
3. For awareness, Code Review agent has access to the **Code Graph** to analyze broader context.  Meaning it not only sees the PR changes, but also related files and dependencies.
4. Review runs independently - no blocking your workflow

### Step 3: Review Enhanced Feedback

Once the Actions run has completed, go back to the pull request.  You should see Copilot's review (typically starting with a 'Pull Request Overview' section).  The review includes:

- **Security findings** from CodeQL scan
- **Code quality issues** from ESLint
- **Best practices** violations such as missing swagger docs and not using React Query as per team standards
- **Additional context** from Code Graph (not just PR changes)
- **Instructions-based feedback** (checks against your `.github/instructions/`)

### Step 4: Implement Suggestions Automatically

Don't like manual fixes? Click **"Implement Suggestions"** to hand feedback back to Coding Agent for automatic fixes.  This will open a new pull request that merges into your existing PR with all suggested fixes applied.

Alternatively you can open a new comment:
```text
@Copilot implement all your review suggestions
```

### Step 5: Grouped Changes (Optional)

## Copilot Group Changes in PRs :copilot: 📦

Copilot is not able to group changes in existing pull requests created by humans. (Not yet on AI generated PRs).  This is intended to help reviewers better understand large PRs by breaking them into logical sections.

1. Switch to the `feature-add-cart-page` branch and click the **Contribute** button to open a pull request against the `main` branch.
2. Create a description for the pull request.  (Click the Copilot icon to have Copilot help you write this!)
3. Click **Create pull request** to complete this process.  
4. Navigate to the `Files changed` tab of the PR.
5. On the top right, notice how Copilot grouped changes into logical sections, making it easier to review and understand the modifications.

### What You Learned

✅ **Enhanced Code Review** - Security scanning built-in  
✅ **Actions Integration** - Reviews run independently and are auditable  
✅ **Automatic Implementation** - Hand fixes back to agent  

**Time Investment:** 15 minutes  
**Value:** Thorough reviews in less time, higher quality feedback

---

## Use Case 6: "Security keeps finding issues"

**Scenario:** Your security team reports: *"We found 12 CodeQL alerts, 3 leaked secrets, and 47 code quality issues."*

**Your Challenge:** Triage and fix systematically using AI assistance.

### Step 1: Enable Code Quality

1. Go to **Settings → Code Quality**
2. Click **Enable Code Quality**
3. Wait for initial scan (this takes a few minutes)

Code Quality uses CodeQL and AI to identify maintainability issues in your codebase.  Similar to other agents, it will also use GitHub Actions to run scans.  You can see the initial run under **Actions → CodeQL** with the initial job being `Code Quality: CodeQL Setup`.

### Step 2: Review and Fix Code Quality Issues

1. Navigate to **Security → Code Quality → Standard findings**
2. Select the `Inconsistent direction of for loop`.  
3. Click **Show more** just above the 2 findings to get more details
4. Click **Generate fix** on both findings.  Copilot will take around 30 seconds to provide a fix
5. Review the AI-generated fix (in the diff view)
6. Click **Open pull request** and commit the change to apply


Note - This doesn't work in this demo environment.  This may still be in private preview and not enabled here.  The steps are left here for future reference.

### Step 3: Handle Secret Scanning with Extended Metadata

Note your organization must have GitHub Advanced Security enabled for this feature. 

1. Navigate to the repository's **Settings → Advanced Security**
2. Verify that GitHub Advanced Security and Secret Protection are enabled
3. Click **Enable** for `Extended metadata`
4. Go to **Security → Secret scanning → Default** and 
5. Click **Verify Secret**
6. Enable **Extended Metadata** from settings link
7. Return to alert - now see:
   - **Validity status** (is it still active?)
   - **Organization name**
   - **Owner name**
   - Direct contact info for rotation

### Step 4: Assign CodeQL Alerts to Coding Agent

1. Navigate to **Security → Code scanning**
2. Find "Database query built from user-controlled sources"
3. Click **Generate fix**.  Again this takes 15-30 seconds
4. Review the proposed fix
4. Under `Assignees` on the right side menu, Click the gear and assign to Copilot
5. You can track progress in [Mission Control](https://github.com/copilot/agents)
6. The autofix agent will:
   - Open a PR 
   - Analyze the vulnerability
   - Generate a fix
   - Test the fix

### Step 5: Bulk Fix with Security Campaigns (Optional)

This step is for awareness.  Please don't execute it!  There is a limit of 10 active security campaigns in an organization and more people doing this workshop!  However, here is how you remediate at scale.  Identify and filter by similar alerts:

1. Create a **Security Campaign** from code scanning filters
2. Generate autofixes for all applicable alerts
3. **Bulk assign to Copilot**
4. Monitor all fixes from [Mission Control](https://github.com/copilot/agents)

### What You Learned

✅ **Code Quality** - AI-powered maintainability scanning  
✅ **Extended Secret Metadata** - Context for faster remediation  
✅ **CodeQL + Coding Agent** - Automatic vulnerability fixes  
✅ **Security Campaigns** - Bulk remediation workflows

**Time Investment:** 20 minutes  
**Value:** Systematic security improvements, not whack-a-mole

---

## Use Case 7: "I inherited legacy code I don't understand"

**Scenario:** You've been assigned to maintain a 3-year-old module. The original developer left. The code works but is poorly documented and uses unfamiliar patterns.

**Your Challenge:** Understand the code, document it, and refactor safely without breaking functionality.

### Step 1: Understand with Ask Mode

1. Open a complex file (e.g., `api/src/repositories/suppliersRepo.ts`)
2. Select a confusing function
3. Use **Inline Chat** (Cmd/Ctrl + I):
   ```text
   Explain what this function does, including edge cases and error handling
   ```
4. Close the inline chat
5. Move to the chat window, clear your history, and provide broader context in **Ask Mode**:
   ```text
   @workspace Explain the repository pattern used in this codebase. 
   How does it handle database connections and error mapping?
   ```

### Step 2: Add Documentation

1. Switch to `Agent` mode
2. Prompt:
   ```text
   Add comprehensive JSDoc comments to all functions in suppliersRepo.ts.
   Include parameter descriptions, return types, and example usage.
   ```
3. Agent will add structured documentation.  Review changes and keep one by one in the editor or keep all at once in the chat window.  

### Step 3: Refactor with Test Guardrails

1. First, ensure tests exist:
   ```text
   Review suppliersRepo.test.ts. Are there any missing test cases for edge conditions?
   ```
2. If coverage gaps exist:
   ```text
   Add tests for error scenarios: database connection failures, 
   invalid IDs, constraint violations.
   ```
3. Now safely refactor:
   ```text
   Refactor suppliersRepo.ts for better readability:
   - Extract complex conditionals into named functions
   - Reduce nested callbacks
   - Add type safety where any types are used
   
   Run tests after each change to ensure no breaking changes.
   ```

### Step 4: Generate Architecture Documentation

1. Prompt:
   ```text
   Create a Mermaid diagram showing the data flow from 
   API route → repository → database for the suppliers module.
   Save it in docs/architecture-suppliers.md
   ```
2. Open and review the file that was created
3. Note you can render the markdown and diagram by right-clicking the filename in the top tab and selecting **"Open Preview"**

### Step 5: Document Database Schema

1. Prompt:
   ```text
   Analyze the SQL migrations in api/sql/migrations/ and create 
   an ERD (Entity Relationship Diagram) in Mermaid format.
   Include all tables, relationships, and cardinality.
   
   Save to docs/database-schema.md
   ```

### Step 6: Create Developer Onboarding Guide

1. Prompt:
   ```text
   Create docs/ONBOARDING.md with:
   - Prerequisites and setup
   - Architecture overview
   - How to run tests
   - How to add a new API endpoint (step-by-step)
   - Common troubleshooting issues
   - Link to all other documentation
   ```


Copilot is great at reviewing code and generating documentation.  Keep in mind you could always assign this type of task to Coding Agent if you wanted to delegate it.

### What You Learned

✅ **Ask Mode** - Understand complex code without reading line-by-line  
✅ **Inline Chat** - Quick explanations without leaving your file  
✅ **Agent Refactoring** - Safe improvements with test guardrails  
✅ **Documentation Generation** - Diagrams and docs from code

**Time Investment:** 20 minutes  
**Value:** Hours of code reading condensed, safer refactoring, permanent documentation

---

## Use Case 8: "Customize Copilot with skills"

**Scenario:** Generating API endpoints is a workflow that involves multiple steps and Copilot doesn't consistently handle all aspects to our standards. You want to automate this workflow to save time. 

**Your Challenge:** Use a skill to implement a new API endpoint with a single prompt.

### What are Skills?

Agent Skills are folders of instructions, scripts, and resources that GitHub Copilot can load when relevant to perform specialized tasks. Skills are an [open standard](https://agentskills.io/) that works across multiple AI agents, including GitHub Copilot in VS Code, GitHub Copilot CLI, and GitHub Copilot coding agent.

**Key benefits of Agent Skills:**

- **Specialize Copilot**: Tailor capabilities for domain-specific tasks without repeating context
- **Reduce repetition**: Create once, use automatically across all conversations
- **Compose capabilities**: Combine multiple skills to build complex workflows
- **Efficient loading**: Optimize your context window by only loading relevant content when needed

**Comparing Customization Options:**

- **Custom Instructions**: Apply universally to all interactions, ideal for broad guidelines and standards. However, they lack the ability to execute scripts or provide structured resources.
- **Prompt Files**: Reusable templates for specific tasks, but require manual invocation and don't support dynamic execution or structured resources.
- **Agent Skills**: Automatically load based on context, can include executable scripts and structured resources, ideal for complex workflows that require multiple steps or specialized knowledge.
- **MCP Servers:** Extend capabilities with external tools and APIs, but require separate setup and management outside of Copilot's native environment.

#### Skill Structure

Skills are defined in `.github/skills/` or `.claude/skills/` directories and contain:
- `SKILL.md` - The skill definition with YAML frontmatter (name, description) and detailed instructions
- Additional resources - Scripts, examples, templates, and reference documentation

### Step 1: Explore the `api-endpoint` Skill

1. Navigate to `.github/skills/api-endpoint/`
2. Open `SKILL.md` to review the skill definition and instructions
  - Note the YAML frontmatter is the ONLY thing loaded into context.  When the skill is triggered, Copilot will fetch the markdown and pull in any scripts, templates, or resources as needed based on the instructions.  This keeps the context window efficient and focused on the task at hand.
3. Open the `references` folder to see the examples provided to Copilot to learn from when executing the skill.

### Step 2: Generate the DeliveryVehicle Entity

1. Open Copilot Chat and switch to **Agent** mode.  Select `Claude Opus 4.6`. 
2. Enter the following prompt:
   ```txt
   Add a new API endpoint for a new Entity called 'DeliveryVehicle'. Vehicles belong to branches.
   ```
3. Watch as Copilot:
   - Analyzes the existing codebase structure
   - References the `api-endpoint` skill automatically
   - Generates all required components following the established patterns:
     - **Model**: Generates the model using conventions
     - **Repository**: Generates the Repository with CRUD operations
     - **Routes**: Generates the route with full REST endpoints
     - **Migration**: Creates db migrations
     - **Seed Data**: Creates seed data
     - **Tests**: Creates and runs unit tests for the new endpoint

4. Review the generated code and note how it follows all the patterns and standards defined in the skill:
   - **Naming Conventions**: Follows naming conventions for entities/methods
   - **Foreign Key Relationship**: The `branchId` field linking to the `branches` table
   - **API Documentation**: Complete OpenAPI annotations for all endpoints
   - **Error Handling**: Consistent use of custom errors
   - **SQL Utilities**: Using specified utils
   - **Unit Tests**: Created and verified unit tests

5. (Optional) Verify the implementation
   ```bash
   make build-api             # Build the API
   npm test --workspace=api   # Run unit tests
   make run-api               # Start the API server    
   # Open the Swagger UI at `http://localhost:3000/api-docs` and show the new DeliveryVehicle endpoints
   ```

### What You Learned

✅ **Skills** - Encode your team's patterns and conventions, enabling consistent implementation and making them accessible to all developers and AI  

**Time Investment:** 15 minutes  
**Value:** Faster development of new features, consistent code quality, and a way to capture and share institutional knowledge

---

## Use Case 9: "I need end-to-end tests"

**Scenario:** Your QA team wants automated browser tests for critical user flows.

**Your Challenge:** Generate and run Playwright tests using MCP integration.

Playwright is a popular end-to-end testing framework for web applications.  GitHub Copilot can integrate with Playwright via the Model Context Protocol (MCP) to generate and run tests based on natural language prompts.

### Step 1: Start Playwright MCP

1. Open Command Palette (Cmd/Ctrl + Shift + P)
2. Select **MCP: List Servers**
3. Select the Playwright server
4. Click **Start Server**

### Step 2: Generate Test Scenarios

Note this requires that you've already implemented a shopping cart feature (from Use Case 1).

1. In the chat window, clear history, switch to `Agent` mode, and select the `Claude Sonnet 4.6` model
2. Prompt:
   ```text
   Create a Playwright e2e feature file testing:
   1. User adds two products to cart
   2. Verifies cart badge shows "2"
   3. Opens cart page
   4. Verifies subtotal is correct
   5. Removes one item
   6. Verifies badge updates to "1"

   Consult playwright config for the appropriate directories and setup.
   ```
3. Review the files created (feature file in Gherkin format and E2E test implementation)

### Step 3: Run Tests (Local Only)

1. Prompt:
   ```text
   Run these tests in headless mode and show me results
   ```
2. You'll be prompted to install some dependencies for Chromium...
3. Agent executes tests using MCP and discusses results in chat

### What You Learned

✅ **MCP Integration** - Extend Copilot with external tools  
✅ **Browser Automation** - Generate E2E tests from natural language  
✅ **BDD Workflows** - Readable, maintainable test scenarios in Gherkin

**Time Investment:** 15 minutes  
**Value:** E2E tests without learning Playwright syntax

---

## Use Case 10: "I want to build from specs, not vibes"

**Scenario:** Your team struggles with "vibe coding" - starting implementation before requirements are clear, leading to rework, scope creep, and features that don't align with business goals. Your PM wants a disciplined approach that maintains velocity while ensuring quality.

**Your Challenge:** Adopt Specification-Driven Development (SDD) to transform requirements into implementation systematically, with specifications as executable artifacts that drive code generation.

### What is Spec-Driven Development?

Traditional development treats code as king - specifications are scaffolding you discard once coding begins. **Specification-Driven Development (SDD) inverts this**: specifications don't serve code, **code serves specifications**. The Product Requirements Document (PRD) isn't a guide - it's the source that generates implementation.

With AI, specifications can now be:
- **Executable** - Precise enough to generate working systems
- **Living** - Stay in sync with code because they generate it
- **Testable** - Include acceptance criteria that become automated tests
- **Traceable** - Every technical decision links back to requirements

**Spec Kit** is GitHub's open-source toolkit that provides templates, commands, and workflows to implement SDD systematically.

### Step 1: Install Spec Kit

1. Install the Specify CLI:
   ```bash
   # Prerequisites
   sudo apt update && sudo apt install -y python3-pip pipx
   pipx install uv && pipx ensurepath

   # Setup Specify CLI
   uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

   specify check
   # This should say "Specify CLI is ready to use!"
   ```
   
2. Initialize your project :
   ```bash
   # Run this in the root of your repo - Say yes to continue with the risk of overwriting files
   specify init . --ai copilot --script sh

   # If you run into auth issues, try this: `env -u GITHUB_TOKEN specify init . --ai copilot --script sh`
   ```
   
   This creates:
   - `.specify/` directory with templates and scripts
   - Command shortcuts (`/speckit.specify`, `/speckit.plan`, etc.)
   - Constitution template for project principles

### Step 2: Establish Project Constitution

The **constitution** is your project's immutable architectural DNA - the principles that govern every specification and implementation.

1. Clear your chat history, ensure you are on `Agent` mode with `Claude Sonnet 4.6`
2. Run the constitution command with the following prompt:
   ```text
   /speckit.constitution  Our OctoCAT Supply Chain application follows these principles:
   - Library-first architecture for maximum reusability
   - Test-driven development with contract tests before implementation
   - Integration tests over mocks (real SQLite database)
   - Simplicity over abstraction - use frameworks directly
   - REST API design with OpenAPI documentation
   - TypeScript for type safety
   - Minimal dependencies - evaluate before adding
   ```
3. Review the generated `.specify/memory/constitution.md`
4. When happy with it, click `Keep` to save changes
5. The constitution will now guide all subsequent specifications and plans

### Step 3: Create a Feature Specification

Let's add a **Purchase Order** feature using spec-driven development.

1. Run the specify command and provide the feature description:
   ```text
   /speckit.specify Create a Purchase Order management system. Buyers at branches can create purchase 
   orders to suppliers for products. Each PO contains multiple line items with 
   quantities and expected prices. Track PO status (Draft, Submitted, Approved, 
   Fulfilled, Cancelled). Suppliers receive notifications when POs are submitted. 
   Include approval workflow for POs over $10,000.
   ```
2. **Agent will:**
   - Scan existing specs to assign next feature number (e.g., `001-purchase-orders`)
   - Create a feature branch automatically
   - Generate `specs/001-purchase-orders/spec.md` with:
     - User stories
     - Functional requirements
     - Success criteria
     - Key entities
     - Assumptions section
   
4. Review the specification - notice it:
   - ✅ Focuses on **WHAT** and **WHY**, not **HOW**
   - ✅ Marks ambiguities with `[NEEDS CLARIFICATION]`
   - ✅ Defines testable acceptance criteria
   - ✅ Avoids implementation details (no tech stack mentions)

### Step 4: Clarify Requirements

Before planning implementation, use structured clarification to reduce downstream rework.

1. Run the clarify command:
   ```text
   /speckit.clarify
   ```
2. Agent will analyze the spec and ask targeted questions like:
   - "How should suppliers receive notifications?"
   - "What happens when an approver tries to approve their own purchase orders?"
   - "Should PO approvals support multi-level approval chains?"
   - "What happens to in-progress POs when a product is discontinued?"
   
3. Answer each question as you would in a requirements gathering session
4. Agent records clarifications directly in the spec's **Clarifications** section
5. This prevents scope creep and reduces "we should have asked that earlier" moments

### Step 5: Generate Implementation Plan

Now translate the business spec into a technical plan with your chosen architecture.

1. Run the plan command with your technical requirements:
   ```text
   /speckit.plan  Technology Stack:
   - TypeScript with Express.js for REST API
   - SQLite database with repository pattern
   - React frontend with TypeScript
   - OpenAPI/Swagger for API documentation
   - Nodemailer for email notifications (stub for now)
   - Vitest for unit tests, Playwright for E2E tests
   
   Architecture:
   - Repository layer for data access
   - Service layer for business logic (approval workflow, notifications)
   - REST API following existing patterns in codebase
   - React Context for state management
   - Responsive UI matching existing design system
   ```

3. **Agent will generate multiple artifacts**:
   - `specs/004-purchase-orders/plan.md` - High-level implementation plan
   - `specs/004-purchase-orders/research.md` - Technology evaluation and tradeoffs
   - `specs/004-purchase-orders/data-model.md` - Database schema and relationships
   - `specs/004-purchase-orders/contracts/` - API endpoint specifications
   - `specs/004-purchase-orders/quickstart.md` - Key validation scenarios
   
4. Review the plan - notice:
   - Every technical decision references a requirement
   - Constitutional compliance checks (simplicity gates, test-first, etc.)
   - Phase breakdown with clear deliverables
   - Complexity tracking for any deviations from principles

### Step 6: Generate Task Breakdown

Convert the implementation plan into actionable, executable tasks.

1. Run the tasks command:
   ```text
   /speckit.tasks
   ```
2. Agent analyzes the plan and creates `specs/004-purchase-orders/tasks.md` with:
   - Database migration tasks (schema, indexes, foreign keys)
   - Repository layer tasks (CRUD operations per entity)
   - API endpoint tasks (one per contract)
   - Frontend component tasks (PO list, form, approval UI)
   - Test tasks (contract tests first, then integration, then E2E)
   - Parallel execution markers `[P]` for independent tasks
   
3. Tasks are organized in dependency order:
   ```markdown
   ### Phase 1: Foundation [P]
   - [P] Create purchase_orders table migration
   - [P] Create purchase_order_items table migration
   - [P] Create purchase_order_approval_logs table
   
   ### Phase 2: Repository Layer
   - [ ] Implement PurchaseOrdersRepository (depends on Phase 1)
   - [P] Implement PurchaseOrderItemsRepository (depends on Phase 1)
   ```

### Step 7: Implement with Agent

Now execute the implementation plan.

1. Run the implement command:
   ```text
   /speckit.implement
   ```
2. **Agent will:**
   - Validate all prerequisites (constitution, spec, plan, tasks exist)
   - Execute tasks in dependency order
   - Follow TDD: write tests first, confirm they fail, then implement
   - Run builds and tests after each task
   - Track progress and handle errors
   - Provide regular status updates

3. Monitor in real-time as agent:
   - Creates SQL migrations
   - Implements repository classes
   - Builds REST API endpoints
   - Generates OpenAPI documentation
   - Creates React components
   - Writes comprehensive tests at each layer

### Step 8: Verify and Iterate

1. Once implementation completes, test the feature:
   ```bash
   npm run build
   npm run test --workspace=api
   npm run dev
   ```
2. Test in the browser:
   - Navigate to the new Purchase Orders page
   - Create a PO with multiple line items
   - Submit for approval
   - Verify approval workflow for high-value POs
   
3. If issues arise, provide feedback to agent.  For example:
   ```text
   The approval notification isn't triggering. 
   Fix the notification service and add integration tests.
   ```
4. Agent will update the implementation and re-run tests

### Step 9: Specification Evolution

When requirements change (and they will), update specifications first.

**Scenario:** PM says *"We need to support partial fulfillment - suppliers can fulfill line items incrementally."*

1. Update the spec:
   ```text
   /speckit.specify
   
   Update the Purchase Order spec to support partial fulfillment:
   - Line items can be fulfilled in multiple shipments
   - Track fulfillment history per line item
   - PO status is "Partially Fulfilled" until all items complete
   - Add GET /api/purchase-orders/:id/fulfillment-history endpoint
   ```
2. Regenerate the plan:
   ```text
   /speckit.plan
   ```
3. Regenerate tasks:
   ```text
   /speckit.tasks
   ```
4. Implement changes:
   ```text
   /speckit.implement
   ```

The specification drives evolution. Code is regenerated from updated specs, not manually patched.

### What You Learned

✅ **Specification-First Thinking** - Requirements before code, every time  
✅ **Executable Specifications** - Specs precise enough to generate working systems  
✅ **Constitutional Governance** - Immutable principles ensure architectural consistency  
✅ **Structured Clarification** - Reduce rework by asking the right questions upfront  
✅ **Traceability** - Every technical decision links to a requirement  
✅ **Test-First Automation** - Tests written before implementation, built into workflow  
✅ **Systematic Evolution** - Changes start with specs, code regenerates

### Benefits of SDD

| Traditional Development | Spec-Driven Development |
|------------------------|------------------------|
| Code is truth, specs drift | Specs are truth, code is generated |
| "Just start coding" | "Let's clarify first" |
| Manual coordination across files | Automated multi-file implementation |
| Requirements changes = painful rewrites | Requirements changes = regeneration |
| Tests written after (maybe) | Tests mandated before implementation |
| Tribal knowledge | Documented, traceable decisions |
| 2-3 hours to spec a feature | 15 minutes with `/speckit.*` commands |

### When to Use SDD

**Great for:**
- ✅ New features with complex requirements
- ✅ Cross-cutting changes affecting multiple files
- ✅ Features requiring coordination across team members
- ✅ Projects with compliance/audit requirements
- ✅ When requirements are likely to evolve

**Less valuable for:**
- ❌ Trivial bug fixes
- ❌ One-file changes with clear scope
- ❌ Prototypes meant to be thrown away
- ❌ Emergency hotfixes

**Time Investment:** 30 minutes (+ agent implementation time)  
**Value:** Reduced rework, living documentation, systematic quality, faster pivots

---

## Use Case 11: "Governance With Hooks"

**Scenario:** Your team wants to better understand what code is aided or delivered by Copilot.  

**Your Challenge:** Add a hook to create a git commit after each agent session with proper attribution to Copilot.  This will create an auditable trail in git history for all agent sessions.

### What are Agent Hooks?

Agent Hooks allow execution of arbitrary commands or scripts at specific points in the Copilot Agent lifecycle. These hooks enable sophisticated workflows such as:

- **Audit Logging**: Recording prompts and session events for compliance.
- **Automated Checkpoints**: Creating git commits after each agent session.
- **Validation**: Running linters or tests before allowing the agent to proceed.

Hooks are defined in `.github/hooks/hooks.json` and support lifecycle events including `sessionStart`, `UserPromptSubmit`, and `Stop`.

### Step 1: Explore existing hooks

1. Open `.github/hooks/hooks.json` to see existing hook definitions.  Notice we have existing hooks for `sessionStart`, `UserPromptSubmit`, and `Stop` that log events to `.agent.log`
2. Assuming you've been using Copilot during this workshop, open `.agent.log` in your root workspace to see a log of your agent sessions, prompts submitted, and when sessions stopped.  This is an example of using hooks for audit logging.
3. If you have not been using Copilot yet, start an agent session and submit a prompt to see how it gets logged in `.agent.log`

### Step 2: Adding a git commit hook with Copilot attribution

The majority of this work has been done for you with a script and comment.  We'll just need to make a few modifications for our use case.  

1. Go back to `.github/hooks/hooks.json`.  Uncomment the agent hook definition under `Stop` for commits.  Notice this is calling a script, `.github/hooks/checkpoint-commit.sh`.  

```json
      // comment this in if you want automatic commits after each agent session
      {
        "type": "command",
        "bash": ".github/hooks/checkpoint-commit.sh",
        "cwd": ".",
        "timeoutSec": 10
      }
```

2. Open `.github/hooks/checkpoint-commit.sh` to see the script that creates a git commit with the message "Checkpoint commit after agent session".  This script will run every time an agent session stops, creating a checkpoint in git history.  Modify the script so the commit message includes Copilot attribution.  For example: 

```bash
# Create timestamped commit with Copilot co-author trailer
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
git commit -m "[Checkpoint-commit] $TIMESTAMP

Co-authored-by: GitHub Copilot <copilot@github.com>" --no-verify 2>/dev/null || {
  echo "⚠️  Commit failed"
  exit 0
}
```

3. Create a new branch (`git branch checkpoint-hook-test`) and start an agent session.  Use the following prompt:

```text
Add two rocket emojis 🚀🚀 to the title in the README.
```

4. One the session stops, check the git history by running `git log -1`.  You should see a new commit with the message starting with `[Checkpoint-commit]` and the co-author trailer for GitHub Copilot.  Note you could also search all commit history with 'git log --grep="Co-authored-by: GitHub Copilot" --oneline'

Note if you accidentally commit to main branch, you can reset to undo the commit and move it to a new branch:
```bash
git reset HEAD~1  # Undo last commit but keep changes staged
git checkout -b checkpoint-hook-test  # Move to new branch
```

### What You Learned

✅ **Agent Hooks** - Commands triggered at specific points in agent lifecycle

**Time Investment:** 15 minutes  
**Value:** Hooks provide ways to call external scripts at different points in the agent lifecycle.  This could be used to send notifications, enforce policies, create audit logs, block certain actions, or even create git commits for every agent session with proper attribution.  This gives you control at various events throughout the agent lifecycle.  

---

## Use Case 12: "Agentic Workflows"

**Scenario:** You want to add a review workflow to ensure your site renders appropriately across mobile, tablet, and desktop devices. 

**Your Challenge:** Create an agentic workflow in GitHub Actions that reviews and updates your responsive design code based on natural language prompts.

### What Are Agentic Workflows?

Agentic Workflows are AI-powered GitHub Actions workflows that can reason, make decisions, and take actions autonomously. Unlike traditional YAML-based workflows that follow rigid, predefined steps, agentic workflows are written in markdown and use natural language to describe what the agent should accomplish.

The agent interprets the instructions, gathers context, and dynamically determines the best path to achieve the goal - including error handling, retries, and adaptive decision-making. Execution is secured within a sandbox with explicit permissions and safe outputs to ensure security.

### Key Concepts

#### Custom Front matter - e.g. Schedule Jittering

Agentic workflow markdown file have custom frontmatter properties that look similar to Actions properties. There are differences though: for example, `schedule: daily` runs at a **random time** each day. This "jittering" prevents multiple workflows from executing simultaneously and overwhelming resources.

```yaml
on:
  schedule: daily  # Runs at a random time each day
```

#### Secure Sandbox and Permissions

Agentic workflows run in a **secure sandbox** with minimal default permissions:

- **Network isolation**: Only explicitly allowed domains can be accessed
- **Read-only by default**: Write permissions must be explicitly granted
- **Tool restrictions**: Only specified tools and commands are available
- **Safe outputs**: Only declared outputs can be produced by the agent
- **LLM guardrails**: LLM session is isolated in its own container with limited host access

Example permission block:

```yaml
permissions:
  contents: read
  issues: read
  pull-requests: read
network:
  allowed:
    - node  # Allow npm registry access
```

Refer to the [Security Architecture Documentation](https://github.github.io/gh-aw/introduction/architecture/) for complete details.

#### Safe Outputs

Safe outputs are a security feature that restricts what actions the agent can take. Instead of having full write access, agents declare specific outputs they can produce:

```yaml
safe-outputs:
  create-issue:
    title-prefix: "[auto] "  # All created issues must have this prefix
    max: 1                    # Only one issue per run
  assign-to-agent:
    allowed: [copilot]        # Can only assign to Copilot
  noop:                       # Allow "no operation" output
```

The [Safe Outputs documentation](https://github.github.io/gh-aw/reference/safe-outputs/) outlines available output types and how to configure them.

### Step 1: Install GitHub CLI and the Agentic Workflows Extension

* Install the GitHub CLI: [https://cli.github.com/](https://cli.github.com/).  Skip this in Codespaces since it's pre-installed.
* Install the Agentic Workflows extension:
  ```bash
  curl -sL https://raw.githubusercontent.com/github/gh-aw/main/install-gh-aw.sh | bash
  ```
  * Note that outside of Codespaces you can likely just use `gh extension install github/gh-aw` to install.  
* Test the CLI and extension to ensure they respond:
  ```bash
  gh --version
  gh aw version
  ```

### Step 2: Setup - Token Configuration

Before creating agentic workflows, you need to configure tokens with appropriate permissions.  Currently this is 2 tokens: 

- One for allowing Copilot requests in the Actions workflow 
- One to allow Copilot to assign issues to itself (for the "assign-to-agent" output)

Note that this is expected to be simplified in the future with org-level support (so the built-in Actions token can be used rather than needing personal tokens). 

* **COPILOT_GITHUB_TOKEN (Copilot Authentication)** Setup 
  * Go to [Create a fine-grained PAT](https://github.com/settings/personal-access-tokens/new?name=COPILOT_GITHUB_TOKEN&description=GitHub+Agentic+Workflows+-+Copilot+engine+authentication&user_copilot_requests=read).  This link will pre-full the token name, description, and Copilot Requests permission.  
  * **Resource owner** is your user account (not the organization).  This is because the Copilot seat is owned by you!
  * Set an appropriate expiration 
  * For repos the setting really doesn't matter since we're not giving any repo permissions to the token
  * Permissions - should already be set under Account permissions to 'Copilot Requests:Read'
  * Click 'Generate token' and copy the token value.  
  * Add it to your repository by going to your repository's Settings → Secrets and variables → Actions → New repository secret
    * Name: `COPILOT_GITHUB_TOKEN`
    * Value: the token value you just copied
    * Click 'Add secret' to save it

This token authenticates the Copilot agent to run within GitHub Actions.  The authentication reference is [here](https://github.github.com/gh-aw/reference/auth/).

* **AGENT_ISSUE_TOKEN (Issue Creation and Assignment)** Setup 
  * Go to [Create a fine-grained PAT](https://github.com/settings/personal-access-tokens/new?name=GH_AW_AGENT_TOKEN&description=GitHub+Agentic+Workflows+-+Agent+assignment&actions=write&contents=write&issues=write&pull_requests=write).  This link will pre-fill the token name, description, and necessary permissions for issue creation and assignment.
  * Resource owner should be the organization if these are organization-owned repositories.  Otherwise it can be your user account if they are in your personal namespace.  
  * For repo access, select the specific repository where the agentic workflow will run
  * For repository permissions, set: 
    * Actions: Write
    * Contents: Write
    * Issues: Write
    * Pull requests: Write
  * Click 'Generate token' and copy the token value.  
  * Add it to your repository by going to your repository's Settings → Secrets and variables → Actions → New repository secret
    * Name: `GH_AW_AGENT_TOKEN`
    * Value: the token value you just copied
    * Click 'Add secret' to save it

This token allows the agentic workflow to [assign to Copilot](https://github.github.com/gh-aw/reference/assign-to-copilot/) using safe outputs.  We will use it for a workflow that auto-analyzes build failures.  


### Step 3: Create a New Workflow from Scratch

Here we will use Copilot Coding Agent to create an agentic workflow from scratch.  Note that while you can create this manually it is much easier to just have Copilot do it.  This can take anywhere from 10-30 minutes so we will start here and then focus on other aspects of agentic workflows in the next steps.

1. In your repo in GitHub.com, go to the `Agents` tab
2. Choose 'Claude Opus 4.6' as your model and enter this prompt:

   ```text
   Create a workflow for GitHub Agentic Workflows using https://github.com/github/gh-aw/blob/main/create.md. The purpose of the workflow is to import multi-device resolution tester agentic workflow from github/gh-aw and adapt it to test the website in this repo.  Ensure that the build steps are followed in docs/build.md.  Please create a pull request with these changes and ensure it can be triggered from workflow_dispatch as well as scheduled weekly.  
   ```
3. Click the send button to send the request to Copilot Coding Agent
4. Let Copilot Coding Agent Cook - it will:
   - Fetch the creation guide
   - Create the markdown file describing the intent of the workflow
   - Create the workflow file in `.github/workflows/`
5. While waiting, proceed to the next step


### Step 4: Auto-Analyzing Build Failures

With the addition of Copilot into a GitHub Actions workflow, you can create workflows that automatically analyze build failures and even create issues with findings and recommended fixes.  

1. The workflow [.github/workflows/auto-analyze-failures.md](.github/workflows/auto-analyze-failures.md) is already configured.  Open it and review the contents.  Notice the frontmatter shows the trigger (on workflow run completed), permissions, the toolset enabled, safe outputs (create an issue and assign to copilot), as well as network access limitations.  The body of the markdown describes the workflow in natural language, and references `${{ github.xxx }}` context variables to pull in dynamic information about the workflow run and failure.
    1. Note the `auto-analyze-failures.lock.yml` file is auto-generated.  Review it and you will see a typical GitHub Actions workflow. 
2. Enable the `auto-analyze-failures.lock.yml` workflow
    1. Go to the **Actions** tab in your repository 
    2. Select **"Auto Analyze Build Failures"** from the left sidebar.  You might need to click **Show More** to find it. 
    3. Click the **Enable workflow** button
3. Create an intentional failure in the code to workflow
    1. In your Codespace, hit *Cmd-shift-P* or *Ctrl-shift-P* and select `Tasks: Run Task` and then select `Copilot: Self-healing DevOps`.
    2. Say `Yes` to create a new branch.  
    3. This will create a breaking code change.  The branch should be called `update-branch-route-behavior`
    4. Commit and push this change and create a pull request to trigger the CI workflow, which should fail.
       ```bash
       git add . 
       git commit -m "Update branch route behavior"
       git push --set-upstream origin update-branch-route-behavior
       ## Now create a pull request in GitHub.com from this branch to main to trigger the CI workflow
       ```
4. Wait for the CI build to fail (this should take a few moments)
5. The `auto-analyze-failures` workflow automatically triggers on the failure
6. Inspect the workflow run:
   - The agent reads the failure logs
   - Classifies the failure type (code, test, config, dependency, etc.)
   - Determines if it's transient or requires action
5. If not transient, an issue is automatically created with:
   - Failure analysis summary
   - Remediation plan
   - Links to the failed run
6. For certain failure categories, the issue is automatically assigned to Copilot Coding Agent
7. Open Issues tab to show the newly created issue.  Be aware that the issue is assigned to Copilot and it will work on a fix.  

### Step 5: (Optional) Daily Repo Activity Summary

You can also create agentic workflows that run on a schedule.  For example, you could create a workflow that runs daily and summarizes all PR activity in the repo, identifies stale issues, or surfaces security vulnerabilities.  

1. Navigate to **Actions** tab in GitHub
2. Find the workflow: **"Daily Repo Activity Summary"**
3. Click **"Run workflow"** to trigger manually
   - Note: In production, this runs daily at a random time (jittered)
4. Wait for completion (~2-5 minutes)
5. Check the **Issues** tab for the new summary issue
6. Review the generated content:
   - Issues opened/closed in last 24 hours
   - Pull requests activity
   - Notable high-activity items
   - Direct links to all referenced items
7. Review the `.github/workflows/daily-repo-activity-summary.md`.  Note the `safe-outputs` section restricts the agent to only creating a maximum of 1 issue per run and the `title-prefix` ensures all issues created by this workflow are easily identifiable.  Also note the `network` section only allows access to the GitHub API, preventing any external calls. 

### Step 6: Returning to our original workflow

At this point hopefully the workflow that we created earlier has finished generating.  Check the **Pull requests** tab for a pull request with a title like 'Add Multi-Device Site Tester Agentic Workflow.  If it's not there, go to the `Agents` tab in your repository and look at the session for the workflow creation.  

1. Review the pull request.  Check the frontmatter (triggers, permissions, tools, safe-outputs).  Review the natural language instructions and notice how it references `${{ github.xxx }}` context variables.  
2. Merge the pull request.   
3. After merging, go to the **Actions** tab and find the new workflow that was created.  It should be called something like "Multi-Device Site Tester".  Click **Run Workflow** to trigger it manually for testing. 
4. Watch the workflow run in real-time to see how the agent executes the instructions, gathers information, and takes actions based on the defined workflow.  This workflow should be testing the responsiveness of your site across different device types and providing a summary of findings in the workflow logs.
5. Once complete, review the issue created by the workflow with the summary of findings.  

### Step 7: Look At Examples

This was a brief overview of agentic workflows. There are a couple key places to find inspiration and examples for agentic workflows:

* [Peli's Agent Factory](https://github.github.com/gh-aw/blog/2026-01-12-welcome-to-pelis-agent-factory/)
* [The Agentics Repo](https://github.com/githubnext/agentics)

### What You Learned

✅ **Agentic Workflows** - Agentic workflows can autonomously gather data, synthesize insights, and create structured reports on a schedule. They can be used for monitoring, reporting, and automating routine tasks with AI-driven insights.

**Time Investment:** 45 minutes  
**Value:** Agentic Workflows provide a way to schedule and trigger automation based on natural language instructions.  This allows you to create powerful automations that can analyze data, generate reports, and even take actions like creating issues or commenting on PRs - all without writing traditional code.  The secure sandbox and safe outputs ensure that these workflows can run safely with limited permissions.

---

## 🔄 Wrap Up

### Reflection Questions

1. **Which use case felt most valuable to your daily work?**
2. **Where could you apply these techniques tomorrow?**
3. **What team processes could benefit from custom agents or instructions?**

### Key Takeaways

| Use Case | Key Lesson |
|----------|------------|
| Feature Development | Planning Agent + Agent Mode = fast, high-quality features |
| Test Coverage | Prompt files create reusable, documented workflows |
| Team Standards | Custom instructions enforce consistency automatically |
| Task Management | Mission Control lets you delegate and scale your impact |
| Complex Workflows | Agent Skills encode complex workflows and patterns for consistent execution |
| Code Review | AI-assisted reviews catch more issues faster |
| Security | Automate vulnerability fixes with Coding Agent |
| Legacy Code | Ask Mode + Agent refactoring makes unknowns manageable |
| E2E Testing | MCP Playwright generates browser tests from natural language |
| Spec-Driven Development | Specifications drive code, eliminating the intent-implementation gap |
| Governance | Lifecycle hooks enable custom workflows and audit logging |
| Agentic Workflows | AI-powered automation in GitHub Actions |

### Next Steps

1. **This Week:**
   - Add custom instructions for your team's standards
     - Use the 'Generate Chat Instructions' feature at the top of Copilot Chat to get started or consult examples in the [awesome-copilot repo](https://github.com/github/awesome-copilot/tree/main/instructions)
   - Create one reusable [prompt file](https://code.visualstudio.com/docs/copilot/customization/prompt-files) for a common task
   
2. **This Month:**
   - Configure custom agents for specialized domains
   - Build your first Agent Skill to encode a common workflow or pattern
   - Enable Code Quality and work through findings
   - Use Coding Agent to delegate a task

3. **This Quarter:**
   - Establish team patterns for agent usage
   - Build a library of prompt files and skills
   - Measure productivity impact
   - Try Spec-Driven Development for a new feature

---

## 📚 Resources

- [Awesome Copilot Library - Prompts, Instructions, Agents, Skills, etc.](https://github.com/github/awesome-copilot)
- [Official GitHub Copilot Docs](https://docs.github.com/en/copilot)
- [Custom Agents Documentation](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents)
- [Agent Skills Documentation](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-skills)
- [GitHub MCP Registry](https://github.com/mcp)
- [Mission Control](https://github.com/copilot/agents)
- [Spec Kit - Spec-Driven Development Toolkit](https://github.com/github/spec-kit)
- [Spec-Driven Development Methodology](https://github.com/github/spec-kit/blob/main/spec-driven.md)
- [Video: Using Spec Kit with Existing Projects](https://www.youtube.com/watch?v=SGHIQTsPzuY)
- [Agentic Workflows Documentation](https://github.github.io/gh-aw/)

---

**You're now equipped to solve real problems with AI. Go build something amazing!** 🚀