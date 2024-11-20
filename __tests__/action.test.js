// __tests__/action.test.js

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

describe('Action Tests', () => {
  let mockOctokit;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

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
          ref: 'LIBTREATDB-84-feature-update',
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

  test('Runs action with a valid Jira issue', async () => {
    await run();

    // Verify that octokit.rest.pulls.update was called twice
    expect(mockOctokit.rest.pulls.update).toHaveBeenCalledTimes(2);
  });
});
