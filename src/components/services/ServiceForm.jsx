import { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { validateService } from '../../utils/validation';
import { SERVICE_TYPES } from '../../constants/services';
import { capitalize } from '../../utils/format';

const typeOptions = SERVICE_TYPES.map((type) => ({
  value: type,
  label: capitalize(type),
}));

const emptyService = { name: '', type: '', url: '' };

export function ServiceForm({ service, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(emptyService);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        type: service.type || '',
        url: service.url || '',
      });
    } else {
      setFormData(emptyService);
    }
    setErrors({});
    setTouched({});
  }, [service]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      const validationErrors = validateService({ ...formData, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: validationErrors[field] }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validationErrors = validateService(formData);
    setErrors((prev) => ({ ...prev, [field]: validationErrors[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateService(formData);
    setErrors(validationErrors);
    setTouched({ name: true, type: true, url: true });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData(emptyService);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitLabel = service ? 'Save changes' : 'Add service';

  return (
    <form className="service-form" onSubmit={handleSubmit} noValidate>
      <Input
        id="service-name"
        label="Service name"
        value={formData.name}
        onChange={handleChange('name')}
        onBlur={handleBlur('name')}
        error={errors.name}
        required
        placeholder="e.g. Coolify Panel"
        autoFocus
      />
      <Select
        id="service-type"
        label="Service type"
        value={formData.type}
        onChange={handleChange('type')}
        onBlur={handleBlur('type')}
        options={typeOptions}
        error={errors.type}
        required
      />
      <Input
        id="service-url"
        label="Service URL"
        type="url"
        value={formData.url}
        onChange={handleChange('url')}
        onBlur={handleBlur('url')}
        error={errors.url}
        required
        placeholder="https://example.com"
        helper="Must start with http:// or https://"
      />
      <div className="service-form__actions">
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
