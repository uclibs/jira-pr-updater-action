const core = require('@actions/core');
const github = require('@actions/github');
const { extractJiraIssue } = require('./utils');

async function run() {
  try {
    const jiraProjectKeyRegex = core.getInput('jira-project-key-regex');
    const jiraBaseUrl = core.getInput('jira-base-url');
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      core.setFailed('GITHUB_TOKEN is not set.');
      return;
    }

    const octokit = github.getOctokit(token);
    const { context } = github;
    const { pull_request: pullRequest } = context.payload;

    if (!pullRequest) {
      core.setFailed('This action must be run on a pull_request event.');
      return;
    }

    const branchName = pullRequest.head.ref;
    core.info(`Branch name: ${branchName}`);

    const jiraIssue = extractJiraIssue(branchName, jiraProjectKeyRegex);

    if (!jiraIssue) {
      core.info('No Jira issue found. Exiting action.');
      return;
    }

    core.info(`Extracted Jira Issue: ${jiraIssue}`);

    await updatePRTitle(octokit, pullRequest, jiraIssue);
    await updatePRBody(octokit, pullRequest, jiraIssue, jiraBaseUrl);

  } catch (error) {
    core.setFailed(error.message);
  }
}

/**
 * Updates the PR title by prepending the Jira issue key if it's not already present.
 * @param {object} octokit - The GitHub client.
 * @param {object} pullRequest - The pull request object.
 * @param {string} jiraIssue - The Jira issue key.
 */
async function updatePRTitle(octokit, pullRequest, jiraIssue) {
  const currentTitle = pullRequest.title;
  core.info(`Current PR title: ${currentTitle}`);

  const jiraIssuePattern = new RegExp(`\\b${jiraIssue}\\b`, 'i');
  if (jiraIssuePattern.test(currentTitle)) {
    core.info('Jira issue already present in the PR title.');
    return;
  }

  const newTitle = `${jiraIssue} ${currentTitle}`;
  core.info(`Updating PR title to: ${newTitle}`);

  await octokit.rest.pulls.update({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: pullRequest.number,
    title: newTitle,
  });

  core.info('PR title updated successfully.');
}

/**
 * Updates the PR body by prepending the Jira issue link if it's not already present.
 * @param {object} octokit - The GitHub client.
 * @param {object} pullRequest - The pull request object.
 * @param {string} jiraIssue - The Jira issue key.
 * @param {string} jiraBaseUrl - The base URL of the Jira instance.
 */
async function updatePRBody(octokit, pullRequest, jiraIssue, jiraBaseUrl) {
  const jiraLink = `${jiraBaseUrl}/browse/${jiraIssue}`;
  const jiraLinkMarkdown = `Jira Issue: [${jiraIssue}](${jiraLink})`;

  const currentBody = pullRequest.body || '';
  core.info('Checking if Jira link is present in the PR body.');

  if (currentBody.includes(jiraLink)) {
    core.info('Jira link already present in the PR body.');
    return;
  }

  const newBody = `${jiraLinkMarkdown}\n\n${currentBody}`;
  core.info('Updating PR body with Jira link.');

  await octokit.rest.pulls.update({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: pullRequest.number,
    body: newBody,
  });

  core.info('PR body updated successfully.');
}

// Export the run function for testing
module.exports = { run };

// Execute run function if the script is run directly
if (require.main === module) {
  run();
}
