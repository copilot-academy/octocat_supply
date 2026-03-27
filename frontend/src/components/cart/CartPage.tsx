import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import CartItem from './CartItem';

export default function CartPage() {
	const { items, totalPrice, clearCart } = useCart();
	const { darkMode } = useTheme();

	if (items.length === 0) {
		return (
			<div className={`min-h-screen pt-20 pb-8 ${darkMode ? 'bg-dark' : 'bg-gray-100'} transition-colors duration-300`}>
				<div className="container mx-auto px-4">
					<div className={`max-w-2xl mx-auto text-center py-20 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm transition-colors duration-300`}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H17M9 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM20.5 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
							/>
						</svg>
						<h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}>
							Your cart is empty
						</h2>
						<p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
							Add some products to get started!
						</p>
						<Link
							to="/products"
							className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-md font-medium transition-colors duration-300 inline-block"
						>
							Browse Products
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={`min-h-screen pt-20 pb-8 ${darkMode ? 'bg-dark' : 'bg-gray-100'} transition-colors duration-300`}>
			<div className="container mx-auto px-4">
				<div className="max-w-4xl mx-auto">
					<h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}>
						Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
					</h1>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Cart Items */}
						<div className="lg:col-span-2">
							<div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}>
								{items.map((item) => (
									<CartItem key={item.orderDetailId} item={item} />
								))}
							</div>

							<div className="mt-4">
								<button
									onClick={clearCart}
									className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors duration-300"
								>
									Clear entire cart
								</button>
							</div>
						</div>

						{/* Order Summary */}
						<div className="lg:col-span-1">
							<div className={`rounded-lg shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}>
								<h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}>
									Order Summary
								</h2>

								<div className={`space-y-2 mb-4 pb-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
									<div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
										<span>Subtotal:</span>
										<span>${totalPrice.toFixed(2)}</span>
									</div>
									<div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
										<span>Shipping:</span>
										<span>Free</span>
									</div>
									<div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
										<span>Tax:</span>
										<span>Calculated at checkout</span>
									</div>
								</div>

								<div className={`flex justify-between text-lg font-bold mb-6 ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}>
									<span>Total:</span>
									<span>${totalPrice.toFixed(2)}</span>
								</div>

								<button
									className="w-full bg-primary hover:bg-accent text-white py-3 rounded-md font-medium transition-colors duration-300 mb-4"
									onClick={() => alert('Checkout functionality not implemented yet!')}
								>
									Proceed to Checkout
								</button>

								<Link
									to="/products"
									className={`block text-center ${darkMode ? 'text-gray-400 hover:text-primary' : 'text-gray-600 hover:text-primary'} text-sm transition-colors duration-300`}
								>
									Continue Shopping
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}