/* Content for the inner pages, taken from the live AccioJob Job Preparation Hub. */
const CDN = 'https://d2ufls9ug2ki79.cloudfront.net';

const LOGOS = {
  TCS: `${CDN}/uploaded/1782382815666-TCSLogo.webp`,
  Wipro: `${CDN}/uploaded/1783952910600-wiproIcon.png`,
  Infosys: `${CDN}/uploaded/1784100144785-InfosysLogo.png`,
  Cognizant: `${CDN}/uploaded/1784198843107-cognizantLogo.jpg`,
  Capgemini: `${CDN}/uploaded/1784198927628-capgeminiIcon.jpg`,
  'HCL Tech': `${CDN}/uploaded/1784719957935-HCL%20BLUE%20LOGO.png`,
  Accenture: `${CDN}/uploaded/1784186660159-Accenture.svg`,
  Microsoft: `${CDN}/uploaded/1782929200555-Microsoft.webp`,
  Amazon: `${CDN}/accio-assets/hiring-partner/amazon.webp`,
  Google: `${CDN}/uploaded/1782988589319-Google.webp`,
  Flipkart: `${CDN}/uploaded/1783953238219-flipkart-com-logo.png`,
  Paytm: `${CDN}/uploaded/1784017392392-paytmIcon.png`,
  Razorpay: `${CDN}/uploaded/1784100380642-razorpay-icon.png`,
  Swiggy: `${CDN}/uploaded/1784018628841-swiggyIcon.webp`,
};

const COMPANY_GROUPS = [
  { name: 'IT Services', icon: 'i-building' },
  { name: 'Consulting & Analytics', icon: 'i-graph' },
  { name: 'MNCs', icon: 'i-layers' },
  { name: 'Startups & Unicorns', icon: 'i-trend' },
];

// [group, company, role, tag1, tag2, extraCount, slug]
const COMPANIES = [
  ['IT Services', 'TCS', 'Software Developer', 'Aptitude', 'Coding', 3, 'tcs-software-developer'],
  ['IT Services', 'Wipro', 'Software Engineer – Elite NTH / Elite Turbo', 'Aptitude', 'OOPs', 4, 'wipro-software-engineer'],
  ['IT Services', 'Infosys', 'Specialist Programmer (SP L1/L2/L3)', 'Competitive Programming DSA', 'DP & Graphs', 4, 'infosys-specialist-programmer'],
  ['IT Services', 'Infosys', 'Systems Engineer', 'Aptitude', 'Pseudo Code', 4, 'infosys-systems-engineer'],
  ['IT Services', 'Infosys', 'Digital Specialist Engineer (DSE)', 'DSA (DP, Graphs, Trees)', 'OOPs', 4, 'infosys-digital-specialist-engineer'],
  ['IT Services', 'Cognizant', 'GenC / GenC Elevate / GenC Next (Programmer Analyst Trainee)', 'Versant Communication Test', 'Aptitude & Game-Based Reasoning', 4, 'cognizant-genc'],
  ['IT Services', 'Capgemini', 'Analyst Trainee / Associate Consultant Trainee / Junior Analyst (Exceller Programme)', 'Pseudocode Analysis', 'Game-Based Aptitude', 4, 'capgemini-analyst-trainee'],
  ['IT Services', 'HCL Tech', 'Graduate Engineer Trainee (GET)', 'Quantitative Aptitude', 'Pseudocode', 4, 'hcltech-graduate-engineer-trainee'],
  ['Consulting & Analytics', 'Accenture', 'Associate Software Engineer', 'Cognitive Aptitude', 'Pseudocode', 4, 'accenture-associate-software-engineer'],
  ['Consulting & Analytics', 'Accenture', 'Business & Technology Analyst', 'Cognitive Aptitude', 'Pseudocode', 4, 'accenture-business-technology-analyst'],
  ['MNCs', 'Microsoft', 'Software Engineer I (SWE-1)', 'DSA', 'Growth Mindset', 4, 'microsoft-software-engineer'],
  ['MNCs', 'Amazon', 'Software Development Engineer I (SDE-1)', 'DSA', 'Leadership Principles', 4, 'amazon-sde-1'],
  ['MNCs', 'Google', 'Software Engineer L3 (New Grad / SWE)', 'DSA', 'Graphs', 4, 'google-software-engineer-l3'],
  ['Startups & Unicorns', 'Flipkart', 'Data Analyst / Business Analyst', 'SQL', 'Excel', 4, 'flipkart-data-analyst'],
  ['Startups & Unicorns', 'Paytm', 'Data Analyst', 'SQL', 'Window Functions', 4, 'paytm-data-analyst'],
  ['Startups & Unicorns', 'Razorpay', 'Software Development Engineer (SDE-1)', 'Machine Coding (LLD)', 'Design Patterns', 4, 'razorpay-sde-1'],
  ['Startups & Unicorns', 'Flipkart', 'Software Development Engineer I (SDE-1)', 'DSA', 'OOPs', 4, 'flipkart-sde-1'],
  ['Startups & Unicorns', 'Paytm', 'Software Engineer', 'DSA', 'Java Collections', 4, 'paytm-software-engineer'],
  ['Startups & Unicorns', 'Swiggy', 'Software Development Engineer (SDE-1)', 'DSA', 'Machine Coding (LLD)', 4, 'swiggy-sde-1'],
].map(([group, name, role, t1, t2, more, slug]) => ({ group, name, role, tags: [t1, t2], more, slug, logo: LOGOS[name] }));

