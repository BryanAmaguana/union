import React, { useState } from "react";
import { Form, Input, Button, notification /* Select */ } from "antd";
import { CrearPasajero } from "../../../../api/pasajero";
import { getAccessTokenApi } from "../../../../api/auth";
import { UserAddOutlined, ContactsOutlined, DollarCircleOutlined, InfoCircleOutlined, CreditCardOutlined } from '@ant-design/icons';
import { ObtenerPersonaCedula } from "../../../../api/persona";
import { ObtenerTarjetaCodigoP } from "../../../../api/tarjeta"


import "./AddPasajer.scss";

export default function AddPasajeroForm(props) {
    const { setIsVisibleModal, setReloadPasajero, Tipo_Pasajero } = props;
    const [pasajeroData, setPasajeroData] = useState({});
    const [persona, setPersona] = useState({});
    const [tarjeta, setTarjeta] = useState({});

    const TipoPasajero = (fecha, tipo) => {
        var id_tipo = 0;
        var hoy = new Date();
        var cumpleanos = new Date(fecha);
        var edad = hoy.getFullYear() - cumpleanos.getFullYear();
        var m = hoy.getMonth() - cumpleanos.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
            edad--;
        }

        if (edad < 18) {
            for (let i = 0; i < tipo.length; i++) {
                if (tipo[i].nombre === "Estudiante") {
                    id_tipo = tipo[i]._id
                }
            }
        } else if (edad >= 18) {
            for (let i = 0; i < tipo.length; i++) {
                if (tipo[i].nombre === "Adulto") {
                    id_tipo = tipo[i]._id
                }
            }
        } else if (edad >= 60) {
            for (let i = 0; i < tipo.length; i++) {
                if (tipo[i].nombre === "Tercera Edad") {
                    id_tipo = tipo[i]._id
                }
            }
        }else {
            for (let i = 0; i < Tipo_Pasajero.length; i++) {
                if (Tipo_Pasajero[i].nombre === "Especial") {
                    id_tipo = Tipo_Pasajero[i]._id
                }
            }
        }
        return id_tipo;
    }

    const addPasajero = event => {
        event.preventDefault();
        pasajeroData.id_persona = persona._id;
        pasajeroData.id_tarjeta_pasajero = tarjeta._id;
        pasajeroData.cedula_persona = persona.cedula_persona;
        pasajeroData.id_tipo_pasajero = TipoPasajero(persona.fecha_nacimiento_persona, Tipo_Pasajero);
        if (
            !pasajeroData.id_persona ||
            !pasajeroData.cedula_persona ||
            !pasajeroData.id_tarjeta_pasajero ||
            !pasajeroData.id_tipo_pasajero
        ) {
            notification["error"]({
                message: "Todos los campos son obligatorios."
            });

        } else {
            if(pasajeroData.id_tipo_pasajero === tarjeta.descripcion._id){
                const accesToken = getAccessTokenApi();
                CrearPasajero(accesToken, pasajeroData)
                    .then(response => {
                        if (response === "Pasajero creado exitosamente.") {
                            notification["success"]({
                                message: response
                            });
                            setPasajeroData({});
                            setPersona({});
                            setTarjeta({});
                            setIsVisibleModal(false);
                            setReloadPasajero(true);
                        } else {
                            notification["info"]({
                                message: response
                            });
                        }
                    })
                    .catch(err => {
                        notification["error"]({
                            message: err
                        });
                    });
            }else{
                notification["error"]({
                    message: "La tarjeta no coincide con la edad del pasajero"
                });
            }
          
        }
    };

    return (
        <div className="add-pasajero-form">
            <AddForm
                pasajeroData={pasajeroData}
                setPasajeroData={setPasajeroData}
                persona={persona}
                setPersona={setPersona}
                tarjeta={tarjeta}
                setTarjeta={setTarjeta}
                addPasajero={addPasajero}
                Tipo_Pasajero={Tipo_Pasajero}
            />
        </div>
    );
}


