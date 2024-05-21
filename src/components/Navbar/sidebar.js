import React from 'react';
import { Drawer, Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import './sidebar.css'; 

function Sidebar({ visible, onClose }) {
    const [t] = useTranslation("global");

    return (
        <Drawer
            title={t("Saved BPMS")}
            placement="left"
            closable={true}
            onClose={onClose}
            open={visible}
        >
            <Menu>
                <Menu.Item key="1">{t("sidebar.item1")}</Menu.Item>
                <Menu.Item key="2">{t("sidebar.item2")}</Menu.Item>
                <Menu.Item key="3">{t("sidebar.item3")}</Menu.Item>
                {/* Add more menu items here */}
            </Menu>
        </Drawer>
    );
}

export default Sidebar;
