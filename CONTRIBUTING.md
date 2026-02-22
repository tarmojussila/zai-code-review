# Contributing to Z.ai Code Review

Thank you for your interest in contributing!

## Issues and pull requests

If you have suggestions for improvements, you can contribute by opening an issue. If you'd like to introduce changes to the project, see the instructions below.

## Project structure

```
src/index.js      # Action source code
dist/index.js     # Compiled bundle (used by the runner)
action.yml        # Action metadata and input definitions
```

The action runs from `dist/index.js`, which is a self-contained bundle built from `src/index.js` using [`@vercel/ncc`](https://github.com/vercel/ncc).

## Development setup

**Prerequisites:** Node.js 20+

```bash
git clone https://github.com/tarmojussila/zai-code-review.git
cd zai-code-review
npm install
```

## Making changes

Edit `src/index.js`, then rebuild the bundle:

```bash
npm run build
```

**The `dist/` directory must be committed.** The GitHub Actions runner executes `dist/index.js` directly — it does not run `npm install` or build steps.

## Submitting a pull request

1. Fork the repository and create a branch from `main`
2. Make your changes in `src/index.js`
3. Run `npm run build` and commit both `src/` and `dist/` changes
4. Open a pull request against `main`

Please keep PRs focused — one fix or feature per PR.

## Releases

Releases are tagged using semantic versioning (e.g. `v0.1.1`). After a PR is merged to `main`, a maintainer will tag the release.

Users reference the action by tag in their workflows, so the `dist/index.js` and `action.yml` at the tagged commit are what gets executed.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
