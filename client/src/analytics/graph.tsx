import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { TasksAnalyticsResponse } from "./analytics-types";

import "react-datepicker/dist/react-datepicker.css";

import { registerLocale } from "react-datepicker";
import {uk} from "date-fns/locale/uk";
registerLocale("ua", uk);

interface LocalParams {
  name: string;
  data: any[];
  color?: string;
  type?: 'line' | 'area';
}

const AnalyticsGraph = (params: LocalParams) => {
  const { data, name, color = "#667eea", type = 'area' } = params;

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="text-center">
          <span className="text-4xl mb-2 block">📊</span>
          <p>No data to display</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-lg shadow-lg border-2 border-gray-200">
          <p className="font-semibold text-gray-800 mb-1">{label}</p>
          <p className="text-blue-600 font-medium">
            {name}: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  if (type === 'area') {
    return (
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id={`color${name}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="uv"
            stroke={color}
            strokeWidth={3}
            fillOpacity={1}
            fill={`url(#color${name})`}
            name={name}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="name" 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="circle"
        />
        <Line
          type="monotone"
          dataKey="uv"
          name={name}
          stroke={color}
          strokeWidth={3}
          dot={{ fill: color, r: 5 }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AnalyticsGraph;