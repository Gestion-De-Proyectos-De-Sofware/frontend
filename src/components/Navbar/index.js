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
import Swal from "sweetalert2";

const openai = new OpenAI({
	apiKey: process.env.REACT_APP_GPT_KEY,
	dangerouslyAllowBrowser: true,
});

function Navbar({ onReset }) {
	const [t, i18n] = useTranslation("global");
	const { diagramDefinitions } = useDiagramDefinitions();

	const colorAI = (yesIds, noIds) => { //Color function
		var elementRegistry = diagramDefinitions.get('elementRegistry') // Get IDs
		var modeling = diagramDefinitions.get('modeling'); // Modeling with the functions of color (and other)
		yesIds.forEach(element => {
			modeling.setColor(elementRegistry.get(element),{
				stroke: 'black',
				fill: 'green'
			});
		});
		noIds.forEach(element => {
			modeling.setColor(elementRegistry.get(element),{
				stroke: 'black',
				fill: 'red'
			});
		});
	}

	const handleChangeLanguage = (lang) => {
		console.log("new language choosen: ", lang);
		if (lang == "English") {
			i18n.changeLanguage("en");
		} else {
			i18n.changeLanguage("es");
		}
	};

	const handleAI = async () => {
		Swal.fire({
			toast: true,
			position: "top-end",
			title: t("sweetalert.bpmnsent"),
			showConfirmButton: false,
			icon: "success",
			customClass: 'swal-aisent',
		});
		let xml = await getXmlFromModeler(diagramDefinitions); // Obtain current xml
		let data; //Answer Object
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

		Este es el diagrama en formato XML: \n${xml} 
		
		`;
		const numTokens = prompt.length / 2.1
		if (numTokens <= 16385){ 
			try {
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
				data = JSON.parse(response.choices[0].message.content.replace(/\n/g, ""));
				Swal.close();
				Swal.fire({
					toast: true,
					position: "top-end",
					title: t("sweetalert.bpmnsucess"),
					showConfirmButton: false,
					icon: "success",
					timer: 2000,
					customClass: 'swal-aisent',
					timerProgressBar: true,
				});
				const BpmnIds = Object.keys(data);		//Every Id on the BPMN
				const BpmnValues = Object.values(data); //Every object related to the Ids
				const { yesIds, noIds } = BpmnValues.reduce((acc, value, index) => { // Go object to object into the BpmnValues list
					const userStories = value.user_stories; //Access user_stories property of every ID
					const id = BpmnIds[index]; 	//If any ID has at least one YES on the ai element, include it into yesIds, if not, in noIds
					const hasYes = userStories.some(story => story.ai.substring(0, 2) === "SI");
					if (hasYes) {
					acc.yesIds.push(id);
					} else {
					acc.noIds.push(id);
					}
					return acc;
				}, { yesIds: [], noIds: [] }); //Variables initialized
				colorAI(yesIds,noIds);
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
				Swal.close();
				Swal.fire({
					toast: true,
					position: "top-end",
					title: t("sweetalert.bpmnerror"),
					showConfirmButton: false,
					icon: "error",
					timer: 2000,
					customClass: 'swal-aisent',
					timerProgressBar: true,
				});
			}
		}
		else{
			Swal.fire({
				toast: true,
				position: "top-end",
				title: t("sweetalert.bpmnsizeerror"),
				showConfirmButton: false,
				icon: "error",
				timer: 2000,
				customClass: 'swal-aisent',
				timerProgressBar: true,
			});
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



	const handleFileMenu = async (e) => {
		switch (e.key) {
			case 'save':
				const xml = await getXmlFromModeler(diagramDefinitions);

				const { value: title } = await Swal.fire({
					title: t("dialogMessages.title"),
					input: "text",
					inputLabel: t("dialogMessages.inputLabel"),
					showCancelButton: true,
					inputValidator: (value) => {
						if (!value) {
							return t("dialogMessages.titleReq");
						}
					}
				});
				if (title) {
					let bpmnList = JSON.parse(localStorage.getItem('bpmnList')) || [];
					const currentDate = new Date();
					const newBPMN = {
						title: title,
						date: currentDate.toISOString(),
						xml: xml
					};
					bpmnList.push(newBPMN);

					localStorage.setItem('bpmnList', JSON.stringify(bpmnList));

					await Swal.fire(`${t("dialogMessages.saveSuccess")} ${title}`);
				}
				break;
			default:
				console.log("No se encontró la file key: ", e.key)
				break;
		}
	};

	const fileMenu = (
		<Menu onClick={handleFileMenu}>
			    <Menu.Item key="new" id="newItem">{t("fileMenu.new")}</Menu.Item>
    			<Menu.Item key="save" id="saveItem" >{t("fileMenu.save")}
				</Menu.Item>
   				<Menu.Item key="trash" id="trashItem">{t("fileMenu.trash")}</Menu.Item>
			<Menu.Divider />
			<Menu.Item
				key="history"
				id="historyItem"
				onClick={() => {
					/** setMostrarHistorial(!mostrarHistorial)*/
				}}
			>
				{t("fileMenu.history")}
			</Menu.Item>
		</Menu>
	);

	return (
		<div className="navbar-container">
			<img className='logo' src={logo} alt="logo"/>
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
			<Button className="navbar-button-IA" onClick={handleAI}>
				{t("body.buttonSearchIA")}
			</Button>
			<DropdownLang onClick={handleChangeLanguage}></DropdownLang>
		</div>
	);
}

export default Navbar;
