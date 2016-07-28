'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('A World of Plants App', function() {

  it('should have a title', function() {
    browser.get('index.html');
    expect(browser.getTitle()).toEqual("A World of Plants");
  });

  it('should not allow an unauthorised user access to the site', function() {
    browser.get('/#!/site');
    expect(browser.getLocationAbsUrl()).toContain('/landing');
  });

  describe('landing', function() {


    describe('login', function() {

      beforeEach(function() {
        browser.get('/#!/landing');
      });

      it('should switch to registration form', function() {
        element(by.id('switchToRegister')).click().then(function() {
          var searchString = '<register((.|\n)*)>((.|\n)*)<\/register>';
          expect(element(by.id('my-tab-content')).getInnerHtml()).toMatch(searchString);
        });
      });

      it('should log an existing user in and redirect to the site dashboard', function() {
        element(by.id('username')).sendKeys('JohnSmith');
        element(by.id('password')).sendKeys('JohnSmith');
        element(by.id('loginBtn')).click();
        browser.ignoreSynchronization = true;
        expect(element(by.id('wrapper')).waitReady()).toBeTruthy();
        expect(browser.getLocationAbsUrl()).toContain('/site');
        browser.ignoreSynchronization = false;
        element(by.id('user-toggle')).click();
        element(by.id('logout')).click();
      });

    });


    describe('register', function() {

      beforeEach(function() {
        browser.get('/#!/landing');
        element(by.id('switchToRegister')).click();
      });

      it('should switch to login form', function() {
        element(by.id('switchToLogin')).click();
        var searchString = '<login((.|\n)*)>((.|\n)*)<\/login>';
        expect(element(by.id('my-tab-content')).getInnerHtml()).toMatch(searchString);
      });

      it('should register a new user and then log them in to the site dashboard', function() {
        element(by.id('email')).sendKeys('newuser123@email.com');
        element(by.id('username')).sendKeys('NewUser123');
        element(by.id('password')).sendKeys('NewUser123');
        element(by.id('confirmPassword')).sendKeys('NewUser123');
        element(by.id('signUp')).click();
        browser.ignoreSynchronization = true;
        expect(element(by.id('wrapper')).waitReady()).toBeTruthy();
        expect(browser.getLocationAbsUrl()).toContain('/site');
        browser.ignoreSynchronization = false;
      });
    });
  });


  describe('site', function() {

    beforeEach(function() {
      browser.get('/#!/site');
    });

    it('should log the user out and redirect back to landing', function() {
      element(by.id('user-toggle')).click();
      element(by.id('logout')).click();
      expect(browser.getLocationAbsUrl()).toContain('/landing');
    });

  });


});
