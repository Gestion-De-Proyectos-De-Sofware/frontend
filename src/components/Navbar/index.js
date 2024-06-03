import React, { useState, useEffect } from "react";
import { Menu, Dropdown, Button, message, ConfigProvider } from "antd";
import { OpenAI } from "openai";
import { TinyColor } from "@ctrl/tinycolor";
import "./styles.css";
import { useTranslation } from "react-i18next";
import DropdownLang from "./Dropdown/index";
import { useDiagramDefinitions } from "../../contexts/DiagramDefinitions";
import xmltest from "../../diagramCreator/resources/test.bpmn";
import logo from "../../images/logo.png";
import Swal from "sweetalert2";
import { DownOutlined, MenuOutlined } from "@ant-design/icons"; // Import MenuOutlined for the sidebar button
import Sidebar from "./sidebar";
import styled from "styled-components";
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import sidebar from "./sidebar";


const openai = new OpenAI({
	apiKey: process.env.REACT_APP_GPT_KEY,
	dangerouslyAllowBrowser: true,
});

async function removeBpmndiSection(xml) {
	// Encontrar el índice donde empieza la etiqueta <bpmndi>
	const bpmndiIndex = xml.indexOf("<bpmndi");

	// Si se encuentra la etiqueta, cortar el XML hasta ese punto
	if (bpmndiIndex !== -1) {
		xml = xml.substring(0, bpmndiIndex);
		// Opcionalmente puedes agregar la etiqueta de cierre para mantener un XML bien formado
		xml += "</definitions>";
	}

	return xml;
}

// Function to extract and print descriptions
function gatherDescriptions(data) {
	const descriptions = [];

	for (const key in data) {
		if (data[key].justification) {
			descriptions.push(data[key].justification);
		}
		if (data[key].user_stories) {
			data[key].user_stories.forEach((story) => {
				if (story.ai == "SI") {
					descriptions.push(story.ai);
				}
				if (story.justification) {
					descriptions.push(story.justification);
				}
			});
		}
	}

	return descriptions;
}

function getIdsWithNameAttribute(xml) {
	const elements = xml.getElementsByTagName("*");
	const ids = [];
	for (let i = 0; i < elements.length; i++) {
		if (
			elements[i].hasAttribute("name") &&
			elements[i].nodeName !== "participant" &&
			elements[i].nodeName !== "process" &&
			elements[i].nodeName !== "lane" &&
			elements[i].nodeName !== "messageFlow" &&
			elements[i].nodeName !== "flowNodeRef"
		) {
			// console.log(elements[i].getAttribute("id"));
			if (elements[i].getAttribute("id") != null) {
				ids.push(elements[i].getAttribute("id"));
			}
		}
	}
	return ids;
}

const colors1 = ["#11B0CA", "#0B5F6D"];
const getHoverColors = (colors) =>
	colors.map((color) => new TinyColor(color).lighten(5).toString());
const getActiveColors = (colors) =>
	colors.map((color) => new TinyColor(color).darken(5).toString());

const GradientButton = styled(Button)`
	background-color: #0e4690;
	border: none;
	padding: 10px 20px;
	font-size: 16px;
	font-weight: bold;
	font-style: oblique;
	cursor: pointer;
	transition: background 0.3s ease !important;

	&:hover {
		background: linear-gradient(135deg, ${getHoverColors(colors1).join(", ")}) !important;
		color: white !important;
		transition: background 0.4s ease !important;
	}
	&:active {
		background: linear-gradient(135deg, ${getActiveColors(colors1).join(", ")}) !important;
		color: white !important;
	}
`;

