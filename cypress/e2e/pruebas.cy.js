describe('ModelerCreator Component', () => {
    beforeEach(() => {
      cy.visit('localhost:3000/') 
    })
  
    it('Canvas exist', () => {
      cy.get('#js-canvas').should('exist'); // Verifica que el contenedor del lienzo exista
      cy.get('.djs-container').should('exist'); // Verifica que el lienzo de BPMN se haya cargado
    })
  
    it('Components button', () => {
      cy.get('#js-canvas').should('exist'); // Verifica que el contenedor del lienzo exista
      cy.get('.bpmn-icon-intermediate-event-none').click(); // Click en un componente del lienzo 
      cy.get('.bpmn-icon-intermediate-event-none').click();

      // Verifica que el diagrama se haya reiniciado cargando el diagramXML
      cy.get('.djs-container').should('exist'); 
    })

    it('File menu buttons', () => {
      cy.get('#js-canvas').should('exist'); // Verifica que el contenedor del lienzo exista
      cy.get('.navbar-buttons > :nth-child(1)').click(); // Click en el archivo de la navbar
      cy.get('#newItem > .ant-dropdown-menu-title-content').click(); // Click en el botón nuevo de la navbar
      cy.get('.navbar-buttons > :nth-child(1)').click(); // Click en el archivo de la navbar
      cy.get('#saveItem > .ant-dropdown-menu-title-content').click(); // Click en el botón guardar de la navbar
      cy.get('.navbar-buttons > :nth-child(1)').click(); // Click en el archivo de la navbar
      cy.get('#trashItem > .ant-dropdown-menu-title-content').click(); // Click en el botón borrar de la navbar
      cy.get('.navbar-buttons > :nth-child(1)').click(); // Click en el archivo de la navbar
      cy.get('#historyItem > .ant-dropdown-menu-title-content').click(); // Click en el hitorial de la navbar
  
      // Verifica que el diagrama se haya reiniciado cargando el diagramXML
      cy.get('.djs-container').should('exist'); 
    })

    it('AI button', () => {
        cy.get('#js-canvas').should('exist'); // Verifica que el contenedor del lienzo exista
        cy.get('.ant-btn > span').click(); //Click en búsqueda con IA
        cy.contains('Error al realizar la búsqueda con IA').should('be.visible'); //Mensaje de error (Aún sin implementar)

        // Verifica que el diagrama se haya reiniciado cargando el diagramXML
        cy.get('.djs-container').should('exist'); 
    })

    it('Languaje selection', () => {
        cy.get('#js-canvas').should('exist'); // Verifica que el contenedor del lienzo exista
        cy.get('.dropdown-select').select('Spanish'); //Cambia idioma a inglés
        cy.get('.dropdown-select').select('English'); //Cambia idioma a español

        // Verifica que el diagrama se haya reiniciado cargando el diagramXML
        cy.get('.djs-container').should('exist'); 
    })
    
  })
  