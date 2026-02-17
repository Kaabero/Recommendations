describe("Recommendation app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/testing/reset");
    
    const user1 = {
      username: "testUsername",
      password: "testPassword",
    };
    const user2 = {
      username: "testUsername2",
      password: "testPassword2",
    };
    cy.request("POST", "http://localhost:3001/api/users/", user1);
    cy.request("POST", "http://localhost:3001/api/users/", user2);
    cy.visit("/");
  });

  it("Login form is shown", function () {
    cy.contains("Login");
  });

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.visit('/login');
      cy.get('#username').type('testUsername')
      cy.get('#password').type('testPassword')
      cy.get('#login-button').click()
      cy.contains('What to watch today?')

    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testUsername')
      cy.get('#password').type('wrongPassword')
      cy.get('#login-button').click()
      cy.get('.error')
        .should('contain', 'Invalid username or password')
       
        
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testUsername', password: 'testPassword' })
      cy.visit('/recommendations')

    })

    it('A recommendation can be created', function() {
      cy.contains('Add a new recommendation').click()
      cy.get('#title-input').type('testRecommendation')
      cy.get('#service-input').type('testService')
      cy.get('#url-input').type('www.testUrl.com')
      cy.get('#addRecommendation-button').click()
      cy.wait(500)
      cy.contains('testRecommendation')
    })
  })


  describe("When there is one recommendation on the recommendationlist", function () {
    beforeEach(function () {
      cy.login({ username: "testUsername", password: "testPassword" });
      cy.createRecommendation({
        title: "testRecommendation",
        service: "testService",
        url: "www.testUrl.com",
      });
      cy.visit('/recommendations')
    });


    it('a recommendation can be liked', function() {
      cy.contains('testRecommendation').click()
      cy.wait(500)
      cy.contains('Likes: 0')
      cy.get('#like-button-testRecommendation').click()
      cy.contains('Likes: 1')

    })

    it('a recommendation can be removed by the person who added the recommendation', function() {
      cy.contains('testRecommendation').click()
      cy.wait(500)
      cy.get('#delete-button-testRecommendation').click()
      cy.wait(500)
      cy.contains('testRecommendation').should('not.exist');

    })

    it('only the person who added the recommendation can see the delete-button', function() {
      cy.contains('testRecommendation').click()
      cy.wait(500)
      cy.get('#delete-button-testRecommendation')
      cy.get('#logout-button').click()
      cy.login({ username: 'testUsername2', password: 'testPassword2' })
      cy.contains('Recommendations').click()
      cy.contains('testRecommendation').click()
      cy.wait(500)
      cy.get('#delete-button-testRecommendation').should('not.exist')

    })

    it("recommendations are sorted from most likes to fewest likes", function () {
      cy.createRecommendation({
        title: "testRecommendation2",
        service: "testService2",
        url: "www.testUrl2.com",
      });
      cy.createRecommendation({
        title: "testRecommendation3",
        service: "testService3",
        url: "www.testUrl3.com",
      });
      cy.visit('/recommendations')
      cy.contains('testRecommendation2').click()
      cy.wait(500)
      cy.get('#like-button-testRecommendation2').click()
      cy.get('#like-button-testRecommendation2').click()
      cy.get('#like-button-testRecommendation2').click()
      cy.get('#like-button-testRecommendation2').click()
      cy.get('#like-button-testRecommendation2').click()
      cy.visit('/recommendations')
      cy.contains('testRecommendation3').click()
      cy.contains('testRecommendation3').click()
      cy.contains('testRecommendation3').click()
      cy.contains('testRecommendation3').click()
      cy.wait(500)
      cy.get('#like-button-testRecommendation3').click()
      cy.visit('/recommendations')
      cy.get('body').then(body => {
        console.log(body.html());
      });
      cy.get('table tbody tr td:first-child').eq(0).should('contain', 'testRecommendation2');
      cy.get('table tbody tr td:first-child').eq(1).should('contain', 'testRecommendation3');
      cy.get('table tbody tr td:first-child').eq(2).should('contain', 'testRecommendation');
    });
  });
});
