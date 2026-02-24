# Z.ai Code Review

AI-powered GitHub Pull Request code review using Z.ai models. Automatic PR comments, bug detection, and improvement suggestions via GitHub Actions.

## Features

- 🚀 Detect bugs
- 🔍 Suggest improvements
- 🧠 AI-driven PR feedback
- ⚡ Works with GitHub Actions

## Quickstart

Add this to your `.github/workflows/code-review.yml`:

```yaml
name: AI Code Review with Z.ai

on:
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    name: Review
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Code Review
        uses: tarmojussila/zai-code-review@v0.2.0
        with:
          ZAI_API_KEY: ${{ secrets.ZAI_API_KEY }}
```

## Inputs

| Input | Required | Default | Description |
|---|---|---|---|
| `ZAI_API_KEY` | Yes | — | Your Z.ai API key |
| `ZAI_MODEL` | No | `glm-4.7` | Z.ai model to use for review |
| `ZAI_SYSTEM_PROMPT` | No | See below | Custom system prompt for the AI reviewer |

The default system prompt is:

> You are an expert code reviewer. Review the provided code changes and give clear, actionable feedback.

You can override it to focus on specific concerns, enforce coding standards, or adjust the review tone, e.g.:

> You are a security-focused code reviewer. Identify vulnerabilities, unsafe patterns, and authentication issues. Skip style comments.

## Configuration

To use this action, you must add your Z.ai API key as a GitHub secret.

### 1️⃣ Get your Z.ai API key

Generate an API key from your Z.ai dashboard.

### 2️⃣ Add the API key to your repository

1. Go to your GitHub repository  
2. Click **Settings**  
3. Navigate to **Secrets and variables → Actions**  
4. Click **New repository secret** and add:

   - **Name:** `ZAI_API_KEY` — **Value:** your Z.ai API key

## Advanced configuration

Instead of using default values for `ZAI_MODEL` and `ZAI_SYSTEM_PROMPT`, you can override them, and manage them as GitHub Actions variables. This lets you update the model or review prompt without touching the workflow file.

### 1️⃣ Add the variables to your repository

1. Go to your GitHub repository
2. Click **Settings**
3. Navigate to **Secrets and variables → Actions**
4. Click the **Variables** tab
5. Click **New repository variable** and add:

   - **Name:** `ZAI_MODEL` — **Value:** e.g. `glm-4.7`
   - **Name:** `ZAI_SYSTEM_PROMPT` — **Value:** your custom system prompt

### 2️⃣ Reference them in your workflow

```yaml
      - name: Code Review
        uses: tarmojussila/zai-code-review@v0.2.0
        with:
          ZAI_API_KEY: ${{ secrets.ZAI_API_KEY }}
          ZAI_MODEL: ${{ vars.ZAI_MODEL }}
          ZAI_SYSTEM_PROMPT: ${{ vars.ZAI_SYSTEM_PROMPT }}
```

## Contributing

Contributions are welcome. See the [CONTRIBUTING](CONTRIBUTING.md) file for more information.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
