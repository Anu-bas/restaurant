import SafeImage from './SafeImage.jsx';

const TableCard = ({ table, onBook }) => (
  <article className="card-plain">
    <SafeImage src={table.image} alt={`Table ${table.tableNumber}`} className="card-media" />
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-start gap-2">
        <h3 className="card-title-lg">Table {table.tableNumber}</h3>
        <span className={`tag ${table.isAvailable ? 'tag-open' : 'tag-closed'}`}>
          {table.isAvailable ? 'Available' : 'Not available'}
        </span>
      </div>
      <p className="meta">
        Seats {table.capacity} · {table.section}
      </p>
      {table.restaurant?.name && <p className="meta">{table.restaurant.name}</p>}
      {table.isAvailable ? (
        <button className="btn btn-brass mt-auto align-self-start" onClick={() => onBook(table)}>
          Book table
        </button>
      ) : (
        <button className="btn btn-ghost mt-auto align-self-start" disabled>
          Not available
        </button>
      )}
    </div>
  </article>
);

export default TableCard;
