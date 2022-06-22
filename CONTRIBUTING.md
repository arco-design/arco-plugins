
> English | [简体中文](./CONTRIBUTING.zh-CN.md)
# Contributing

Thank you for taking your time to contribute and make this project better! Here are some guidelines to help you get started. Please make sure to take a moment and read through them before submitting your contributions.

## Code of Conduct

This project is governed by the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to adhere to it.

## Open Development

All work happens directly on GitHub. Both core team members and external contributors send pull requests which go through the same review process.

## Semantic Versioning

This project follows semantic versioning. We release patch versions for bug fixes or other changes that do not change the behavior of the API, minor versions for new features that are backward-compatible, and major versions for any breaking changes.

Every significant change is documented in the changelog file.

## Reporting Issues

We use [Github issues](https://github.com/arco-design/arco-plugins/issues) for bug reports and feature requests. Before reporting an issue, please make sure you have searched for similar [issues](https://github.com/arco-design/arco-plugins/issues) as they may have been already answered or being fixed. A new issue should be submitted via [issue helper](https://arco.design/issue-helper?repo=arco-plugins). For bug reporting, please include the minimum code that can be used to reproduce the problem. For feature request, please specify what changes you want and what behavior you expect.

## Sending a pull request

1. Fork [the repository](https://github.com/arco-design/arco-plugins) and create your branch from `main`. For new feature, please submit your changes directly to the `feature` branch. Other changes should go against `main` branch.
2. Use `npm install -g` to install basic packages such as `lerna` and `yarn`.
3. Use `yarn install` to install the dependencies of each package in `workspaces` (If you encounter a `YN0018` error, you can use `YARN_CHECKSUM_BEHAVIOR=update yarn` to install).
4. Make changes to the codebase. Please add tests if applicable.
5. Commit your changes, adhering to the [Commit Guidelines](#commit-guidelines)
6. Open a new pull request, [referencing corresponding issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword) if available.

## Commit Guidelines

Commit messages are required to follow the [conventional-changelog standard](https://www.conventionalcommits.org/en/v1.0.0/):

```bash
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit types

The following is a list of commit types:

- feat: A new feature or functionality
- fix: A bug fix
- docs: Documentation only changes
- style: Code formatting or component style changes
- refactor: Code changes that neither fixes a bug nor adds a feature.
- perf: Improve performance.
- test: Add missing or correct existing tests.
- chore: Other commits that don’t modify src or test files.

## License

By contributing your code to the repository, you agree to license your contribution under the [MIT license](./LICENSE).
