"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Task, Subtask } from "./types";
import Image from "next/image";

interface TileProps {
  task: Task;
  isCompleted: boolean;
  subtasksWithState: Subtask[];
  onTaskClick: (task: Task) => void;
}

const imageBaseUrl =
  "https://urwxlaourlithtflocpq.supabase.co/storage/v1/object/public/images/";

export default function Tile({
  task,
  isCompleted,
  subtasksWithState,
  onTaskClick,
}: TileProps) {
  return (
    <Card
      className={cn(isCompleted && "opacity-75 bg-zinc-600/50")}
      onClick={() => onTaskClick(task)}
    >
      <CardHeader>
        <CardTitle
          className={cn(
            "text-xl leading-tight text-balance text-yellow-300",
            isCompleted && "text-yellow-500"
          )}
        >
          {task.title}
        </CardTitle>
        <CardDescription className="mt-1">
          <Image
            src={
              task.image_name
                ? imageBaseUrl + task.image_name
                : "/images/dyz_surprised.png"
            }
            alt={task.title}
            width={100}
            height={100}
            className={cn("mx-auto", isCompleted && "opacity-75")}
          />
        </CardDescription>
        <div className="text-xs text-yellow-300/70 mt-2">
          {subtasksWithState.filter((subtask) => subtask.completed).length}/
          {subtasksWithState.length}
        </div>
      </CardHeader>
    </Card>
  );
}
