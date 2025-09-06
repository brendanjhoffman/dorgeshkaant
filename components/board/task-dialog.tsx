"use client";

import { useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Task, Subtask } from "./types";
import Image from "next/image";

interface TaskDialogProps {
  selectedTask: Task | null;
  isOpen: boolean;
  onClose: () => void;
  getSubtasksWithState: (task: Task) => Subtask[];
  toggleSubtaskCompletion: (taskId: number, subtaskId: string) => void;
}

export default function TaskDialog({
  selectedTask,
  isOpen,
  onClose,
  getSubtasksWithState,
  toggleSubtaskCompletion,
}: TaskDialogProps) {
  const imageBaseUrl =
    "https://urwxlaourlithtflocpq.supabase.co/storage/v1/object/public/images/";

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onClose();
      }
    },
    [onClose]
  );

  if (!selectedTask) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl bg-zinc-900 border-yellow-300 border-2">
        <DialogHeader>
          <DialogTitle className="text-xl text-balance pr-4 text-yellow-300">
            {selectedTask.title}
          </DialogTitle>
          <div className="flex">
            <DialogDescription className="text-lg mt-2 text-white">
              {selectedTask.description}
            </DialogDescription>
            <Image
              src={
                selectedTask.image_name
                  ? imageBaseUrl + selectedTask.image_name
                  : "/images/dyz_surprised.png"
              }
              alt={selectedTask.title}
              width={100}
              height={100}
            />
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <h4 className="font-medium mb-3 text-yellow-300">Required Items</h4>
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
                    subtask.completed && "line-through text-muted-foreground"
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
      </DialogContent>
    </Dialog>
  );
}
