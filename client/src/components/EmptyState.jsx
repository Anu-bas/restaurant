const EmptyState = ({ title, body, action }) => (
  <div className="empty-state">
    <h3>{title}</h3>
    {body && <p className="lead-muted mx-auto">{body}</p>}
    {action}
  </div>
);

export default EmptyState;
