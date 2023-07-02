import { task } from '../types'

export async function getTasks(): Promise<task[]> {
  const apiUrl = "https://5da4daf857f48b0014fba3e4.mockapi.io/v1/task"
  const response = await fetch(apiUrl);
  const jsonData: task[] = await response.json();
  return jsonData;
}
