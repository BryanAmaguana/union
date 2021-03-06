import React, { useState, useEffect } from "react";
import { Switch, List, Button /* Modal as ModalAntd */, notification } from "antd";
import { EditOutlined /* DeleteOutlined */  } from '@ant-design/icons';
import Modal from "../../../Modal";
import DragSortableList from "react-drag-sortable";
import { ActualizarMenuApi, ActivarMenuApi /* deleteMenuApi  */} from "../../../../api/menu";
import { getAccessTokenApi } from "../../../../api/auth";
import AddMenuWebForm from "../AddMenuWeb";
import EditMenuWebForm from "../EditMenuWeb";

import "./ListMenuWeb.scss";

/* const { confirm } = ModalAntd; */

export default function MenuWebList(props) {
    const { menu, setReloadMenuWeb } = props;
    const [listItems, setListItems] = useState([]);
    const [isVisibleModal, setIsVisibleModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState(null);

    useEffect(() => {
        const listItemsArray = [];
        try {
            menu.forEach(item => {
                listItemsArray.push({
                    content: (
                        <MenuItem
                            item={item}
                            activateMenu={activateMenu}
                            editMenuWebModal={editMenuWebModal}
                            /* deleteMenu={deleteMenu} */
                        />
                    )
                });
            });
        } catch (error) {
            console.log("Error del servidor")
        }
            setListItems(listItemsArray);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menu]);

    const activateMenu = (menu, status) => {
        const accesToken = getAccessTokenApi();
        ActivarMenuApi(accesToken, menu._id, status).then(response => {
            notification["success"]({
                message: response
            });
        });
    };

    const OrdenarLista = (sortedList, dropEvent) => {
        const accesToken = getAccessTokenApi();

        sortedList.forEach(item => {
            const { _id } = item.content.props.item;
            const order = item.rank;
            ActualizarMenuApi(accesToken, _id, { order });
        });
    };

    const addMenuWebModal = () => {
        setIsVisibleModal(true);
        setModalTitle("Creando nuevo men??");
        setModalContent(
            <AddMenuWebForm
                setIsVisibleModal={setIsVisibleModal}
                setReloadMenuWeb={setReloadMenuWeb}
            />
        );
    };

/*     const deleteMenu = menu => {
        const accesToken = getAccessTokenApi();

        confirm({
            title: "Eliminando menu",
            content: `??Estas seguro que desea eliminar el menu ${menu.titulo}?`,
            okText: "Eliminar",
            okType: "danger",
            cancelText: "Cancelar",
            onOk() {
                deleteMenuApi(accesToken, menu._id)
                    .then(response => {
                        notification["success"]({
                            message: response
                        });
                        setReloadMenuWeb(true);
                    })
                    .catch(() => {
                        notification["error"]({
                            message: "Error del servidor, intentelo m??s tarde."
                        });
                    });
            }
        });
    }; */

    const editMenuWebModal = menu => {
        setIsVisibleModal(true);
        setModalTitle(`Editando menu: ${menu.titulo}`);
        setModalContent(
            <EditMenuWebForm
                setIsVisibleModal={setIsVisibleModal}
                setReloadMenuWeb={setReloadMenuWeb}
                menu={menu}
            />
        );
    };

    return (
        <div className="menu-web-list">
            <div className="menu-web-list__header">
                <Button type="primary" onClick={addMenuWebModal}>
                    Crear men??
                </Button>
            </div>

            <div className="menu-web-list__items">
                <DragSortableList items={listItems} onSort={OrdenarLista} type="vertical" />
            </div>

            <Modal
                title={modalTitle}
                isVisible={isVisibleModal}
                setIsVisible={setIsVisibleModal}
            >
                {modalContent}
            </Modal>
        </div>
    );
}

function MenuItem(props) {
    const { item, activateMenu, editMenuWebModal/*  deleteMenu */ } = props;

    return (
        <List.Item
            actions={[


                <div className="navbarContenido">
                <div className="BuscadorContenido" >
                <Switch
                    defaultChecked={item.disponible}
                    onChange={e => activateMenu(item, e)}
                />
                </div>
                <div className="BuscadorContenido" >
                <Button type="primary" onClick={() => editMenuWebModal(item)}>
                    <EditOutlined />
                </Button>
      
                  {/* <Tooltip title="Eliminar">
                        <Button type="danger" onClick={() => ConfirmarEliminar()}>
                          <DeleteOutlined />
                        </Button></Tooltip> */}
                </div>
              </div>
            ]}
        >
            <List.Item.Meta title={item.titulo} description={item.url} />
        </List.Item>
    );
}