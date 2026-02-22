const core = require('@actions/core');
const github = require('@actions/github');
const https = require('https');

const ZAI_API_URL = 'https://api.z.ai/api/coding/paas/v4/chat/completions';

async function getChangedFiles(octokit, owner, repo, pullNumber) {
  const { data: files } = await octokit.rest.pulls.listFiles({
    owner,
    repo,
    pull_number: pullNumber,
    per_page: 100,
  });
  return files;
}

function buildPrompt(files) {
  const diffs = files
    .filter(f => f.patch)
    .map(f => `### ${f.filename} (${f.status})\n\`\`\`diff\n${f.patch}\n\`\`\``)
    .join('\n\n');

  return `Please review the following pull request changes and provide concise, constructive feedback. Focus on bugs, logic errors, security issues, and meaningful improvements. Skip trivial style comments.\n\n${diffs}`;
}

function callZaiApi(apiKey, model, prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert code reviewer. Review the provided code changes and give clear, actionable feedback.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const url = new URL(ZAI_API_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.message?.content;
          if (!content) {
            reject(new Error(`Z.ai API returned an empty response: ${data}`));
          } else {
            resolve(content);
          }
        } else {
          reject(new Error(`Z.ai API error ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function run() {
  const apiKey = core.getInput('ZAI_API_KEY', { required: true });
  const model = core.getInput('ZAI_MODEL') || 'glm-4.7';
  const token = core.getInput('GITHUB_TOKEN') || process.env.GITHUB_TOKEN;

  const { context } = github;
  const { owner, repo } = context.repo;
  const pullNumber = context.payload.pull_request?.number;

  if (!pullNumber) {
    core.setFailed('This action only runs on pull_request events.');
    return;
  }

  const octokit = github.getOctokit(token);

  core.info(`Fetching changed files for PR #${pullNumber}...`);
  const files = await getChangedFiles(octokit, owner, repo, pullNumber);

  if (!files.some(f => f.patch)) {
    core.info('No patchable changes found. Skipping review.');
    return;
  }

  const prompt = buildPrompt(files);

  core.info(`Sending ${files.length} file(s) to Z.ai for review...`);
  const review = await callZaiApi(apiKey, model, prompt);

  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: pullNumber,
    body: `## Z.ai Code Review\n\n${review}`,
  });

  core.info('Review posted successfully.');
}

run().catch(err => core.setFailed(err.message));
