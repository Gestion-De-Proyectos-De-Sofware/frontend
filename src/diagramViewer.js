import React, { useEffect, useRef } from "react";
import BpmnViewer from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-font/dist/css/bpmn-embedded.css";
import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import { useDiagramDefinitions } from "./contexts/DiagramDefinitions";

const BpmnView = () => {
	const containerRef = useRef(null);
	const viewerRef = useRef(null);
	const { setDiagramDefinitions } = useDiagramDefinitions();
	const handleElementChanged = (event) => {
		console.log("Elemento cambiado:", event.element);
		setDiagramDefinitions(viewerRef.current);
	};
	useEffect(() => {
		viewerRef.current = new BpmnViewer({
			container: containerRef.current,
			keyboard: {
				bindTo: window,
			},
			propertiesPanel: {
				parent: "#propview",
			},
			additionalModules: [propertiesPanelModule, propertiesProviderModule],
			moddleExtensions: {
				camunda: camundaModdleDescriptor,
			},
		});

		const importXML = (xml, Viewer) => {
			Viewer.importXML(xml, function (err) {
				if (err) {
					return console.error("could not import BPMN 2.0 diagram", err);
				}

				const canvas = Viewer.get("canvas");
				const overlays = Viewer.get("overlays");

				// Zoom to fit full viewport
				canvas.zoom("fit-viewport");

				// Attach an overlay to a node
				// overlays.add("SCAN_OK", "note", {
				// 	position: {
				// 		bottom: 0,
				// 		right: 0,
				// 	},
				// 	html: '<div class="diagram-note">Mixed up the labels?</div>',
				// });

				// canvas.addMarker("SCAN_OK", "needs-discussion");
				setDiagramDefinitions(viewerRef.current);
				viewerRef.current.on("element.changed", handleElementChanged);
			});
		};

		const diagramXML =
			'<?xml version="1.0" encoding="UTF-8"?><definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" targetNamespace="" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL http://www.omg.org/spec/BPMN/2.0/20100501/BPMN20.xsd"><collaboration id="sid-c0e745ff-361e-4afb-8c8d-2a1fc32b1424"><extensionElements><camunda:properties><camunda:property name="hola" value="1" /></camunda:properties></extensionElements><participant id="sid-87F4C1D6-25E1-4A45-9DA7-AD945993D06F" name="Cliente" processRef="sid-C3803939-0872-457F-8336-EAE484DC4A04" /><participant id="Participant_0mhc32q" name="Empleado de ventas" processRef="Process_09mko2y" /><participant id="Participant_0ld6vog" name="Bodega" processRef="Process_1lixb0g" /><messageFlow id="MessageFlow_0jnpddk" sourceRef="Task_020wfhh" targetRef="Task_1vn0bke" /><messageFlow id="MessageFlow_15vlgv3" sourceRef="Task_05ypel9" targetRef="Task_00vcoxw" /><messageFlow id="MessageFlow_0mn472a" name="Sugerir cambio en la orden" sourceRef="Task_0jw2ciu" targetRef="Task_06thxx1" /></collaboration><process id="sid-C3803939-0872-457F-8336-EAE484DC4A04" name="Customer" processType="None" isClosed="false" isExecutable="false"><extensionElements /><laneSet id="sid-b167d0d7-e761-4636-9200-76b7f0e8e83a"><lane id="sid-57E4FE0D-18E4-478D-BC5D-B15164E93254" name=""><flowNodeRef>sid-D7F237E8-56D0-4283-A3CE-4F0EFE446138</flowNodeRef><flowNodeRef>Task_020wfhh</flowNodeRef><flowNodeRef>Task_06thxx1</flowNodeRef></lane></laneSet><startEvent id="sid-D7F237E8-56D0-4283-A3CE-4F0EFE446138" name="Inicio"><outgoing>SequenceFlow_0ayryza</outgoing></startEvent><task id="Task_020wfhh" name="Hacer orden de compra"><incoming>SequenceFlow_0ayryza</incoming></task><sequenceFlow id="SequenceFlow_0ayryza" sourceRef="sid-D7F237E8-56D0-4283-A3CE-4F0EFE446138" targetRef="Task_020wfhh" /><task id="Task_06thxx1" name="Recibir respuesta" /></process><process id="Process_09mko2y"><sequenceFlow id="SequenceFlow_0vtqgii" name="NO" sourceRef="ExclusiveGateway_0vawk79" targetRef="Task_0jw2ciu" /><sequenceFlow id="SequenceFlow_06xntq8" name="SÍ" sourceRef="ExclusiveGateway_0vawk79" targetRef="Task_05ypel9" /><sequenceFlow id="SequenceFlow_1evtq63" sourceRef="Task_1vn0bke" targetRef="ExclusiveGateway_0vawk79" /><receiveTask id="Task_1vn0bke" name="Recibir orden"><outgoing>SequenceFlow_1evtq63</outgoing></receiveTask><task id="Task_0jw2ciu" name="Sugerir cambio por otro producto"><incoming>SequenceFlow_0vtqgii</incoming></task><task id="Task_05ypel9" name="Solicitar paquete de mercancías"><incoming>SequenceFlow_06xntq8</incoming></task><exclusiveGateway id="ExclusiveGateway_0vawk79" name="¿Stock suficiente?"><incoming>SequenceFlow_1evtq63</incoming><outgoing>SequenceFlow_06xntq8</outgoing><outgoing>SequenceFlow_0vtqgii</outgoing></exclusiveGateway></process><process id="Process_1lixb0g"><task id="Task_00vcoxw" name="Empacar mercancía"><outgoing>SequenceFlow_1vmzhhu</outgoing></task><task id="Task_18j261d" name="Enviar mercancía"><incoming>SequenceFlow_1vmzhhu</incoming><outgoing>SequenceFlow_17c5a5w</outgoing></task><sequenceFlow id="SequenceFlow_1vmzhhu" sourceRef="Task_00vcoxw" targetRef="Task_18j261d" /><endEvent id="EndEvent_0l800er" name="Orden completada"><incoming>SequenceFlow_17c5a5w</incoming></endEvent><sequenceFlow id="SequenceFlow_17c5a5w" sourceRef="Task_18j261d" targetRef="EndEvent_0l800er" /></process><bpmndi:BPMNDiagram id="sid-74620812-92c4-44e5-949c-aa47393d3830"><bpmndi:BPMNPlane id="sid-cdcae759-2af7-4a6d-bd02-53f3352a731d" bpmnElement="sid-c0e745ff-361e-4afb-8c8d-2a1fc32b1424"><bpmndi:BPMNShape id="sid-87F4C1D6-25E1-4A45-9DA7-AD945993D06F_gui" bpmnElement="sid-87F4C1D6-25E1-4A45-9DA7-AD945993D06F" isHorizontal="true"><omgdc:Bounds x="43" y="75" width="933" height="250" /><bpmndi:BPMNLabel labelStyle="sid-84cb49fd-2f7c-44fb-8950-83c3fa153d3b"><omgdc:Bounds x="47.49999999999999" y="170.42857360839844" width="12.000000000000014" height="59.142852783203125" /></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNShape id="sid-57E4FE0D-18E4-478D-BC5D-B15164E93254_gui" bpmnElement="sid-57E4FE0D-18E4-478D-BC5D-B15164E93254" isHorizontal="true"><omgdc:Bounds x="73" y="75" width="903" height="250" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="sid-D7F237E8-56D0-4283-A3CE-4F0EFE446138_gui" bpmnElement="sid-D7F237E8-56D0-4283-A3CE-4F0EFE446138"><omgdc:Bounds x="150" y="165" width="30" height="30" /><bpmndi:BPMNLabel labelStyle="sid-e0502d32-f8d1-41cf-9c4a-cbb49fecf581"><omgdc:Bounds x="152" y="197" width="26" height="14" /></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNShape id="Participant_0mhc32q_di" bpmnElement="Participant_0mhc32q"><omgdc:Bounds x="43" y="347" width="748" height="261" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Participant_0ld6vog_di" bpmnElement="Participant_0ld6vog"><omgdc:Bounds x="43" y="635" width="841" height="183" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Task_020wfhh_di" bpmnElement="Task_020wfhh"><omgdc:Bounds x="230" y="140" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNEdge id="SequenceFlow_0ayryza_di" bpmnElement="SequenceFlow_0ayryza"><omgdi:waypoint x="180" y="180" /><omgdi:waypoint x="230" y="180" /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="MessageFlow_0jnpddk_di" bpmnElement="MessageFlow_0jnpddk"><omgdi:waypoint x="280" y="220" /><omgdi:waypoint x="280" y="444" /></bpmndi:BPMNEdge><bpmndi:BPMNShape id="ExclusiveGateway_0vawk79_di" bpmnElement="ExclusiveGateway_0vawk79" isMarkerVisible="true"><omgdc:Bounds x="343" y="459" width="50" height="50" /><bpmndi:BPMNLabel><omgdc:Bounds x="402.5" y="470.5" width="53" height="27" /></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNEdge id="SequenceFlow_1evtq63_di" bpmnElement="SequenceFlow_1evtq63"><omgdi:waypoint x="293" y="484" /><omgdi:waypoint x="343" y="484" /></bpmndi:BPMNEdge><bpmndi:BPMNShape id="Task_05ypel9_di" bpmnElement="Task_05ypel9"><omgdc:Bounds x="455" y="504" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNEdge id="SequenceFlow_06xntq8_di" bpmnElement="SequenceFlow_06xntq8"><omgdi:waypoint x="368" y="509" /><omgdi:waypoint x="368" y="544" /><omgdi:waypoint x="455" y="544" /><bpmndi:BPMNLabel><omgdc:Bounds x="378" y="524" width="11" height="14" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNShape id="Task_0jw2ciu_di" bpmnElement="Task_0jw2ciu"><omgdc:Bounds x="455" y="374" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNEdge id="SequenceFlow_0vtqgii_di" bpmnElement="SequenceFlow_0vtqgii"><omgdi:waypoint x="368" y="459" /><omgdi:waypoint x="368" y="414" /><omgdi:waypoint x="455" y="414" /><bpmndi:BPMNLabel><omgdc:Bounds x="375" y="434" width="17" height="14" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNShape id="Task_00vcoxw_di" bpmnElement="Task_00vcoxw"><omgdc:Bounds x="448" y="697" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNEdge id="MessageFlow_15vlgv3_di" bpmnElement="MessageFlow_15vlgv3"><omgdi:waypoint x="505" y="584" /><omgdi:waypoint x="505" y="697" /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="MessageFlow_0mn472a_di" bpmnElement="MessageFlow_0mn472a"><omgdi:waypoint x="505" y="374" /><omgdi:waypoint x="505" y="220" /><bpmndi:BPMNLabel><omgdc:Bounds x="475" y="294" width="90" height="27" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNShape id="Task_18j261d_di" bpmnElement="Task_18j261d"><omgdc:Bounds x="598" y="697" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNEdge id="SequenceFlow_1vmzhhu_di" bpmnElement="SequenceFlow_1vmzhhu"><omgdi:waypoint x="548" y="737" /><omgdi:waypoint x="598" y="737" /></bpmndi:BPMNEdge><bpmndi:BPMNShape id="EndEvent_0l800er_di" bpmnElement="EndEvent_0l800er"><omgdc:Bounds x="748" y="719" width="36" height="36" /><bpmndi:BPMNLabel><omgdc:Bounds x="737" y="762" width="58" height="27" /></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNEdge id="SequenceFlow_17c5a5w_di" bpmnElement="SequenceFlow_17c5a5w"><omgdi:waypoint x="698" y="737" /><omgdi:waypoint x="748" y="737" /></bpmndi:BPMNEdge><bpmndi:BPMNShape id="ReceiveTask_1xvh1c3_di" bpmnElement="Task_1vn0bke"><omgdc:Bounds x="193" y="444" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Task_06thxx1_di" bpmnElement="Task_06thxx1"><omgdc:Bounds x="455" y="140" width="100" height="80" /></bpmndi:BPMNShape></bpmndi:BPMNPlane><bpmndi:BPMNLabelStyle id="sid-e0502d32-f8d1-41cf-9c4a-cbb49fecf581"><omgdc:Font name="Arial" size="11" isBold="false" isItalic="false" isUnderline="false" isStrikeThrough="false" /></bpmndi:BPMNLabelStyle><bpmndi:BPMNLabelStyle id="sid-84cb49fd-2f7c-44fb-8950-83c3fa153d3b"><omgdc:Font name="Arial" size="12" isBold="false" isItalic="false" isUnderline="false" isStrikeThrough="false" /></bpmndi:BPMNLabelStyle></bpmndi:BPMNDiagram></definitions>';

		importXML(diagramXML, viewerRef.current);
		setDiagramDefinitions(viewerRef.current);
		viewerRef.current.on("element.changed", handleElementChanged);

		return () => {
			if (viewerRef.current) {
				viewerRef.current.destroy();
			}
		};
	}, []);

	return (
		<div style={{ height: "100%" }}>
			<div id="js-canvas" ref={containerRef} />
			<div id="propview" />
		</div>
	);
};

export default BpmnView;
