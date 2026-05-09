const INDUSTRY_MAPPINGS = {
  'fitness|health|wellness': {
    blogs: [
      { name: 'Healthline', url: 'healthline.com' },
      { name: "Men's Health", url: 'menshealth.com' },
      { name: "Women's Health", url: 'womenshealthmag.com' },
      { name: 'Bodybuilding.com', url: 'bodybuilding.com' },
      { name: 'Nerd Fitness', url: 'nerdfitness.com' },
    ],
    forums: [
      { name: 'r/fitness', url: 'reddit.com/r/fitness' },
      { name: 'r/loseit', url: 'reddit.com/r/loseit' },
      { name: 'Bodybuilding Forums', url: 'forums.bodybuilding.com' },
    ],
    communities: [
      { name: 'MyFitnessPal community', url: 'myfitnesspal.com' },
      { name: 'Strava clubs', url: 'strava.com' },
    ],
    directories: [
      { name: 'Mindbody', url: 'mindbodyonline.com' },
      { name: 'ClassPass', url: 'classpass.com' },
      { name: 'Yelp Health', url: 'yelp.com' },
    ],
    social: ['Instagram', 'TikTok', 'YouTube', 'Pinterest'],
  },
  'technology|software|saas|tech': {
    blogs: [
      { name: 'TechCrunch', url: 'techcrunch.com' },
      { name: 'Dev.to', url: 'dev.to' },
      { name: 'HackerNoon', url: 'hackernoon.com' },
      { name: 'Medium Tech', url: 'medium.com/technology' },
      { name: 'Indie Hackers', url: 'indiehackers.com' },
    ],
    forums: [
      { name: 'r/webdev', url: 'reddit.com/r/webdev' },
      { name: 'r/programming', url: 'reddit.com/r/programming' },
      { name: 'Stack Overflow', url: 'stackoverflow.com' },
      { name: 'Hacker News', url: 'news.ycombinator.com' },
    ],
    communities: [
      { name: 'Product Hunt', url: 'producthunt.com' },
      { name: 'GitHub Discussions', url: 'github.com' },
    ],
    directories: [
      { name: 'G2', url: 'g2.com' },
      { name: 'Capterra', url: 'capterra.com' },
      { name: 'AlternativeTo', url: 'alternativeto.net' },
    ],
    social: ['LinkedIn', 'Twitter/X', 'YouTube', 'Dev.to'],
  },
  'ecommerce|retail|fashion|shopping': {
    blogs: [
      { name: 'Shopify Blog', url: 'shopify.com/blog' },
      { name: 'BigCommerce Blog', url: 'bigcommerce.com/blog' },
      { name: 'Practical Ecommerce', url: 'practicalecommerce.com' },
    ],
    forums: [
      { name: 'r/ecommerce', url: 'reddit.com/r/ecommerce' },
      { name: 'r/dropship', url: 'reddit.com/r/dropship' },
    ],
    communities: [
      { name: 'Shopify Community', url: 'community.shopify.com' },
      { name: 'WooCommerce Community', url: 'woocommerce.com/community' },
    ],
    directories: [
      { name: 'Google Business Profile', url: 'business.google.com' },
      { name: 'Yelp', url: 'yelp.com' },
      { name: 'Trustpilot', url: 'trustpilot.com' },
    ],
    social: ['Instagram', 'Pinterest', 'TikTok', 'Facebook'],
  },
  'finance|fintech|accounting|insurance': {
    blogs: [
      { name: 'Investopedia', url: 'investopedia.com' },
      { name: 'NerdWallet', url: 'nerdwallet.com' },
      { name: 'Bankrate', url: 'bankrate.com' },
    ],
    forums: [
      { name: 'r/personalfinance', url: 'reddit.com/r/personalfinance' },
      { name: 'r/investing', url: 'reddit.com/r/investing' },
    ],
    communities: [
      { name: 'Bogleheads Forum', url: 'bogleheads.org' },
      { name: 'Elite Trader', url: 'elitetrader.com' },
    ],
    directories: [
      { name: 'Clutch', url: 'clutch.co' },
      { name: 'G2', url: 'g2.com' },
      { name: 'Better Business Bureau', url: 'bbb.org' },
    ],
    social: ['LinkedIn', 'Twitter/X', 'YouTube'],
  },
  'marketing|advertising|seo|digital': {
    blogs: [
      { name: 'Moz Blog', url: 'moz.com/blog' },
      { name: 'Search Engine Land', url: 'searchengineland.com' },
      { name: 'Backlinko', url: 'backlinko.com' },
      { name: 'Neil Patel', url: 'neilpatel.com' },
      { name: 'HubSpot Blog', url: 'hubspot.com/blog' },
    ],
    forums: [
      { name: 'r/SEO', url: 'reddit.com/r/SEO' },
      { name: 'r/digital_marketing', url: 'reddit.com/r/digital_marketing' },
      { name: 'BlackHatWorld', url: 'blackhatworld.com' },
    ],
    communities: [
      { name: 'GrowthHackers', url: 'growthhackers.com' },
      { name: 'Online Geniuses Slack', url: 'onlinegeniuses.com' },
    ],
    directories: [
      { name: 'Clutch', url: 'clutch.co' },
      { name: 'G2', url: 'g2.com' },
      { name: 'DesignRush', url: 'designrush.com' },
    ],
    social: ['LinkedIn', 'Twitter/X', 'YouTube'],
  },
  'default': {
    blogs: [
      { name: 'Medium', url: 'medium.com' },
      { name: 'LinkedIn Pulse', url: 'linkedin.com/pulse' },
      { name: 'Substack', url: 'substack.com' },
    ],
    forums: [
      { name: 'Reddit', url: 'reddit.com' },
      { name: 'Quora', url: 'quora.com' },
    ],
    communities: [
      { name: 'Facebook Groups', url: 'facebook.com' },
      { name: 'LinkedIn Groups', url: 'linkedin.com' },
    ],
    directories: [
      { name: 'Google Business Profile', url: 'business.google.com' },
      { name: 'Yelp', url: 'yelp.com' },
      { name: 'Yellow Pages', url: 'yellowpages.com' },
      { name: 'Bing Places', url: 'bingplaces.com' },
    ],
    social: ['LinkedIn', 'Twitter/X', 'Facebook', 'Instagram'],
  },
};

