'use strict';
define(['angular-mocks', 'portal'], function() {
  describe('MessagesService', function() {

    var messagesService, httpBackend, messagesUrl, loginSilentUrl;

    beforeEach(function() {
      module('portal');
    });

    beforeEach(inject(function(_messagesService_, _$httpBackend_, SERVICE_LOC) {
      messagesService = _messagesService_;
      httpBackend = _$httpBackend_;
      SERVICE_LOC.messagesURL = "/messages";
      messagesUrl = SERVICE_LOC.messagesURL;
      loginSilentUrl = SERVICE_LOC.loginSilentURL;
      if(loginSilentUrl) {
        httpBackend.whenGET(loginSilentUrl).respond({"status" : "success", "username" : "admin"});
      }
    }));

    it("message should not appear if dataURL is present but incorrect", function(){
      //setup
      httpBackend.whenGET(messagesUrl).respond(
          {"messages" :
            [
             {
               "id"     : 1,
               "title"  : "message 1",
               "actionURL" : "http://www.google.com",
               "actionAlt" : "Google",
               "audienceFilter": {
                 "groups": [
                   "Everyone"
                 ]
               }
             },
             {
               "id"     : 2,
               "title"  : "message 2",
               "actionURL" : "http://www.google.com",
               "actionAlt" : "Google",
               "audienceFilter": {
                 "groups": [
                   "Everyone"
                 ],
                 "dataUrl": "http://www.google.com"
               }
             }
             ]
          }
      );
      httpBackend.whenGET('http://www.google.com').respond(400, {});
      messagesService.getAllMessages().then(function(allMessages){
        expect(allMessages).toBeTruthy();
        expect(allMessages.length).toEqual(2);
        return messagesService.getMessagesByData(allMessages);
      }).then(function(dataMessages){
        expect(dataMessages).toBeTruthy();
        expect(dataMessages.length).toEqual(1);
      });
      httpBackend.flush();
    });
    
    it("message should appear if dataURL is present and returns data", function(){
      //setup
      httpBackend.whenGET(messagesUrl).respond(
          {"messages" :
            [
             {
               "id"     : 1,
               "title"  : "message 1",
               "actionURL" : "http://www.google.com",
               "actionAlt" : "Google",
               "audienceFilter": {
                 "groups": [
                   "Everyone"
                 ]
               }
             },
             {
               "id"     : 2,
               "title"  : "message 2",
               "actionURL" : "http://www.google.com",
               "actionAlt" : "Google",
               "audienceFilter": {
                 "groups": [
                   "Everyone"
                 ],
                 "dataUrl" : "http://www.google.com"
               }
             }
             ]
          }
      );
      httpBackend.whenGET("http://www.google.com").respond(200, "something");
      messagesService.getAllMessages().then(function(allMessages){
        expect(allMessages).toBeTruthy();
        expect(allMessages.length).toEqual(2);
        return messagesService.getMessagesByData(allMessages);
      }).then(function(dataMessages){
        expect(dataMessages).toBeTruthy();
        expect(dataMessages.length).toEqual(2);
      });
      httpBackend.flush();
    });
    
    it("message should appear if dataURL is present and returns data specifically asked for by dataObject", function(){
      //setup
      httpBackend.whenGET(messagesUrl).respond(
          {"messages" :
            [
             {
               "id"     : 1,
               "title"  : "message 1",
               "actionURL" : "http://www.google.com",
               "actionAlt" : "Google",
               "audienceFilter": {
                 "groups": [
                   "Everyone"
                 ]
               }
             },
             {
               "id"     : 2,
               "title"  : "message 2",
               "actionURL" : "http://www.google.com",
               "actionAlt" : "Google",
               "audienceFilter": {
                 "groups": [
                   "Everyone"
                 ],
                 "dataUrl" : "http://www.google.com",
                 "dataObject" : "developers"
               }
             }
             ]
          }
      );
      httpBackend.whenGET("http://www.google.com").respond(200, "{\"developers\": [\"foo\", \"bar\"], \"favorite foods\":\"chicken\"}");
      messagesService.getAllMessages().then(function(allMessages){
        expect(allMessages).toBeTruthy();
        expect(allMessages.length).toEqual(2);
        return messagesService.getMessagesByData(allMessages);
      }).then(function(dataMessages){
        expect(dataMessages).toBeTruthy();
        expect(dataMessages.length).toEqual(2);
      });
      httpBackend.flush();
    });
    
    it("message should not appear if dataURL is present and can't return data specifically asked for by dataObject", function(){
      //setup
      httpBackend.whenGET(messagesUrl).respond(
          {"messages" :
            [
             {
               "id"     : 1,
               "title"  : "message 1",
               "actionURL" : "http://www.google.com",
               "actionAlt" : "Google",
               "audienceFilter": {
                 "groups": [
                   "Everyone"
                 ]
               }
             },
             {
               "id"     : 2,
               "title"  : "message 2",
               "actionURL" : "http://www.google.com",
               "actionAlt" : "Google",
               "audienceFilter": {
                 "groups": [
                   "Everyone"
                 ],
                 "dataUrl" : "http://www.google.com",
                 "dataObject" : "data"
               }
             }
             ]
          }
      );
      httpBackend.whenGET("http://www.google.com").respond(200, "{\"developers\": [\"foo\", \"bar\"], \"favorite foods\":\"chicken\"}");
      messagesService.getAllMessages().then(function(allMessages){
        expect(allMessages).toBeTruthy();
        expect(allMessages.length).toEqual(2);
        return messagesService.getMessagesByData(allMessages);
      }).then(function(dataMessages){
        expect(dataMessages).toBeTruthy();
        expect(dataMessages.length).toEqual(1);
      });
      httpBackend.flush();
    });
    
    it("message should appear if dataURL is not present and dataObject is mistakenly present", function(){
      //setup
      httpBackend.whenGET(messagesUrl).respond(
          {"messages" :
            [
             {
               "id"     : 1,
               "title"  : "message 1",
               "actionURL" : "http://www.google.com",
               "actionAlt" : "Google",
               "audienceFilter": {
                 "groups": [
                   "Everyone"
                 ]
               }
             },
             {
               "id"     : 2,
               "title"  : "message 2",
               "actionURL" : "http://www.google.com",
               "actionAlt" : "Google",
               "audienceFilter": {
                 "groups": [
                   "Everyone"
                 ],
                 "dataObject" : "data"
               }
             }
             ]
          }
      );
      messagesService.getAllMessages().then(function(allMessages){
        expect(allMessages).toBeTruthy();
        expect(allMessages.length).toEqual(2);
        return messagesService.getMessagesByData(allMessages);
      }).then(function(dataMessages){
        expect(dataMessages).toBeTruthy();
        expect(dataMessages.length).toEqual(2);
      });
      httpBackend.flush();
    });
    
    it("message should appear if dataURL is present and returns data specifically asked for by dataArray and searched by object", function(){
      //setup
      httpBackend.whenGET(messagesUrl).respond(
        {"messages" :
          [
            {
              "id"     : 1,
              "title"  : "message 1",
              "actionURL" : "http://www.google.com",
              "actionAlt" : "Google",
              "audienceFilter": {
                "groups": [
                  "Everyone"
                ]
              }
            },
            {
              "id"     : 2,
              "title"  : "message 2",
              "actionURL" : "http://www.google.com",
              "actionAlt" : "Google",
              "audienceFilter": {
                "groups": [
                  "Everyone"
                ],
                "dataUrl" : "http://www.google.com",
                "dataObject" : "developers",
                "dataArrayFilter" : "{\"name\": \"baz\"}"
              }
            }
          ]
        }
      );
      httpBackend.whenGET("http://www.google.com").respond(200, {"developers":[{"name":"foo"}, {"name":"bar"}, {"name":"baz"}], 
        "fruit":["apples, oranges"]});
      messagesService.getAllMessages().then(function(allMessages){
        expect(allMessages).toBeTruthy();
        expect(allMessages.length).toEqual(2);
        return messagesService.getMessagesByData(allMessages);
      }).then(function(dataMessages){
        expect(dataMessages).toBeTruthy();
        expect(dataMessages.length).toEqual(2);
      });
      httpBackend.flush();
    });
    
    it("message should appear if dataURL is present and returns data specifically asked for by dataArray with two filters and searched by object", function(){
      //setup
      //setup
      httpBackend.whenGET(messagesUrl).respond(
        {"messages" :
          [
            {
              "id"     : 1,
              "title"  : "message 1",
              "actionURL" : "http://www.google.com",
              "actionAlt" : "Google",
              "audienceFilter": {
                "groups": [
                  "Everyone"
                ]
              }
            },
            {
              "id"     : 2,
              "title"  : "message 2",
              "actionURL" : "http://www.google.com",
              "actionAlt" : "Google",
              "audienceFilter": {
                "groups": [
                  "Everyone"
                ],
                "dataUrl" : "http://www.google.com",
                "dataObject" : "developers",
                "dataArrayFilter" : "{\"name\": \"foo\", \"id\" : 4}"
              }
            }
          ]
        }
      );
      httpBackend.whenGET("http://www.google.com").respond(200, {"developers":[{"name":"foo", "id":4}, {"name":"foo"}, {"name":"foo"}], 
        "fruit":["apples, oranges"]});
      messagesService.getAllMessages().then(function(allMessages){
        expect(allMessages).toBeTruthy();
        expect(allMessages.length).toEqual(2);
        return messagesService.getMessagesByData(allMessages);
      }).then(function(dataMessages){
        expect(dataMessages).toBeTruthy();
        expect(dataMessages.length).toEqual(2);
      });
      httpBackend.flush();
    });
    
    it("message should not appear if dataURL is present and returns data specifically asked for by dataArray with two filters and searched by object when filter does not match", function(){
      //setup
      httpBackend.whenGET(messagesUrl).respond(
        {"messages" :
          [
            {
              "id"     : 1,
              "title"  : "message 1",
              "actionURL" : "http://www.google.com",
              "actionAlt" : "Google",
              "audienceFilter": {
                "groups": [
                  "Everyone"
                ]
              }
            },
            {
              "id"     : 2,
              "title"  : "message 2",
              "actionURL" : "http://www.google.com",
              "actionAlt" : "Google",
              "audienceFilter": {
                "groups": [
                  "Everyone"
                ],
                "dataUrl" : "http://www.google.com",
                "dataObject" : "developers",
                "dataArrayFilter" : "{\"name\": \"foo\", \"id\" : 3}"
              }
            }
          ]
        }
      );
      httpBackend.whenGET("http://www.google.com").respond(200, {"developers":[{"name":"foo", "id":4}, {"name":"foo"}, {"name":"foo"}], 
        "fruit":["apples, oranges"]});
      messagesService.getAllMessages().then(function(allMessages){
        expect(allMessages).toBeTruthy();
        expect(allMessages.length).toEqual(2);
        return messagesService.getMessagesByData(allMessages);
      }).then(function(dataMessages){
        expect(dataMessages).toBeTruthy();
        expect(dataMessages.length).toEqual(1);
      });
      httpBackend.flush();
    });
    
    it("message should not appear if dataURL is present and attempts to arrayFilter on non-array", function(){
      //setup
      httpBackend.whenGET(messagesUrl).respond(
        {"messages" :
          [
            {
              "id"     : 1,
              "title"  : "message 1",
              "actionURL" : "http://www.google.com",
              "actionAlt" : "Google",
              "audienceFilter": {
                "groups": [
                  "Everyone"
                ]
              }
            },
            {
              "id"     : 2,
              "groups" : ["Everyone"],
              "title"  : "message 2",
              "actionURL" : "http://www.google.com",
              "actionAlt" : "Google",
              "audienceFilter": {
                "groups": [
                  "Everyone"
                ],
                "dataUrl" : "http://www.google.com",
                "dataArrayFilter" : "{\"name\": \"baz\"}"
              }
            }
          ]
        }
      );
      httpBackend.whenGET("http://www.google.com").respond(200, {"developers":[{"name":"foo"}, {"name":"bar"}, {"name":"baz"}], 
        "fruit":["apples, oranges"]});
      messagesService.getAllMessages().then(function(allMessages){
        expect(allMessages).toBeTruthy();
        expect(allMessages.length).toEqual(2);
        return messagesService.getMessagesByData(allMessages);
      }).then(function(dataMessages){
        expect(dataMessages).toBeTruthy();
        expect(dataMessages.length).toEqual(1);
      });
      httpBackend.flush();
    });

    it("message should appear when dataObject is present and not an array", function(){
      //setup
      httpBackend.whenGET(messagesUrl).respond(
        {"messages" :
          [
            {
              "id"     : 1,
              "title"  : "message 1",
              "actionURL" : "http://www.google.com",
              "actionAlt" : "Google",
              "audienceFilter": {
                "groups": [
                  "Everyone"
                ]
              }
            },
            {
              "id"     : 2,
              "title"  : "message 2",
              "actionURL" : "http://www.google.com",
              "actionAlt" : "Google",
              "audienceFilter": {
                "groups": [
                  "Everyone"
                ],
                "dataUrl" : "http://www.google.com",
                "dataObject" : "id"
              }
            }
          ]
        }
      );
      httpBackend.whenGET("http://www.google.com").respond(200, {"name":"foo" , "id":"bar" , "favorite food":"baz"});
      messagesService.getAllMessages().then(function(allMessages){
        expect(allMessages).toBeTruthy();
        expect(allMessages.length).toEqual(2);
        return messagesService.getMessagesByData(allMessages);
      }).then(function(dataMessages){
        expect(dataMessages).toBeTruthy();
        expect(dataMessages.length).toEqual(2);
      });
      httpBackend.flush();
    });

    it("message should have title from data if specified", function(){
      //setup
      var title = "Use this as a title";
      httpBackend.whenGET(messagesUrl).respond(
        {"messages" :
          [
            {
              "id"     : 1,
              "title"  : "message 1",
              "actionURL" : "http://www.google.com",
              "actionAlt" : "Google",
              "audienceFilter": {
                "groups": [
                  "Everyone"
                ]
              }
            },
            {
              "id"     : 2,
              "title"  : "message 2",
              "actionURL" : "http://www.google.com",
              "actionAlt" : "Google",
              "audienceFilter": {
                "groups": [
                  "Everyone"
                ],
                "dataUrl" : "http://www.google.com",
                "dataObject" : "id",
                "dataMessageTitle" : ["title", "Supplied Title"]
              }
            }
          ]
        }
      );
      httpBackend.whenGET("http://www.google.com").respond(200, {"name":"foo" , "id":"bar" , "favorite food":"baz", "title":{"Supplied Title" : title}});
      messagesService.getAllMessages().then(function(allMessages){
        expect(allMessages).toBeTruthy();
        expect(allMessages.length).toEqual(2);
        return messagesService.getMessagesByData(allMessages);
      }).then(function(dataMessages){
        expect(dataMessages).toBeTruthy();
        expect(dataMessages.length).toEqual(2);
        expect(dataMessages[1].title).toEqual(title);
      });
      httpBackend.flush();
    });
    
    it("message should not have title from data if specified but url is not used", function(){
      //setup
      var title = "Use this as a title";
      httpBackend.whenGET(messagesUrl).respond(
        {"messages" :
          [
            {
              "id"     : 1,
              "title"  : "message 1",
              "actionURL" : "http://www.google.com",
              "actionAlt" : "Google",
              "audienceFilter": {
                "groups": [
                  "Everyone"
                ]
              }
            },
            {
              "id"     : 2,
              "title"  : "message 2",
              "actionURL" : "http://www.google.com",
              "actionAlt" : "Google",
              "audienceFilter": {
                "groups": [
                  "Everyone"
                ],
                "dataObject" : "id",
                "dataMessageTitle" : ["title", "Supplied Title"]
              }
            }
          ]
        }
      );
      httpBackend.whenGET("http://www.google.com").respond(200, {"name":"foo" , "id":"bar" , "favorite food":"baz", "title":{"Supplied Title" : title}});
      messagesService.getAllMessages().then(function(allMessages){
        expect(allMessages).toBeTruthy();
        expect(allMessages.length).toEqual(2);
        return messagesService.getMessagesByData(allMessages);
      }).then(function(dataMessages){
        expect(dataMessages).toBeTruthy();
        expect(dataMessages.length).toEqual(2);
        expect(dataMessages[1].title).toEqual("message 2");
      });
      httpBackend.flush();
    });

    it("message should have more info url from data if specified", function(){
      //setup
      var url = "exampleUrl";
      httpBackend.whenGET(messagesUrl).respond(
        {"messages" :
          [
            {
              "id"     : 1,
              "title"  : "message 1",
              "actionURL" : "http://www.google.com",
              "actionAlt" : "Google",
              "audienceFilter": {
                "groups": [
                  "Everyone"
                ]
              }
            },
            {
              "id"     : 2,
              "title"  : "message 2",
              "actionURL" : "http://www.google.com",
              "actionAlt" : "Google",
              "audienceFilter": {
                "groups": [
                  "Everyone"
                ],
                "dataUrl" : "http://www.google.com",
                "dataObject" : "id",
                "dataMessageMoreInfoUrl" : ["Learn More", "url"]
              },
              "moreInfoButton": {
                "label": "Learn more",
                "url": "to be replaced"
              }
            }
          ]
        }
      );
      httpBackend.whenGET("http://www.google.com").respond(200, {"name":"foo" , "id":"bar" , "favorite food":"baz", "Learn More":{"url" : url}});
      messagesService.getAllMessages().then(function(allMessages){
        expect(allMessages).toBeTruthy();
        expect(allMessages.length).toEqual(2);
        return messagesService.getMessagesByData(allMessages);
      }).then(function(dataMessages){
        expect(dataMessages).toBeTruthy();
        expect(dataMessages.length).toEqual(2);
        expect(dataMessages[1].moreInfoButton.url).toEqual(url);
      });
      httpBackend.flush();
    });
    
    it("message should not have more info url from data if specified, but learnMoreButton not configured", function(){
      //setup
      var url = "exampleUrl";
      httpBackend.whenGET(messagesUrl).respond(
        {"messages" :
          [
            {
              "id"     : 1,
              "title"  : "message 1",
              "actionURL" : "http://www.google.com",
              "actionAlt" : "Google",
              "audienceFilter": {
                "groups": [
                  "Everyone"
                ]
              }
            },
            {
              "id"     : 2,
              "title"  : "message 2",
              "actionURL" : "http://www.google.com",
              "actionAlt" : "Google",
              "audienceFilter": {
                "groups": [
                  "Everyone"
                ],
                "dataUrl" : "http://www.google.com",
                "dataObject" : "id",
                "dataMessageMoreInfoUrl" : ["Learn More", "url"]
              }
            }
          ]
        }
      );
      httpBackend.whenGET("http://www.google.com").respond(200, {"name":"foo" , "id":"bar" , "favorite food":"baz", "Learn More":{"url" : url}});
      messagesService.getAllMessages().then(function(allMessages){
        expect(allMessages).toBeTruthy();
        expect(allMessages.length).toEqual(2);
        return messagesService.getMessagesByData(allMessages);
      }).then(function(dataMessages){
        expect(dataMessages).toBeTruthy();
        expect(dataMessages.length).toEqual(2);
        expect(dataMessages[1].moreInfoButton).toBeUndefined();
      });
      httpBackend.flush();
    });
    
    it("message should not have more info url from data if specified, but no dataurl is configured", function(){
      //setup
      var url = "exampleUrl";
      httpBackend.whenGET(messagesUrl).respond(
        {"messages" :
          [
            {
              "id"     : 1,
              "title"  : "message 1",
              "actionURL" : "http://www.google.com",
              "actionAlt" : "Google",
              "audienceFilter": {
                "groups": [
                  "Everyone"
                ]
              }
            },
            {
              "id"     : 2,
              "title"  : "message 2",
              "actionURL" : "http://www.google.com",
              "actionAlt" : "Google",
              "audienceFilter": {
                "groups": [
                  "Everyone"
                ],
                "dataObject" : "id",
                "dataMessageMoreInfoUrl" : ["Learn More", "url"]
              },
              "moreInfoButton": {
                "label": "Learn more",
                "url": "to be replaced"
              }
            }
          ]
        }
      );
      httpBackend.whenGET("http://www.google.com").respond(200, {"name":"foo" , "id":"bar" , "favorite food":"baz", "Learn More":{"url" : url}});
      messagesService.getAllMessages().then(function(allMessages){
        expect(allMessages).toBeTruthy();
        expect(allMessages.length).toEqual(2);
        return messagesService.getMessagesByData(allMessages);
      }).then(function(dataMessages){
        expect(dataMessages).toBeTruthy();
        expect(dataMessages.length).toEqual(2);
        expect(dataMessages[1].moreInfoButton.url).toEqual("to be replaced");
      });
      httpBackend.flush();
    });

  });
});