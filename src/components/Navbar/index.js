import React from 'react';
import { OpenAI } from 'openai'; // -> Si es con OpenAI
import { Menu, Dropdown, Button, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import './styles.css';


const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, 
});

function Navbar({ onReset }) {
  console.log("API Key:", process.env.REACT_APP_OPENAI_API_KEY);

  const handleAI = async () => {
    try {
      const response = await openai.Completion.create({
        model: "gpt-3.5-turbo",
        prompt: "Realiza la mejor estimación de puntos para historias de usuario segun la bmpn",
        max_tokens: 50,
        temperature: 0.5
      });

      console.log("Respuesta de IA:", response.data.choices[0].text.trim());
      console.log("Sugerencia de IA:", suggestion);
      message.success("Mejores resultados con IA obtenidos");
    } catch (error) {
      console.error("Error al conectar con la IA", error);
      if (error.response) {
        console.log("Datos de la respuesta:", error.response.data);
        console.log("Estado de la respuesta:", error.response.status);
      } else if (error.request) {
        console.log("Petición hecha sin respuesta", error.request);
      } else {
       
        console.log('Error', error.message);
      }
      message.error("Error al realizar la búsqueda con IA");
    }
  };

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

  const fileMenu = (
    <Menu>
      <Menu.Item key="new">Nuevo</Menu.Item>
      <Menu.Item key="save">Guardar</Menu.Item>
      <Menu.Item key="trash">Mover a la papelera</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="history" onClick={() => {/** setMostrarHistorial(!mostrarHistorial)*/}}>Historial</Menu.Item>
    </Menu>
  );

  return (
    <div className="navbar-container">
      <div className="navbar-buttons">
        <Dropdown overlay={fileMenu} className="navbar-dropdown" trigger={['click']} overlayStyle={{ border: 'none' }}>
          <span className="navbar-button">Archivo</span>
        </Dropdown>
      </div>

      <Button className="navbar-button-IA" onClick={handleAI}>Busqueda con IA</Button>

    </div>
  );
}

export default Navbar;