const PLATFORM_GUIDELINES = {
  'reddit.com': "Post in relevant subreddit. Must provide value. No direct promotion. Read subreddit rules first.",
  'linkedin.com': "Professional tone required. Tag relevant people. Use 3-5 hashtags.",
  'medium.com': "Long-form content performs best (1500+ words). Add relevant tags.",
  'directories': "Ensure NAP (Name, Address, Phone) consistency across all listings.",
};

export const getPlatformTargets = (orgData, recommendationType, category) => {
  const industry = (orgData.industry || '').toLowerCase();
  
  let mapping = INDUSTRY_MAPPINGS.default;
  for (const key in INDUSTRY_MAPPINGS) {
    if (key === 'default') continue;
    const regex = new RegExp(key, 'i');
    if (regex.test(industry)) {
      mapping = INDUSTRY_MAPPINGS[key];
      break;
    }
  }

  let selected = [];
  switch (recommendationType) {
    case 'BLOG_COMMENT':
      selected = mapping.blogs.slice(0, 3).map(p => ({ ...p, type: 'blog', submissionType: 'comment' }));
      break;
    case 'FORUM_POST':
      selected = mapping.forums.slice(0, 3).map(p => ({ ...p, type: 'forum', submissionType: 'post' }));
      break;
    case 'SOCIAL_POST':
      selected = mapping.social.slice(0, 3).map(name => ({ name, url: name.toLowerCase() + '.com', type: 'social', submissionType: 'post' }));
      break;
    case 'DIRECTORY_SUBMISSION':
      selected = mapping.directories.map(p => ({ ...p, type: 'directory', submissionType: 'listing' }));
      break;
    case 'OUTREACH_EMAIL':
      selected = [...mapping.blogs, ...mapping.communities].slice(0, 5).map(p => ({ ...p, type: p.url ? 'blog' : 'community', submissionType: 'outreach' }));
      break;
    case 'BLOG_POST_IDEA':
      selected = [...mapping.blogs, ...mapping.communities].slice(0, 3).map(p => ({ ...p, type: 'article', submissionType: 'article' }));
      break;
    default:
      selected = mapping.blogs.slice(0, 1).map(p => ({ ...p, type: 'blog', submissionType: 'article' }));
  }

  return selected.map(p => {
    let guidelines = "Follow platform rules and provide value.";
    for (const domain in PLATFORM_GUIDELINES) {
      if (p.url?.includes(domain)) {
        guidelines = PLATFORM_GUIDELINES[domain];
        break;
      }
    }
    if (p.type === 'directory') guidelines = PLATFORM_GUIDELINES.directories;
    
    return { ...p, guidelines };
  });
};
