import { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { Input, Textarea, Select, Label } from './ui/Form';
import { Plus, Zap, Mail, FileText, Database, Settings } from 'lucide-react';

const JobForm = ({ onJobCreated }) => {
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [jobType, setJobType] = useState('custom');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Dynamic form fields based on job type
  const [formData, setFormData] = useState({});

  const jobTemplates = {
    email: {
      name: 'Send Email',
      icon: Mail,
      fields: [
        { key: 'recipientEmail', label: 'Recipient Email', type: 'email', required: true },
        { key: 'subject', label: 'Email Subject', type: 'text', required: true },
        { key: 'template', label: 'Email Template', type: 'select', options: ['welcome', 'notification', 'reminder'], required: true },
        { key: 'senderName', label: 'Sender Name', type: 'text', required: false }
      ]
    },
    report: {
      name: 'Generate Report',
      icon: FileText,
      fields: [
        { key: 'reportType', label: 'Report Type', type: 'select', options: ['monthly', 'weekly', 'quarterly', 'annual'], required: true },
        { key: 'department', label: 'Department', type: 'select', options: ['sales', 'marketing', 'finance', 'hr'], required: true },
        { key: 'format', label: 'Output Format', type: 'select', options: ['PDF', 'Excel', 'CSV'], required: true },
        { key: 'emailTo', label: 'Send Report To', type: 'email', required: false }
      ]
    },
    sync: {
      name: 'Data Sync',
      icon: Database,
      fields: [
        { key: 'source', label: 'Data Source', type: 'select', options: ['API', 'Database', 'File'], required: true },
        { key: 'destination', label: 'Destination', type: 'select', options: ['Database', 'S3', 'Local'], required: true },
        { key: 'batchSize', label: 'Batch Size', type: 'number', required: false },
        { key: 'syncType', label: 'Sync Type', type: 'select', options: ['full', 'incremental'], required: true }
      ]
    },
    notification: {
      name: 'Send Notification',
      icon: Zap,
      fields: [
        { key: 'userId', label: 'User ID', type: 'text', required: true },
        { key: 'message', label: 'Notification Message', type: 'textarea', required: true },
        { key: 'channel', label: 'Channel', type: 'select', options: ['email', 'sms', 'push'], required: true },
        { key: 'priority', label: 'Notification Priority', type: 'select', options: ['low', 'normal', 'high'], required: true }
      ]
    },
    custom: {
      name: 'Custom Task',
      icon: Settings,
      fields: [
        { key: 'description', label: 'Task Description', type: 'textarea', required: true },
        { key: 'customData', label: 'Additional Data (JSON)', type: 'textarea', required: false }
      ]
    }
  };

  const handleJobTypeChange = (type) => {
    setJobType(type);
    setFormData({});
    if (type !== 'custom') {
      setTaskName(jobTemplates[type].name);
    } else {
      setTaskName('');
    }
  };

  const handleFieldChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const buildPayload = () => {
    if (jobType === 'custom' && formData.customData) {
      try {
        const customPayload = JSON.parse(formData.customData);
        return { ...formData, ...customPayload };
      } catch (e) {
        return formData;
      }
    }
    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;
    
    // Validate required fields
    const template = jobTemplates[jobType];
    const requiredFields = template.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formData[field.key]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const payload = buildPayload();
      
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          taskName: taskName.trim(), 
          payload, 
          priority 
        })
      });

      if (response.ok) {
        setTaskName('');
        setFormData({});
        setJobType('custom');
        setPriority('Medium');
        onJobCreated?.();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to create job'}`);
      }
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
    const { key, label, type, options, required } = field;
    const value = formData[key] || '';

    switch (type) {
      case 'select':
        return (
          <Select
            key={key}
            value={value}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            required={required}
          >
            <option value="">Select {label}</option>
            {options.map(option => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </Select>
        );
      case 'textarea':
        return (
          <Textarea
            key={key}
            value={value}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
            rows={3}
            required={required}
          />
        );
      case 'number':
        return (
          <Input
            key={key}
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
            required={required}
          />
        );
      default:
        return (
          <Input
            key={key}
            type={type}
            value={value}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
            required={required}
          />
        );
    }
  };

  const currentTemplate = jobTemplates[jobType];
  const IconComponent = currentTemplate.icon;

  return (
    <Card>
      <Card.Header>
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Job
        </h2>
      </Card.Header>
      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Type Selection */}
          <div>
            <Label>Job Type</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {Object.entries(jobTemplates).map(([key, template]) => {
                const Icon = template.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleJobTypeChange(key)}
                    className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                      jobType === key
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{template.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Task Name */}
          <div>
            <Label htmlFor="taskName">Task Name {jobType === 'custom' && '*'}</Label>
            <Input
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task name"
              required={jobType === 'custom'}
              disabled={jobType !== 'custom'}
            />
          </div>

          {/* Dynamic Fields */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <IconComponent className="h-4 w-4" />
              {currentTemplate.name} Configuration
            </div>
            
            {currentTemplate.fields.map((field) => (
              <div key={field.key}>
                <Label htmlFor={field.key}>
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </Label>
                {renderField(field)}
              </div>
            ))}
          </div>

          {/* Priority */}
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">🟢 Low Priority</option>
              <option value="Medium">🟡 Medium Priority</option>
              <option value="High">🔴 High Priority</option>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting || !taskName.trim()}
            className="w-full"
          >
            {isSubmitting ? 'Creating Job...' : 'Create Job'}
          </Button>
        </form>
      </Card.Content>
    </Card>
  );
};

export default JobForm;