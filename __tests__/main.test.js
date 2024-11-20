// __tests__/main.test.js

const core = require('@actions/core');
const github = require('@actions/github');
const { run } = require('../src/main');

// Mock core functions
jest.mock('@actions/core');

// Mock github module partially
jest.mock('@actions/github', () => {
  const originalModule = jest.requireActual('@actions/github');
  return {
    ...originalModule,
    getOctokit: jest.fn(),
    context: {
      payload: {},
      repo: {},
    },
  };
});

describe('GitHub Action Tests', () => {
  let mockOctokit;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {}; // Clear environment variables

    // Mock core functions
    core.getInput = jest.fn((name) => {
      switch (name) {
        case 'jira-project-key-regex':
          return '[A-Za-z0-9_-]+';
        case 'jira-base-url':
          return 'https://your-domain.atlassian.net';
        default:
          return '';
      }
    });
    core.info = jest.fn();
    core.setFailed = jest.fn();

    // Mock environment variables
    process.env.GITHUB_TOKEN = 'test-token';

    // Mock Octokit
    mockOctokit = {
      rest: {
        pulls: {
          update: jest.fn().mockResolvedValue({}),
        },
      },
    };
    github.getOctokit.mockReturnValue(mockOctokit);

    // Set up GitHub context
    github.context.payload = {
      pull_request: {
        number: 1,
        title: 'Update README',
        body: 'This is a test PR.',
        head: {
          ref: 'feature/update-readme',
        },
        base: {
          ref: 'main',
        },
      },
    };
    github.context.eventName = 'pull_request';
    github.context.repo = {
      owner: 'test-owner',
      repo: 'test-repo',
    };
  });

  test('Updates PR title and body when Jira issue is found', async () => {
    // Mock the branch name to include a Jira issue
    github.context.payload.pull_request.head.ref = 'TEST-123-feature-update';

    await run();

    // Assertions
    expect(core.info).toHaveBeenCalledWith('Branch name: TEST-123-feature-update');
    expect(core.info).toHaveBeenCalledWith('Extracted Jira Issue: TEST-123');
    expect(core.info).toHaveBeenCalledWith('Current PR title: Update README');
    expect(core.info).toHaveBeenCalledWith('Updating PR title to: TEST-123 Update README');
    expect(core.info).toHaveBeenCalledWith('PR title updated successfully.');
    expect(core.info).toHaveBeenCalledWith('Checking if Jira link is present in the PR body.');
    expect(core.info).toHaveBeenCalledWith('Updating PR body with Jira link.');
    expect(core.info).toHaveBeenCalledWith('PR body updated successfully.');

    // Verify that octokit.rest.pulls.update was called twice
    expect(mockOctokit.rest.pulls.update).toHaveBeenCalledTimes(2);

    // Verify the first call (title update)
    expect(mockOctokit.rest.pulls.update).toHaveBeenNthCalledWith(1, {
      owner: 'test-owner',
      repo: 'test-repo',
      pull_number: 1,
      title: 'TEST-123 Update README',
    });

    // Verify the second call (body update)
    expect(mockOctokit.rest.pulls.update).toHaveBeenNthCalledWith(2, {
      owner: 'test-owner',
      repo: 'test-repo',
      pull_number: 1,
      body:
        'Jira Issue: [TEST-123](https://your-domain.atlassian.net/browse/TEST-123)\n\nThis is a test PR.',
    });
  });

  test('Does not update PR when no Jira issue is found', async () => {
    // Branch name without a Jira issue
    github.context.payload.pull_request.head.ref = 'feature/update-readme';

    await run();

    // Assertions
    expect(core.info).toHaveBeenCalledWith('Branch name: feature/update-readme');
    expect(core.info).toHaveBeenCalledWith('No Jira issue found. Exiting action.');
    // Ensure that octokit.rest.pulls.update was not called
    expect(mockOctokit.rest.pulls.update).not.toHaveBeenCalled();
  });

  test('Does not update PR title when Jira issue is already present', async () => {
    github.context.payload.pull_request.head.ref = 'TEST-123-feature-update';
    github.context.payload.pull_request.title = 'TEST-123 Update README';

    await run();

    // Assertions
    expect(core.info).toHaveBeenCalledWith('Branch name: TEST-123-feature-update');
    expect(core.info).toHaveBeenCalledWith('Extracted Jira Issue: TEST-123');
    expect(core.info).toHaveBeenCalledWith('Current PR title: TEST-123 Update README');
    expect(core.info).toHaveBeenCalledWith('Jira issue already present in the PR title.');
    expect(mockOctokit.rest.pulls.update).toHaveBeenCalledTimes(1); // Only body update

    // Verify that only the body was updated
    expect(mockOctokit.rest.pulls.update).toHaveBeenCalledWith({
      owner: 'test-owner',
      repo: 'test-repo',
      pull_number: 1,
      body:
        'Jira Issue: [TEST-123](https://your-domain.atlassian.net/browse/TEST-123)\n\nThis is a test PR.',
    });
  });

  test('Does not update PR body when Jira link is already present', async () => {
    github.context.payload.pull_request.head.ref = 'TEST-123-feature-update';
    github.context.payload.pull_request.body =
      'Jira Issue: [TEST-123](https://your-domain.atlassian.net/browse/TEST-123)\n\nThis is a test PR.';

    await run();

    // Assertions
    expect(core.info).toHaveBeenCalledWith('Branch name: TEST-123-feature-update');
    expect(core.info).toHaveBeenCalledWith('Extracted Jira Issue: TEST-123');
    expect(core.info).toHaveBeenCalledWith('Current PR title: Update README');
    expect(core.info).toHaveBeenCalledWith('Updating PR title to: TEST-123 Update README');
    expect(core.info).toHaveBeenCalledWith('PR title updated successfully.');
    expect(core.info).toHaveBeenCalledWith('Checking if Jira link is present in the PR body.');
    expect(core.info).toHaveBeenCalledWith('Jira link already present in the PR body.');
    expect(mockOctokit.rest.pulls.update).toHaveBeenCalledTimes(1); // Only title update

    // Verify that only the title was updated
    expect(mockOctokit.rest.pulls.update).toHaveBeenCalledWith({
      owner: 'test-owner',
      repo: 'test-repo',
      pull_number: 1,
      title: 'TEST-123 Update README',
    });
  });

  test('Action is idempotent when run multiple times', async () => {
    github.context.payload.pull_request.head.ref = 'TEST-123-feature-update';
    github.context.payload.pull_request.title = 'TEST-123 Update README';
    github.context.payload.pull_request.body =
      'Jira Issue: [TEST-123](https://your-domain.atlassian.net/browse/TEST-123)\n\nThis is a test PR.';

    await run();

    // Assertions
    expect(core.info).toHaveBeenCalledWith('Branch name: TEST-123-feature-update');
    expect(core.info).toHaveBeenCalledWith('Extracted Jira Issue: TEST-123');
    expect(core.info).toHaveBeenCalledWith('Current PR title: TEST-123 Update README');
    expect(core.info).toHaveBeenCalledWith('Jira issue already present in the PR title.');
    expect(core.info).toHaveBeenCalledWith('Checking if Jira link is present in the PR body.');
    expect(core.info).toHaveBeenCalledWith('Jira link already present in the PR body.');
    expect(mockOctokit.rest.pulls.update).not.toHaveBeenCalled();
  });

  test('Handles PR with empty body', async () => {
    github.context.payload.pull_request.head.ref = 'TEST-123-feature-update';
    github.context.payload.pull_request.body = '';

    await run();

    // Assertions
    expect(core.info).toHaveBeenCalledWith('Branch name: TEST-123-feature-update');
    expect(core.info).toHaveBeenCalledWith('Extracted Jira Issue: TEST-123');
    expect(core.info).toHaveBeenCalledWith('Current PR title: Update README');
    expect(core.info).toHaveBeenCalledWith('Updating PR title to: TEST-123 Update README');
    expect(core.info).toHaveBeenCalledWith('PR title updated successfully.');
    expect(core.info).toHaveBeenCalledWith('Checking if Jira link is present in the PR body.');
    expect(core.info).toHaveBeenCalledWith('Updating PR body with Jira link.');
    expect(core.info).toHaveBeenCalledWith('PR body updated successfully.');
    expect(mockOctokit.rest.pulls.update).toHaveBeenCalledTimes(2);

    // Verify the updates
    expect(mockOctokit.rest.pulls.update).toHaveBeenNthCalledWith(1, {
      owner: 'test-owner',
      repo: 'test-repo',
      pull_number: 1,
      title: 'TEST-123 Update README',
    });

    expect(mockOctokit.rest.pulls.update).toHaveBeenNthCalledWith(2, {
      owner: 'test-owner',
      repo: 'test-repo',
      pull_number: 1,
      body: 'Jira Issue: [TEST-123](https://your-domain.atlassian.net/browse/TEST-123)\n\n',
    });
  });

  test('Does not prepend Jira issue to PR title if it appears elsewhere', async () => {
    github.context.payload.pull_request.head.ref = 'TEST-123-feature-update';
    github.context.payload.pull_request.title = 'Update README for TEST-123';
    github.context.payload.pull_request.body =
      'Jira Issue: [TEST-123](https://your-domain.atlassian.net/browse/TEST-123)\n\nThis is a test PR.';

    await run();

    // Assertions
    expect(core.info).toHaveBeenCalledWith('Branch name: TEST-123-feature-update');
    expect(core.info).toHaveBeenCalledWith('Extracted Jira Issue: TEST-123');
    expect(core.info).toHaveBeenCalledWith('Current PR title: Update README for TEST-123');
    expect(core.info).toHaveBeenCalledWith('Jira issue already present in the PR title.');
    expect(mockOctokit.rest.pulls.update).not.toHaveBeenCalled();})

  test('Handles GitHub API error gracefully', async () => {
    github.context.payload.pull_request.head.ref = 'TEST-123-feature-update';

    // Mock Octokit to throw an error
    mockOctokit.rest.pulls.update.mockRejectedValue(new Error('API Error'));

    await run();

    // Assertions
    expect(core.setFailed).toHaveBeenCalledWith('API Error');
  });

});