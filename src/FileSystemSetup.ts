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
  
  // Build the hierarchy
  jobsFolder.addChild(lockheedFile);
  jobsFolder.addChild(bayerFile);
  jobsFolder.addChild(twoRoadsFile);
  
  root.addChild(jobsFolder);
  root.addChild(projectsFolder);
  root.addChild(academicsFolder);
  
  return root;
}

// Export a singleton instance for the command processor
export const fileSystemRoot = createFileSystem();
