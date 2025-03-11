export interface DocContent {
  id: string;
  title: string;
  description: string;
  content: string;
  timeComplexity?: {
    average: string;
    best: string;
    worst: string;
  };
  spaceComplexity?: string;
  applications?: string[];
}