import { ServiceCard } from './ServiceCard';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';
import './ServiceList.css';

export function ServiceList({ services, onEdit, onDelete, onCheck }) {
  if (services.length === 0) {
    return (
      <EmptyState
        title="No services yet"
        message="Add your first backend service to start monitoring its health."
        action={
          <Button variant="primary" onClick={onEdit}>
            Add service
          </Button>
        }
      />
    );
  }

  return (
    <ul className="service-list">
      {services.map((service, index) => (
        <li key={service.id} className="service-list__item">
          <ServiceCard
            service={service}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
            onCheck={onCheck}
          />
        </li>
      ))}
    </ul>
  );
}
