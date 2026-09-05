export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SkillExperience = '0-6 months' | '1 year' | '2 years' | '3+ years';

export interface ToolCatalogItem {
  id: string;
  name: string;
  synonyms?: string[];
}

export interface SkillCatalogItem {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
  synonyms?: string[];
  suggestedTools?: string[];
  relatedSkills?: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  description?: string;
}

export const skillCategories: SkillCategory[] = [
  { id: 'dev', name: 'Software & Development' },
  { id: 'design', name: 'Design & Creative' },
  { id: 'marketing', name: 'Digital Marketing & Growth' },
  { id: 'data', name: 'Data & AI' },
  { id: 'infra', name: 'Infrastructure & Cloud' },
  { id: 'product', name: 'Product & Project Management' },
  { id: 'content', name: 'Content & Media' },
];

export const skillsCatalog: SkillCatalogItem[] = [
  // DEV
  { id: 'frontend', name: 'Frontend Development', categoryId: 'dev', suggestedTools: ['react', 'vue', 'angular', 'html', 'css'], relatedSkills: ['backend', 'ui_ux'] },
  { id: 'backend', name: 'Backend Development', categoryId: 'dev', suggestedTools: ['node', 'python', 'java', 'go'], relatedSkills: ['frontend', 'database', 'api_design'] },
  { id: 'mobile', name: 'Mobile Development', categoryId: 'dev', suggestedTools: ['flutter', 'react_native', 'swift', 'kotlin'], relatedSkills: ['frontend', 'ui_ux'] },
  { id: 'database', name: 'Database Architecture', categoryId: 'dev', suggestedTools: ['postgres', 'mongo', 'mysql', 'redis'] },
  { id: 'api_design', name: 'API Design & Integration', categoryId: 'dev' },
  { id: 'blockchain', name: 'Blockchain Development', categoryId: 'dev', suggestedTools: ['solidity', 'hardhat', 'web3'] },
  
  // DESIGN
  { id: 'ui_ux', name: 'UI/UX Design', categoryId: 'design', suggestedTools: ['figma', 'xd', 'sketch', 'framer'], relatedSkills: ['frontend', 'user_research', 'graphic_design'] },
  { id: 'graphic_design', name: 'Graphic Design', categoryId: 'design', suggestedTools: ['illustrator', 'photoshop', 'indesign'] },
  { id: 'motion_design', name: 'Motion Design', categoryId: 'design', suggestedTools: ['after_effects', 'c4d'] },
  { id: '3d_design', name: '3D Design', categoryId: 'design', suggestedTools: ['blender', 'maya', 'zbrush'] },
  { id: 'user_research', name: 'User Research', categoryId: 'design' },
  { id: 'design_systems', name: 'Design Systems', categoryId: 'design', suggestedTools: ['figma'] },
  
  // MARKETING
  { id: 'seo', name: 'SEO / Search Engine Optimization', categoryId: 'marketing', synonyms: ['Search Engine Optimization'], suggestedTools: ['ahrefs', 'semrush', 'analytics'] },
  { id: 'content_marketing', name: 'Content Marketing', categoryId: 'marketing', relatedSkills: ['copywriting', 'seo'] },
  { id: 'social_media', name: 'Social Media Strategy', categoryId: 'marketing', relatedSkills: ['community_management'] },
  { id: 'community_management', name: 'Community Management', categoryId: 'marketing', relatedSkills: ['social_media', 'copywriting', 'content_creation'] },
  { id: 'paid_ads', name: 'Paid Advertising', categoryId: 'marketing', synonyms: ['Media Buying'], suggestedTools: ['meta_ads', 'google_ads'] },
  { id: 'growth', name: 'Growth Marketing', categoryId: 'marketing', relatedSkills: ['seo', 'paid_ads', 'data_analysis'] },
  
  // DATA & AI
  { id: 'data_analysis', name: 'Data Analysis', categoryId: 'data', suggestedTools: ['excel', 'sql', 'python', 'tableau'] },
  { id: 'data_science', name: 'Data Science', categoryId: 'data', suggestedTools: ['python', 'pandas', 'tensorflow'] },
  { id: 'data_eng', name: 'Data Engineering', categoryId: 'data', suggestedTools: ['spark', 'airflow', 'snowflake'] },
  { id: 'ai_gen', name: 'Generative AI', categoryId: 'data', synonyms: ['Prompt Engineering'], suggestedTools: ['chatgpt', 'midjourney', 'claude'] },
  { id: 'ml', name: 'Machine Learning', categoryId: 'data' },
  
  // INFRA & CLOUD
  { id: 'cloud_arch', name: 'Cloud Architecture', categoryId: 'infra', suggestedTools: ['aws', 'gcp', 'azure'] },
  { id: 'devops', name: 'DevOps & CI/CD', categoryId: 'infra', suggestedTools: ['docker', 'kubernetes', 'github_actions', 'jenkins'] },
  { id: 'cybersec', name: 'Cybersecurity', categoryId: 'infra', suggestedTools: ['wireshark', 'metasploit'] },
  { id: 'sysadmin', name: 'System Administration', categoryId: 'infra', suggestedTools: ['linux', 'windows_server'] },
  
  // PRODUCT & MANAGEMENT
  { id: 'product_management', name: 'Product Management', categoryId: 'product', suggestedTools: ['jira', 'linear', 'notion'], relatedSkills: ['agile', 'ui_ux'] },
  { id: 'project_management', name: 'Project Management', categoryId: 'product', suggestedTools: ['asana', 'trello', 'clickup'] },
  { id: 'agile', name: 'Agile & Scrum', categoryId: 'product' },
  { id: 'entrepreneurship', name: 'Digital Entrepreneurship', categoryId: 'product' },
  
  // CONTENT & MEDIA
  { id: 'copywriting', name: 'Copywriting', categoryId: 'content', relatedSkills: ['content_marketing', 'seo'] },
  { id: 'web_writing', name: 'Web Writing', categoryId: 'content' },
  { id: 'video_editing', name: 'Video Editing', categoryId: 'content', suggestedTools: ['premiere', 'capcut', 'davinci', 'final_cut'] },
  { id: 'photography', name: 'Photography', categoryId: 'content', suggestedTools: ['lightroom', 'photoshop'] },
  { id: 'content_creation', name: 'Content Creation', categoryId: 'content', relatedSkills: ['video_editing', 'copywriting', 'social_media'] },
];