function AddForm(props) {
    const { persona, setPersona, /* pasajeroData, setPasajeroData, */ addPasajero, tarjeta, setTarjeta/*  Tipo_Pasajero  */ } = props;
    /*     const { Option } = Select; */
    const accesToken = getAccessTokenApi();

    const PersonaCedula = (props) => {
        ObtenerPersonaCedula(accesToken, props).then(result => {
            if (result.message === "No se ha encontrado ninguna persona.") {
                notification["error"]({
                    message: result.message
                });
                setPersona({});
            } else {
                setPersona(result.persona);
            }
        });
    }

    const CodigoTarjeta = (props) => {
        ObtenerTarjetaCodigoP(accesToken, props, true).then(result => {
            if (result.message === "No se ha encontrado ninguna tarjeta.") {
                notification["error"]({
                    message: result.message
                });
                setTarjeta({});
            } else {
                setTarjeta(result.tarjeta);
            }
        });
    }

    const valor = valor => {
        var cadena = valor;
        var separador = ".";
        var arregloDeSubCadenas = cadena.toString().split(separador, 3);
        if (arregloDeSubCadenas[1] && arregloDeSubCadenas[1].length === 1) {
            cadena = arregloDeSubCadenas[0] + "." + arregloDeSubCadenas[1] + "0";
        }
        return cadena;
    }

    return (

        <Form className="form-edit" onSubmitCapture={addPasajero}>

            {/* ver los datos de la persona */}
            <div className="navbarContenido">
                <div className="BuscadorContenido" >
                    <Input
                        id='Cedula'
                        prefix={<UserAddOutlined />}
                        maxLength="10"
                        placeholder="C??dula de la persona"
                    />
                </div>
                <div className="BuscadorContenido" >
                    <Button type="primary" onClick={() => PersonaCedula(document.getElementById('Cedula').value !== "" ? document.getElementById('Cedula').value : "11")} className="btn-submit">
                        Buscar datos
                    </Button>
                </div>
            </div>

            {/* datos de la persona */}
            <div className="navbarContenido">
                <div className="BuscadorContenido" >
                    <Input
                        prefix={<ContactsOutlined />}
                        placeholder="Nombre "
                        value={persona.nombre_persona}
                    />
                </div>
                <div className="BuscadorContenido" >
                    <Input
                        prefix={<ContactsOutlined />}
                        placeholder="Apellido"
                        value={persona.apellido_persona}
                    />
                </div>
            </div>

            {/* Buscar Tarjeta  */}
            <div className="navbarContenido">
                <div className="BuscadorContenido" >
                    <Input
                        id='CodigoT'
                        prefix={<CreditCardOutlined />}
                        placeholder="C??digo Tarjeta"
                    />
                </div>
                <div className="BuscadorContenido" >
                    <Button type="primary" onClick={() => CodigoTarjeta(document.getElementById('CodigoT').value !== "" ? document.getElementById('CodigoT').value : "11")} className="btn-submit">
                        Buscar Tarjeta
                    </Button>
                </div>
            </div>

            {/* datos de la tarjeta */}
            <div className="navbarContenido">
                <div className="BuscadorContenido" >
                    <Input
                        prefix={<DollarCircleOutlined />}
                        placeholder="Saldo"
                        value={tarjeta.valor_tarjeta ? valor(tarjeta.valor_tarjeta) : "0.00"}
                    />
                </div>
                <div className="BuscadorContenido" >
                    <Input

                        prefix={<InfoCircleOutlined />}
                        placeholder="Descripci??n"
                        value={tarjeta.descripcion ? tarjeta.descripcion.nombre : ""}
                    />
                </div>
            </div>

            {/*             <div className="navbarContenido">
                <Select
                    className="BuscadorContenido2"
                    placeholder="Seleccione tipo de pasajero"
                    onChange={e =>
                        setPasajeroData({ ...pasajeroData, id_tipo_pasajero: e })}
                    value={pasajeroData.id_tipo_pasajero}
                >
                    {Tipo_Pasajero.map((item) => {
                        return <Option key={item._id.toString()} value={`${item._id}`}> {item.nombre} </Option>
                    })}
                </Select>
            </div> */}

            <Form.Item>
                <div className="navbarContenido">
                    <Button type="primary" htmlType="submit" className="btn-submit">
                        Agregar Pasajero
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
}