import { memo } from 'react';
import { formatYear } from '@/utils/date';

const Footer = () => (
  <footer className="bg-gray-100 p-4 text-center text-gray-600">
    <p>© {formatYear()} React 19 Boilerplate</p>
  </footer>
);

export default memo(Footer);
