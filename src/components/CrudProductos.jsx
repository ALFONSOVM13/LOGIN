import React, { useState, useEffect } from 'react';
import '../styles/crud.scss'
import { Modal, Button } from 'react-bootstrap';
import Cookies from 'js-cookie';
import axios from 'axios';
import Swal from 'sweetalert2';

const ProductCrud = () => {
    const [productos, setProductos] = useState([]);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editedProduct, setEditedProduct] = useState({});
    const [users, setUsers] = useState([]);
    const [newRole, setNewRole] = useState('');
    const [nuevoProducto, setNuevoProducto] = useState({
        Nombre: '',
        Descripcion: '',
        Precio: '',
        CantidadStock: '',
    });

    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        getUserInfo();
    }, []);

    const getUserInfo = async () => {
        try {
            const token = Cookies.get('token');
            if (token) {
                const response = await axios.get('https://backendtienda.onrender.com/userinfo', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    const userData = response.data;
                    setUserRole(userData.Role);
                }
            }
        } catch (error) {
            console.error('Error al obtener información del usuario:', error);
        }
    };

    useEffect(() => {
        getProductos();
    }, []);

    const getProductos = async () => {
        try {
            const response = await axios.get('https://backendtienda.onrender.com/products');
            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log('Campo:', name, 'Valor:', value);
        setNuevoProducto({ ...nuevoProducto, [name]: value });
    };
    const handleEdit = (producto) => {
        setEditedProduct({
            Codigo: producto.Codigo,
            Nombre: producto.Nombre,
            Descripcion: producto.Descripcion,
            Precio: producto.Precio,
            CantidadStock: producto.CantidadStock,
        });
        setShowEditForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://backendtienda.onrender.com/products', nuevoProducto);
            await getProductos();
            setNuevoProducto({
                Nombre: '',
                Descripcion: '',
                Precio: '',
                CantidadStock: '',
            });
        } catch (error) {
            console.error('Error al crear el producto:', error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`https://backendtienda.onrender.com/products/${editedProduct.Codigo}`, editedProduct);
            await getProductos();
            setShowEditForm(false);
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    };
    const handleDelete = async (codigo) => {
        try {
            const willDelete = await Swal.fire({
                title: '¿Estás seguro?',
                text: 'Esta acción no se puede deshacer',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar'
            });
    
            if (willDelete.isConfirmed) {
                await axios.delete(`https://backendtienda.onrender.com/products/${codigo}`);
                await getProductos();
                Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.', 'success');
            } else {
                Swal.fire('Cancelado', 'El producto no ha sido eliminado.', 'info');
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };
    useEffect(() => {
        // Llamada a la API para obtener la lista de usuarios
        axios.get('https://backendtienda.onrender.com/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error al obtener la lista de usuarios:', error);
            });
    }, []);
    const handleRoleChange = (userId, newRole) => {
        if (!userId || !newRole) {
            console.error('ID de usuario o rol no válido');
            return;
        }

        // Evitar cambios si el rol actual es "Admin"
        const userToUpdate = users.find(user => user.ID === userId);
        if (userToUpdate.Role === 'admin' && newRole !== 'admin') {
            console.error('No se pueden quitar permisos de administrador.');
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'No se pueden quitar permisos de administrador.',
            });
            return;
        }
        axios.patch(`https://backendtienda.onrender.com/users/${userId}/role`, { role: newRole })
            .then(response => {
                // Actualizar la lista de usuarios después de cambiar el rol
                // Puedes mostrar un mensaje de éxito aquí si lo deseas
                console.log('Rol actualizado:', response.data);
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Rol actualizado correctamente.',
                });
            })
            .catch(error => {
                console.error('Error al cambiar el rol del usuario:', error);
            });
    };

    return (
        <div className="container mt-4">
            <h1>CRUD de Productos</h1>
            <Modal show={showEditForm} onHide={() => setShowEditForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleUpdate}>
                        <div className="form-group">
                            <label>Código:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="Codigo"
                                value={editedProduct.Codigo}
                                onChange={(e) => setEditedProduct({ ...editedProduct, Codigo: e.target.value })}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label>Nombre:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="Nombre"
                                value={editedProduct.Nombre}
                                onChange={(e) => setEditedProduct({ ...editedProduct, Nombre: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Descripción:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="Descripcion"
                                value={editedProduct.Descripcion}
                                onChange={(e) => setEditedProduct({ ...editedProduct, Descripcion: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Precio:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="Precio"
                                value={editedProduct.Precio}
                                onChange={(e) => setEditedProduct({ ...editedProduct, Precio: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Cantidad en Stock:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="CantidadStock"
                                value={editedProduct.CantidadStock}
                                onChange={(e) => setEditedProduct({ ...editedProduct, CantidadStock: e.target.value })}
                            />
                        </div>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowEditForm(false)}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit" onClick={handleUpdate}>
                                Guardar Cambios
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal.Body>
            </Modal>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Nombre"
                        name="Nombre"
                        value={nuevoProducto.Nombre}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="URL de la imagen"
                        name="Descripcion"
                        value={nuevoProducto.Descripcion}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Precio"
                        name="Precio"
                        value={nuevoProducto.Precio}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Cantidad en Stock"
                        name="CantidadStock"
                        value={nuevoProducto.CantidadStock}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Agregar Producto</button>
            </form>
            <h2>Lista de productos</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto) => (
                        <tr key={producto.Codigo}>
                            <td>{producto.Codigo}</td>
                            <td>{producto.Nombre}</td>
                            <td>{producto.Precio}€</td>
                            <td>{producto.CantidadStock}</td>
                            <td>
                                {userRole === 'admin' ? (
                                    <>
                                        <button onClick={() => handleEdit(producto)} className="btn btn-primary me-2">
                                            Editar
                                        </button>
                                        <button onClick={() => handleDelete(producto.Codigo)} className="btn btn-danger">
                                            Eliminar
                                        </button>
                                    </>
                                ) : userRole === 'vendedor' ? (
                                    <button onClick={() => handleEdit(producto)} className="btn btn-primary me-2">
                                        Editar
                                    </button>
                                ) : null}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="container">
                <h2>Lista de Usuarios</h2>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Nombre de Usuario</th>
                            <th>Rol</th>
                            {userRole === 'admin' ? (
                            <th>Cambiar Rol</th>
                            ) : null}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.ID}>
                                <td>{user.Username}</td>
                                <td>{user.Role}</td>
                                <td>
                                {userRole === 'admin' ? (
                                    <select className="form-select" onChange={(e) => setNewRole(e.target.value)}>
                                        <option value="">Seleccionar Rol</option>
                                        <option value="admin">Admin</option>
                                        <option value="vendedor">Vendedor</option>
                                        <option value="cliente">Cliente</option>
                                    </select>
                                    ) : null}
                                    {userRole === 'admin' ? (
                                    <button className="btn btn-primary" onClick={() => handleRoleChange(user.ID, newRole)}>Cambiar Rol</button>
                                
                                ) : null}
                                    </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductCrud;
