import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/productos.scss';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';

const ProductList = () => {
	const [total, setTotal] = useState(0);
	const [countProducts, setCountProducts] = useState(0);
	const [products, setProducts] = useState([]);
	const [active, setActive] = useState(false);
	const [cart, setCart] = useState([]);
	const navigate = useNavigate();
	const userRole = useSelector(state => state.userData?.Role || 'defaultRole');

	useEffect(() => {
		const storedCart = localStorage.getItem('cart');
		if (storedCart) {
			const parsedCart = JSON.parse(storedCart);
			setCart(parsedCart);
			const totalCount = parsedCart.reduce((acc, item) => acc + item.quantity, 0);
			setCountProducts(totalCount);
			const updatedTotal = parsedCart.reduce((acc, item) => acc + item.Precio * item.quantity, 0);
			setTotal(updatedTotal);
		}
	}, []);


	const onDeleteProduct = product => {

	};

	const onCleanCart = () => {
		setCart([]);
		setTotal(0);
		setCountProducts(0);
		localStorage.removeItem('cart');
		setActive(false);
	};
	const onAddProduct = (product) => {
		const productInCartIndex = cart.findIndex((item) => item.Codigo === product.Codigo);

		if (productInCartIndex !== -1) {
			const updatedCart = cart.map((item, index) =>
				index === productInCartIndex ? { ...item, quantity: item.quantity + 1 } : item
			);
			setCart([...updatedCart]);
			const updatedTotal = updatedCart.reduce((acc, item) => acc + item.Precio * item.quantity, 0);
			setTotal(updatedTotal);
			setCountProducts((prevCount) => prevCount + 1);

			// Actualizar localStorage con el carrito actualizado
			localStorage.setItem('cart', JSON.stringify(updatedCart));
		} else {
			setCart([...cart, { ...product, quantity: 1 }]);
			const updatedTotal = cart.reduce((acc, item) => acc + item.Precio * item.quantity, 0) + product.Precio;
			setTotal(updatedTotal);
			setCountProducts((prevCount) => prevCount + 1);

			// Agregar el nuevo producto al localStorage
			const updatedCart = [...cart, { ...product, quantity: 1 }];
			localStorage.setItem('cart', JSON.stringify(updatedCart));
		}
	};



	useEffect(() => {
		axios.get('https://backendtienda.onrender.com/products')
			.then(response => {
				setProducts(response.data);
			})
			.catch(error => console.error('Error al obtener los productos:', error));
	}, []);

	const token = Cookies.get('token');
	return (
		<>
			<header>
				<h1>Tienda</h1>
				<div className='container-icon'>
					{token && typeof token === 'string' && token.trim() !== '' && (
						<div
							className='container-cart-icon'
							onClick={() => setActive(!active)}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth='1.5'
								stroke='currentColor'
								className='icon-cart'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
								/>
							</svg>
							<div className='count-products'>
								<span id='contador-productos'>{countProducts}</span>

							</div>
						</div>
					)}

					<div
						className={`container-cart-products ${active ? '' : 'hidden-cart'
							}`}
					>
						{cart.length ? (
							<>

								<div className='row-product'>
									{cart.length > 0 && (
										<button className='pago' onClick={() => navigate('/pedidos')}>
											Proceder al pago
										</button>
									)}

									{cart.map(product => (
										<div className='cart-product' key={product.Codigo}>

											<div className='info-cart-product'>
												<span className='cantidad-producto-carrito'>
													{product.quantity}
												</span>
												<p className='titulo-producto-carrito'>
													{product.Nombre}
												</p>
												<span className='precio-producto-carrito'>
													{product.Precio}
												</span>
											</div>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												fill='none'
												viewBox='0 0 24 24'
												strokeWidth='1.5'
												stroke='currentColor'
												className='icon-close'
												onClick={() => onDeleteProduct(product)}
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M6 18L18 6M6 6l12 12'
												/>
											</svg>
										</div>
									))}


								</div>


								<div className='cart-total'>
									<h3>Total:</h3>
									<span className='total-pagar'>{total}€</span>
								</div>




								<button className='btn-clear-all' onClick={onCleanCart}>
									Vaciar Carrito
								</button>


							</>
						) : (
							<p className='cart-empty'>El carrito está vacío</p>
						)}
					</div>
				</div>
			</header>

			<h1 className='titulo-productos'>Productos</h1>
			<div className='container-items'>
				{products.map(product => (
					<div className='item' key={product.Codigo}>
						<figure>
							<img src={product.Descripcion} alt={product.Nombre} />
						</figure>
						<div className='info-product'>
							<h2>{product.Nombre}</h2>
							<p className='price'>{product.Precio}€</p>
							{userRole === 'cliente' && (
								<button onClick={() => onAddProduct(product)}>
									Añadir al carrito
								</button>
							)}
						</div>
					</div>
				))}
			</div>
		</>
	);
};
export default ProductList;