// Colours match the live role cards
const ROLES = [
  { slug: 'backend', name: 'Backend Developer', icon: 'i-database', bg: '#f0fdf9', bd: '#ccfbef', tile: '#0e9384', skills: ['Core Java', 'DBMS', 'DSA'], more: 2, track: 'Java or Python', count: 5 },
  { slug: 'fullstack', name: 'Full-Stack Developer', icon: 'i-layers', bg: '#eff8ff', bd: '#d1e9ff', tile: '#2f80ed', skills: ['Core Java', 'Spring & REST APIs', 'DBMS'], more: 3, track: 'Java or MERN', count: 6 },
  { slug: 'frontend', name: 'Frontend Developer', icon: 'i-layout', bg: '#f4f3ff', bd: '#ebe9fe', tile: '#6938ef', skills: ['HTML & CSS', 'JavaScript & ES6+', 'React'], more: 3, count: 6 },
  { slug: 'analyst', name: 'Data Analyst', icon: 'i-chart', bg: '#edfcf2', bd: '#d3f8df', tile: '#099250', skills: ['Excel', 'SQL', 'Power BI'], more: 2, count: 5 },
  { slug: 'scientist', name: 'Data Scientist', icon: 'i-brain', bg: '#eef4ff', bd: '#e0eaff', tile: '#444ce7', skills: ['Python', 'Statistics', 'Machine Learning'], more: 3, count: 6 },
  { slug: 'engineer', name: 'Data Engineer', icon: 'i-database', bg: '#f9fafb', bd: '#eaecf0', tile: '#475467', skills: ['Python', 'SQL & Data Modeling', 'Big Data (Spark)'], more: 2, count: 5 },
  { slug: 'qa', name: 'QA Engineer', icon: 'i-bug', bg: '#fefbe8', bd: '#fef7c3', tile: '#ca8504', skills: ['Testing Fundamentals', 'Selenium & Automation', 'SQL'], more: 2, track: 'Automation or Manual', count: 5 },
];

const SKILL_CATS = {
  'Data Analytics': { bg: '#edfcf2', bd: '#d3f8df', tile: '#099250', icon: 'i-chart' },
  'CS Fundamentals': { bg: '#eef4ff', bd: '#e0eaff', tile: '#444ce7', icon: 'i-cpu' },
  Frontend: { bg: '#eff4ff', bd: '#dbe6fe', tile: '#2563eb', icon: 'i-layout' },
  'OOPs + SQL': { bg: '#fff6ed', bd: '#ffead5', tile: '#e04f16', icon: 'i-cube' },
  Aptitude: { bg: '#fff1f3', bd: '#ffe4e8', tile: '#e31b54', icon: 'i-brain' },
  DSA: { bg: '#f4f3ff', bd: '#ebe9fe', tile: '#6938ef', icon: 'i-code' },
  Backend: { bg: '#f0fdf9', bd: '#ccfbef', tile: '#0e9384', icon: 'i-database' },
  Communication: { bg: '#fefbe8', bd: '#fef7c3', tile: '#ca8504', icon: 'i-chat' },
};

// Skill drills — topics, levels, durations and test format from the live site.
// levels: [levelName|null, minutes, format]
const MCQ = 'Multiple-Choice Questions', CODE = 'Coding Problems', PSEUDO = 'Pseudo-Code', AI = 'AI Interview',
  SUBJ = 'Subjective Questions', SQLQ = 'SQL Queries', VOICE = 'Voice Based Questions';
