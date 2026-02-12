
export interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  guide?: string[]; // Detailed insights or step-by-step guides
}

export interface Lab {
  title: string;
  tools: string[];
  objective: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tooltip?: string;
}

export interface Project {
  title: string;
  description: string;
  deliverables: string[];
}

export interface TopicResource {
  name: string;
  resources: string[];
  tooltip?: string;
}

export interface Phase {
  id: number;
  month: number;
  title: string;
  focus: string;
  description: string;
  topics: TopicResource[];
  milestones: Milestone[];
  labs: Lab[];
  project: Project;
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
