const { Octokit } = require('octokit');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.GITHUB_TOKEN || '';
const REPO_COUNT = 10;
const TIME_RANGE = process.env.TIME_RANGE || 'daily';

async function fetchTrendingRepos(timeRange = 'daily') {
  const octokit = new Octokit({
    auth: TOKEN
  });

  try {
    console.log(`Fetching trending repositories for ${timeRange} range...`);

    const startDate = new Date();
    
    switch (timeRange) {
      case 'daily':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'weekly':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'monthly':
        startDate.setDate(startDate.getDate() - 30);
        break;
      default:
        startDate.setDate(startDate.getDate() - 1);
    }
    
    startDate.setHours(7, 0, 0, 0);
    const dateStr = startDate.toISOString();

    const searchQuery = `created:>=${dateStr}`;
    console.log(`Search query: ${searchQuery}`);

    const response = await octokit.rest.search.repos({
      q: searchQuery,
      sort: 'stars',
      order: 'desc',
      per_page: REPO_COUNT
    });

    const repos = [];
    
    for (const item of response.data.items) {
      console.log(`Fetching details for: ${item.full_name}`);
      
      const repoDetails = await octokit.rest.repos.get({
        owner: item.owner.login,
        repo: item.name
      });

      const readmeResponse = await octokit.rest.repos.getReadme({
        owner: item.owner.login,
        repo: item.name
      }).catch(() => null);

      let readmeContent = '';
      if (readmeResponse) {
        const content = Buffer.from(readmeResponse.data.content, 'base64').toString('utf-8');
        readmeContent = content.substring(0, 500);
        readmeContent = readmeContent.replace(/[#*`_]/g, '').replace(/\n/g, ' ').trim();
      }

      repos.push({
        id: item.id,
        name: item.name,
        full_name: item.full_name,
        description: item.description || 'No description available',
        html_url: item.html_url,
        stars: item.stargazers_count,
        language: item.language || 'Unknown',
        owner: {
          login: item.owner.login,
          avatar_url: item.owner.avatar_url
        },
        topics: repoDetails.data.topics || [],
        created_at: item.created_at,
        updated_at: item.updated_at,
        readme_summary: readmeContent,
        watchers: item.watchers_count,
        forks: item.forks_count,
        open_issues: item.open_issues_count
      });
    }

    const today = new Date().toISOString().split('T')[0];
    const outputPath = path.join(__dirname, `../data/trending-${timeRange}-${today}.json`);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(repos, null, 2));

    console.log(`Successfully fetched ${repos.length} repositories`);
    console.log(`Data saved to: ${outputPath}`);

    return repos;
  } catch (error) {
    console.error('Error fetching trending repositories:', error.message);
    throw error;
  }
}

if (require.main === module) {
  const range = process.argv[2] || TIME_RANGE;
  fetchTrendingRepos(range)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { fetchTrendingRepos };