const SKILLS = [
  ['Python', 'Data Analytics', ['Data Types', 'Control Flow', 'Functions', 'Pandas'], [[null, 87, [MCQ, CODE]]]],
  ['Computer Networking', 'CS Fundamentals', ['OSI Model', 'TCP/IP', 'HTTP & DNS', 'Routing'], [[null, 44, [MCQ, SUBJ]]]],
  ['CSS', 'Frontend', ['CSS Selectors', 'CSS Grid Layout', 'Flexbox', 'Responsive Design'], [[null, 59, [MCQ, PSEUDO]]]],
  ['Redux', 'Frontend', ['Store & Reducers', 'Actions & Dispatch', 'Middleware', 'Selectors'], [[null, 69, [MCQ, CODE, PSEUDO, AI]]]],
  ['OOPs in Java', 'OOPs + SQL', ['Classes & Objects', 'Inheritance', 'Polymorphism', 'Encapsulation'], [[null, 69, [MCQ, CODE, PSEUDO, AI]]]],
  ['HTML', 'Frontend', ['HTML Essentials', 'Forms & Inputs', 'Semantic HTML', 'HTML Accessibility'], [[null, 59, [MCQ, PSEUDO, AI]]]],
  ['DBMS + SQL', 'OOPs + SQL', ['ER Models', 'Normalization', 'Transactions', 'Indexing'], [[null, 36, [MCQ, SQLQ, AI]]]],
  ['Advanced Statistics', 'Data Analytics', ['Probability', 'Distributions', 'Hypothesis Testing', 'Regression'], [[null, 44, [MCQ, SUBJ, AI]]]],
  ['Aptitude', 'Aptitude', ['Quantitative', 'Logical Reasoning', 'Verbal Ability', 'Data Interpretation'], [[null, 30, [MCQ]]]],
  ['JavaScript', 'Frontend', ['Arrays and Functions', 'Strings in JS', 'Objects', 'Closures', 'Promises', 'Async/Await', 'DOM Manipulation', 'Events', 'ES6+ Features', 'Error Handling', 'Prototypes', 'Modules'],
    [['Basics', 35, [MCQ, CODE, PSEUDO, AI]], ['Development', 126, [MCQ, CODE, PSEUDO]], ['Advanced', 113, [MCQ, CODE, PSEUDO, AI]]]],
  ['DSA', 'DSA', ['Time Complexity', 'Arrays', 'Strings', 'Linked Lists', 'Stacks', 'Queues', 'Recursion', 'Sorting', 'Searching', 'Hashing', 'Trees', 'Graphs', 'Dynamic Programming', 'Greedy', 'Backtracking', 'Heaps'],
    [['Basic', 51, [MCQ, CODE]], ['Intro', 78, [MCQ, CODE, AI]], ['Intermediate', 103, [MCQ, CODE, AI]], ['Advanced', 104, [MCQ, CODE, AI]]]],
  ['Node & Express Fundamentals', 'Backend', ['HTTP & Routing', 'Middleware', 'REST APIs', 'Error Handling'], [[null, 63, [MCQ, CODE, SUBJ, AI]]]],
  ['Operating Systems', 'CS Fundamentals', ['Processes', 'Threads', 'Memory Management', 'Scheduling'], [[null, 44, [MCQ, SUBJ, AI]]]],
  ['SQL', 'Data Analytics', ['SELECT & Filtering', 'Joins', 'Aggregations', 'Subqueries'], [[null, 36, [MCQ, SQLQ, AI]]]],
  ['React', 'Frontend', ['Components & Props', 'State & Hooks', 'Context API', 'React Router'], [[null, 69, [MCQ, CODE, PSEUDO, AI]]]],
  ['Power BI', 'Data Analytics', ['Data Modeling', 'DAX Basics', 'Visualizations', 'Power Query'], [[null, 59, [MCQ, PSEUDO, AI]]]],
  ['Advanced Backend Concepts', 'Backend', ['Authentication', 'Caching', 'Rate Limiting', 'Message Queues'], [[null, 68, [MCQ, CODE, SUBJ]]]],
  ['Excel', 'Data Analytics', ['Formulas & Functions', 'Pivot Tables', 'Charts', 'Data Cleaning'], [[null, 59, [MCQ, PSEUDO]]]],
  ['English Proficiency', 'Communication', ['Oral communication', 'Listening skills'], [[null, 26, [VOICE]]]],
].map(([name, cat, topics, levels]) => ({
  name, cat, topics, topic: topics[0], more: topics.length - 1,
  levels: levels.map(([level, minutes, format]) => ({ level, minutes, format })),
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
}));

// Role readiness tests — track -> [testName, minutes, structure, skillsTested]
const APT = ['Aptitude', 30, '20 MCQs', ['Quantitative', 'Logical reasoning', 'Verbal ability', 'Data interpretation']];
const DSA_T = ['DSA', 69, '6 MCQs · 3 coding questions', ['Arrays & Strings', 'Trees', 'Graphs', 'Dynamic programming']];
const DBMS_T = ['DBMS + SQL', 36, '12 MCQs · 3 query questions', ['Joins', 'Normalization', 'Indexing', 'Transactions']];
const SQL_T = ['SQL', 36, '8 MCQs · 4 query questions', ['SELECT & filtering', 'Joins', 'Aggregations', 'Subqueries']];
const REACT_T = ['React', 43, '10 MCQs · 2 pseudo-code · 1 subjective', ['Components & props', 'State & hooks', 'Context', 'Routing']];
const JS_T = ['JavaScript & ES6+', 38, '12 MCQs · 2 pseudo-code', ['Closures', 'Promises', 'Async / await', 'DOM']];
const JAVA_T = ['Core Java & OOP', 55, '10 MCQs · 1 coding · 2 pseudo-code', ['OOP principles', 'Collections', 'Exceptions', 'Generics']];
const PY_T = ['Python', 38, '12 MCQs · 2 pseudo-code', ['Data types', 'Control flow', 'Functions', 'Pandas']];
const STATS_T = ['Statistics & Probability', 32, '16 MCQs · 1 subjective', ['Probability', 'Distributions', 'Hypothesis testing', 'Regression']];
const QA_FUND = ['Testing Fundamentals', 30, '20 MCQs', ['SDLC & STLC', 'Test types', 'Bug lifecycle', 'Severity vs priority']];

