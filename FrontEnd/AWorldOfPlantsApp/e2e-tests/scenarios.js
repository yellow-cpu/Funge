'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('A World of Plants App', function() {

  it('should have a title', function() {
    browser.get('index.html');
    expect(browser.getTitle()).toEqual("A World of Plants");
  });


  describe('landing', function() {

    beforeEach(function() {
      browser.get('/#!/landing');
    });


    describe('login', function() {

      beforeEach(function() {
        browser.get('/#!/landing');
      });

      var switchToReg = element(by.id('switchToRegister'));

      it('should switch to registration form', function() {
        switchToReg.click().then(function() {
          var searchString = '<register((.|\n)*)>((.|\n)*)<\/register>';
          expect(element(by.id('my-tab-content')).getInnerHtml()).toMatch(searchString);
        });
      });

      it('should log an existing user in and redirect to the site dashboard', function() {
        element(by.id('username')).sendKeys('JohnSmith');
        element(by.id('password')).sendKeys('JohnSmith');
        element(by.id('loginBtn')).click();
        setTimeout(function () {
          expect(browser.getCurrentUrl()).toContain('/site');
        }, 5000);
      });

    });


    describe('register', function() {

      beforeEach(function() {
        browser.get('/#!/landing');
        element(by.id('switchToRegister')).click();
      });

      it('should switch to login form', function() {
        element(by.id('switchToLogin')).click().then(function() {
          var searchString = '<login((.|\n)*)>((.|\n)*)<\/login>';
          expect(element(by.id('my-tab-content')).getInnerHtml()).toMatch(searchString);
        });
      });

      it('should register a new user and then log them in to the site dashboard', function() {
        element(by.id('email')).sendKeys('newuser@email.com');
        element(by.id('username')).sendKeys('NewUser');
        element(by.id('password')).sendKeys('NewUser');
        element(by.id('confirmPassword')).sendKeys('NewUser');
        element(by.id('signUp')).click();
        setTimeout(function() {
          expect(browser.getCurrentUrl()).toContain('/site');
        }, 5000);
      });
    });


  });


});
