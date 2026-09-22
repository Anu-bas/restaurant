import { Link } from 'react-router-dom';
import SafeImage from './SafeImage.jsx';

const RestaurantCard = ({ restaurant }) => (
  <article className="card-plain">
    <SafeImage src={restaurant.image} alt={restaurant.name} className="card-media" />
    <div className="card-body">
      <h3 className="card-title-lg">{restaurant.name}</h3>
      <p className="meta">
        {restaurant.cuisine} · {restaurant.openingHours}
      </p>
      <p className="meta">{restaurant.address}</p>
      <p className="mb-2" style={{ fontSize: '0.95rem' }}>
        {restaurant.description}
      </p>
      <Link to={`/restaurants/${restaurant._id}`} className="btn btn-brand mt-auto align-self-start">
        View restaurant
      </Link>
    </div>
  </article>
);

export default RestaurantCard;
