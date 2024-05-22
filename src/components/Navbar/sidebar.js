import React, { useState, useEffect } from "react";
import { Drawer, Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import './sidebar.css';
import logo from '../../images/logo.png'
function Sidebar({ visible, onClose }) {
    const [t] = useTranslation("global");
    const [bpmnList, setBpmnList] = useState([]); // Estado para almacenar los elementos de bpmnList

    useEffect(() => {
        // Función para obtener los elementos de localStorage y parsearlos
        const fetchBpmnList = () => {
            const storedBpmnList = localStorage.getItem('bpmnList');
            if (storedBpmnList) {
                setBpmnList(JSON.parse(storedBpmnList));
            }
        };

        fetchBpmnList(); // Llamar a la función cuando el componente se monte
    }, []);

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
            open={visible}
        >
            <Menu>
                {bpmnList.map((item, index) => (
                    <Menu.Item key={index}>
                        {item.title}
                    </Menu.Item>
                ))}
            </Menu>
        </Drawer>
    );
}

export default Sidebar;
