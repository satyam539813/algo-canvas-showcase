export interface ArrayElement {
  value: number;
  id: string;
  state: 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot';
}

export interface SortingStep {
  array: ArrayElement[];
  comparing?: number[];
  swapping?: number[];
  pivot?: number;
  description: string;
}

export type SortingAlgorithm = 'bubble' | 'merge';

export interface AlgorithmInfo {
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
}