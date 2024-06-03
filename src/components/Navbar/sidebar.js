import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Drawer, Menu, Input } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './sidebar.css';
import logo from '../../images/logo.png';
import { useDiagramDefinitions } from "../../contexts/DiagramDefinitions";

const fetchBpmnListFromStorage = () => {
    console.log("Fetching BPMN List from localStorage");
    const storedBpmnList = localStorage.getItem('bpmnList');
    return storedBpmnList ? JSON.parse(storedBpmnList) : [];
};

function Sidebar({ visible, onClose }) {
    const { t } = useTranslation("global");
    const [bpmnList, setBpmnList] = useState([]);
    const { setDiagramDefinitions, diagramDefinitions } = useDiagramDefinitions();
    const [selectedKey, setSelectedKey] = useState(null);
    const [editingKey, setEditingKey] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");

    useEffect(() => {
        setBpmnList(fetchBpmnListFromStorage());
    }, []);

    const handleOnOpen = () => {
        setBpmnList(fetchBpmnListFromStorage());
    };

    const handleMenuItemClick = (item, index) => {
        if (editingKey == null) {
            diagramDefinitions.importXML(item.xml, (err) => {
                if (err) {
                    return console.error("could not import BPMN 2.0 diagram", err);
                }

                const canvas = diagramDefinitions.get("canvas");
                canvas.zoom("fit-viewport");
            });
            setSelectedKey(index);
        }
    };

    const handleEditClick = (item, index) => {
        setEditingKey(index);
        setEditedTitle(item.title);
    };

    const handleDeleteClick = (item, index) => {
        const newList = bpmnList.filter((_, i) => i !== index);
        setBpmnList(newList);
        localStorage.setItem('bpmnList', JSON.stringify(newList));
        if (selectedKey === index) {
            setSelectedKey(null);
        }
    };

    const handleEditChange = (e) => {
        setEditedTitle(e.target.value);
    };

    const handleEditSave = (index) => {
        const newList = [...bpmnList];
        newList[index].title = editedTitle;
        setBpmnList(newList);
        localStorage.setItem('bpmnList', JSON.stringify(newList));
        setEditingKey(null);
        setEditedTitle("");
    };

    const handleEditCancel = () => {
        setEditingKey(null);
        setEditedTitle("");
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
                      style={{
                            backgroundColor: selectedKey === index ? '#BDBDBD' : '#dbdee0',
                            color: selectedKey === index ? 'black' : 'black'
                        }}
                        key={index} 
                        onClick={() => handleMenuItemClick(item, index)}
                    >
                        {editingKey === index ? (
                            <Input 
                                value={editedTitle}
                                onChange={handleEditChange}
                                onPressEnter={() => handleEditSave(index)}
                                onBlur={handleEditCancel}
                            />
                        ) : (
                            <span>{item.title}</span>
                        )}
                        <DeleteOutlined 
                            className="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(item, index);
                            }} 
                        />
                        {editingKey === index ? (
                            <CheckOutlined 
                                className="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditSave(index);
                                }}
                            />
                        ) : (
                            <EditOutlined 
                                className="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditClick(item, index);
                                }} 
                            />
                        )}
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
