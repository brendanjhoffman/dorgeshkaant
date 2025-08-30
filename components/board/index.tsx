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

interface Task {
  id: number;
  title: string;
  items: string;
  description: string;
}

interface BoardState {
  completedTasks: Set<number>;
  selectedTaskId: number | null;
}

export default function TaskGrid({
  data,
  boardId,
}: {
  data: Task[];
  boardId: string;
}) {
  const [boardState, setBoardState] = useState<BoardState>({
    completedTasks: new Set(),
    selectedTaskId: null,
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
          completedTasks: new Set(parsedState.completedTasks || []),
          selectedTaskId: parsedState.selectedTaskId || null,
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
        completedTasks: Array.from(boardState.completedTasks),
        selectedTaskId: boardState.selectedTaskId,
      };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Error saving board state to localStorage:", error);
    }
  }, [boardState, storageKey]);

  const toggleTaskCompletion = useCallback((taskId: number) => {
    setBoardState((prev) => {
      const newCompletedTasks = new Set(prev.completedTasks);
      if (newCompletedTasks.has(taskId)) {
        newCompletedTasks.delete(taskId);
      } else {
        newCompletedTasks.add(taskId);
      }
      return {
        ...prev,
        completedTasks: newCompletedTasks,
      };
    });
  }, []);

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

  return (
    <div>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {data.map((task) => {
          const isCompleted = boardState.completedTasks.has(task.id);

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
                <div className="flex items-start justify-between gap-3">
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
                      {task.items}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Checkbox
                      checked={isCompleted}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                        e.stopPropagation()
                      }
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      aria-label={`Mark "${task.title}" as ${
                        isCompleted ? "incomplete" : "complete"
                      }`}
                    />
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-yellow-300">
          {boardState.completedTasks.size} of {data.length} tiles completed
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
                    {selectedTask.items}
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
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
