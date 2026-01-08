import { useState } from 'react';
import Link from 'next/link';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { Select } from './ui/Form';
import { Play, RefreshCw, Filter, Eye } from 'lucide-react';

const JobTable = ({ jobs, onJobRun, onRefresh }) => {
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh?.(statusFilter, priorityFilter);
    setIsRefreshing(false);
  };

  const handleFilterChange = (type, value) => {
    if (type === 'status') {
      setStatusFilter(value);
    } else {
      setPriorityFilter(value);
    }
    onRefresh?.(type === 'status' ? value : statusFilter, type === 'priority' ? value : priorityFilter);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Jobs Dashboard</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select
              value={statusFilter}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-32"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </Select>
          </div>
          
          <Select
            value={priorityFilter}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="w-32"
          >
            <option value="">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </Select>
        </div>
      </Card.Header>
      
      <Card.Content className="p-0">
        {jobs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No jobs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{job.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/job/${job.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                        {job.taskName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={job.priority}>{job.priority}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={job.status}>{job.status}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(job.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link href={`/job/${job.id}`}>
                        <Button variant="outline" size="sm" className="inline-flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                      </Link>
                      {job.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => onJobRun?.(job.id)}
                          className="inline-flex items-center gap-1"
                        >
                          <Play className="h-3 w-3" />
                          Run
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default JobTable;