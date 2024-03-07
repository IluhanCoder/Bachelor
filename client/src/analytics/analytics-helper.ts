import { TasksAnalyticsResponse } from "./analytics-types";

export function convertArray(inputArray: TasksAnalyticsResponse[]) {
    return inputArray.map((value: TasksAnalyticsResponse) => ({
      name: `${value.day ? `${value.day}/`:""}${value.month}${value.year ? `/${value.year}`:""}`,
      uv: value.amount
    }));
  }