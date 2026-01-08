import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { ArrowLeft, Play, Clock, CheckCircle, XCircle, Calendar, User, Settings, Database } from 'lucide-react';

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
    // Auto-refresh if job is running
    const interval = job?.status === 'running' ? setInterval(fetchJob, 2000) : null;
    return () => interval && clearInterval(interval);
  }, [id, job?.status]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'running': return <Play className="h-6 w-6 text-blue-500 animate-pulse" />;
      case 'completed': return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'failed': return <XCircle className="h-6 w-6 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 border-yellow-200';
      case 'running': return 'bg-blue-50 border-blue-200';
      case 'completed': return 'bg-green-50 border-green-200';
      case 'failed': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
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

  const formatPayload = (payload) => {
    if (!payload || Object.keys(payload).length === 0) {
      return 'No additional data';
    }
    return JSON.stringify(payload, null, 2);
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
          <XCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been deleted.</p>
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
              {running ? 'Starting Job...' : 'Run Job Now'}
            </Button>
          )}
        </div>

        {/* Status Card */}
        <Card className={`border-2 ${getStatusColor(job.status)}`}>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getStatusIcon(job.status)}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Job #{job.id}</h1>
                  <p className="text-gray-600">{job.taskName}</p>
                </div>
              </div>
              <Badge variant={job.status} className="text-lg px-4 py-2">
                {job.status.toUpperCase()}
              </Badge>
            </div>
          </Card.Content>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Job Configuration
                </h3>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Task Name</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{job.taskName}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Priority Level</label>
                    <div className="mt-1">
                      <Badge variant={job.priority} className="text-sm px-3 py-1">
                        {job.priority} Priority
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* Payload Data */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Job Data
                </h3>
              </Card.Header>
              <Card.Content>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                    {formatPayload(job.payload)}
                  </pre>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Timeline */}
          <div>
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline
                </h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900">Job Created</p>
                      <p className="text-sm text-gray-500">{formatDate(job.createdAt)}</p>
                    </div>
                  </div>
                  
                  {job.status !== 'pending' && (
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Job Started</p>
                        <p className="text-sm text-gray-500">Processing initiated</p>
                      </div>
                    </div>
                  )}
                  
                  {job.completedAt && (
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                        job.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Job {job.status === 'completed' ? 'Completed' : 'Failed'}
                        </p>
                        <p className="text-sm text-gray-500">{formatDate(job.completedAt)}</p>
                      </div>
                    </div>
                  )}
                  
                  {job.status === 'running' && (
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 animate-pulse"></div>
                      <div>
                        <p className="font-medium text-gray-900">Processing...</p>
                        <p className="text-sm text-gray-500">Job is currently running</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
