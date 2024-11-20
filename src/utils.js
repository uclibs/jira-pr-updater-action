const core = require('@actions/core');

/**
 * Extracts the Jira issue key from the branch name.
 * @param {string} branchName - The name of the branch.
 * @param {string} projectKeyRegex - The regex pattern for the Jira project key.
 * @returns {string|null} - The Jira issue key or null if not found.
 */
function extractJiraIssue(branchName, projectKeyRegex) {
  // Construct the full regex pattern
  const pattern = new RegExp(`(${projectKeyRegex}-\\d+)`, 'i');
  const match = branchName.match(pattern);
  if (match) {
    // Remove any extra characters after the issue number
    return match[1].toUpperCase();
  } else {
    core.info('No Jira issue found in branch name.');
    return null;
  }
}


module.exports = {
  extractJiraIssue,
};
