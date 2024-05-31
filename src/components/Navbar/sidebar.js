import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Drawer, Menu } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './sidebar.css';
import logo from '../../images/logo.png';
import { useDiagramDefinitions } from "../../contexts/DiagramDefinitions";

// Helper function to fetch BPMN List from localStorage
const fetchBpmnListFromStorage = () => {
    console.log("Fetching BPMN List from localStorage");
    const storedBpmnList = localStorage.getItem('bpmnList');
    return storedBpmnList ? JSON.parse(storedBpmnList) : [];
};

function Sidebar({ visible, onClose }) {
    const [t] = useTranslation("global");
    const [bpmnList, setBpmnList] = useState([]);
    const { setDiagramDefinitions } = useDiagramDefinitions();
    const [selectedKey, setSelectedKey] = useState(null); // Estado para rastrear el elemento seleccionado


    useEffect(() => {
        setBpmnList(fetchBpmnListFromStorage());
    }, []);

    const handleOnOpen = () => {
        setBpmnList(fetchBpmnListFromStorage());
    };

    const handleMenuItemClick = (item, index) => {
        setSelectedKey(index); // Establecer el índice del elemento seleccionado
        console.log(setDiagramDefinitions);
        console.log('Menu item clicked:', item);
        //logica de si se presiono algun icono, no pase lo de arriba
    };

    const handleEditClick = (item) => {
        console.log('Edit item clicked:', item);
        // Aquí puedes agregar la lógica para editar el item
    };

    const handleDeleteClick = (item) => {
        console.log('Delete item clicked:', item);
        // Aquí puedes agregar la lógica para eliminar el item
    };

    return (
        <Drawer
            title={
                <div className="logo-title">
                    <img className='logo' src={logo} alt="logo" />
                    <div className="title">{t("IdentiAI")}</div>
                </div>
            }
            className="drawer"
            placement="left"
            closable={true}
            onClose={onClose}
            afterOpenChange={(visible) => {
                if (visible) {
                    handleOnOpen();
                }
            }}
            open={visible}
        >
            <Menu>
                {bpmnList.map((item, index) => (
                    <Menu.Item 
                        key={index}
                        style={{
                            backgroundColor: selectedKey === index ? '#BDBDBD' : '#dbdee0',
                            color: selectedKey === index ? 'black' : 'black'
                        }}
                        onClick={() => handleMenuItemClick(item, index)}
                        >
                        <span >{item.title}</span>
                        <DeleteOutlined 
                            className="icon"

                            onClick={() => handleDeleteClick(item)} 
                        />
                        <EditOutlined 
                            className="icon"

                            onClick={() => handleEditClick(item)} 
                        />
                    </Menu.Item>
                ))}
            </Menu>
        </Drawer>
    );
}

Sidebar.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default Sidebar;
