import { task } from '../types'

const apiUrl = "https://5da4daf857f48b0014fba3e4.mockapi.io/v1/task"

export async function getTasks(): Promise<task[]> {
  const response = await fetch(apiUrl);
  const jsonData: task[] = await response.json();
  return jsonData;
}

export async function postTask(newTask: task): Promise<task> {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTask),
  });

  if (!response.ok) {
    throw new Error("Failed to post task");
  }

  const jsonData: task = await response.json();
  return jsonData;
}

export async function updateTask(updatedTask: task): Promise<task> {
  const response = await fetch(`${apiUrl}/${updatedTask.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedTask),
  });

  if (!response.ok) {
    throw new Error("Failed to update task");
  }

  const jsonData: task = await response.json();
  return jsonData;
}

export async function deleteTask(taskId: string): Promise<void> {
  const response = await fetch(`${apiUrl}/${taskId}`, { method: "DELETE" });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
}