const ROLE_TESTS = {
  backend: {
    Python: [['Core Python & OOP', 55, '10 MCQs · 1 coding · 2 pseudo-code', ['OOP principles', 'Data structures', 'Exceptions', 'Modules']], DBMS_T, DSA_T,
      ['Django/Flask & Backend', 43, '10 MCQs · 2 pseudo-code · 1 subjective', ['REST APIs', 'Authentication', 'Caching', 'ORMs']], APT],
    Java: [JAVA_T, DBMS_T, DSA_T,
      ['Spring & Backend Concepts', 43, '10 MCQs · 2 pseudo-code · 1 subjective', ['REST APIs', 'Authentication', 'Caching', 'Rate limiting']], APT],
  },
  fullstack: {
    Java: [JAVA_T, ['Spring & REST APIs', 58, '10 MCQs · 2 pseudo-code · 1 subjective', ['Controllers', 'REST design', 'Auth', 'Validation']], DBMS_T, DSA_T, REACT_T, APT],
    MERN: [JS_T, ['Node & Express', 43, '10 MCQs · 2 pseudo-code · 1 subjective', ['HTTP & routing', 'Middleware', 'REST APIs', 'Error handling']],
      ['MongoDB', 46, '10 MCQs · 1 pseudo-code · 1 subjective', ['Documents', 'CRUD', 'Aggregation', 'Indexing']], REACT_T, DSA_T, APT],
  },
  frontend: {
    default: [['HTML & CSS', 44, '12 MCQs · 1 pseudo-code build task', ['Semantic HTML', 'Flexbox & grid', 'Responsive design', 'Accessibility']], JS_T, REACT_T, DSA_T, DBMS_T, APT],
  },
  analyst: {
    default: [['Excel', 41, '14 MCQs · 2 pseudo-code tasks', ['Formulas & functions', 'Pivot tables', 'Charts', 'Data cleaning']], SQL_T,
      ['Power BI', 28, '12 MCQs · 1 pseudo-code dashboard task', ['Data modeling', 'DAX basics', 'Visualizations', 'Power Query']], STATS_T, APT],
  },
  scientist: {
    default: [PY_T, STATS_T, ['Machine Learning', 29, '14 MCQs · 1 subjective', ['Supervised learning', 'Model evaluation', 'Feature engineering', 'Overfitting']], SQL_T, DSA_T, APT],
  },
  engineer: {
    default: [PY_T, ['SQL & Data Modeling', 33, '10 MCQs · 3 query questions', ['Schema design', 'Joins', 'Window functions', 'Partitioning']],
      ['Big Data (Spark)', 26, '12 MCQs · 1 subjective', ['Spark basics', 'RDDs & DataFrames', 'ETL pipelines', 'Batch vs streaming']], DBMS_T, APT],
  },
  qa: {
    Automation: [QA_FUND, ['Selenium & Automation', 38, '12 MCQs · 2 pseudo-code', ['Locators', 'WebDriver', 'Waits', 'Frameworks']], SQL_T, DSA_T, APT],
    Manual: [QA_FUND, ['Test Case Design', 34, '12 MCQs · 2 subjective', ['Equivalence partitioning', 'Boundary values', 'Test scenarios', 'Traceability']], SQL_T, DBMS_T, APT],
  },
};

// Icon for a test, picked from its name
const testIcon = (name) => {
  const n = name.toLowerCase();
  if (/dsa|algorithm/.test(n)) return 'i-code';
  if (/sql|dbms|mongo|data model/.test(n)) return 'i-database';
  if (/aptitude/.test(n)) return 'i-brain';
  if (/react|html|css|javascript|node/.test(n)) return 'i-layout';
  if (/excel|power bi|statistic/.test(n)) return 'i-chart';
  if (/machine|spark/.test(n)) return 'i-cpu';
  if (/test|selenium/.test(n)) return 'i-bug';
  if (/oop|java|python/.test(n)) return 'i-cube';
  return 'i-layers';
};

/* ---------- Full handbook: TCS Software Developer ----------
   Block types are rendered by company.js */
