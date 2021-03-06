import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { CrearBus } from "../../../../api/bus";
import { getAccessTokenApi } from "../../../../api/auth";
import { FieldNumberOutlined, CreditCardOutlined, UserAddOutlined, ContactsOutlined } from '@ant-design/icons';
import { ObtenerPersonaCedula } from "../../../../api/persona";

import "./AddBus.scss";

export default function AddBusForm(props) {
  const { setIsVisibleModal, setReloadBus } = props;
  const [busData, setbusData] = useState({});
  const [persona, setPersona] = useState({});

  const addBus = event => {
    event.preventDefault();
    busData.id_persona = persona._id;
    if (
      !busData.numero_bus ||
      !busData.placa_bus ||
      !busData.id_persona
    ) {
      notification["error"]({
        message: "Todos los campos son obligatorios."
      });

    } else {
      const accesToken = getAccessTokenApi();
      CrearBus(accesToken, busData)
        .then(response => {
          if (response === "Bus creado exitosamente.") {
            notification["success"]({
              message: response
            });
            setbusData({});
            setPersona({});
            setIsVisibleModal(false);
            setReloadBus(true);
          } else {
            notification["error"]({
              message: response
            });
          }
        })
        .catch(err => {
          notification["error"]({
            message: err
          });
        });
    }
  };

  return (
    <div className="add-bus-form">
      <AddForm
        busData={busData}
        setbusData={setbusData}
        persona={persona}
        setPersona={setPersona}
        addBus={addBus}
        setReloadBus={setReloadBus}
      />
    </div>
  );
}


function AddForm(props) {
  const { persona, setPersona, busData, setbusData, addBus, setReloadBus } = props;

  const accesToken = getAccessTokenApi();

  const PersonaCedula = (props) => {
    ObtenerPersonaCedula(accesToken, props).then(result => {
      if (result.message === "No se ha encontrado ninguna persona.") {
        notification["error"]({
          message: result.message
        });
        setPersona({});
        setReloadBus(true);
      } else {
        setPersona(result.persona);
      }
    });
  }

  return (

    <Form className="form-edit" onSubmitCapture={addBus}>
      {/* ver los datos de la persona */}

      <div className="navbarContenido">
        <div className="BuscadorContenido" >
          <Input
            id='Cedula'
            prefix={<UserAddOutlined />}
            placeholder="C??dula de la persona"
            maxLength="10"
            value={persona.Vacio}
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

      <div className="navbarContenido">
        <div className="BuscadorContenido" >
          <Input
            prefix={<FieldNumberOutlined />}
            placeholder="Numero de Bus"
            type="number"
            min="0"
            value={busData.numero_bus}
            onChange={e =>
              setbusData({ ...busData, numero_bus: e.target.value, id_persona: persona._id })
            }
          />
        </div>
        <div className="BuscadorContenido" >
          <Input
            prefix={<CreditCardOutlined />}
            placeholder="Placa del Bus"
            value={busData.placa_bus}
            maxLength="7"
            onChange={e =>
              setbusData({ ...busData, placa_bus: e.target.value.toUpperCase(), id_persona: persona._id })
            }
          />
        </div>
      </div>
      <Form.Item>
        <div className="navbarContenido">
          <Button type="primary" htmlType="submit" className="btn-submit">
            Agregar Bus
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}