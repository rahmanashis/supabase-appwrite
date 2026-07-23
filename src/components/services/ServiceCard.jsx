import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/format';
import './ServiceCard.css';

export function ServiceCard({ service, onEdit, onDelete, onCheck, index }) {
  return (
    <Card className="service-card" delay={index * 0.05}>
      <div className="service-card__header">
        <div className="service-card__info">
          <h3 className="service-card__name">{service.name}</h3>
          <span className="service-card__type">{service.type}</span>
        </div>
        <StatusBadge status={service.status} />
      </div>
      <a
        href={service.url}
        target="_blank"
        rel="noopener noreferrer"
        className="service-card__url"
      >
        {service.url}
      </a>
      <p className="service-card__last-checked">
        Last checked: {formatDate(service.lastChecked)}
      </p>
      <div className="service-card__actions">
        <Button size="sm" variant="secondary" onClick={() => onCheck(service.id)}>
          Check health
        </Button>
        <Button size="sm" variant="secondary" onClick={() => onEdit(service)}>
          Edit
        </Button>
        <Button size="sm" variant="danger" onClick={() => onDelete(service.id)}>
          Delete
        </Button>
      </div>
    </Card>
  );
}
