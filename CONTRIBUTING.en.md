# Contributing

🌐 [日本語](CONTRIBUTING.md) ・ English

Thank you for contributing to Weapon Lottery.

## Table of Contents

- [Development Environment](#development-environment)

- [Tech Stack](#tech-stack)

- [Requesting Features and Reporting Bugs](#requesting-features-and-reporting-bugs---issues)

- [Pull Request](#pull-request-pr)

- [License](#license)

## Development Environment

- OS: Windows 11 26H2 (Build 26300.9550)

  - Windows Subsystem for Linux (WSL) 2

    - Ubuntu 24.04.4 LTS

- Editor: Visual Studio Code

- Node.js v24

- Bun v1.3.13 (Package Manager)

- Git v2.43.0 via SSH

- Release Please (Release management using GitHub Actions)

## Tech Stack

### Dependencies

- React v19

- Vite v8.3.0

- Tailwind CSS v4.3.3

### DevDependencies

- Biome v2.5.14

- TypeScript v6.0.2


## Requesting Features and Reporting Bugs - Issues

If you would like to request a new feature or report a bug, please create an **[Issue](https://github.com/zibasan/spla3-lottery-weapon/issues/new)**.

Please include the following information in your request or bug report.

### Feature Request

```markdown
- What kind of feature would you like? (Please be specific)
- Why do you think this feature is necessary?
- Specific use cases
```

### Bug Report

```markdown
- Description of the problem

- Steps to reproduce

- Expected behavior

- What is happening instead of the expected behavior

- Browser/OS being used
  - Example:
      OS: Windows 11 26H2 (Build 26300.9550)
      Browser: Google Chrome 154

- Screenshots/screen recordings

- Additional notes (optional)
```

## Pull Request (PR)

If you would like to provide actual code instead of an Issue, please submit a **[Pull Request](https://github.com/zibasan/spla3-lottery-weapon/pulls)**.

When submitting a PR, please **Fork** the repository and follow the steps below.

### Setup

1. **Clone** the forked repository.

```bash
# For HTTPS
git clone https://github.com/your-name/your-cloned-repo/
```

2. **Navigate** to the directory of your forked repository.

```bash
cd your-cloned-repo
```

3. **Install the dependencies.**

> [!IMPORTANT]
> **Bun** is required as the package manager to install the dependencies.
>
> Please refer to the Bun documentation for installation instructions if necessary.

```bash
bun install
```

4. To verify that the dependencies were installed correctly, start the development server.

> [!IMPORTANT]
> **Node.js v24** is required to start the development server.
>
> Please refer to the Node.js documentation for installation instructions if necessary.

```bash
bun run dev
```

5. Make the changes you would like to contribute.

### Submitting a PR

1. Build the project after making your changes.

```bash
bun run build
```

> [!CAUTION]
> If an error occurs during the build, fix the error and run the build again.

2. Run the Biome check.

```bash
bun run check
```

> [!CAUTION]
> If an error occurs during the check, fix the error manually or use the `--fix` option to let Biome fix it.
>
> **Do not use the `--unsafe` option when fixing errors.**

3. Once steps 1 and 2 are complete, commit and push your changes, then create a PR.

### Before Submitting a PR

Please check the following before submitting a PR.

- [ ] The app (development server) starts normally without errors

- [ ] The added or modified features work correctly

- [ ] Existing features are not broken

- [ ] There are no Biome errors

- [ ] README and other documentation have been updated if necessary

### Coding Guidelines

- Follow the existing TypeScript / React code style.

- Reuse existing components and features whenever possible.

- If you are planning to make a major change, please discuss it in an Issue before making the changes.

## License

Contributions to this repository are subject to the [license of this repository](LICENSE).