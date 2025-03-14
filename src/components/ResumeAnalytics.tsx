import React from 'react';
import { BarChart3, Download, Eye } from 'lucide-react';

interface ResumeAnalyticsProps {
  data: {
    views: number;
    downloads: number;
    viewsByDay: { date: string; count: number }[];
    downloadsByDay: { date: string; count: number }[];
    topLocation: string;
    averageViewTime: string;
  };
}

const ResumeAnalytics: React.FC<ResumeAnalyticsProps> = ({ data }) => {
  // In a real application, this would be fetched from an analytics API
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BarChart3 className="text-blue-500" />
          Resume Analytics
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="text-blue-500" />
            <h3 className="font-medium">Total Views</h3>
          </div>
          <p className="text-3xl font-bold">{data.views}</p>
          <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Download className="text-green-500" />
            <h3 className="font-medium">Total Downloads</h3>
          </div>
          <p className="text-3xl font-bold">{data.downloads}</p>
          <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-2">View Trend</h3>
        <div className="h-20 flex items-end space-x-1">
          {data.viewsByDay.map((day, index) => (
            <div 
              key={index} 
              className="bg-blue-400 w-full" 
              style={{ 
                height: `${Math.max((day.count / Math.max(...data.viewsByDay.map(d => d.count))) * 100, 5)}%`,
              }}
              title={`${day.date}: ${day.count} views`}
            ></div>
          ))}
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>{data.viewsByDay[0].date}</span>
          <span>{data.viewsByDay[data.viewsByDay.length - 1].date}</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Download Trend</h3>
        <div className="h-20 flex items-end space-x-1">
          {data.downloadsByDay.map((day, index) => (
            <div 
              key={index} 
              className="bg-green-400 w-full" 
              style={{ 
                height: `${Math.max((day.count / Math.max(...data.downloadsByDay.map(d => d.count))) * 100, 5)}%`,
              }}
              title={`${day.date}: ${day.count} downloads`}
            ></div>
          ))}
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>{data.downloadsByDay[0].date}</span>
          <span>{data.downloadsByDay[data.downloadsByDay.length - 1].date}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium mb-2">Top Location</h3>
          <p className="text-lg">{data.topLocation}</p>
        </div>
        <div>
          <h3 className="font-medium mb-2">Average View Time</h3>
          <p className="text-lg">{data.averageViewTime}</p>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalytics; 