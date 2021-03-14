import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col, notification, DatePicker } from "antd";
import { UserOutlined, ContactsOutlined, EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';
import { ActualizarPersona } from "../../../../api/persona"
import { getAccessTokenApi } from "../../../../api/auth"

import "./EditPersona.scss"

export default function EditPersonaForm(props) {
    const { persona, setIsVisibleModal, setReloadPersona } = props;
    const [personaData, setPersonaData] = useState({});

    useEffect(() => {
        setPersonaData({
            cedula_persona: persona.cedula_persona,
            nombre_persona: persona.nombre_persona,
            apellido_persona: persona.apellido_persona,
            direccion_persona: persona.direccion_persona,
            celular_persona: persona.celular_persona,
            fecha_nacimiento_persona: persona.fecha_nacimiento_persona
        });
    }, [persona]);

    const updatePersona = e => {
        e.preventDefault();
        const token = getAccessTokenApi();
        let PersonaActualizado = personaData;

        if (!PersonaActualizado.cedula_persona ||
            !PersonaActualizado.nombre_persona ||
            !PersonaActualizado.apellido_persona ||
            !PersonaActualizado.direccion_persona ||
            !PersonaActualizado.celular_persona ||
            !PersonaActualizado.fecha_nacimiento_persona) {
            notification["error"]({
                message: "Datos Incompletos."
            });
            return;
        }

        ActualizarPersona(token, PersonaActualizado, persona._id).then(result => {
            if (result.message === "Persona actualizada correctamente.") {
                setIsVisibleModal(false);
                setReloadPersona(true);
            }
            notification["info"]({
                message: result.message
            });
            setReloadPersona(true);
        });

    };

    return (
        <div className="edit-persona-form">
            <EditForm
                personaData={personaData}
                setpersonaData={setPersonaData}
                updatePersona={updatePersona} />
        </div>
    );
}

function EditForm(props) {
    const { personaData, setpersonaData, updatePersona } = props;

    function onChange(dateString) {
        console.log(personaData.fecha_nacimiento_persona.substr(0,10))
        console.log(personaData.fecha_nacimiento_persona)
        console.log(dateString)
        setpersonaData({ ...personaData, fecha_nacimiento_persona: dateString })
    }

    return (
        <Form className="form-edit" onSubmitCapture={updatePersona}>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item>
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Cédula"
                            maxLength="10"
                            value={personaData.cedula_persona}
                            onChange={e =>
                                setpersonaData({ ...personaData, cedula_persona: e.target.value })
                            }
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item>
                        <DatePicker
                            onChange={onChange}
                            placeholder="Fecha de Nacimiento"
                            className="Fecha"
                            setDate="2021-01-01"
                            />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item>
                        <Input
                            prefix={<ContactsOutlined />}
                            placeholder="Nombre "
                            value={personaData.nombre_persona}
                            onChange={e =>
                                setpersonaData({ ...personaData, nombre_persona: e.target.value })
                            }
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item>
                        <Input
                            prefix={<ContactsOutlined />}
                            placeholder="Apellido"
                            value={personaData.apellido_persona}
                            onChange={e =>
                                setpersonaData({ ...personaData, apellido_persona: e.target.value })
                            }
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item>
                        <Input
                            prefix={<EnvironmentOutlined />}
                            placeholder="Dirección"
                            value={personaData.direccion_persona}
                            onChange={e =>
                                setpersonaData({ ...personaData, direccion_persona: e.target.value })
                            }
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item>
                        <Input
                            prefix={<PhoneOutlined />}
                            placeholder="Celular"
                            maxLength="10"
                            value={personaData.celular_persona}
                            onChange={e =>
                                setpersonaData({ ...personaData, celular_persona: e.target.value })
                            }
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item>
                <Button type="primary" htmlType="submit" className="btn-submit">
                    Actualizar Persona
        </Button>
            </Form.Item>
        </Form>
    );
}
