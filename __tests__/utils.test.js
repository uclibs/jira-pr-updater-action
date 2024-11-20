// __tests__/utils.test.js

const { extractJiraIssue } = require('../src/utils');

describe('extractJiraIssue', () => {
  test('Extracts Jira issue with uppercase project name', () => {
    const branchName = 'LIBTREATDB-84-connect-qa-shibboleth-to-app';
    const jiraIssue = extractJiraIssue(branchName, '[A-Za-z0-9_-]+');
    expect(jiraIssue).toBe('LIBTREATDB-84');
  });

  test('Extracts Jira issue with lowercase project name', () => {
    const branchName = 'libtreatdb-84-connect-qa-shibboleth-to-app';
    const jiraIssue = extractJiraIssue(branchName, '[A-Za-z0-9_-]+');
    expect(jiraIssue).toBe('LIBTREATDB-84');
  });

  test('Extracts Jira issue with snakecase project name', () => {
    const branchName = 'lib_treat_db-84-connect-qa-shibboleth-to-app';
    const jiraIssue = extractJiraIssue(branchName, '[A-Za-z0-9_-]+');
    expect(jiraIssue).toBe('LIB_TREAT_DB-84');
  });

  test('Extracts Jira issue when Jira project name has a hyphen', () => {
    const branchName = 'LIB-TREAT-DB-84-connect-qa-shibboleth-to-app';
    const jiraIssue = extractJiraIssue(branchName, '[A-Za-z0-9_-]+');
    expect(jiraIssue).toBe('LIB-TREAT-DB-84');
  });

  test('Extracts Jira issue with numbers in project key', () => {
    const branchName = 'P2ROJ123-456-feature-update';
    const jiraIssue = extractJiraIssue(branchName, '[A-Za-z0-9_-]+');
    expect(jiraIssue).toBe('P2ROJ123-456');
  });

  test('Returns null when Jira issue is not found', () => {
    const branchName = 'feature/update-readme';
    const jiraIssue = extractJiraIssue(branchName, '[A-Za-z0-9_-]+');
    expect(jiraIssue).toBeNull();
  });

  test('Case-insensitive extraction', () => {
    const branchName = 'proj-123-new-feature';
    const jiraIssue = extractJiraIssue(branchName, '[A-Za-z0-9_-]+');
    expect(jiraIssue).toBe('PROJ-123');
  });
});