function Navbar({ onReset }) {
	const [t, i18n] = useTranslation("global");
	const { diagramDefinitions, newDiagram, reset, canvas } = useDiagramDefinitions();
	const [sidebarVisible, setSidebarVisible] = useState(false); // State to manage sidebar visibility
	const [bpmnList, setBpmnList] = useState(JSON.parse(localStorage.getItem('bpmnList')) || []);
	const [currentBPMNIndex, setCurrentBPMNIndex] = useState(null);
	const [menuVisible, setMenuVisible, trashMenuVisible, setTrashMenuVisible] = useState(false);


	useEffect(() => {
        // Cargar BPMN list del almacenamiento local al inicializar el componente
        const storedBpmnList = JSON.parse(localStorage.getItem('bpmnList')) || [];
        setBpmnList(storedBpmnList);
    }, []);

	const { SubMenu } = Menu;

	const onTitleClick = (e) => {
		if (e && e.stopPropagation) {
			e.stopPropagation();
		}
	};

	const colorAI = (yesIds, noIds) => {
		//Color function
		var elementRegistry = diagramDefinitions.get("elementRegistry"); // Get IDs
		var modeling = diagramDefinitions.get("modeling"); // Modeling with the functions of color (and other)
		yesIds.forEach((element) => {
			modeling.setColor(elementRegistry.get(element), {
				stroke: "black",
				fill: "green",
			});
		});
		noIds.forEach((element) => {
			modeling.setColor(elementRegistry.get(element), {
				stroke: "black",
				fill: "red",
			});
		});
	};

	const handleChangeLanguage = (lang) => {
		console.log("new language choosen: ", lang);
		if (lang == "English") {
			i18n.changeLanguage("en");
		} else {
			i18n.changeLanguage("es");
		}
	};

	const template = {
		name: "Nombre subproceso según XML",
		user_stories: [
			{
				id: "hu1",
				description: "Describir historia de usuario 1",
				ai: "SI/NO",
				justification: "Justificar aplicabilidad IA. Cuáles tecnologías (TERCER PASO)",
			},
			{
				id: "hu2",
				description: "Describir historia de usuario 2",
				ai: "SI/NO",
				justification: "Justificar aplicabilidad IA. Cuáles tecnologías (TERCER PASO)",
			},
		],
	};

	const generateJson = (ids, template) => {
		let result = {};
		ids.forEach((id) => {
			result[id] = JSON.parse(JSON.stringify(template)); // deep copy of template
		});
		return result;
	};

	const handleAI = async () => {
		Swal.fire({
			toast: true,
			position: "top-end",
			title: t("sweetalert.bpmnsent"),
			showConfirmButton: false,
			icon: "success",
			customClass: "swal-aisent",
		});
		let xml = await getXmlFromModeler(diagramDefinitions); // Obtain current xml

		// console.log("XML:", xml);

		let modifiedXml = await removeBpmndiSection(xml);
		// console.log("Modified XML:", modifiedXml);

		const parser = new DOMParser();

		const xmlDoc = parser.parseFromString(modifiedXml, "application/xml");

		const ids = getIdsWithNameAttribute(xmlDoc);
		// console.log(ids);

		const jsonOutput = generateJson(ids, template);
		const jsonOutputStringify = JSON.stringify(jsonOutput, null, 4);

		let data; //Answer Object
		const prompt = `Imagina que eres un analista de sistemas y tienes frente a ti un diagrama de proceso de negocio (BPM) en formato XML que describe un proceso completo en una empresa o aplicación 

		-----------------------------------------------------
		PRIMER PASO - IDENTIFICAR POSIBLES HISTORIAS DE USUARIO A PARTIR DE CADA UNO DE LOS SUBPROCESOS EN EL BPM
		
		Tu tarea es analizar este diagrama y analizar los siguientes subprocesos que serán consignados en la respuesta final en un JSON: \n${ids} (estos son los ids de los subprocesos que hay en el XML) 
		
		Para cada subproceso, describe detalladamente entre 1 y 10 posibles HUs que sean críticas para el proceso.
		
		Por ejemplo si un subproceso es "Realizar compra". Las historias que podrían ser necesarias son las siguientes: 
		-Obtener datos del cliente
		-Seleccionar medio de pago
		-Validar tarjeta según medio de pago

		-----------------------------------------------------
		SEGUNDO PASO - IDENTIFICAR HISTORIAS DE USUARIO QUE PUEDEN SER REALIZABLES POR INTELIGENCIA ARTIFICIAL EN SU TOTALIDAD, O PARCIALMENTE

		Para cada historia de usuario, evalúa si las actividades implicadas pueden ser automatizadas o asistidas por tecnologías de inteligencia artificial, enfocándote en mejorar o asistir las funcionalidades ya existentes en el sistema sin inventar nuevas funcionalidades que no están evidenciadas en el BPM. Justifica tu respuesta, considerando la complejidad de las tareas, la necesidad de entender o procesar lenguaje natural, reconocimiento de patrones o cualquier otro elemento relevante que la IA podría manejar. Describe brevemente por qué una HU es o no es adecuada para ser realizada con IA, utilizando ejemplos de tecnologías o algoritmos específicos de IA cuando sea posible

		Criterios de evaluación de IA:
		- ¿La HU involucra la recolección y procesamiento de grandes volúmenes de datos?
		- ¿Es la interacción o el input humano reemplazable mediante bots o interfaces de IA?
		- ¿Involucra la toma de decisiones basada en el análisis predictivo o reconocimiento de patrones?
		- ¿Es esta una tarea repetitiva que consume mucho tiempo y que podría ser más eficiente con IA?
		- ¿Aportaría la IA mejoras significativas en eficiencia o experiencia del usuario sin complicar innecesariamente el proceso?
		- ¿Es tecnológicamente factible implementar IA para esta tarea sin excesiva inversión en recursos o alteración del sistema existente?
		- ¿Es realmente necesario incluir IA para esta tarea? 

		Las historias que marques como realizables por IA, deben cumplir mínimo 3 de los criterios anteriores y obligatoriamente el criterio de ¿Es realmente necesario incluir IA para esta tarea?
		
		-> Ejemplos de historias de usuario que pueden ser realizadas con inteligencia artificial:

		Que requieran uso de herramientas como reconocimiento de voz a texto, texto a voz, web scraping, reconocimiento de imagenes o patrones, entre otros
		Como gerente de atención al cliente, quiero un chatbot de IA que responda preguntas comunes para reducir el tiempo de espera de los clientes
		Como usuario de una aplicación de fitness, deseo recibir recomendaciones personalizadas de ejercicios basadas en mi progreso y objetivos
		Como especialista en marketing, quiero que un sistema de IA analice las tendencias de consumo para optimizar nuestras campañas publicitarias
		Como editor de un periódico, necesito una herramienta de IA que sugiera titulares atractivos basados en el contenido de los artículos
		Como comprador en línea, quiero un asistente de compra virtual que me recomiende productos basados en mis compras anteriores y preferencias
		Como analista financiero, deseo utilizar algoritmos de IA para predecir tendencias del mercado y asesorar mejor a mis clientes
		Como usuario de una aplicación de citas, quiero que un algoritmo de IA me sugiera matches potenciales basados en compatibilidad de intereses y personalidades
		Como administrador de redes sociales, necesito una herramienta de IA que genere automáticamente contenido atractivo para mejorar el engagement en nuestras plataformas
		Como reclutador, quiero un sistema de IA que analice currículos automáticamente para encontrar los candidatos más adecuados para una vacante
		Como investigador, necesito una herramienta de IA que realice revisiones de literatura y resuma investigaciones relevantes en mi campo
		Como usuario, quiero poder ingresar mi búsqueda por voz
		Como gerente de atención al cliente, deseo utilizar herramientas de IA para realizar análisis de sentimiento y resumir las respuestas de las encuestas, ayudando a comprender mejor la satisfacción del cliente
		Como agente de atención al cliente, necesito que las consultas sean clasificadas automáticamente por urgencia y tema para priorizar mi trabajo de manera eficiente
		Como supervisor de atención al cliente, quiero que los tickets sean asignados automáticamente al agente más adecuado para mejorar la eficiencia en la resolución de problemas
		Como empleado de ventas, deseo recibir recomendaciones automáticas de productos alternativos para ofrecer a los clientes
		Como cliente, deseo recibir sugerencias de productos complementarios a mi orden
		Como cliente, quiero recibir recomendaciones de productos similares en caso de que no haya stock
		Como gerente de recursos humanos, quiero una herramienta de IA que realice entrevistas preliminares con candidatos para filtrar a los más adecuados
		Como agricultor, quiero un sistema de IA que analice las condiciones del suelo y el clima para optimizar el riego y fertilización de mis cultivos
		Como administrador de un hospital, necesito una IA que pueda predecir la ocupación de camas para mejorar la planificación de recursos
		Como profesor, quiero un asistente de IA que califique automáticamente los exámenes de opción múltiple para ahorrar tiempo
		Como usuario de una aplicación de salud mental, deseo recibir recomendaciones personalizadas de meditación basadas en mi estado de ánimo
		Como médico, quiero un sistema que analice imágenes de resonancias magnéticas para detectar posibles anomalías
		Como usuario de una aplicación de música, deseo recibir recomendaciones de canciones y artistas nuevos basados en mis preferencias y hábitos de escucha
		Como profesor, quiero una herramienta que evalúe automáticamente los ensayos de los estudiantes y proporcione comentarios detallados
		Como encargado de un servicio de atención al cliente, quiero un sistema que clasifique automáticamente las consultas de los clientes por prioridad
		Como gestor de contenido, deseo una herramienta que me sugiera palabras clave y etiquetas para mejorar el SEO de nuestros artículos


		-> Ejemplos de historias de usuario NO realizables de alguna manera con inteligencia artificial: 

		Como encargado de almacén, quiero recibir una notificación cuando el stock de un producto esté por debajo del nivel mínimo para reponerlo
		Como usuario, quiero poder solicitar una orden de compra para adquirir materiales de oficina
		Como gerente, quiero poder autorizar una orden de compra para la adquisición de nuevos equipos de trabajo
		Como supervisor de compras, quiero recibir un informe automatizado con la disponibilidad de los productos en stock para agilizar la autorización de órdenes de compra
		Como proveedor, quiero recibir una notificación automática cuando se realice el pago de una factura
		Como cliente, quiero que se abra la información del producto en mi aplicación móvil después de escanear el código QR
		Como cliente, deseo recibir notificaciones por correo electrónico sobre las promociones mensuales para aprovechar las ofertas especiales
		Como usuario final, necesito una opción de restablecimiento de contraseña para recuperar mi acceso cuando lo olvide
		Como desarrollador, quiero tener acceso a una API documentada para integrar rápidamente nuestra solución con sistemas externos
		Como jugador en una app de videojuegos, quiero poder guardar mi progreso automáticamente para no perder mi avance al salir del juego
		Como administrador, quiero poder asignar tareas a los empleados para gestionar mejor la carga de trabajo
		Como gerente de proyecto, quiero ver un dashboard de progreso del proyecto para monitorear el estado de todas las tareas activas
		Como analista de datos, necesito exportar informes en formato CSV para realizar análisis offline
		Como comprador en un e-commerce, quiero agregar productos a un carrito de compras para revisarlos antes de finalizar mi compra
		Como miembro de soporte técnico, necesito poder acceder al historial de interacciones del cliente para proporcionar un servicio más personalizado
		Como paciente, deseo poder reservar citas médicas en línea para evitar llamadas telefónicas y esperas
		Como cliente, quiero escanear el código QR para acceder a la información del producto
		Como cliente, quiero poder enviar fácilmente mis consultas a través de la plataforma para que sean atendidas de manera rápida
		Como agente de atención al cliente, necesito contactar al cliente para obtener más detalles sobre su consulta, asegurando que tengo toda la información necesaria para proceder
		Como agente de atención al cliente, quiero evaluar cada consulta y determinar las posibles soluciones para responder efectivamente a las necesidades del cliente
		Como técnico de soporte, necesito actualizar el sistema con los detalles de la solución aplicada para mantener un registro preciso del caso
		Como agente de atención al cliente, quiero verificar con el cliente si la solución proporcionada ha resuelto su problema satisfactoriamente para asegurar la calidad del servicio
		Como gerente de atención al cliente, quiero que se envíe automáticamente una encuesta de satisfacción al finalizar la interacción para evaluar la calidad del servicio proporcionado
		Como empleado de bodega, deseo recibir instrucciones claras sobre cómo empacar la mercancía de forma eficiente
		Como empleado de ventas, deseo recibir las órdenes de compra de forma clara y organizada
		Como cliente, deseo recibir sugerencias de productos alternativos en caso de que el producto seleccionado no esté disponible
		Como empleado de ventas, deseo recibir notificaciones automáticas sobre cambios sugeridos en las órdenes de compra
		Como sistema, debo registrar el inicio de un nuevo proceso de compra para su seguimiento
		Como cliente, deseo poder realizar una orden de compra de manera sencilla y rápida
		Como cliente, deseo recibir confirmación de mi orden de compra de manera inmediata
		Como sistema, debo procesar y registrar las órdenes recibidas de los clientes
		Como cliente, deseo recibir sugerencias de productos similares en caso de que el producto seleccionado no esté disponible
		Como sistema, debo verificar automáticamente si hay suficiente stock para procesar una orden
		Como empleado de bodega, deseo recibir notificaciones automáticas sobre las órdenes de empaque pendientes
		Como sistema, debo generar automáticamente la etiqueta de envío y coordinar la logística de entrega
		Como cliente, quiero poder agregar productos al carrito de compra para realizar una orden
		Como cliente, quiero recibir confirmación de mi orden de compra
		Como empleado de ventas, deseo recibir notificaciones automáticas sobre la disponibilidad de mercancías para informar al cliente
		Como empleado de ventas, necesito recibir alertas automáticas cuando el stock de un producto esté por debajo del nivel mínimo
		Como empleado de bodega, deseo recibir sugerencias de empaquetado eficiente para optimizar el proceso de envío
		Como empleado de logística, deseo recibir rutas de envío optimizadas para garantizar la entrega puntual
		Como cliente, deseo recibir una confirmación automática de la finalización de mi orden y envío
		Como comerciante en línea, deseo una IA que gestione automáticamente el inventario y haga pedidos a los proveedores cuando el stock sea bajo
		As an employee, I want to send goods for delivery accurately and timely

		Asegúrate de que cada historia de usuario identificada para automatización o asistencia por IA esté basada en requerimientos o funcionalidades reales observadas en el diagrama BPMN. Cualquier propuesta de IA debe mejorar directamente estos aspectos sin añadir elementos externos al flujo de procesos establecido. En tus respuestas, limita la creatividad y céntrate en aplicaciones de IA que mejoren o agilicen las funcionalidades ya documentadas. No introduzcas nuevas funcionalidades que no se derivan directamente de los procesos y tareas existentes en el diagrama BPMN

		-----------------------------------------------------
		TERCER PASO - TECNOLOGÍAS PARA REALIZAR LA HISTORIA DE USUARIO
		Por cada historia de usuario que hayas identificado como realizable con IA, deberás proporcionar las tecnologías, librerías, herramientas o software que permiten llevar a cabo la historia de usuario, algunos ejemplos son (no te tienes que limitar solo a estos): Amazon Personalize,Google Cloud Speech-to-Text,Azure Speech,NLTK,spaCy,OpenAI GPT,OpenCV,TensorFlow,Keras,Azure Machine Learning, entre otros.
		Explica la razón de tus elecciones en mínimo 40 palabras y sé específico con las tecnologías a usar.

		-----------------------------------------------------
		CUARTO PASO - GENERAR RESPUESTA

		Este es el diagrama en formato XML: \n${modifiedXml} 
		Analizando el idioma en el que están escritos los name de las task, deberás responder en ese idioma. Responde con el idioma en el que están escritas los name de las task en el XML
				
		IMPORTANTE: Debes incluir los siguientes subprocesos (a continuación se indican sus id) en el JSON, NO te puede hacer falta ninguno, ya que esto afecta el uso que le daré a la respuesta que des: \n${ids}

		Recuerda limitar la creatividad.
		La respuesta de tus hallazgos será en este formato JSON: \n${jsonOutputStringify}
		`;

		// console.log(prompt);
		const numTokens = prompt.length / 2.1;

		console.log("Tokens restantes = ", 16385 - numTokens);

		if (numTokens <= 16385) {
			try {
				console.log("Solicitud a GPT enviada");
				const response = await openai.chat.completions.create({
					model: "gpt-3.5-turbo",
					// prompt: prompt,
					// max_tokens: 50,
					temperature: 0.2,
					messages: [
						{
							content: prompt,
							role: "user",
						},
					],
				});

				console.log(response);

				data = JSON.parse(response.choices[0].message.content.replace(/\n/g, ""));
				Swal.close();
				Swal.fire({
					toast: true,
					position: "top-end",
					title: t("sweetalert.bpmnsucess"),
					showConfirmButton: false,
					icon: "success",
					timer: 2000,
					customClass: "swal-aisent",
					timerProgressBar: true,
				});

				console.log("RESPUESTA DE GPT:", data);

				const allDescriptions = gatherDescriptions(data);
				console.log(allDescriptions.join("\n"));

				const BpmnIds = Object.keys(data); //Every Id on the BPMN
				const BpmnValues = Object.values(data); //Every object related to the Ids
				const { yesIds, noIds } = BpmnValues.reduce(
					(acc, value, index) => {
						// Go object to object into the BpmnValues list
						const userStories = value.user_stories; //Access user_stories property of every ID
						const id = BpmnIds[index]; //If any ID has at least one YES on the ai element, include it into yesIds, if not, in noIds
						const hasYes = userStories.some((story) => story.ai === "SI" || story.ai === "YES");
						if (hasYes) {
							acc.yesIds.push(id);
						} else {
							acc.noIds.push(id);
						}
						return acc;
					},
					{ yesIds: [], noIds: [] }
				); //Variables initialized
				colorAI(yesIds, noIds);
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
					customClass: "swal-aisent",
					timerProgressBar: true,
				});
			}
		} else {
			Swal.fire({
				toast: true,
				position: "top-end",
				title: t("sweetalert.bpmnsizeerror"),
				showConfirmButton: false,
				icon: "error",
				timer: 2000,
				customClass: "swal-aisent",
				timerProgressBar: true,
			});
		}
	};

	function getXmlFromModeler(modeler) {
		return new Promise((resolve, reject) => {
			if (!modeler) {
				return reject(new Error("Modeler is not initialized"));
			}
			modeler.saveXML({ format: true }, (err, xml) => {
				if (err) {
					reject(err);
				} else {
					resolve(xml);
				}
			});
		});
	}

	const handleNew = async () => {

        if (window.confirm("¿Estás seguro que quieres comenzar un nuevo diagrama?")) {
            newDiagram();
            message.success("Nuevo diagrama iniciado con éxito");
        }
    };
    
	const handleSelectDiagram = (index) => {
		setCurrentBPMNIndex(index);
	};
    


	const handleTrash = (index) => {
		if (window.confirm("Are you sure you want to delete this diagram?")) {
			let updatedBpmnList = [...bpmnList];
			if (index >= 0 && index < updatedBpmnList.length) {
				updatedBpmnList.splice(index, 1);
				localStorage.setItem('bpmnList', JSON.stringify(updatedBpmnList));
				setBpmnList(updatedBpmnList);
				message.success("Diagram successfully deleted.");
			} else {
				message.error("No diagram found to delete.");
			}
		}
	};
	


	const handleExportImage = () => {
		if (canvas) {
			const canvasElement = document.getElementById("js-canvas");
			if (canvasElement) {
				toPng(canvasElement, {
					quality: 1.0, // Máxima calidad
					pixelRatio: 3, // Aumenta la resolución de la imagen
				})
					.then((dataUrl) => {
						download(dataUrl, "bpmn-diagram.png");
						message.success("Imagen exportada con éxito");
					})
					.catch((err) => {
						message.error("Error al exportar el diagrama");
						console.error("Error al exportar el diagrama", err);
					});
			} else {
				message.error("No se encontró el canvas del diagrama para exportar");
			}
		} else {
			message.error("No se encontró el diagrama para exportar");
		}
	};

	const handleTrashMenuClick = (e) => {
        const index = Number(e.key);
        let newList = [...bpmnList];
        newList.splice(index, 1);
        setBpmnList(newList);
        localStorage.setItem('bpmnList', JSON.stringify(newList));
        message.success(t('diagramDeletedSuccess'));
    };


	const handleFileMenu = async (e) => {
		switch (e.key) {
			case "new":
				await handleNew();
				break;
			case "save":
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
					},
				});
				if (title) {
					//saving
					let bpmnList = JSON.parse(localStorage.getItem("bpmnList")) || [];
					const currentDate = new Date();
					const newBPMN = {
						title: title,
						date: currentDate.toISOString(),
						xml: xml,
					};
					bpmnList.push(newBPMN);

					localStorage.setItem("bpmnList", JSON.stringify(bpmnList));

					await Swal.fire(`${t("dialogMessages.saveSuccess")} ${title}`);
				}
				break;
			default:
				if (e.key.startsWith("trash-")) {
					const index = parseInt(e.key.split("-")[1], 10);
					handleTrash(index);
				}
				console.log("No se encontró la file key: ", e.key);
				break;
		}
	};

	



	const fileMenu = (
		<Menu onClick={handleFileMenu}>
			<Menu.Item key="new" id="newItem">
				{t("fileMenu.new")}
			</Menu.Item>
			<Menu.Item key="save" id="saveItem">
				{t("fileMenu.save")}
			</Menu.Item>
			<SubMenu title="Move to Trash" onTitleClick={onTitleClick}>
				{bpmnList.map((item, index) => (
					<Menu.Item key={`trash-${index}`}>
						{item.title}
					</Menu.Item>
				))}
			</SubMenu>
		</Menu>
	);

	const trashMenu = (
        <Menu onClick={handleTrashMenuClick}>
            {bpmnList.map((item, index) => (
                <Menu.Item key={index}>
					{item.title}
					</Menu.Item>
            ))}
        </Menu>
    );

	return (
		<div className="navbar-container">
			<Button
				icon={<MenuOutlined />}
				onClick={() => setSidebarVisible(true)}
				className="sidebar-button"
			/>
			<div className="logo-title">
				<img className="logo" src={logo} alt="logo" />
				<div className="title">{t("IdentiAI")}</div>
			</div>
			<div className="navbar-buttons">
				<Dropdown
					overlay={fileMenu}
					className="navbar-dropdown"
					trigger={["click"]}
					placement="bottomLeft"
					overlayStyle={{ border: "none" }}
				>
					<span className="navbar-button">{t("body.buttonFileName")}</span>
				</Dropdown>
			</div>
			<Button className="navbar-button-export" onClick={handleExportImage}>
				<span className="navbar-container">{t("body.buttonExport")}</span>
			</Button>
			<GradientButton className="navbar-button-IA" onClick={handleAI}>
				{t("body.buttonSearchIA")}
			</GradientButton>
			<DropdownLang onClick={handleChangeLanguage}></DropdownLang>
			<Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
		</div>
	);
}

export default Navbar;
