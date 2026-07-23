import { useState, useCallback } from 'react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { ErrorState } from '../ui/ErrorState';
import { ServiceList } from './ServiceList';
import { ServiceForm } from './ServiceForm';
import { INITIAL_SERVICES, SERVICE_STATUS } from '../../constants/services';
import './ServiceDashboard.css';

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getRandomStatus() {
  const statuses = Object.values(SERVICE_STATUS);
  return statuses[Math.floor(Math.random() * statuses.length)];
}

export function ServiceDashboard() {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [error, setError] = useState(null);

  const handleAdd = useCallback(() => {
    setEditingService(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((service) => {
    setEditingService(service);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingService(null);
  }, []);

  const handleSubmit = useCallback(
    (formData) => {
      try {
        if (editingService) {
          setServices((prev) =>
            prev.map((s) =>
              s.id === editingService.id
                ? { ...s, ...formData, lastChecked: new Date().toISOString() }
                : s
            )
          );
        } else {
          const newService = {
            id: generateId(),
            ...formData,
            status: SERVICE_STATUS.UNKNOWN,
            lastChecked: null,
          };
          setServices((prev) => [newService, ...prev]);
        }
        setError(null);
        handleCloseModal();
      } catch (err) {
        setError(err.message || 'Failed to save service.');
      }
    },
    [editingService, handleCloseModal]
  );

  const handleDelete = useCallback((id) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleCheck = useCallback((id) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: getRandomStatus(), lastChecked: new Date().toISOString() }
          : s
      )
    );
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
  }, []);

  const healthyCount = services.filter((s) => s.status === SERVICE_STATUS.HEALTHY).length;
  const warningCount = services.filter((s) => s.status === SERVICE_STATUS.WARNING).length;
  const errorCount = services.filter((s) => s.status === SERVICE_STATUS.ERROR).length;

  return (
    <section className="service-dashboard" aria-labelledby="dashboard-title">
      <div className="service-dashboard__header">
        <div>
          <h2 id="dashboard-title" className="service-dashboard__title">
            Service Dashboard
          </h2>
          <p className="service-dashboard__subtitle">
            Monitor and manage your self-hosted backend services.
          </p>
        </div>
        <Button onClick={handleAdd}>Add service</Button>
      </div>

      <div className="service-dashboard__stats">
        <div className="stat-card stat-card--healthy">
          <span className="stat-card__value">{healthyCount}</span>
          <span className="stat-card__label">Healthy</span>
        </div>
        <div className="stat-card stat-card--warning">
          <span className="stat-card__value">{warningCount}</span>
          <span className="stat-card__label">Warning</span>
        </div>
        <div className="stat-card stat-card--error">
          <span className="stat-card__value">{errorCount}</span>
          <span className="stat-card__label">Error</span>
        </div>
        <div className="stat-card stat-card--total">
          <span className="stat-card__value">{services.length}</span>
          <span className="stat-card__label">Total</span>
        </div>
      </div>

      {error && (
        <ErrorState
          title="Something went wrong"
          message={error}
          onRetry={handleRetry}
        />
      )}

      <ServiceList
        services={services}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCheck={handleCheck}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingService ? 'Edit service' : 'Add service'}
      >
        <ServiceForm
          service={editingService}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </section>
  );
}
