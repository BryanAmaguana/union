import React, { useState, useEffect } from "react";
import { Switch, List, Input, Avatar, Button, Tooltip, notification/*  Modal as ModalAntd */ } from "antd";
import NoAvatar from "../../../../assets/img/png/tarjeta.png";
import { EditOutlined, StopOutlined, /* DeleteOutlined */ CheckOutlined, SearchOutlined } from '@ant-design/icons';
import Modal from "../../../Modal";
import EditTarjetaForm from "../EditTarjeta";
import { ObtenerTarjetaCodigo, ActivarTarjeta, /* EliminarTarjeta */ ObtenerTarjeta } from "../../../../api/tarjeta";
import { getAccessTokenApi } from "../../../../api/auth";
import AddTarjetaForm from "../AddTarjeta";

import "./ListTarjeta.scss";

/* const { confirm } = ModalAntd; */

export default function ListTarjeta(props) {
    const { TarjetaActivos, setTarjetaActivos, TarjetaInactivos, setTarjetaInactivos, setReloadTarjeta, Tipo_Pasajero } = props;
    const [VerTarjetaActivos, setVerTarjetaActivos] = useState(true);
    const [IsVisibleModal, setIsVisibleModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState(null);
    const [BusquedaTarjetaActivo, setBusquedaTarjetaA] = useState(false);
    const [BusquedaTarjetaInactivo, setBusquedaTarjetaI] = useState(false);
    const [CodigoTarjeta, setCodigoTarjeta] = useState(" ");
    const [paginaActual, setpaginaActual] = useState(1);
    const [BotonesPaginacion, setBotonesPaginacion] = useState(true);
    const [desde, setDesde] = useState(0);
    const [limite, setLimite] = useState(6);
    const token = getAccessTokenApi();
    const NumeroPorPagina = 6;

    /* Obtener los nombres de los usuarios para la busqueda */
    useEffect(() => {
        if (CodigoTarjeta === "" || CodigoTarjeta === " ") {
            setBusquedaTarjetaA(TarjetaActivos);
            setBusquedaTarjetaI(TarjetaInactivos);
        } else {
            ObtenerTarjetaCodigo(token, CodigoTarjeta, true)
                .then(response => {
                    setBusquedaTarjetaA(response.tarjeta)
                })
                .catch(err => {
                    notification["error"]({
                        message: err
                    });
                });
            ObtenerTarjetaCodigo(token, CodigoTarjeta, false)
                .then(response => {
                    setBusquedaTarjetaI(response.tarjeta)
                })
                .catch(err => {
                    notification["error"]({
                        message: err
                    });
                });
        }
    }, [token, CodigoTarjeta, TarjetaActivos, TarjetaInactivos]);

    /* Modal para agregar usuario */
    const AgregarTarjetaModal = () => {
        setIsVisibleModal(true);
        setModalTitle("Agregar nueva Tarjeta");
        setModalContent(
            <AddTarjetaForm
                setIsVisibleModal={setIsVisibleModal}
                setReloadTarjeta={setReloadTarjeta}
                Tipo_Pasajero={Tipo_Pasajero}
            />
        );
    };

    /* Buscar usuarios */
    const Buscar = codigo => {
        setCodigoTarjeta(codigo);
        setBusquedaTarjetaA(TarjetaActivos);
        setBusquedaTarjetaI(TarjetaInactivos);
        if (codigo === "" || codigo === " ") {
            setBusquedaTarjetaA(TarjetaActivos);
            setBusquedaTarjetaI(TarjetaInactivos);
        } else {
            ObtenerTarjetaCodigo(token, codigo, true)
                .then(response => {
                    setBusquedaTarjetaA(response.tarjeta)
                })
                .catch(err => {
                    notification["error"]({
                        message: err
                    });
                });
            ObtenerTarjetaCodigo(token, codigo, false)
                .then(response => {
                    setBusquedaTarjetaI(response.tarjeta)
                })
                .catch(err => {
                    notification["error"]({
                        message: err
                    });
                });
        }
    }

    return (
        /* switch y boton agregar usuario */
        <div className="list-tarjeta">
            <div className="navbar">
                <div className="switch" >
                    <Switch
                        defaultChecked
                        onChange={() => { setVerTarjetaActivos(!VerTarjetaActivos); setpaginaActual(1); setDesde(0); setLimite(6); setBotonesPaginacion(!BotonesPaginacion) }}
                    />
                    <span id="TActivos" >
                        {VerTarjetaActivos ? "Tarjetas Activas" : "Tarjetas Inactivas"}
                    </span>
                </div>
                <div className="Buscador" >
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder=" Buscar c??digo de tarjeta"
                        onChange={
                            event => Buscar(event.target.value)
                        }
                    />
                </div>
                <div className="BuscadorB" >

                    <Button className="BuscadorB" type="primary" onClick={AgregarTarjetaModal}>
                        Nueva Tarjeta
                    </Button>
                </div>
            </div>

            {/* listado de usuarios activos e inactivos */}
            {VerTarjetaActivos ? (
                <TarjetaActivo
                    TarjetaActivos={BusquedaTarjetaActivo ? BusquedaTarjetaActivo : TarjetaActivos}
                    setIsVisibleModal={setIsVisibleModal}
                    setModalTitle={setModalTitle}
                    setReloadTarjeta={setReloadTarjeta}
                    setModalContent={setModalContent}
                    Tipo_Pasajero={Tipo_Pasajero} />) : (
                <TarjetaInactivo TarjetaInactivos={BusquedaTarjetaInactivo ? BusquedaTarjetaInactivo : TarjetaInactivos} setReloadTarjeta={setReloadTarjeta} />)}

            {/* Modal para editar */}
            <Modal title={modalTitle} isVisible={IsVisibleModal} setIsVisible={setIsVisibleModal}>
                {modalContent}
            </Modal>

            {/* Paginacion de los usuarios Activos  */}
            <div className="centradoL">
                {BotonesPaginacion ?
                    <PaginacionA
                        paginaActual={paginaActual}
                        setpaginaActual={setpaginaActual}
                        token={token}
                        setTarjetaActivos={setTarjetaActivos}
                        desde={desde}
                        setDesde={setDesde}
                        limite={limite}
                        setLimite={setLimite}
                        setTarjetaInactivos={setTarjetaInactivos}
                        NumeroPorPagina={NumeroPorPagina}
                        setReloadTarjeta={setReloadTarjeta} /> :
                    <PaginacionI
                        paginaActual={paginaActual}
                        setpaginaActual={setpaginaActual}
                        token={token}
                        setTarjetaActivos={setTarjetaActivos}
                        desde={desde}
                        setDesde={setDesde}
                        limite={limite}
                        setLimite={setLimite}
                        setTarjetaInactivos={setTarjetaInactivos}
                        NumeroPorPagina={NumeroPorPagina}
                        setReloadTarjeta={setReloadTarjeta} />
                }
            </div>
        </div>
    );
}

/* Mostrar 4 siguientes usuarios Activos */
function PaginacionA(props) {
    const { paginaActual, setpaginaActual, token, setTarjetaActivos, desde, setDesde, limite, setTarjetaInactivos, NumeroPorPagina, setReloadTarjeta } = props;
    useEffect(() => {
        ObtenerTarjeta(token, true, desde, limite).then(response => {
            setTarjetaActivos(response.tarjeta);
            try {
                if ((response.tarjeta).length < NumeroPorPagina) {
                    document.getElementById('siguiente').disabled = true;
                }
            } catch (error) {
                setReloadTarjeta(true);
            }
        });
        // eslint-disable-next-line
    }, [desde, limite, token, setTarjetaActivos, setDesde, setTarjetaInactivos, NumeroPorPagina]);

    const Siguiente = () => {
        try {
            var PA = paginaActual + 1
            setpaginaActual(PA)
            setDesde(desde + limite);
            document.getElementById('anterior').disabled = false;
        } catch (error) {

        }

    }

    const Atras = () => {
        if (paginaActual > 1) {
            try {
                var PA = paginaActual - 1
                setpaginaActual(PA)
                setDesde(desde - limite);
                document.getElementById('siguiente').disabled = false;
            } catch (error) {

            }

        }
        if (paginaActual === 1) {
            document.getElementById('anterior').disabled = true;
        }
    }

    return (
        <div className="navbar">

            <div className="BuscadorB" >
                <Button id='anterior' className="centradoB" type="primary" onClick={Atras}>
                    Anterior
                </Button>
            </div>


            <div className="BuscadorB" >
                <Button className="centradoB" type="second">
                    {paginaActual}
                </Button>
            </div>

            <div className="BuscadorB" >
                <Button id='siguiente' className="centradoB" type="primary" onClick={Siguiente}>
                    Siguiente
                </Button>
            </div>

        </div>
    )
}

/* Mostrar 4 siguientes usuarios Inactivos */
function PaginacionI(props) {
    const { paginaActual, setpaginaActual, token, setTarjetaActivos, desde, setDesde, limite, setTarjetaInactivos, NumeroPorPagina, setReloadTarjeta } = props;
    useEffect(() => {
        ObtenerTarjeta(token, false, desde, limite).then(response => {
            setTarjetaInactivos(response.tarjeta);
            try {
                if ((response.tarjeta).length < NumeroPorPagina) {
                    document.getElementById('siguiente').disabled = true;
                }
            } catch (error) {
                setReloadTarjeta(true);
            }
        });
        // eslint-disable-next-line
    }, [desde, limite, token, setTarjetaActivos, setDesde, setTarjetaInactivos, NumeroPorPagina]);

    const Siguiente = () => {
        var PA = paginaActual + 1
        setpaginaActual(PA)
        setDesde(desde + limite);
        document.getElementById('anterior').disabled = false;
    }

    const Atras = () => {
        if (paginaActual > 1) {
            var PA = paginaActual - 1
            setpaginaActual(PA)
            setDesde(desde - limite);
            document.getElementById('siguiente').disabled = false;
        }
        if (paginaActual === 1) {
            document.getElementById('anterior').disabled = true;
        }
    }

    return (
        <div className="navbar">

            <div className="BuscadorB" >
                <Button id='anterior' className="centradoB" type="primary" onClick={Atras}>
                    Anterior
                </Button>
            </div>


            <div className="BuscadorB" >
                <Button className="centradoB" type="second">
                    {paginaActual}
                </Button>
            </div>

            <div className="BuscadorB" >
                <Button id='siguiente' className="centradoB" type="primary" onClick={Siguiente}>
                    Siguiente
                </Button>
            </div>

        </div>
    )
}

/* Metodo para llamar a los usuarios activos */
function TarjetaActivo(props) {
    const { TarjetaActivos, setIsVisibleModal, setModalTitle, setModalContent, setReloadTarjeta, Tipo_Pasajero } = props;
    /* Metodo para activar modal y editar usuario, llamada a EditUserForm */
    const EditarTarjeta = tarjeta => {
        setIsVisibleModal(true);
        setModalTitle(`Editar Tarjeta : 
    ${tarjeta.codigo ? tarjeta.codigo : '...'}`);
        setModalContent(
            <EditTarjetaForm
                tarjeta={tarjeta}
                setIsVisibleModal={setIsVisibleModal}
                setReloadTarjeta={setReloadTarjeta}
                Tipo_Pasajero={Tipo_Pasajero} />)
    }

    return (
        <List
            className="tarjeta-active"
            itemLayout="horizontal"
            dataSource={TarjetaActivos}
            renderItem={
                tarjeta => <ListaTarjetaActivos
                    tarjeta={tarjeta}
                    EditarTarjeta={EditarTarjeta}
                    setReloadTarjeta={setReloadTarjeta} />}
        />

    );
}

/* Metodo que muesta los datos dento de la lista */
function ListaTarjetaActivos(props) {
    const { tarjeta, EditarTarjeta, setReloadTarjeta } = props;
    const desactivarTarjeta = () => {
        const accesToken = getAccessTokenApi();

        ActivarTarjeta(accesToken, tarjeta._id, false)
            .then(response => {
                notification["success"]({
                    message: response
                });
                setReloadTarjeta(true);
            })
            .catch(err => {
                notification["error"]({
                    message: err
                });
            });
    };

    /*     const ConfirmarEliminar = () => {
            const accesToken = getAccessTokenApi();
    
            confirm({
                title: "Eliminando Tarjeta",
                content: `??Esta seguro que desea eliminar a la Tarjeta con c??digo: ${tarjeta.codigo}?`,
                okText: "Eliminar",
                okType: "danger",
                cancelText: "Cancelar",
                onOk() {
                    EliminarTarjeta(accesToken, tarjeta._id)
                        .then(response => {
                            notification["success"]({
                                message: response
                            });
                            setReloadTarjeta(true);
                        })
                        .catch(err => {
                            notification["error"]({
                                message: err
                            });
                        });
                }
            });
        }; */

    const Valor = valor => {
        var cadena = valor;
        var separador = ".";
        var arregloDeSubCadenas = cadena.toString().split(separador, 3);
        if (arregloDeSubCadenas[1] && arregloDeSubCadenas[1].length === 1) {
            cadena = arregloDeSubCadenas[0] + "." + arregloDeSubCadenas[1] + "0";
        }
        return cadena;
    }

    return (
        <List.Item
            actions={[


                <div className="navbarContenido">
                    <div className="BuscadorContenido" >
                        <Tooltip title="Editar">
                            <Button type="primary" onClick={() => EditarTarjeta(tarjeta)} >
                                <EditOutlined />
                            </Button>
                        </Tooltip>
                    </div>
                    <div className="BuscadorContenido" >
                        <Tooltip title="Desactivar">
                            <Button type="danger" onClick={() => desactivarTarjeta()}>
                                <StopOutlined />
                            </Button>
                        </Tooltip>

                        {/* <Tooltip title="Eliminar">
                  <Button type="danger" onClick={() => ConfirmarEliminar()}>
                    <DeleteOutlined />
                  </Button></Tooltip> */}
                    </div>
                </div>


            ]}
        >
            <List.Item.Meta
                avatar={<Avatar src={NoAvatar} />}
                title={`C??digo de Tarjeta:  ${tarjeta.codigo ? tarjeta.codigo : '...'}`}
                description={
                    <div>
                        <b>Valor Tarjeta:</b> {tarjeta.valor_tarjeta ? Valor(tarjeta.valor_tarjeta) : '0.00'}
                        <br />
                        <b>Descripci??n:</b> {tarjeta.descripcion.nombre ? tarjeta.descripcion.nombre : '...'}
                        <br />
                        <b>Bloqueo:</b> {tarjeta.bloqueo ? tarjeta.bloqueo : 'ninguno'}
                    </div>
                }
            />
        </List.Item>
    );
}

/* Metodo para llamar a los usuarios inactivos */
function TarjetaInactivo(props) {
    const { TarjetaInactivos, setReloadTarjeta } = props
    return (
        <List
            className="tarjeta-active"
            itemLayout="horizontal"
            dataSource={TarjetaInactivos}
            renderItem={tarjeta => (<ListaTarjetaInactivos tarjeta={tarjeta} setReloadTarjeta={setReloadTarjeta} />)}
        />
    );
}

/* Metodo que muesta los datos dento de la lista */
function ListaTarjetaInactivos(props) {
    const { tarjeta, setReloadTarjeta } = props;

    const activarTarjeta = () => {
        const accesToken = getAccessTokenApi();

        ActivarTarjeta(accesToken, tarjeta._id, true)
            .then(response => {
                notification["success"]({
                    message: response
                });
                setReloadTarjeta(true);
            })
            .catch(err => {
                notification["error"]({
                    message: err
                });
            });
    };

    /*     const ConfirmarEliminar = () => {
            const accesToken = getAccessTokenApi();
    
            confirm({
                title: "Eliminando Tarjeta",
                content: `??Esta seguro que desea eliminar a la Tarjeta con c??digo: ${tarjeta.codigo}?`,
                okText: "Eliminar",
                okType: "danger",
                cancelText: "Cancelar",
                onOk() {
                    EliminarTarjeta(accesToken, tarjeta._id)
                        .then(response => {
                            notification["success"]({
                                message: response
                            });
                            setReloadTarjeta(true);
                        })
                        .catch(err => {
                            notification["error"]({
                                message: err
                            });
                        });
                }
            });
        }; */

    const Valor = valor => {
        var cadena = valor;
        var separador = ".";
        var arregloDeSubCadenas = cadena.toString().split(separador, 3);
        if (arregloDeSubCadenas[1] && arregloDeSubCadenas[1].length === 1) {
            cadena = arregloDeSubCadenas[0] + "." + arregloDeSubCadenas[1] + "0";
        }
        return cadena;
    }

    return (
        <List.Item
            actions={[
                <Tooltip title="Activar">
                    <Button type="primary" onClick={() => activarTarjeta()}>
                        <CheckOutlined />
                    </Button>
                </Tooltip>,
                /*                 <Tooltip title="Eliminar">
                                    <Button type="danger" onClick={() => ConfirmarEliminar()}>
                                        <DeleteOutlined />
                                    </Button>
                                </Tooltip> */
            ]}
        >
            <List.Item.Meta
                avatar={<Avatar src={NoAvatar} />}
                title={`C??digo de Tarjeta: 
            ${tarjeta.codigo ? tarjeta.codigo : '...'}
         ` }
                description={
                    <div>
                        <b>Valor Tarjeta:</b> {tarjeta.valor_tarjeta ? Valor(tarjeta.valor_tarjeta) : '0.00'}
                        <br />
                        <b>Descripci??n:</b> {tarjeta.descripcion.nombre ? tarjeta.descripcion.nombre : '...'}
                        <br />
                        <b>Bloqueo:</b> {tarjeta.bloqueo ? tarjeta.bloqueo : 'ninguno'}
                    </div>
                }
            />
        </List.Item>
    );
}
