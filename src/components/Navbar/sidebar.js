import React, { useState, useEffect } from "react";
import { Drawer, Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import './sidebar.css';
import logo from '../../images/logo.png';
import {useDiagramDefinitions} from "../../contexts/DiagramDefinitions";

function Sidebar({ visible, onClose }) {
    const [t] = useTranslation("global");
    const [bpmnList, setBpmnList] = useState([]); // Estado para almacenar los elementos de bpmnList
    const { setDiagramDefinitions} = useDiagramDefinitions();
    // Función para obtener los elementos de localStorage y parsearlos
    const fetchBpmnList = () => {
        console.log("Fetching BPMN List from localStorage");
        const storedBpmnList = localStorage.getItem('bpmnList');
        if (storedBpmnList) {
            setBpmnList(JSON.parse(storedBpmnList));
        }
    };

    useEffect(() => {
        fetchBpmnList(); // Llamar a la función cuando el componente se monte
    }, []);

    // Función que se llama al abrir el Drawer
    const handleOnOpen = () => {
        fetchBpmnList(); // Actualizar la lista cuando se abre el Drawer
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
            afterOpenChange ={(visible) => {
                if (visible) {
                    handleOnOpen();
                }
            }}
            open={visible}
        >
            <Menu>
                {bpmnList.map((item, index) => (
                    <Menu.Item key={index} onClick={() => {console.log(setDiagramDefinitions);console.log('Menu item clicked:', item)}}>
                        {item.title}
                    </Menu.Item>
                ))}
            </Menu>
        </Drawer>
    );
}

export default Sidebar;
