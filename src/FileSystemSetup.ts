import { Folder, File } from './FileSystem';

export function createFileSystem(): Folder {
  // Create root folder
  const root = new Folder('/');
  
  // Create folders
  const jobsFolder = new Folder('jobs');
  const projectsFolder = new Folder('projects');
  const academicsFolder = new Folder('academics');
  
  // Create job files with real experience content
  const lockheedFile = new File('lockheed.txt', 'LOCKHEED MARTIN - Software Engineering Intern\nLocation: Moorestown, NJ\nDuration: May 2025 - August 2025\n\nKey Accomplishments:\n• Enhanced existing lab debug tool to support semi-automated issue reporting\n• Increased consistency and detail of problem reports, reducing time spent per defect\n• Resolved various bugs and implemented changes for project compliance\n• Worked primarily in Java programming language\n• Led a team of 3 interns to develop hypersonic threat assessment system\n• Used Python and Matlab for threat assessment system development\n• Gained experience in defense/aerospace industry software development');
  const bayerFile = new File('bayer.txt', 'BAYER RADIOLOGY - Software Developer Co-op\nLocation: Pittsburgh, PA\nDuration: May 2024 - November 2024\n\nKey Accomplishments:\n• Implemented real-time motor position verification in embedded contrast injection system\n• Enhanced patient safety through precise control during injection procedures\n• Created and executed embedded C++ and C unit tests for next-generation contrast injector\n• Ensured software accuracy, consistency, and patient safety through comprehensive testing\n• Designed and developed automated build system for hardened product images\n• Significantly reduced build time while improving consistency\n• Prioritized modularity for future process changes and deployment efficiency');
  const twoRoadsFile = new File('two_roads.txt', 'TWO ROADS BREWING - Logistics Team Intern\nLocation: Stratford, CT\nDuration: May 2023 - August 2023\n\nKey Accomplishments:\n• Utilized the SAP suite to conduct loss analysis and track production metrics\n• Executed inventory corrections to maintain accurate stock levels\n• Investigated and analyzed inventory discrepancies to identify inefficiencies\n• Improved forecasting accuracy through systematic analysis\n• Oversaw contract customer order fulfillment operations\n• Ensured trucks were loading in a timely and accurate manner\n• Gained experience in supply chain management and logistics operations');

  // Create project files based on resume
  const rustDistributedFile = new File('rust_distributed_file_sharing.txt', 'RUST DISTRIBUTED FILE SHARING\nDate: April 2025\nLanguages: Rust\n\nProject Overview:\n• Developed a distributed and scalable file distribution system written in Rust\n• Implemented multiple clients and linking servers architecture\n• Focused on synchronization and memory safe programming practices\n• Designed and implemented custom network protocols\n• Emphasized distributed systems principles and concurrent programming\n• Demonstrated expertise in systems programming with Rust');

  const homelabFile = new File('personal_homelab.txt', 'PERSONAL HOMELAB\nDate: September 2019 - Current\nTechnologies: Linux, Virtualization, Docker, WireGuard, Backup Systems\n\nProject Overview:\n• Designed and implemented personal homelab on Linux-based system\n• Leveraged virtualization, Docker containerization, and WireGuard VPN\n• Integrated various backup and cloud storage utilities\n• Maintained and continuously optimized infrastructure for over 7 years\n• Migrated across various platforms while increasing reliability\n• Focused on efficiency, performance optimization, and system administration\n• Demonstrates long-term commitment to infrastructure management');

  const digitalPhoneBoothFile = new File('digital_phone_booth.txt', 'DIGITAL PHONE BOOTH\nDate: August 2022\nLanguages: C#\nCompetition: SkillUSA National Level\n\nProject Overview:\n• Collaborated with multidisciplinary team of 3 to construct digitized phone booth\n• Competed in SkillUSA at the national level\n• Retrofitted authentic rotary phone to function as USB keypad\n• Developed front-end application written in C#\n• Implemented hardware-software integration for vintage phone interface\n• Won Connecticut state competition\n• Showcased project at national level in Atlanta, Georgia\n• Demonstrated teamwork, hardware integration, and competitive programming skills');

  // Create education file
  const educationFile = new File('education.txt', 'EDUCATION\n\nRochester Institute of Technology - Rochester, NY\nBachelor of Science in Software Engineering\nExpected Graduation: May 2026\n\nAcademic Performance:\n• Cumulative GPA: 3.96/4.0\n• Dean\'s List: 2022 - Present\n• Outstanding Undergraduate Scholar (April 2025) - Top 1% of undergraduate class\n\nRelevant Coursework:\n• Analysis of Algorithms\n• Engineering of Software Subsystems\n• Web Engineering\n• Software Project Management\n\nHonors and Organizations:\n• Tau Beta Pi (May 2025 - Present) - New York Pi Chapter\n• Focus on integrity, service, and advancement of engineering\n\nLeadership Experience:\n• Resident Advisor (August 2023 - Present)\n• Overseeing 33 students, shaping campus culture\n• Fostering academic success and managing conflict resolution');
  
  // Build the hierarchy
  jobsFolder.addChild(lockheedFile);
  jobsFolder.addChild(bayerFile);
  jobsFolder.addChild(twoRoadsFile);
  
  projectsFolder.addChild(rustDistributedFile);
  projectsFolder.addChild(homelabFile);
  projectsFolder.addChild(digitalPhoneBoothFile);
  
  academicsFolder.addChild(educationFile);
  
  root.addChild(jobsFolder);
  root.addChild(projectsFolder);
  root.addChild(academicsFolder);
  
  return root;
}

// Export a singleton instance for the command processor
export const fileSystemRoot = createFileSystem();
