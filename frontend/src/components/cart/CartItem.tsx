import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

interface CartItemProps {
	item: {
		orderDetailId: string;
		productId: number;
		quantity: number;
		unitPrice: number;
		product?: {
			productId: number;
			name: string;
			price: number;
			description?: string;
			imgName?: string;
		};
	};
}

export default function CartItem({ item }: CartItemProps) {
	const { updateQuantity, removeItem } = useCart();
	const { darkMode } = useTheme();

	const handleQuantityChange = (newQuantity: number) => {
		if (newQuantity > 0) {
			updateQuantity(item.orderDetailId, newQuantity);
		}
	};

	const totalPrice = item.quantity * item.unitPrice;

	return (
		<div className={`flex items-center space-x-4 p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
			<div className={`w-16 h-16 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-md flex items-center justify-center transition-colors duration-300`}>
				{item.product?.imgName ? (
					<img
						src={`/${item.product.imgName}`}
						alt={item.product.name}
						className="w-full h-full object-cover rounded-md"
					/>
				) : (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className={`h-8 w-8 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
						/>
					</svg>
				)}
			</div>

			<div className="flex-1">
				<h3 className={`font-medium ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}>
					{item.product?.name || `Product ${item.productId}`}
				</h3>
				<p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
					${item.unitPrice.toFixed(2)} each
				</p>
			</div>

			<div className="flex items-center space-x-2">
				<button
					onClick={() => handleQuantityChange(item.quantity - 1)}
					className={`w-8 h-8 rounded-full border ${darkMode ? 'border-gray-600 text-light hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'} flex items-center justify-center transition-colors duration-300`}
					disabled={item.quantity <= 1}
				>
					−
				</button>
				<span className={`w-12 text-center font-medium ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}>
					{item.quantity}
				</span>
				<button
					onClick={() => handleQuantityChange(item.quantity + 1)}
					className={`w-8 h-8 rounded-full border ${darkMode ? 'border-gray-600 text-light hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'} flex items-center justify-center transition-colors duration-300`}
				>
					+
				</button>
			</div>

			<div className="text-right">
				<p className={`font-bold ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}>
					${totalPrice.toFixed(2)}
				</p>
				<button
					onClick={() => removeItem(item.orderDetailId)}
					className="text-red-500 hover:text-red-700 text-sm transition-colors duration-300"
				>
					Remove
				</button>
			</div>
		</div>
	);
}