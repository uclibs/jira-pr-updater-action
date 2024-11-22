# Update PR with Jira Issue
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)

A GitHub Action to automatically update pull request titles and bodies with the Jira issue key and link extracted from the branch name.

## Features
- Extract Jira Issue Key: From branch names following the pattern PROJECTKEY-123-description.
- Update PR Title: Prepends the Jira issue key to the PR title if not already present.
- Update PR Body: Prepends a link to the Jira issue at the beginning of the PR body if not already present.
- Configurable Project Key Pattern: Supports customization of the Jira project key pattern.

## Inputs
`jira-project-key-regex`

**Optional** The regex pattern to match the Jira project key.
- Default: [A-Za-z0-9_-]+
- Example: If your project keys include letters, numbers, underscores, or hyphens, the default pattern should suffice.

`jira-base-url`

**Required** The base URL of your Jira instance.
- Example: https://ucdts.atlassian.net

## Usage
To use this action in your workflow, add the following to your workflow YAML file:

```yaml
name: Update PR with Jira Issue
on:
  pull_request:
    types: [opened, edited, synchronize, reopened]

jobs:
  update-pr:
    runs-on: ubuntu-latest
    steps:
      - name: Update PR with Jira Issue
        uses: uclibs/jira-pr-updater-action@v1
        with:
          jira-base-url: 'https://ucdts.atlassian.net'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
- Notes:
  - Ensure the GITHUB_TOKEN is provided, which is automatically available in GitHub Actions.

## Examples

### Branch Naming Conventions
Your branch names should include the Jira issue key. Examples:

- PROJECT-123-new-feature
- project_123_fix-bug
- proj-1234-improve-documentation

### Customizing the Project Key Pattern
If your project keys have a specific pattern, you can customize the jira-project-key-regex input:

```yaml
with:
  jira-base-url: 'https://ucdts.atlassian.net'
  jira-project-key-regex: '[A-Z]{2,5}'
```
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
Contributions are welcome! Please open an issue or pull request for any bugs or enhancements.
Before making a contribution please see our [Contributing Guidelines](CONTRIBUTING.md)



## Code of Conduct
Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## License
This project is licensed under the terms of the MIT license. See [the LICENSE file](LICENSE.md) for details.