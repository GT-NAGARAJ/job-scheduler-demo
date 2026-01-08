import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import JobForm from '../components/JobForm';
import JobTable from '../components/JobTable';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async (statusFilter = '', priorityFilter = '') => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (priorityFilter) params.set('priority', priorityFilter);
      
      const response = await fetch(`${API}/jobs?${params.toString()}`);
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobRun = async (jobId) => {
    try {
      await fetch(`${API}/run-job/${jobId}`, { method: 'POST' });
      fetchJobs(); // Refresh jobs after running
    } catch (error) {
      console.error('Error running job:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <JobForm onJobCreated={() => fetchJobs()} />
        <JobTable 
          jobs={jobs} 
          onJobRun={handleJobRun}
          onRefresh={fetchJobs}
        />
      </div>
    </Layout>
  );
}
