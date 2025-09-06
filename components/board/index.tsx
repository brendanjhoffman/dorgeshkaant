"use client";

import { useState, useEffect, useCallback } from "react";
import { Task, Subtask, BoardState } from "./types";
import Tile from "./tile";
import TaskDialog from "./task-dialog";

export default function TaskGrid({
  data,
  boardId,
}: {
  data: Task[];
  boardId: string;
}) {
  // Generate storage key based on board ID
  const storageKey = `board_${boardId}_state`;
  const saved = localStorage.getItem(storageKey);
  const parsedState = JSON.parse(saved || "{}") as BoardState;
  const [boardState, setBoardState] = useState<BoardState>({
    selectedTaskId: parsedState.selectedTaskId || null,
    subtaskStates: parsedState.subtaskStates || {},
  });

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
    <div className="">
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 text-center justify-items-center">
        {data.map((task) => {
          const isCompleted = isTaskCompleted(task);
          const subtasksWithState = getSubtasksWithState(task);

          return (
            <Tile
              key={task.id}
              task={task}
              isCompleted={isCompleted}
              subtasksWithState={subtasksWithState}
              onTaskClick={openTaskDialog}
            />
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-yellow-300">
          {completedTasksCount} of {data.length} tiles completed
        </p>
      </div>

      <TaskDialog
        selectedTask={selectedTask}
        isOpen={!!selectedTask}
        onClose={closeTaskDialog}
        getSubtasksWithState={getSubtasksWithState}
        toggleSubtaskCompletion={toggleSubtaskCompletion}
      />
    </div>
  );
}
