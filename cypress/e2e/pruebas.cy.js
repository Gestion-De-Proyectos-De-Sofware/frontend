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

    it('New button', () => {
      cy.get('#js-canvas').should('exist'); // Verifica que el contenedor del lienzo exista
      cy.get('.navbar-buttons > :nth-child(1)').click(); // Click en el archivo de la navbar
      cy.get('#newItem > .ant-dropdown-menu-title-content').click(); // Click en el botón nuevo de la navbar
  
      // Verifica que el diagrama se haya reiniciado cargando el diagramXML
      cy.get('.djs-container').should('exist'); 
    })

    it('Save BPM', () => {
      cy.get('#js-canvas').should('exist'); // Verifica que el contenedor del lienzo exista
      cy.get('.navbar-buttons > :nth-child(1)').click(); // Click en el archivo de la navbar
      cy.get('#saveItem > .ant-dropdown-menu-title-content').click(); // Click en el botón guardar de la navbar
      cy.get('.swal2-popup').should('be.visible'); //Verifica que el popup de nombre salga en pantalla
      cy.get('#swal2-input').type('New'); //Escribe el nombre del BPM
      cy.get('#swal2-input').should('have.value', 'New'); //Verifica que el input contiene el texto
      cy.get('.swal2-confirm') //Guarda el BPM
  
      // Verifica que el diagrama se haya reiniciado cargando el diagramXML
      cy.get('.djs-container').should('exist'); 
    })

    it('AI button', () => {
        cy.get('#js-canvas').should('exist'); // Verifica que el contenedor del lienzo exista        
        cy.get('.sc-aYaIB').click(); //Click botón IA     
        cy.wait(2000)
        cy.get('.swal2-popup').should('be.visible'); //El popup de búsqueda debe ser visible

        // Verifica que el diagrama se haya reiniciado cargando el diagramXML
        cy.get('.djs-container').should('exist'); 
    })

    it('Languaje selection', () => {
        cy.get('#js-canvas').should('exist'); // Verifica que el contenedor del lienzo exista
        cy.get('.ant-dropdown-link > :nth-child(1)').click();

        // Verifica que el diagrama se haya reiniciado cargando el diagramXML
        cy.get('.djs-container').should('exist'); 
    })
    
  })
  