import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { CrearTipo_Pasajero } from "../../../../api/tipo_pasajero";
import { getAccessTokenApi } from "../../../../api/auth";
import { CreditCardOutlined, DollarCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

import "./AddTipo_Pasajero.scss";

export default function AddTipoForm(props) {
  const { setIsVisibleModal, setReloadTipo } = props;
  const [tipoData, setTipoData] = useState({});

  const addTipo = event => {
    event.preventDefault();
    if (
      !tipoData.nombre ||
      !tipoData.valor ||
      !tipoData.descripcion
    ) {
      notification["error"]({
        message: "Todos los campos son obligatorios."
      });

    } else {
      const accesToken = getAccessTokenApi();
      CrearTipo_Pasajero(accesToken, tipoData)
        .then(response => {
          if (response === "Tipo de pasajero creado exitosamente.") {
            notification["success"]({
              message: response
            });
            setTipoData({});
            setIsVisibleModal(false);
            setReloadTipo(true);
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
    <div className="add-tipo-form">
      <AddForm
        tipoData={tipoData}
        setTipoData={setTipoData}
        addTipo={addTipo}
      />
    </div>
  );
}


function AddForm(props) {
  const { tipoData, setTipoData, addTipo } = props;
  return (
    <Form className="form-edit" onSubmitCapture={addTipo}>
      <div className="navbarContenido">
        <div className="BuscadorContenido" >
          <Input
            prefix={<CreditCardOutlined />}
            placeholder="Nombre"
            value={tipoData.nombre}
            onChange={e =>
              setTipoData({ ...tipoData, nombre: e.target.value })
            }
          />
        </div>

        <div className="BuscadorContenido" >
          <Input
            prefix={<DollarCircleOutlined />}
            placeholder="Valor 00.00"
            type="number"
            min="0"
            step="0.01"
            value={tipoData.valor}
            onChange={e =>
              setTipoData({ ...tipoData, valor: e.target.value })
            }
          />
        </div>
      </div>

      <div className="navbarContenido">
        <div className="BuscadorContenido1" >
          <Input
            prefix={<InfoCircleOutlined />}
            placeholder="Descripci??n"
            value={tipoData.descripcion}
            onChange={e =>
              setTipoData({ ...tipoData, descripcion: e.target.value })
            }
          />
        </div>
      </div>

      <Form.Item>
        <div className="navbarContenido">
          <Button type="primary" htmlType="submit" className="btn-submit">
            Agregar Tipo de Pasajero
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}