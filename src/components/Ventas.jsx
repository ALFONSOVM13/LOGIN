import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap'; 
import Swal from 'sweetalert2';


function VentasVendedor() {
    const [ventas, setVentas] = useState([]);
    const [filtroCodigo, setFiltroCodigo] = useState('');
    const [ventasFiltradas, setVentasFiltradas] = useState([]);
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null); 
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchAllVentas = async () => {
            try {
                const response = await axios.get('https://backendtienda.onrender.com/sales');
                setVentas(response.data);
            } catch (error) {
                console.error('Error al obtener todas las ventas:', error);
            }
        };

        fetchAllVentas();
    }, []);

    useEffect(() => {
        const handleFiltrarAutomatico = async () => {
            try {
                const response = await axios.get(`https://backendtienda.onrender.com/sales/${filtroCodigo}`);
                console.log('Data de la venta por código:', response.data);
                setVentasFiltradas([response.data]);
            } catch (error) {
                console.error('Error al obtener la venta por código:', error);
                setVentasFiltradas([]);
            }
        };

        if (filtroCodigo !== '') {
            handleFiltrarAutomatico();
        } else {
            setVentasFiltradas([]);
        }
    }, [filtroCodigo]);



    const handleUpdateVenta = async (codigoVenta, newData) => {
        try {
            const response = await axios.patch(`https://backendtienda.onrender.com/sales/${codigoVenta}`, newData);
            console.log('Venta actualizada:', response.data);
        } catch (error) {
            console.error('Error al actualizar la venta:', error);
        }
    };
    const handleEditarVenta = (venta) => {
        setVentaSeleccionada(venta);
        setShowModal(true);
    };

    const handleEliminarVenta = async (IDVenta) => {
        // Mostrar la alerta de confirmación
        Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción eliminará la venta. ¿Estás seguro que quieres continuar?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, eliminar venta',
          cancelButtonText: 'Cancelar',
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const response = await axios.delete(`https://backendtienda.onrender.com/sales/${IDVenta}`);
              console.log('Venta eliminada:', response.data);
      
              // Actualizar los datos después de eliminar la venta
              // Eliminar la venta eliminada del estado de ventas
              const updatedSales = ventas.filter(venta => venta.IDVenta !== IDVenta);
              setVentas(updatedSales);
      
              // Restablecer el filtro de búsqueda por código a un estado inicial (vacío)
              setFiltroCodigo('');
            } catch (error) {
              console.error('Error al eliminar la venta:', error);
              // Manejar errores, mostrar mensajes al usuario, etc.
            }
          }
        });
      };

    

    const handleCloseModal = () => {
        setVentaSeleccionada(null);
        setShowModal(false);
    };

    const handleChange = (field, value) => {
        setVentaSeleccionada({
            ...ventaSeleccionada,
            [field]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleUpdateVenta(ventaSeleccionada.IDVenta, ventaSeleccionada);
            // Una vez actualizada la venta, cierra el modal
            setShowModal(false);
        } catch (error) {
            console.error('Error al guardar los cambios:', error);
        }
    };


    return (
        <div className='ventas'>
            <h1>Ventas</h1>

            <div className="row">
                <h2>Ventas por Código</h2>
                <br />
                <div className="col-sm-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por código"
                        value={filtroCodigo}
                        onChange={(event) => setFiltroCodigo(event.target.value)}
                    />
                </div>


                {ventasFiltradas.length > 0 && filtroCodigo !== '' && (
                    <table className="table">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Código Producto</th>
                                <th scope="col">Nombre Producto</th>
                                <th scope="col">Precio</th>
                                <th scope="col">Fecha Venta</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Email</th>
                                <th scope="col">Teléfono</th>
                                <th scope="col">Total Venta</th>
                                <th scope="col">Cantidad Vendida</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                ventasFiltradas.length > 0 &&
                                ventasFiltradas.map((venta) => (
                                    <tr key={venta.IDVenta}>
                                        <td>{venta.CodigoProducto}</td>
                                        <td>{venta.NombreProducto}</td>
                                        <td>{venta.Precio}€</td>
                                        <td>{new Date(venta.FechaVenta).toLocaleDateString()}</td>
                                        <td>{venta.FirstName} {venta.LastName}</td>
                                        <td>{venta.Email}</td>
                                        <td>{venta.Phone}</td>
                                        <td>{venta.TotalVenta}€</td>
                                        <td>{venta.CantidadVendida}</td>
                                        <Button onClick={() => handleEditarVenta(venta)}>Editar Cantidad Vendida</Button>
                                        <Button onClick={() => handleEliminarVenta(venta.IDVenta)}>Eliminar</Button>                                    </tr>
                                ))
                            }
                        </tbody>


                    </table>
                )}
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Venta</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="cantidadVendida">Cantidad Vendida</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="cantidadVendida"
                                    value={ventaSeleccionada ? ventaSeleccionada.CantidadVendida : ''}
                                    onChange={(e) => handleChange('CantidadVendida', e.target.value)}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary">
                                Guardar cambios
                            </button>
                        </form>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cerrar
                        </Button>

                    </Modal.Footer>
                </Modal>
            </div>
            {!filtroCodigo && (
                <div>
                    <br />
                    <h2>Todas las Ventas</h2>
                    <table className="table">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Codigo de Venta</th>
                                <th scope="col">Código Producto</th>
                                <th scope="col">Cantidad Vendida</th>
                                <th scope="col">Fecha Venta</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventas.map((ventas) => (
                                <tr key={ventas.IDVenta}>
                                    <td>{ventas.IDVenta}</td>
                                    <td>{ventas.CodigoProducto}</td>
                                    <td>{ventas.CantidadVendida}</td>
                                    <td>{new Date(ventas.FechaVenta).toLocaleDateString()}</td>
                                    {console.log('Información de venta:', ventas)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
export default VentasVendedor;



