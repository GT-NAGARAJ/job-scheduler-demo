import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { ArrowLeft, Play, Clock, CheckCircle, XCircle } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function JobDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const fetchJob = async () => {
    if (!id) return;
    try {
      const response = await fetch(`${API}/jobs/${id}`);
      const data = await response.json();
      setJob(data);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunJob = async () => {
    setRunning(true);
    try {
      await fetch(`${API}/run-job/${id}`, { method: 'POST' });
      fetchJob(); // Refresh job data
    } catch (error) {
      console.error('Error running job:', error);
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'running': return <Play className="h-5 w-5 text-blue-500" />;
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout title={`Job #${id}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout title="Job Not Found">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Job #${job.id}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          
          {job.status === 'pending' && (
            <Button
              onClick={handleRunJob}
              disabled={running}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {running ? 'Running...' : 'Run Job'}
            </Button>
          )}
        </div>

        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Job #{job.id}</h1>
              <div className="flex items-center gap-2">
                {getStatusIcon(job.status)}
                <Badge variant={job.status}>{job.status}</Badge>
              </div>
            </div>
          </Card.Header>
          
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Task Name</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{job.taskName}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Priority</h3>
                  <div className="mt-1">
                    <Badge variant={job.priority}>{job.priority}</Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Created At</h3>
                  <p className="mt-1 text-gray-900">{formatDate(job.createdAt)}</p>
                </div>
                
                {job.completedAt && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Completed At</h3>
                    <p className="mt-1 text-gray-900">{formatDate(job.completedAt)}</p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Payload</h3>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(job.payload, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </Layout>
  );
}