const HANDBOOKS = {
  'tcs-software-developer': {
    title: 'TCS Software Developer Interview Preparation Kit 2026',
    tracks: 'Ninja / Digital / Prime',
    tags: ['Aptitude', 'Coding', 'OOP', 'DBMS & SQL', 'Verbal'],
    meta: [['i-building', "India's largest IT services · Tata Group"], ['i-pin', 'Pan-India · 150+ global locations'], ['i-cash', '3.36–12 LPA · 3 hiring tracks']],
    test: { questions: 67, minutes: '~120', mix: '20 numerical, 20 reasoning, 25 verbal & 2 coding questions.', difficulty: '50% easy, 35% medium, 15% hard.', covers: ['Numerical', 'Reasoning', 'Verbal', 'Coding'] },
    aiPoints: ['The code you wrote in the test', 'Core CS concepts — OOP, DBMS, OS', 'The projects on your resume'],
    sections: [
      {
        nav: 'Company Snapshot', title: 'About TCS — Company Overview & Culture',
        blocks: [
          { p: "Tata Consultancy Services is <b>India's largest IT services company</b> and a flagship member of the Tata Group — recognized globally as one of the world's leading IT services, consulting, and business solutions organizations." },
          { p: 'TCS provides IT consulting, application development, infrastructure management, BPO, cloud computing, digital transformation, and AI/ML solutions across banking, healthcare, retail, and manufacturing. For freshers the culture means <b>professional development, global project exposure, and a strong emphasis on continuous learning, teamwork, and adaptability</b> over rote specialisation.' },
          { stats: [['Founded', '1968 ·', 'Tata Group'], ['Revenue', '$30B+', 'FY26'], ['Listed', 'Public', 'since 2004'], ['Industry', 'IT Services', '& Consulting']] },
        ],
      },
      {
        nav: 'The Role & Hiring Tracks', title: 'TCS Hiring Tracks — Ninja, Digital & Prime',
        blocks: [
          { p: "As a Software Developer you design, build, and maintain scalable software applications for clients across industries — writing clean code in Java, C++, Python, or C#, working with SQL databases, and shipping inside Agile teams. You'll debug, test, and troubleshoot across domains like banking, healthcare, retail, and manufacturing." },
          { chips: { title: 'Core skills that actually get tested', items: ['OOP concepts (critical)', 'Data Structures & Algorithms', 'DBMS & SQL', 'A language (Java / C++ / Python)', 'Operating Systems', 'Computer Networks', 'Problem-solving & Analytical thinking', 'Communication & Teamwork'] } },
          { tracks: { title: 'Three tracks via TCS NQT', items: [
            ['Ninja', '₹3.36', 'Entry level', 'Clear fundamentals — aptitude, OOP, and basic coding. Foundation section only.'],
            ['Digital', '₹7–8', 'Higher skill', 'Strong DSA plus the Advanced coding section — 2 problems in 30–40 min.'],
            ['Prime', '₹9–12', 'Advanced', 'Top advanced scores with stronger DSA and system design thinking.'],
          ] } },
          { callout: ['The hiring bar', 'TCS rewards clarity of concepts, honest communication, and practical problem-solving over rote memorisation. Digital/Prime roles require higher Advanced section scores and stronger DSA skills.'] },
        ],
      },
      {
        nav: 'Hiring Process Map', title: 'TCS Interview Process 2026 — All 4 Rounds Explained',
        blocks: [
          { p: 'A structured four-stage process that runs <b>3–8 weeks</b> from application to offer. Interviewers are generally supportive — honesty about knowledge gaps is valued over bluffing.' },
          { rounds: [
            ['Online Assessment', '90–120 min', 'TCS iON platform · aptitude + coding'],
            ['Technical Interview', '25–40 min', 'OOP, DSA, DBMS, OS, Networks · resume deep-dive'],
            ['Managerial Round', '15–25 min', 'Behavioural · communication · sometimes merged with Round 2'],
            ['HR Interview', '10–20 min', 'Personality fit · relocation · document verification'],
          ] },
          { pills: [['i-star', '<b>Glassdoor 2.8/5</b> · Moderate'], ['i-clock', '<b>3–8 weeks</b> end-to-end'], ['i-check', '<b>4 rounds</b>']] },
          { callout: ['What actually matters', "Questions are <b>heavily resume-focused</b> — expect deep dives into every project and skill you list. For freshers: generally easy to moderate if basics are clear. Honesty about what you don't know beats bluffing, every time."] },
        ],
      },
      {
        nav: 'Round 1 · Online Assessment', title: 'Round 1: TCS NQT Online Assessment — Pattern & Strategy',
        blocks: [
          { p: 'A 90–120 minute test on <b>TCS iON</b>, split into Foundation (all candidates) and Advanced (Digital / Prime). Each section has its own separate timer. Ninja requires lower scores; Digital/Prime require higher Advanced section scores.' },
          { pills: [['i-clock', '90–120 min'], ['i-monitor', 'TCS iON platform'], ['i-gauge', 'Easy–Medium difficulty']] },
          { table: { head: ['Section', 'Questions', 'Time'], groups: [
            ['Foundation · All candidates', [['Numerical Ability', '20', '25 min'], ['Reasoning Ability', '20', '25 min'], ['Verbal Ability', '25', '25 min']]],
            ['Advanced · Digital / Prime', [['Advanced Quantitative', '15–20', '—'], ['Advanced Reasoning', '15–20', '—'], ['Advanced Coding', '2', '30–40 min']]],
          ] } },
          { topics: [
            ['Numerical Ability', '20 Q · 25 min', ['Percentages & ratios', 'Time & work, pipes & cisterns', 'Speed, distance & time', 'Number systems & HCF/LCM', 'Profit, loss & interest']],
            ['Reasoning Ability', '20 Q · 25 min', ['Blood relations', 'Seating arrangement', 'Coding-decoding', 'Data sufficiency', 'Pattern & series', 'Arrangements & directions']],
            ['Verbal Ability', '25 Q · 25 min', ['Reading comprehension', 'Grammar & error spotting', 'Sentence completion', 'Synonyms & antonyms']],
            ['Strategy', 'tips', ["Each section has its own separate timer — don't get stuck on one question", 'Attempt all questions — no harsh negative marking', 'Bank easy wins first, flag difficult ones and return', 'Advanced section determines Digital / Prime selection', 'Manage time carefully — attempt as many as possible even if unsure']],
          ] },
          { topics: [
            ['Coding — Foundation + Advanced', '2 Q · 30–40 min', ['Find largest / smallest element in array', 'Find second largest element in array', 'Reverse an array / a string', 'Sum or product problems on arrays', 'Check whether a string is a palindrome', 'Character frequency in a string', 'Pattern matching in strings', 'Bubble sort / selection sort implementation', 'Calculate factorial of a number', 'Check if a number is prime', 'Generate the Fibonacci sequence', 'Digit manipulation problems', 'Longest common subsequence (DP, medium)', 'Sum of odd vs even position digits of a ≤100-digit number', 'Basic stack, queue, linked-list operations (Digital/Prime)'], true],
          ] },
          { tip: 'Practice easy–medium LeetCode + arrays/strings cold. Know sorting algorithms. For Digital/Prime, the Advanced Coding section is the track differentiator. Don\'t overlook the timer — attempt all questions even if unsure.' },
          { cta: 'This is the pattern. Practice it under time pressure - test similar to the actual company test.' },
        ],
      },
      {
        nav: 'Round 2 · Technical Interview', title: 'Round 2: TCS Technical Interview — OOP, DSA, SQL & OS Questions',
        blocks: [
          { p: 'A 25–40 minute interview (Microsoft Teams or in-person) starting with resume/projects, then moving through CS fundamentals. <b>OOP is always asked</b> — be ready to explain the four pillars with real examples. Interviewers are generally friendly. Ninja: easy-moderate; Digital/Prime: medium.' },
          { pills: [['i-clock', '25–40 min'], ['i-monitor', 'Microsoft Teams / in-person'], ['i-code', '60+ questions across 6 topics']] },
          { topics: [
            ['Resume & Introduction', '5–10 min', ['Tell me about yourself', 'Walk me through your final year project — tech, architecture, your role', 'Explain your internship projects and the technologies used', 'What challenges did you face in this project?', 'Questions on GitHub: push code, fork, pull requests, contribute to a repo']],
            ['DSA & Coding', '12 questions', ['What is time complexity? Explain Big-O notation', 'Difference between array and linked list', 'What is a stack vs queue?', 'What is a linked list? Types of linked lists?', 'Explain binary tree and its traversals', 'How does binary search work?', 'What is a hash table? How does hashing work?', 'What is a sorting algorithm? Explain bubble sort', 'Write a program to calculate factorial', 'Write a program to reverse a string', 'Write a program to find the largest element in an array', 'Write a program to implement bubble sort']],
            ['OOP & Languages', '18 questions', ['What are the four pillars of OOP? (Encapsulation, Inheritance, Polymorphism, Abstraction)', 'Explain encapsulation with a real-world example', 'Difference between abstraction and encapsulation', 'What is polymorphism? Types of polymorphism?', 'Difference between method overloading and method overriding', 'What is inheritance? Types of inheritance?', 'Can you create objects of an abstract class?', 'Difference between abstract class and interface (Java)', 'What is a pointer? Explain memory allocation — stack vs heap (C/C++)', 'Difference between list, tuple, and dictionary (Python)', 'What are mutable vs immutable data types? (Python)', 'What is garbage collection in Java?', 'Difference between String, StringBuilder, and StringBuffer (Java)', 'Explain constructor and its types', 'What is operator overloading? (C++)', 'Difference between compiler and interpreter', 'What is recursion? Give an example', 'Difference between call by value and call by reference']],
            ['DBMS & SQL', '10 questions', ['Write a SQL query to find the nth highest salary (very common!)', 'Difference between WHERE and HAVING clause', 'What is a JOIN? Types of JOINs (INNER, LEFT, RIGHT, FULL)', 'Explain primary key vs foreign key vs unique key', 'What is normalization? Explain 1NF, 2NF, 3NF', 'ACID properties of transactions', 'What is indexing in databases?', 'Difference between DELETE, DROP, and TRUNCATE', 'What is a stored procedure?']],
            ['OS & Networks', '10 questions', ['Difference between process and thread', 'Explain deadlock and how to prevent it', 'What is virtual memory and paging?', 'What is a semaphore?', 'Types of CPU scheduling algorithms', 'Explain the OSI model and its layers', 'Difference between TCP and UDP', 'What is HTTP vs HTTPS?', 'What happens when you type a URL in the browser?', 'Difference between IPv4 and IPv6']],
          ] },
          { tip: "Master OOP — it's always asked. Prepare to deep-dive every project on your resume. Practice writing code on paper/whiteboard without an IDE. Brush up on SQL (nth highest salary), ACID properties, and JOIN types. Be honest if you don't know something." },
        ],
      },
      {
        nav: 'Round 3 · Managerial Round', title: 'Round 3: TCS Managerial Round — Behavioural Questions & STAR Method',
        blocks: [
          { p: '15–25 minutes, often merged with the technical round, conducted by a Manager or Team Lead. Use the <b>STAR method</b> (Situation, Task, Action, Result) to structure every answer. Focus on communication, teamwork, problem-solving, and adaptability. Difficulty is moderate — honesty and self-awareness matter most.' },
          { pills: [['i-clock', '15–25 min'], ['i-user', 'Manager / Team Lead'], ['i-star', 'STAR method answers']] },
          { star: [
            ['S', 'Situation', 'Set the scene — what was the context, when, and where? Give just enough background.'],
            ['T', 'Task', 'What was your specific responsibility or challenge in that situation?'],
            ['A', 'Action', 'What steps did you take? Use "I" not "we." This is the most important part.'],
            ['R', 'Result', 'What happened? Quantify if possible ("improved by X%"). What did you learn?'],
          ] },
          { topics: [
            ['Situational & Behavioural', '13 questions', ['Tell me about a time you faced a challenging situation. How did you handle it?', 'Describe a project where you worked in a team. What was your role?', 'Tell me about a time you had to meet a tight deadline', 'How do you handle conflicts with team members?', 'Describe a situation where you failed. What did you learn?', 'How do you prioritize tasks when faced with multiple deadlines?', 'Tell me about a time you had to adapt to a significant change', "If you're assigned a task you've never done before, how would you approach it?", 'How would you handle a situation where your code is causing problems in production?', "What would you do if you disagree with your manager's technical decision?", 'How do you handle stress and pressure?', 'Do you prefer working independently or in a team? Why?', 'What motivates you?']],
            ['Self-reflection & Goals', '8 questions', ['What are your strengths and weaknesses?', 'How do you plan to improve your weaknesses?', 'What has been the worst situation in your life? How did you overcome it?', 'Where do you see yourself in 5 years?', 'What are your short-term and long-term career goals?', 'Why did you choose software development?', 'What did you do during the pandemic at home?', 'How was your technical interview?']],
            ['Creative & Pressure', '2 questions', ['Tell me a story about this water bottle (tests creativity & communication — focus on storytelling, not a perfect answer)', 'Sell me this pen']],
          ] },
          { tip: 'Prepare STAR-method responses for common behavioral questions. Show self-awareness and a positive attitude — demonstrate enthusiasm for learning and teamwork. Practice storytelling: make your answers engaging and concise.' },
        ],
      },
      {
        nav: 'Round 4 · HR & Documents', title: 'Round 4: TCS HR Interview — Questions, Documents & Final Tips',
        blocks: [
          { p: 'A 10–20 minute interview by HR personnel assessing personality fit, career aspirations, relocation willingness, and commitment. Also includes document verification. Easy difficulty — focus on confidence, honesty, and enthusiasm. Always prepare 1–2 questions to ask the interviewer.' },
          { pills: [['i-clock', '10–20 min'], ['i-user', 'HR personnel'], ['i-file', 'Easy · Document verification']] },
          { topics: [
            ['Self-introduction & Background', '8 questions', ['Tell me about yourself (professional summary)', 'Tell me about your family background', 'What are your hobbies and interests?', 'Have you participated in any extracurricular activities?', 'Tell me about your achievements', 'Did you participate in TCS competitions like CodeVita?', 'What are your strengths and weaknesses?', 'Have you ever experienced failure? Tell me about that experience.']],
            ['Company Knowledge & Motivation', '8 questions', ['Why do you want to join TCS? (mention: global exposure, learning, innovation, work culture)', 'Why should we hire you?', 'What do you know about TCS? (Founded 1968, Tata Group, $30B+ revenue, IT consulting / BPO / digital transformation)', 'Why do you want to work in IT/software development?', 'What is your preferred programming language and why?', 'Who is the CEO of TCS?', 'Difference between a service-based and a product-based company?', 'Do you have any other job offers? When can you join?']],
            ['Flexibility & Commitment', '7 questions', ['Are you willing to relocate? (Generally expected: yes)', 'Are you open to working in any location TCS assigns?', 'Can you work in any shift including night shifts for international clients?', 'Are you comfortable travelling for project requirements?', 'Are you ready to sign a service agreement / bond?', 'What are your salary expectations?', 'Do you have any questions for us? (Always prepare 1–2 thoughtful questions)']],
          ] },
          { docs: [['10th Marksheet', 'Original + photocopy'], ['12th Marksheet', 'Original + photocopy'], ['Degree Marksheets', 'All semesters, original + copy'], ['Government ID', 'Aadhaar / PAN / Passport'], ['College ID Card', 'Carry the original'], ['Resume', '3 clean printed copies'], ['Passport-size Photos', '4–6 recent copies'], ['TCS Offer Letter', 'Print + carry original'], ['Experience Letters', 'Internship / work, if any'], ['Bank Account Details', 'For offer processing']] },
          { tip: 'Research TCS thoroughly — know the company history, services, and values. Always say yes to relocation unless you have genuine constraints. Understand the service agreement / bond period. Prepare 1–2 thoughtful questions to ask the interviewer — it shows genuine interest. Dress professionally, be punctual, and never lie about skills or experiences.' },
        ],
      },
    ],
    sources: ['GeeksforGeeks', 'AmbitionBox', 'InterviewQuery', 'Unstop', 'PrepInsta', 'Reddit', 'Medium', 'YouTube', 'Glassdoor', 'JobAaj Learnings'],
    faq: [
      ['How many rounds are in the TCS interview process?', 'Four: the NQT online assessment, a technical interview, a managerial round (sometimes merged with the technical round), and an HR interview with document verification. End to end it takes 3–8 weeks.'],
      ['What is the TCS NQT exam pattern?', 'A 90–120 minute test on TCS iON. Foundation (all candidates): Numerical 20 Q, Reasoning 20 Q, Verbal 25 Q, 25 min each. Advanced (Digital / Prime): Advanced Quant, Advanced Reasoning and 2 coding problems in 30–40 min. Each section has its own timer.'],
      ['What is the difference between TCS Ninja, Digital, and Prime?', 'They are three hiring tracks from the same NQT. Ninja (₹3.36 LPA) needs only the Foundation section. Digital (₹7–8 LPA) needs strong Advanced coding. Prime (₹9–12 LPA) needs top Advanced scores plus stronger DSA and system design thinking.'],
      ['Is the TCS interview easy for freshers?', 'Generally easy to moderate if your basics are clear. Ninja interviews are easy–moderate; Digital/Prime are medium. Questions are heavily resume-focused, and honesty about gaps is valued over bluffing.'],
      ['What questions are asked in the TCS technical interview?', 'Resume and project deep-dives, the four pillars of OOP, DSA basics (arrays, linked lists, trees, sorting), SQL (nth highest salary, JOINs, normalization, ACID), and OS & networking fundamentals (process vs thread, deadlock, OSI, TCP vs UDP).'],
      ['Who is the current CEO of TCS?', 'K. Krithivasan has been CEO and MD of TCS since June 2023. Check TCS’s official website before your interview in case leadership has changed.'],
      ['What documents should I carry to the TCS interview?', '10th, 12th and all degree marksheets (originals + copies), a government ID, your college ID, 3 printed resumes, 4–6 passport photos, your offer letter if issued, any experience letters, and bank account details.'],
    ],
  },
};

