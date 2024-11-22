## Contributing
We welcome contributions to improve the Jira PR Updater GitHub Action. To contribute:

### Development Setup
1. ### Clone the Repository
```bash
git clone https://github.com/your-github-username/update-pr-with-jira.git
cd update-pr-with-jira
```

2. ### Install Dependencies

```bash
npm install
```
3. ### Run Tests

```bash
npm test
```

4. ### Build the Action

```bash
npm run build
```


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
