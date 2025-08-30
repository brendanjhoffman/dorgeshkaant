"use client";

import { useState, useEffect } from "react";
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

export default function TaskGrid({ data }: { data: Task[] }) {
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("completedTasks");
    if (saved) {
      setCompletedTasks(new Set(JSON.parse(saved)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "completedTasks",
      JSON.stringify(Array.from(completedTasks))
    );
  }, [completedTasks]);

  const toggleTaskCompletion = (taskId: number) => {
    setCompletedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const openTaskDialog = (task: Task) => {
    setSelectedTask(task);
  };

  return (
    <div>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {data.map((task) => {
          const isCompleted = completedTasks.has(task.id);

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
          {completedTasks.size} of {data.length} tiles completed
        </p>
      </div>
      <Dialog
        open={!!selectedTask}
        onOpenChange={(open: boolean) => !open && setSelectedTask(null)}
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
