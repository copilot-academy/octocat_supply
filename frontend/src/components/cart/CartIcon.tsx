import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function CartIcon() {
	const { totalItems } = useCart();
	const { darkMode } = useTheme();

	return (
		<Link
			to="/cart"
			className="relative p-2 rounded-full focus:outline-none transition-colors hover:bg-primary/10"
			aria-label={`Cart with ${totalItems} items`}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className={`h-6 w-6 ${darkMode ? 'text-light' : 'text-gray-700'}`}
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={2}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H17M9 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM20.5 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
				/>
			</svg>
			{totalItems > 0 && (
				<span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem]">
					{totalItems > 99 ? '99+' : totalItems}
				</span>
			)}
		</Link>
	);
}