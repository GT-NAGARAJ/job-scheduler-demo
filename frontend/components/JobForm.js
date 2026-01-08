import { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { Input, Textarea, Select, Label } from './ui/Form';
import { Plus } from 'lucide-react';

const JobForm = ({ onJobCreated }) => {
  const [taskName, setTaskName] = useState('');
  const [payload, setPayload] = useState('{}');
  const [priority, setPriority] = useState('Medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;
    
    setIsSubmitting(true);
    try {
      let parsedPayload = {};
      try {
        parsedPayload = JSON.parse(payload);
      } catch (error) {
        alert('Invalid JSON payload');
        return;
      }

      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskName, payload: parsedPayload, priority })
      });

      if (response.ok) {
        setTaskName('');
        setPayload('{}');
        setPriority('Medium');
        onJobCreated?.();
      }
    } catch (error) {
      console.error('Error creating job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <Card.Header>
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Job
        </h2>
      </Card.Header>
      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="taskName">Task Name</Label>
            <Input
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="payload">Payload (JSON)</Label>
            <Textarea
              id="payload"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              placeholder='{"key": "value"}'
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </Select>
          </div>
          
          <Button type="submit" disabled={isSubmitting || !taskName.trim()}>
            {isSubmitting ? 'Creating...' : 'Create Job'}
          </Button>
        </form>
      </Card.Content>
    </Card>
  );
};

export default JobForm;