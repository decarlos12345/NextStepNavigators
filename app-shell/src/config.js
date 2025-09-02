

const config = {
  schema_encryption_key: process.env.SCHEMA_ENCRYPTION_KEY || '',

  project_uuid: '3d2af730-e4ed-4d2c-a312-49e3a162c4d4',
  flHost: process.env.NODE_ENV === 'production' ? 'https://flatlogic.com/projects' : 'http://localhost:3000/projects',

  gitea_domain: process.env.GITEA_DOMAIN || 'gitea.flatlogic.app',
  gitea_username: process.env.GITEA_USERNAME || 'admin',
  gitea_api_token: process.env.GITEA_API_TOKEN || null,
  github_repo_url: process.env.GITHUB_REPO_URL || null,
  github_token: process.env.GITHUB_TOKEN || null,
};

module.exports = config;