export const toolsCatalog: ToolCatalogItem[] = [
  // DEV TOOLS
  { id: 'react', name: 'React', synonyms: ['ReactJS', 'React.js'] },
  { id: 'vue', name: 'Vue.js' },
  { id: 'angular', name: 'Angular' },
  { id: 'html', name: 'HTML5' },
  { id: 'css', name: 'CSS3' },
  { id: 'node', name: 'Node.js' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'go', name: 'Go (Golang)' },
  { id: 'flutter', name: 'Flutter' },
  { id: 'react_native', name: 'React Native' },
  { id: 'swift', name: 'Swift' },
  { id: 'kotlin', name: 'Kotlin' },
  { id: 'postgres', name: 'PostgreSQL' },
  { id: 'mongo', name: 'MongoDB' },
  { id: 'mysql', name: 'MySQL' },
  { id: 'redis', name: 'Redis' },
  { id: 'solidity', name: 'Solidity' },
  { id: 'hardhat', name: 'Hardhat' },
  { id: 'web3', name: 'Web3.js' },

  // DESIGN TOOLS
  { id: 'figma', name: 'Figma' },
  { id: 'xd', name: 'Adobe XD' },
  { id: 'sketch', name: 'Sketch' },
  { id: 'framer', name: 'Framer' },
  { id: 'illustrator', name: 'Adobe Illustrator', synonyms: ['Illustrator'] },
  { id: 'photoshop', name: 'Adobe Photoshop', synonyms: ['Photoshop'] },
  { id: 'indesign', name: 'Adobe InDesign', synonyms: ['InDesign'] },
  { id: 'after_effects', name: 'Adobe After Effects', synonyms: ['After Effects', 'AE'] },
  { id: 'c4d', name: 'Cinema 4D' },
  { id: 'blender', name: 'Blender' },
  { id: 'maya', name: 'Maya' },
  { id: 'zbrush', name: 'ZBrush' },

  // MARKETING & MEDIA TOOLS
  { id: 'ahrefs', name: 'Ahrefs' },
  { id: 'semrush', name: 'SEMrush' },
  { id: 'analytics', name: 'Google Analytics' },
  { id: 'meta_ads', name: 'Meta Ads', synonyms: ['Facebook Ads'] },
  { id: 'google_ads', name: 'Google Ads', synonyms: ['AdWords'] },
  { id: 'premiere', name: 'Premiere Pro' },
  { id: 'capcut', name: 'CapCut' },
  { id: 'davinci', name: 'DaVinci Resolve' },
  { id: 'final_cut', name: 'Final Cut Pro' },
  { id: 'lightroom', name: 'Adobe Lightroom' },
  
  // DATA TOOLS
  { id: 'excel', name: 'Microsoft Excel' },
  { id: 'sql', name: 'SQL' },
  { id: 'tableau', name: 'Tableau' },
  { id: 'pandas', name: 'Pandas' },
  { id: 'tensorflow', name: 'TensorFlow' },
  { id: 'spark', name: 'Apache Spark' },
  { id: 'airflow', name: 'Apache Airflow' },
  { id: 'snowflake', name: 'Snowflake' },
  { id: 'chatgpt', name: 'ChatGPT' },
  { id: 'midjourney', name: 'Midjourney' },
  { id: 'claude', name: 'Claude AI' },

  // INFRA & PROJECT TOOLS
  { id: 'aws', name: 'AWS', synonyms: ['Amazon Web Services'] },
  { id: 'gcp', name: 'Google Cloud Platform', synonyms: ['GCP'] },
  { id: 'azure', name: 'Microsoft Azure' },
  { id: 'docker', name: 'Docker' },
  { id: 'kubernetes', name: 'Kubernetes', synonyms: ['K8s'] },
  { id: 'github_actions', name: 'GitHub Actions' },
  { id: 'jenkins', name: 'Jenkins' },
  { id: 'wireshark', name: 'Wireshark' },
  { id: 'metasploit', name: 'Metasploit' },
  { id: 'linux', name: 'Linux' },
  { id: 'windows_server', name: 'Windows Server' },
  { id: 'jira', name: 'Jira' },
  { id: 'linear', name: 'Linear' },
  { id: 'notion', name: 'Notion' },
  { id: 'asana', name: 'Asana' },
  { id: 'trello', name: 'Trello' },
  { id: 'clickup', name: 'ClickUp' },
];
