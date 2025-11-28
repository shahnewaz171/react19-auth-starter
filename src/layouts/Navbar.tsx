import { NavLink } from 'react-router';

const Navbar = () => (
  <nav className="bg-blue-600 text-white p-4">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-xl font-bold">React 19 Typescript Boilerplate</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'underline' : 'hover:underline')}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className="hover:underline">
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/others" className="hover:underline">
              Others
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  </nav>
);

export default Navbar;
