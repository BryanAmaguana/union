import React, { useState, useEffect } from "react";
import { List, Input, Button, DatePicker, notification } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import { ObtenerCobroPasajeTodo, ObtenerCobroPasaje } from "../../../../api/CobroPasaje";
import { getAccessTokenApi } from "../../../../api/auth";
import { ObtenerBusNumero } from "../../../../api/bus";
import moment from 'moment';

import "./ListCobroPasaje.scss";

export default function ListCobro(props) {
    const { cobro, setcobro, setReloadCobro } = props;
    const [BusquedaCobro, setBusquedaCobro] = useState(false);
    const [paginaActual, setpaginaActual] = useState(1);
    const [desde, setDesde] = useState(0);
    const [limite, setLimite] = useState(4);
    const token = getAccessTokenApi();
    const NumeroPorPagina = 4;
    const [Numero, setNumero] = useState("");
    const [Inicio, setInicio] = useState("");
    const [Fin, setFin] = useState("");


    function FechaInicio(dateString) {
        const date = moment(dateString).format('YYYY-MM-DD');
        setInicio(date);
    }

    function FechaFin(dateString) {
        const date = moment(dateString).format('YYYY-MM-DD');
        setFin(date)
    }

    /* Buscar usuarios */
    const Buscar = () => {
        if (Numero === "" || Numero === " " || Inicio === "" || Inicio === " " || Fin === "" || Fin === " ") {
            notification["error"]({
                message: "Campos Vacios."
            });
        } else {
            ObtenerBusNumero(token, Numero, true)
                .then(result => {
                    if (result.message === "No se encontro ningun Bus.") {
                        notification["error"]({
                            message: result.message
                        });
                        setBusquedaCobro(false);
                    } else {
                        ObtenerCobroPasaje(token, Inicio, Fin, result.bus._id)
                            .then(response => {
                                setBusquedaCobro(response.cobro);
                            })
                            .catch(err => {
                                notification["error"]({
                                    message: err
                                });
                            });

                    }
                })
                .catch(err => {
                    notification["error"]({
                        message: err
                    });
                });
        }
    }

    return (
        /* switch y boton agregar persona */
        <div className="list-cobro">
            <div className="list-cobro__header">
                {/* Buscar persona */}
                <b className="BuscarLetra">Unidad N˚ </b>
                <div className="Buscar">
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder=" Numero de Bus "
                        onChange={
                            event => setNumero(event.target.value)
                        }
                    />
                </div>
                <b className="BuscarLetra">Inicio </b>
                <div className="Buscar">
                    <DatePicker
                        prefix={<SearchOutlined />}
                        placeholder="Fecha Inicio"
                        onChange={FechaInicio} />
                </div>

                <b >Fin </b>
                <div className="Buscar">
                    <DatePicker
                        prefix={<SearchOutlined />}
                        placeholder=" Fecha Fin "
                        onChange={FechaFin} />
                </div>

                <Button className="BuscarLetra" type="primary" onClick={Buscar}>
                    Buscar
                </Button>
            </div>

            {/* listado de usuarios activos e inactivos */}
            <Cobros
                cobro={BusquedaCobro ? BusquedaCobro : cobro}
                setReloadCobro={setReloadCobro} />

            {/* Paginacion de los usuarios Activos  */}
            <div className="centradoL">
                <Paginacion
                    paginaActual={paginaActual}
                    setpaginaActual={setpaginaActual}
                    token={token}
                    setcobro={setcobro}
                    desde={desde}
                    setDesde={setDesde}
                    limite={limite}
                    setLimite={setLimite}
                    NumeroPorPagina={NumeroPorPagina} />
            </div>
        </div>
    );
}


/* Mostrar 4 siguientes usuarios Activos */
function Paginacion(props) {
    const { paginaActual, setpaginaActual, token, setcobro, desde, setDesde, limite, setlimite, NumeroPorPagina } = props;
    useEffect(() => {
        ObtenerCobroPasajeTodo(token, desde, limite).then(response => {
            setcobro(response.cobro);
            if ((response.cobro).length < NumeroPorPagina) {
                document.getElementById('siguiente').disabled = true;
            }
        });
    }, [desde, limite, token, setcobro, setDesde, setlimite, NumeroPorPagina]);

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
        <div>
            <Button id='anterior' className="centradoB" type="primary" onClick={Atras}>
                Anterior
            </Button>
            <Button className="centradoB" type="second">
                {paginaActual}
            </Button>

            <Button id='siguiente' className="centradoB" type="primary" onClick={Siguiente}>
                Siguiente
            </Button>
        </div>
    )
}


/* Metodo para llamar a los usuarios activos */
function Cobros(props) {
    const { cobro, setReloadCobro } = props;

    return (
        <List
            className="cobro-active"
            itemLayout="horizontal"
            dataSource={cobro}
            renderItem={
                cobro => <ListaPersonas
                    cobro={cobro}
                    setReloadCobro={setReloadCobro} />}
        />

    );
}

const Valor = valor => {
    var cadena = valor;
    var separador = ".";
    var arregloDeSubCadenas = cadena.toString().split(separador, 3);
    if (arregloDeSubCadenas[1] && arregloDeSubCadenas[1].length === 1) {
        cadena = arregloDeSubCadenas[0] + "." + arregloDeSubCadenas[1] + "0";
    }
    return cadena;
}

/* Metodo que muesta los datos dento de la lista */
function ListaPersonas(props) {
    const { cobro } = props;

    return (
        <List.Item>
            <List.Item.Meta
                title={`Cobro de la unidad: 
              ${cobro.id_bus_cobro.numero_bus ? cobro.id_bus_cobro.numero_bus : '...'}
           ` }
                description={
                    <div>
                        <b>Cédula :</b> {cobro.id_pasajero.cedula_persona ? cobro.id_pasajero.cedula_persona : '...'}
                        <br />
                        <b>Valor:</b> {cobro.valor_pagado ? Valor(cobro.valor_pagado) : '...'}
                        <br />
                        <b>Fecha :</b> {cobro.fecha_hora_cobro ? cobro.fecha_hora_cobro.substr(0, 10) : '...'}
                    </div>
                }
            />
        </List.Item>
    );
}
