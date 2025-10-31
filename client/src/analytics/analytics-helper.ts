import { TasksAnalyticsResponse } from "./analytics-types";

export function convertArray(inputArray: TasksAnalyticsResponse[]) {
    return inputArray.map((value: TasksAnalyticsResponse) => {
        // Format month name
        const monthNames = ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'];
        const monthName = monthNames[value.month];
        
        // Format based on whether it's daily or monthly
        let name = '';
        if (value.day) {
            // Daily format: "1 Січ"
            name = `${value.day} ${monthName}`;
        } else if (value.year) {
            // Monthly format: "Січ 2025"
            name = `${monthName} ${value.year}`;
        } else {
            // Fallback
            name = `${monthName}`;
        }
        
        return {
            name,
            uv: Math.round(value.amount * 100) / 100 // Round to 2 decimals
        };
    });
}