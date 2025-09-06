export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: number;
  title: string;
  items: string[];
  description: string;
  image_name?: string;
  subtasks?: Subtask[];
}

export interface BoardState {
  selectedTaskId: number | null;
  subtaskStates: Record<number, Record<string, boolean>>;
}
