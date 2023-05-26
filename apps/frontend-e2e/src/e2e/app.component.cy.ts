describe('frontend', () => {
  beforeEach(() => cy.visit('/iframe.html?id=appcomponent--primary'));
  it('should render the component', () => {
    cy.get('braincandy-root').should('exist');
  });
});
