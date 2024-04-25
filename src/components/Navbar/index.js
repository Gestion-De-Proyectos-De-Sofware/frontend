import React from 'react';
import { Menu, Dropdown, Button, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import './styles.css';
import { useTranslation } from 'react-i18next';
import DropdownLang from '../Dropdown/index';

function Navbar({ onReset }) {

  const [t, i18n] = useTranslation("global")

  const handleChangeLanguage = (lang) => {
    console.log("new language choosen: ",lang)
    if (lang == "English"){
      i18n.changeLanguage("en");
    }else{
      i18n.changeLanguage("es");
    }
    
  }

  {/**  
    const handleSave = () => {
        const data = new Blob(["Contenido del archivo"], { type: 'text/plain' });
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'archivo_guardado.txt';
        link.click();
        window.URL.revokeObjectURL(url);
        message.success("Archivo guardado localmente");
      };

    const handleNew = () => {
        if (window.confirm("¿Está seguro de eliminar lo realizado y crear un lienzo nuevo?")) {
          // Aquí agregas la lógica para borrar el trabajo actual y empezar uno nuevo
          console.log("Lienzo nuevo creado");
          message.success("Lienzo nuevo creado");
        }
      };
    
    
      const handleDuplicate = () => {
        // Aquí agregas la lógica para duplicar el contenido actual
        console.log("Contenido duplicado");
        message.success("Contenido duplicado");
      };
    
      const handleTrash = () => {
        if (window.confirm("¿Está seguro de eliminar todo lo realizado?")) {
          // Aquí agregas la lógica para borrar todo el trabajo realizado
          console.log("Todo eliminado");
          message.success("Todo eliminado");
        }
      };
  */}

  const handleAI = async () => {
    console.log(t("header.messageSuccess"));
    message.success(t("header.messageSuccess"));
  };


  const fileMenu = (
    <Menu>
      <Menu.Item key="new">{t("fileMenu.new")}</Menu.Item>
      <Menu.Item key="save">{t("fileMenu.save")}</Menu.Item>
      <Menu.Item key="trash">{t("fileMenu.trash")}</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="history" onClick={() => {/** setMostrarHistorial(!mostrarHistorial)*/}}>{t("fileMenu.history")}</Menu.Item>
    </Menu>
  );

  

  return (
    <div className="navbar-container">
      <div className="navbar-buttons">
        <Dropdown overlay={fileMenu} className="navbar-dropdown" trigger={['click']} overlayStyle={{ border: 'none' }}>
          <span className="navbar-button">{t("body.buttonFileName")}</span>
        </Dropdown>
      </div>
      <Button className="navbar-button-IA" onClick={handleAI}>{t("body.buttonSearchIA")}</Button>
      <DropdownLang onClick={handleChangeLanguage}></DropdownLang>
    </div>
  );
}

export default Navbar;