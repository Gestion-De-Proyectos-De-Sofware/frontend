describe('ModelerCreator Component', () => {
    beforeEach(() => {
      cy.visit('localhost:3000/') 
    })
  
    it('should load the diagram on mount', () => {
      cy.get('#js-canvas').should('exist'); // Verifica que el contenedor del lienzo exista
      cy.get('.djs-container').should('exist'); // Verifica que el lienzo de BPMN se haya cargado
    })
  
    it('components button', () => {
      cy.get('#js-canvas').should('exist'); // Verifica que el contenedor del lienzo exista
  
      cy.get('.bpmn-icon-intermediate-event-none').click(); // Click en un componente del lienzo 

      cy.get('.bpmn-icon-intermediate-event-none').click();
  
  
      // Verifica que el diagrama se haya reiniciado cargando el diagramXML
      cy.get('.djs-container').should('exist'); 
    })

    it('navbar buttons', () => {
      cy.get('#js-canvas').should('exist'); // Verifica que el contenedor del lienzo exista
  
      cy.get('.navbar-buttons > :nth-child(1)').click(); // click en el archivo de la navbar

      cy.get('.navbar-buttons > :nth-child(2)').click(); // Click en el botón editar de la navbar

      cy.get('.navbar-buttons > :nth-child(3)').click(); //Click en el botón seleccionar de la navbar
  
      // Verifica que el diagrama se haya reiniciado cargando el diagramXML
      cy.get('.djs-container').should('exist'); 
    })
    
  })
  