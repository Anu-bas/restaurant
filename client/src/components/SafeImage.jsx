import { useState } from 'react';

// Falls back to a neutral placeholder if a remote image URL fails to load.
const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='450'>
       <rect width='100%' height='100%' fill='#ece8e0'/>
       <text x='50%' y='50%' text-anchor='middle' fill='#8b9089'
             font-family='Georgia, serif' font-size='26'>Image unavailable</text>
     </svg>`
  );

const SafeImage = ({ src, alt, className = '', ...rest }) => {
  const [url, setUrl] = useState(src || PLACEHOLDER);
  return (
    <img
      src={url}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setUrl(PLACEHOLDER)}
      {...rest}
    />
  );
};

export default SafeImage;
