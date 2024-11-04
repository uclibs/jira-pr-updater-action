# Jira PR Updater GitHub Action
## Overview
The Jira PR Updater is a custom GitHub Action designed to streamline your development workflow by automatically updating pull request (PR) titles and bodies with the corresponding Jira issue number. It extracts the Jira issue number from the branch name and ensures that your PRs are properly linked to their Jira issues.

## Features
<b>Automatic Jira Issue Detection:</b> Parses the branch name to extract the Jira issue number.
<b>PR Title Update:</b> Prepends the Jira issue number to the PR title if it's not already included.
<b>PR Body Update:</b> Adds a link to the Jira issue at the beginning of the PR body if it's not already present.
<b>Easy Integration:</b> Simple setup with minimal configuration required.
## Table of Contents
- [Jira PR Updater GitHub Action](#jira-pr-updater-github-action)
  - [Overview](#overview)
  - [Features](#features)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
    - [Step 1: Set Up the Action in Your Repository](#step-1-set-up-the-action-in-your-repository)
      - [Create the Workflow Directory:](#create-the-workflow-directory)
      - [Create the Workflow File:](#create-the-workflow-file)
    - [Step 2: Configure the Workflow](#step-2-configure-the-workflow)
    - [Step 3: Commit and Push Changes](#step-3-commit-and-push-changes)
    - [Step 4: Verify the Action](#step-4-verify-the-action)
  - [Configuration Options](#configuration-options)
  - [Troubleshooting](#troubleshooting)
    - [Action Doesn't Seem to Run](#action-doesnt-seem-to-run)
    - [Jira Issue Not Detected](#jira-issue-not-detected)
    - [Permission Issues](#permission-issues)
    - [Still Having Problems?](#still-having-problems)
  - [Contributing](#contributing)
  - [Commit Message Guidelines](#commit-message-guidelines)
    - [Commit Message Structure](#commit-message-structure)
    - [Allowed Commit Types](#allowed-commit-types)
    - [Examples of Valid Commit Messages](#examples-of-valid-commit-messages)
    - [Guidelines for Writing Commit Messages](#guidelines-for-writing-commit-messages)
    - [What Happens If a Commit Message Doesn’t Follow These Rules?](#what-happens-if-a-commit-message-doesnt-follow-these-rules)
  - [License](#license)
## Prerequisites
Before you begin, ensure you have the following:

- A repository where you have permissions to add GitHub Actions workflows.
- The Jira base URL for your company's Jira instance.
- Familiarity with Git and GitHub workflows.
## Getting Started
Follow these steps to integrate the Jira PR Updater GitHub Action into your repository.

### Step 1: Set Up the Action in Your Repository
#### Create the Workflow Directory:

Ensure the .github/workflows directory exists:
```aiignore
mkdir -p .github/workflows
```
#### Create the Workflow File:

Create a new file named jira-pr-updater.yml:
```aiignore
touch .github/workflows/jira-pr-updater.yml
```

### Step 2: Configure the Workflow
Open <b>jira-pr-updater.yml</b> in your favorite text editor and add the following content:
```aiignore
name: Jira PR Updater

on:
  pull_request:
    types: [opened, edited, reopened]

jobs:
  update_pr:
    runs-on: ubuntu-latest
    steps:
      - name: Update PR Title and Body with Jira Issue
        uses: uclibs/jira-pr-updater-action@v1
        with:
          jira_base_url: 'https://ucdts.atlassian.net/'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

```

### Step 3: Commit and Push Changes
Commit the Workflow File:
```aiignore
git add .github/workflows/jira-pr-updater.yml
git commit -m "Add Jira PR Updater GitHub Action workflow"
```

Push Changes to the Repository:
```aiignore
git push origin main
```
Replace main with your default branch name if it's different.

### Step 4: Verify the Action
Create a New Branch with a Jira Issue Number:

```aiignore
git checkout -b feature/PROJ-123-add-new-feature
```

Make Some Changes and Push the Branch:

```aiignore
# Make your code changes
git add .
git commit -m "Implement new feature"
git push origin feature/PROJ-123-add-new-feature
```
Open a Pull Request:

- Go to your repository on GitHub.
- Click on "Compare & pull request" for your new branch.
- Submit the pull request without manually adding the Jira issue number in the title or body.

Check the Pull Request:

- Wait for the GitHub Action to run.
- Refresh the pull request page.
- Verify that the Jira issue number has been prepended to the PR title.
- Verify that a link to the Jira issue has been added at the beginning of the PR body.

## Configuration Options
You can customize the behavior of the Jira PR Updater by providing additional inputs.

Available Inputs
- jira_base_url (required): The base URL of your Jira instance.
- issue_regex (optional): A custom regular expression to match the Jira issue number in the branch name.
- title_template (optional): A template for formatting the PR title.
- body_template (optional): A template for formatting the PR body.

Example with Custom Options
```aiignore
- name: Update PR Title and Body with Jira Issue
  uses: your-org/jira-pr-updater-action@v1
  with:
    jira_base_url: 'https://yourcompany.atlassian.net'
    issue_regex: '[A-Z]+-\d+'
    title_template: '[{{ISSUE_KEY}}] {{TITLE}}'
    body_template: '[{{ISSUE_KEY}}]({{JIRA_URL}})\n\n{{BODY}}'
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Template Variables:

- {{ISSUE_KEY}}: The extracted Jira issue key (e.g., PROJ-123).
- {{JIRA_URL}}: The full URL to the Jira issue.
- {{TITLE}}: The original PR title.
- {{BODY}}: The original PR body.

## Troubleshooting
### Action Doesn't Seem to Run
- Check Workflow Triggers: Ensure the on: section in your workflow file includes the pull_request event.
- Verify Workflow File Location: The workflow file must be located in .github/workflows/.
- GitHub Actions Enabled: Confirm that GitHub Actions are enabled for your repository.
### Jira Issue Not Detected
- Branch Naming Convention: Make sure your branch names include the Jira issue number.
- Issue Regex: If you have a custom branch naming convention, adjust the issue_regex input accordingly.
### Permission Issues
- GITHUB_TOKEN: Ensure that the GITHUB_TOKEN is correctly referenced and has the necessary permissions.
- Repository Permissions: Verify that you have write access to the repository.
### Still Having Problems?
- Check Action Logs: Go to the "Actions" tab in your repository to view logs and error messages.
- Contact Support: Reach out to your internal support team or the action maintainer.

## Contributing
We welcome contributions to improve the Jira PR Updater GitHub Action. To contribute:

- Fork the Repository: Create a personal fork of the action repository.

- Create a Feature Branch:
```aiignore
git checkout -b feature/your-feature
```
- Implement Your Changes.

- Commit and Push:
```aiignore
git commit -m "Add your feature"
git push origin feature/your-feature
```
- Open a Pull Request: Submit a pull request to the main repository with a detailed description of your changes.

## Commit Message Guidelines
Our project uses Husky and Commitlint to enforce standardized commit messages based on the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/). Following this format helps make our commit history more readable and makes it easier to generate release notes, automate versioning, and track changes effectively.

### Commit Message Structure
Each commit message should follow this structure:
```
<type>: <subject>
```
`type`: Specifies the nature of the commit. It should be lowercase and describe the type of change you are making.
`subject`: A brief, descriptive summary of the change. It should be written in sentence case (only the first word capitalized) and kept under 50 characters if possible.

### Allowed Commit Types
Here are the main type options we use, along with examples for each:

- `feat`: A new feature for the user.
Example: feat: add user authentication
- `fix`: A bug fix for the user.
Example: fix: resolve login redirect issue
- `docs`: Documentation changes only.
Example: docs: update README with setup instructions
- `style`: Code style changes (formatting, indentation, etc.) without affecting functionality.
Example: style: reformat code to meet style guidelines
- `refactor`: Code changes that improve structure or readability without fixing a bug or adding a feature.
Example: refactor: simplify authentication logic
- `test`: Adding or modifying tests.
Example: test: add unit tests for login component
- `chore`: Routine tasks, such as dependency updates or build process changes.
Example: chore: update dependencies

### Examples of Valid Commit Messages
- `feat: add logout functionality`
- `fix: correct typo in welcome message`
- `docs: add setup instructions to README`
- `style: apply consistent code formatting`
- `refactor: optimize database query logic`
- `test: add tests for profile page`

### Guidelines for Writing Commit Messages
- Keep it short and specific: Use concise descriptions that convey the change.
- Use the imperative mood: For example, use “add feature” instead of “added feature” or “adds feature.”
- Avoid detailed explanations: Focus on the change summary. If further details are needed, include them in the pull request description.
### What Happens If a Commit Message Doesn’t Follow These Rules?
We use Husky to enforce these standards with a Git hook that triggers Commitlint. If your commit message doesn’t follow the specified format, Commitlint will reject the commit and display an error message.

By following these guidelines, we ensure that our commit history remains consistent and organized, making it easier for everyone to understand and track changes over time.

## License
This project is licensed under the [MIT License](https://www.mit.edu/~amini/LICENSE.md).
