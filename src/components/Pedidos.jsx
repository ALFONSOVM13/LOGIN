import { useEffect, useState } from 'react';
import '../styles/pedidos.scss'
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';



const Pedidos = () => {
    const [cartItems, setCartItems] = useState([]);
    // const userData = JSON.parse(sessionStorage.getItem('userData'));

    const [userData, setUserData] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = Cookies.get('token');
                const response = await axios.get('https://backendtienda.onrender.com/userinfo', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUserData(response.data);
            } catch (error) {
                console.error('Error al obtener la información del usuario:', error);
            }
        };

        fetchUserData();
    }, []);






    const handleChangePassword = async () => {
        try {
            const userId = userData.id;
            const url = `https://backendtienda.onrender.com/user/${userId}`;

            await axios.patch(url, {
                currentPassword: currentPassword,
                newPassword: newPassword
            });

            console.log('Contraseña cambiada con éxito');
            setChangingPassword(false);
            setNewPassword('');
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
        }
    };




    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            const parsedCart = JSON.parse(storedCart);
            setCartItems(parsedCart);
        }
    }, []);

    const increaseQuantity = (index) => {
        const updatedCart = [...cartItems];
        updatedCart[index].quantity += 1;
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const decreaseQuantity = (index) => {
        const updatedCart = [...cartItems];
        if (updatedCart[index].quantity > 1) {
            updatedCart[index].quantity -= 1;
            setCartItems(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    };

    const removeItem = (index) => {
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const totalPedido = cartItems.reduce((total, item) => total + item.Precio * item.quantity, 0);

    const pagarPedido = async () => {

        for (const item of cartItems) {
            try {
               

                if (!userData || !userData.Cedula) {
                    console.error('No se encontró información de usuario válida.');
                    return;
                }
                const response = await axios.post('https://backendtienda.onrender.com/sales', {
                    CedulaCliente: userData.Cedula,
                    CodigoProducto: item.Codigo,
                    CantidadVendida: item.quantity
                });
                if (response.status === 200) {

                    Swal.fire({
                        icon: 'success',
                        title: '¡Venta exitosa!',
                        text: 'Tu compra se ha realizado con éxito.',
                        confirmButtonText: 'Aceptar'
                    });

                    setCartItems([]);
                    localStorage.removeItem('cart');
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al realizar la venta.',
                    confirmButtonText: 'Aceptar'
                });
                console.error('Error al crear la venta:', error);
            }
        };
    }
    return (
        <div className="container mt-5">
            <div className='Perfil'>
                <h1>Tu Perfil</h1>
                <div className="container">
                    {userData && (
                        <div className="profile-section">
                            <div className="container">
                                <h2>Detalles del Usuario</h2>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h3>Correo electrónico:</h3>
                                        <h5>{userData.Email}</h5>
                                        <h3>Usuario:</h3>
                                        <h5>{userData.Username}</h5>
                                        <h3>Cédula:</h3>
                                        <h5>{userData.Cedula}</h5>
                                    </div>
                                    <div className="col-md-6">
                                        <h3>Nombre:</h3>
                                        <h5>{userData.FirstName}</h5>
                                        <h3>Apellidos:</h3>
                                        <h5>{userData.LastName}</h5>
                                        <h3>Teléfono:</h3>
                                        <h5>{userData.Phone}</h5>
                                    </div>
                                </div>
                                <button className="btn btn-primary" onClick={() => setChangingPassword(!changingPassword)}>
                                    {changingPassword ? 'Cambiar contraseña' : 'Cambiar contraseña'}
                                </button>
                            </div>
                            {changingPassword && (
                                <div className="col-md-3">
                                    <div className="password-section my-4"> {/* Agregué la clase "my-4" para márgenes verticalmente */}
                                        <input
                                            type="password"
                                            className="form-control mb-2"
                                            placeholder="Contraseña anterior"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />
                                        <input
                                            type="password"
                                            className="form-control mb-2"
                                            placeholder="Nueva contraseña"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <button className="btn btn-success" onClick={handleChangePassword}>
                                            Guardar nueva contraseña
                                        </button>
                                    </div>
                                </div>

                            )}

                        </div>
                    )}
                </div>
            </div>
            <h1>Tus Carrito</h1>
            {cartItems.length > 0 && (
                <div className="col-md-6 mb-3">
                <div className="mt-2 border p-2 bg-light">
                    <h3 className="mb-2">Total del Pedido: <span className="fw-bold">${totalPedido}</span></h3>
                    <button className="btn btn-dark btn-lg" onClick={pagarPedido}>Proceder al pago</button>
                </div>
                </div>
            )}



            {cartItems.length ? (

                <div className="row">
                    {cartItems.map((item, index) => (

                        <div key={index} className="col-md-3 mb-4">

                            <div className="card">
                                <div className="card-body">
                                    <img src={item.Descripcion} className="img-carrito" alt={item.Nombre} />
                                    <h5 className="card-title">{item.Nombre}</h5>
                                    <p className="card-text">Cantidad: {item.quantity}</p>
                                    <p className="card-text">Precio: ${item.Precio * item.quantity}</p>
                                    <div className="btn-group" role="group">
                                        <button className="btn btn-secondary" onClick={() => increaseQuantity(index)}>+</button>
                                        <button className="btn btn-secondary" onClick={() => decreaseQuantity(index)}>-</button>
                                        <button className="btn btn-danger" onClick={() => removeItem(index)}>Eliminar</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="mt-3">No hay artículos en tu carrito de compras</p>
            )}

        </div>
    );
};


export default Pedidos;
