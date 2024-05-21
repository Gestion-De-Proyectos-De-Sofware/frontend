import React from "react";
import { Menu, Dropdown, Button, message } from "antd";
import { OpenAI } from "openai";
import { DownOutlined } from "@ant-design/icons";
import "./styles.css";
import { useTranslation } from "react-i18next";
import DropdownLang from "../Dropdown/index";
import { useDiagramDefinitions } from "../../contexts/DiagramDefinitions";
import xmltest from "../../diagramCreator/resources/test.bpmn";
import logo from '../../images/logo.png'

const openai = new OpenAI({
	apiKey: process.env.REACT_APP_GPT_KEY,
	dangerouslyAllowBrowser: true,
});

function Navbar({ onReset }) {
	const [t, i18n] = useTranslation("global");
	const { diagramDefinitions } = useDiagramDefinitions();

	const handleChangeLanguage = (lang) => {
		console.log("new language choosen: ", lang);
		if (lang == "English") {
			i18n.changeLanguage("en");
		} else {
			i18n.changeLanguage("es");
		}
	};

	const handleAI = async () => {
		console.log("debugging definitions: ", diagramDefinitions);
		// console.log(
		// 	"getting xml from modeler: ",
		// 	getXmlFromModeler(diagramDefinitions)
		// 		.then((xml) => {
		// 			console.log("xml obtenido con exito: ", xml);
		// 		})
		// 		.catch((error) => {
		// 			console.error("Error obteniendo definiciones del diagrama:", error);
		// 		})
		// );

		try {
			// const xml = await getXmlFromModeler(diagramDefinitions);

			// console.log("XML obtenido con exito: ", xml);

			const prompt = `Imagina que eres un analista de sistemas y tienes frente a ti un diagrama de proceso de negocio (BPM) en formato XML que describe un proceso completo en una empresa o aplicación. 
      
      Tu tarea es analizar este diagrama y extraer de cada subproceso (no te puede faltar ningún subproceso sin analizar) (los subprocesos los puedes identificar como los <task>, <sequenceFlow>, <receiveTask> <exclusiveGateway> <messageFlow> en el XML) las historias de usuario (HU) asociadas. 
      
      Debes identificar al menos dos historias por cada subproceso y describirlas detalladamente. Presenta tus hallazgos en formato JSON como se muestra a continuación:

      {
        "(id del subproceso)" : {
          "name": "Nombre del subproceso según el diagrama XML",
          "description": "Descripción de las actividades clave que se realizan en este subproceso",
          "user_stories": [
            {
              "id": "hu1",
              "description": "Descripción de la historia de usuario 1",
              "ai": "SI/NO - Justificación breve de la aplicabilidad de IA"
            },
            {
              "id": "hu2",
              "description": "Descripción de la historia de usuario 2",
              "ai": "SI/NO - Justificación breve de la aplicabilidad de IA"
            }
          ]
        },
        [agrega el resto de subprocesos]
        
      }
      
      Para cada historia de usuario, evalúa si las actividades implicadas pueden ser automatizadas o asistidas por tecnologías de inteligencia artificial. Justifica brevemente tu respuesta, considerando la complejidad de las tareas, la necesidad de entender o procesar lenguaje natural, reconocimiento de patrones, toma de decisiones o cualquier otro elemento relevante que la IA podría manejar.

      Notas adicionales:
      -El (id del subproceso) y el name son el id y name que se muestra en el XML (por ejemplo): <task id="Task_020wfhh" name="Hacer orden de compra">.
      -Un subproceso son todos los elementos dentro de un <process> en el XML; debes analizar todos los <task> <sequenceFlow> <receiveTask> <exclusiveGateway> <messageFlow>.

      Este es el diagrama en formato XML: \n${xmltest} 
      
      `;

			console.log("Enviando solicitud a GPT");
			const response = await openai.chat.completions.create({
				model: "gpt-3.5-turbo",
				// prompt: prompt,
				// max_tokens: 50,
				temperature: 0.5,
				messages: [
					{
						content: prompt,
						role: "user",
					},
				],
			});

			console.log("RESPUESTA");
			// console.log(response.choices);
			const data = JSON.parse(response.choices[0].message.content.replace(/\n/g, ""));
			console.log(JSON.stringify(data));
			console.log(data);
			// console.log("Respuesta de IA:", response.data.choices[0].text.trim());
			// console.log("Sugerencia de IA:", suggestion);
			// message.success("Mejores resultados con IA obtenidos");
		} catch (error) {
			console.error("Error al conectar con la IA", error);
			if (error.response) {
				console.log("Datos de la respuesta:", error.response.data);
				console.log("Estado de la respuesta:", error.response.status);
			} else if (error.request) {
				console.log("Petición hecha sin respuesta", error.request);
			} else {
				console.log("Error", error.message);
			}
			message.error("Error al realizar la búsqueda con IA");
		}
	};

	function getXmlFromModeler(modeler) {
		return new Promise((resolve, reject) => {
			modeler.saveXML({ format: true }, (err, xml) => {
				if (err) {
					reject(err);
				} else {
					resolve(xml);
				}
			});
		});
	}

	{
		/**  
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
  */
	}

	const handleExportImage = () => {
		// const canvas = document.querySelector("canvas");
		// if (canvas) {
		//   canvas.toBlob((blob) => {
		//     const url = URL.createObjectURL(blob);
		//     const link = document.createElement("a");
		//     link.href = url;
		//     link.download = "diagram.png";
		//     link.click();
		//     URL.revokeObjectURL(url);
		//     message.success("Imagen exportada con éxito");
		//   });
		// }
	  };

	const fileMenu = (
		<Menu>
			    <Menu.Item key="new" id="newItem">{t("fileMenu.new")}</Menu.Item>
    			<Menu.Item key="save" id="saveItem">{t("fileMenu.save")}</Menu.Item>
				<Menu.Item
				key="history"
				id="historyItem"
				onClick={() => {
					/** setMostrarHistorial(!mostrarHistorial)*/
				}}
			>
				{t("fileMenu.history")}
			</Menu.Item>
			<Menu.Divider />
			<Menu.Item key="trash" id="trashItem">{t("fileMenu.trash")}</Menu.Item>
		</Menu>
	);


	return (
		<div className="navbar-container">
			 <div className="logo-title">
				<img className='logo' src={logo} alt="logo"/>
				<div className="title">{t("IdentiAI")}</div>
			</div>
			<div className="navbar-buttons">
				<Dropdown
					overlay={fileMenu}
					className="navbar-dropdown"
					trigger={["click"]}
					overlayStyle={{ border: "none" }}
				>
					<span className="navbar-button">{t("body.buttonFileName")}</span>
				</Dropdown>
			</div>
			<Button className="navbar-button-export" onClick={handleExportImage}>
				<span className="navbar-container">{t("body.buttonExport")}</span>
      		</Button>
			<Button className="navbar-button-IA" onClick={handleAI}>
				{t("body.buttonSearchIA")}
			</Button>
			<DropdownLang onClick={handleChangeLanguage}></DropdownLang>
		</div>
	);
}

export default Navbar;
