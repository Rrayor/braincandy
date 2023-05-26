describe('frontend', () => {
  beforeEach(() => cy.visit('/iframe.html?id=nxwelcomecomponent--primary'));
  it('should render the component', () => {
    cy.get('braincandy-nx-welcome').should('exist');
  });
});
