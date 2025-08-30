"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

interface Task {
  id: number;
  title: string;
  items: string[];
  description: string;
  subtasks?: Subtask[];
}

interface BoardState {
  selectedTaskId: number | null;
  subtaskStates: Record<number, Record<string, boolean>>;
}

export default function TaskGrid({
  data,
  boardId,
}: {
  data: Task[];
  boardId: string;
}) {
  const [boardState, setBoardState] = useState<BoardState>({
    selectedTaskId: null,
    subtaskStates: {},
  });

  // Generate storage key based on board ID
  const storageKey = `board_${boardId}_state`;

  // Load state from localStorage on component mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsedState = JSON.parse(saved);
        setBoardState({
          selectedTaskId: parsedState.selectedTaskId || null,
          subtaskStates: parsedState.subtaskStates || {},
        });
      }
    } catch (error) {
      console.error("Error loading board state from localStorage:", error);
    }
  }, [storageKey]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      const stateToSave = {
        selectedTaskId: boardState.selectedTaskId,
        subtaskStates: boardState.subtaskStates,
      };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Error saving board state to localStorage:", error);
    }
  }, [boardState, storageKey]);

  // Convert items string to subtasks array
  const getSubtasks = useCallback((task: Task): Subtask[] => {
    if (task.subtasks) {
      return task.subtasks;
    }

    // If no subtasks defined, create one from the items field
    const items = task.items.map((item) => item.trim()).filter(Boolean);
    return items.map((item, index) => ({
      id: `${task.id}-${index}`,
      text: item,
      completed: false,
    }));
  }, []);

  // Get subtasks for a specific task with their completion state
  const getSubtasksWithState = useCallback(
    (task: Task): Subtask[] => {
      const subtasks = getSubtasks(task);
      const taskSubtaskStates = boardState.subtaskStates[task.id] || {};

      return subtasks.map((subtask) => ({
        ...subtask,
        completed: taskSubtaskStates[subtask.id] || false,
      }));
    },
    [getSubtasks, boardState.subtaskStates]
  );

  // Check if a task is completed based on its subtasks
  const isTaskCompleted = useCallback(
    (task: Task): boolean => {
      const subtasks = getSubtasksWithState(task);
      return (
        subtasks.length > 0 && subtasks.every((subtask) => subtask.completed)
      );
    },
    [getSubtasksWithState]
  );

  const toggleSubtaskCompletion = useCallback(
    (taskId: number, subtaskId: string) => {
      setBoardState((prev) => {
        const currentTaskStates = prev.subtaskStates[taskId] || {};
        const newTaskStates = {
          ...currentTaskStates,
          [subtaskId]: !currentTaskStates[subtaskId],
        };

        return {
          ...prev,
          subtaskStates: {
            ...prev.subtaskStates,
            [taskId]: newTaskStates,
          },
        };
      });
    },
    []
  );

  const openTaskDialog = useCallback((task: Task) => {
    setBoardState((prev) => ({
      ...prev,
      selectedTaskId: task.id,
    }));
  }, []);

  const closeTaskDialog = useCallback(() => {
    setBoardState((prev) => ({
      ...prev,
      selectedTaskId: null,
    }));
  }, []);

  const selectedTask =
    data.find((task) => task.id === boardState.selectedTaskId) || null;

  const completedTasksCount = data.filter((task) =>
    isTaskCompleted(task)
  ).length;

  return (
    <div>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {data.map((task) => {
          const isCompleted = isTaskCompleted(task);

          return (
            <Card
              key={task.id}
              className={cn(
                "bg-black transition-all duration-200 hover:shadow-lg cursor-pointer border-yellow-300",
                isCompleted && "opacity-75 bg-zinc-600/50"
              )}
              onClick={() => openTaskDialog(task)}
            >
              <CardHeader className="pb-3">
                <div className="flex-1 min-w-0">
                  <CardTitle
                    className={cn(
                      "text-lg leading-tight text-balance text-yellow-300",
                      isCompleted && "line-through text-muted-foreground"
                    )}
                  >
                    {task.title}
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm text-white">
                    {task.items.join(", ")}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-yellow-300">
          {completedTasksCount} of {data.length} tiles completed
        </p>
      </div>

      <Dialog
        open={!!selectedTask}
        onOpenChange={(open: boolean) => !open && closeTaskDialog()}
      >
        <DialogContent className="max-w-2xl bg-zinc-900 border-yellow-300 border-2">
          {selectedTask && (
            <>
              <DialogHeader>
                <div className="flex-1">
                  <DialogTitle className="text-xl text-balance pr-4 text-yellow-300">
                    {selectedTask.title}
                  </DialogTitle>
                  <DialogDescription className="mt-2 text-white">
                    {selectedTask.items.join(", ")}
                  </DialogDescription>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-yellow-300">Details</h4>
                  <p className="text-sm text-white text-pretty leading-relaxed">
                    {selectedTask.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-yellow-300">Subtasks</h4>
                  <div className="space-y-2">
                    {getSubtasksWithState(selectedTask).map((subtask) => (
                      <div
                        key={subtask.id}
                        className="flex items-center space-x-3 p-2 rounded-md bg-zinc-800/50"
                      >
                        <Checkbox
                          checked={subtask.completed}
                          onCheckedChange={() =>
                            toggleSubtaskCompletion(selectedTask.id, subtask.id)
                          }
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label
                          className={cn(
                            "text-sm text-white cursor-pointer flex-1",
                            subtask.completed &&
                              "line-through text-muted-foreground"
                          )}
                          onClick={() =>
                            toggleSubtaskCompletion(selectedTask.id, subtask.id)
                          }
                        >
                          {subtask.text}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