const SAMPLE_REPORT = {
  verdict: 'Almost there',
  headline: ['Almost there — a few ', 'answers need work'],
  summary: 'Your project knowledge and technical depth are solid—you explain ML concepts well and backed up most claims. Heavy filler speech and occasional vagueness on implementation details hold you back from ready.',
  oneLine: 'Strong knowledge, needs cleaner delivery and more specifics.',
  score: 62,
  scoreNote: 'You stay calm and own your projects well. Work on answering in a clear order: what you did, how, and the result, without restarting sentences.',
  metrics: [
    ['Speaking pace', null, 62, 'You speak quickly with lots of pausing and restart mid-sentence.'],
    ['Filler words', '47 filler words in 15 minutes 1 second', 34, "High filler density: ~3.1 per minute. 'So', 'uh', 'basically' dominate."],
    ['How clearly you explained', null, 58, 'Ideas are there but buried under restarts and filler; hard to follow at times.'],
  ],
  tip: "Record yourself explaining one project and remove every 'so', 'basically', 'uh' you can. Pause instead.",
  areas: [
    ['Introduction', 'i-user', 1, "You gave a solid overview of the DRDO internship pipeline architecture. You named all key components and explained the flow, though you didn't lead with your role or impact numbers upfront."],
    ['Projects', 'i-folder', 6, "You explained three projects with real detail: the lip-sync delay fix (3.45-second constant), the data augmentation strategy for plant disease detection, and the RAG system's hybrid re-ranking. One follow-up on choosing augmentations lacked clarity on automation."],
    ['Experience', 'i-briefcase', 1, 'You explained your DRDO internship role across multiple questions with concrete numbers: 1,000 articles per week, 25 broadcasts per hour, 30% latency reduction. Leadership of twelve interns and Agile process management came through clearly.'],
    ['Skills', 'i-code', 2, 'You defended your Python advanced claim by explaining NumPy vectorization in clear terms with concrete examples. You explained the 100-element array loop example, batching logic, and when to use parallel vs. batch operations.'],
  ],
  fixes: [
    ["Stop saying 'basically', 'so', and 'uh' when you pause. Replace them with silence or a breath.", 'You use 47 fillers in 15 minutes (3+ per minute). It makes you sound less confident and buries your strong ideas.'],
    ['Always lead with your role and impact numbers when describing a project. Say them first, not last.', "You often bury key details mid-answer. Start with '1,000 articles/week, 25 broadcasts/hour, leading 12 interns' to hook the interviewer immediately."],
    ['When claiming a resume metric like 20% precision improvement, explain how you measured it during the same answer without being asked.', 'The interviewer had to ask follow-up questions for proof of your RAG precision gain. Lead with the benchmark and method upfront.'],
  ],
};
