'use strict';
var Alexa = require('alexa-sdk');

var APP_ID = "amzn1.ask.skill.60c09215-cb26-4e33-97d6-c978ed3dced7"; //app ID as obtained from the Amazon developer's portal for the skill
 
var SKILL_NAME = "MUExpedition";
var WELCOME_MESSAGE = "Welcome to M U Expedition. You can get information about the different rooms of the Old Trafford Museum ... Which room do you want information about?";
var WELCOME_REPROMPT = "For instructions on what you can say, please say help me.";
var GET_FACT_MESSAGE = "Here's some information: ";
var HELP_MESSAGE = "You can say things like, give me some information about...or mention which room you prefer to learn about...Now, what can I help you with?";
var HELP_REPROMPT = "What can I help you with?";
var STOP_MESSAGE = "see you soon, Goodbye!";
var CANCEL_MESSAGE= "Ok, let\'s play again soon.";
var NO_MESSAGE= "Ok, we\'ll play another time. Goodbye!";
var TRIVIA_UNHANDLED= "Do you want to learn more";
var START_UNHANDLED= "Say start over to start a new game.";
var ROOMNAME_UNHANDLED= "Sorry, I did not get you. Which room do you want information about? ";          

var GAME_STATES = {
    TRIVIA: "_TRIVIAMODE", // Asking trivia questions.
    START: "_STARTMODE", // Entry point, start the game.
	CLUE: "_CLUEMODE", // Giving a clue to the next spot.
	BRANCH: "_BRANCHMODE" // User's choice:Trivia or Clue?.

};

var info = require("./facts");

//Information on different rooms
var facts = {
	"trophyroom": info["trophydata"],
	"stadium": info["stadiumdata"],
	"jerseyroom": info["dressingroomdata"],
	"playerslounge": info["playersloungedata"],
	"manchester": info["manchester"]
};

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(newSessionHandlers, startStateHandlers, triviaStateHandlers, clueStateHandlers , branchStateHandlers );
    alexa.execute();
};

var newSessionHandlers = {
    "LaunchRequest": function () {
        this.handler.state = GAME_STATES.START;
        this.emitWithState("StartGame", true);
    },
    "AMAZON.StartOverIntent": function() {
        this.handler.state = GAME_STATES.START;
        this.emitWithState("StartGame", true);
    },
    "Unhandled": function () {
        var speechOutput = START_UNHANDLED;
        this.emit(":ask", speechOutput, speechOutput);
    }
};

var startStateHandlers = Alexa.CreateStateHandler(GAME_STATES.START, {
    "StartGame": function () {
		this.emit(':ask', WELCOME_MESSAGE,WELCOME_REPROMPT);
        this.emit('GetNewFactIntent');
	}, 
	"GetNewFactIntent": function () {
		
		var room = this.event.request.intent.slots.roomname;
		if(room.value==undefined){
			 room.value = "manchester" ;
		}
		var factArr = facts.manchester;
		if(room.value.toLowerCase()=="trophy room"){
			 factArr = facts.trophyroom;
		}
		else if(room.value.toLowerCase()=="stadium"){
			factArr = facts.stadium;
		}
		else if(room.value.toLowerCase()=="players lounge"){
			factArr = facts.playerslounge;
		}
		else if(room.value.toLowerCase()=="jersey room"){
			factArr = facts.jerseyroom;
		}
		else{factArr = facts.manchester;}
		
   
        var factIndex = Math.floor(Math.random() * factArr.length);
        var randomFact = factArr[factIndex];
        var speechOutput = GET_FACT_MESSAGE + randomFact;
		speechOutput+="Do you want to learn more?";
		Object.assign(this.attributes, {
			"oldtraffroom": room.value,
			"speechOutput":speechOutput
			
        });
		this.handler.state = GAME_STATES.BRANCH;
        this.emit(':askWithCard', speechOutput , "Say yes if you would like to learn more or repeat to listen to the information again." , SKILL_NAME, randomFact);
		
		
    },
	"Unhandled": function () {
        var speechOutput = ROOMNAME_UNHANDLED;
        this.emit(":ask", speechOutput, speechOutput);
    },
	'AMAZON.HelpIntent': function () {
        var speechOutput = HELP_MESSAGE;
        var reprompt = HELP_REPROMPT;
        this.emit(':ask', speechOutput, reprompt);
    },
	"SessionEndedRequest": function () {
        console.log("Session ended in trivia state: " + this.event.request.reason);
    }
});

var branchStateHandlers = Alexa.CreateStateHandler(GAME_STATES.BRANCH, {	
	"AMAZON.YesIntent": function() {
		moreRoomInfo.call(this,false);
    },
	"AMAZON.NoIntent": function() {
        this.emit(":ask", "Would you like to play trivia or would you like a clue to the next spot.","Trivia or Clue?");
		this.emit("StateIntent");
		
    },
	
	"StateIntent": function() {
		var state = this.event.request.intent.slots.gamestate;
		if(state.value.toLowerCase()=="trivia"){
			this.handler.state = GAME_STATES.TRIVIA;
			this.emitWithState("TriviaIntent", false);
		}
		else if(state.value.toLowerCase()=="clue"){
			 this.handler.state = GAME_STATES.CLUE;
			this.emitWithState("ClueIntent", false);
		}
		else{}
	},
    "AMAZON.StartOverIntent": function () {
        this.handler.state = GAME_STATES.START;
        this.emitWithState("StartGame", false);
    },
    "AMAZON.RepeatIntent": function () {
        this.emit(":ask", this.attributes.speechOutput, "Do you want to learn more?");
    },
    "AMAZON.HelpIntent": function () {
        var speechOutput = HELP_MESSAGE;
        var reprompt = HELP_REPROMPT;
        this.emit(':ask', speechOutput, reprompt);
    },
    "AMAZON.StopIntent": function () {
        var speechOutput = STOP_MESSAGE;
        this.emit(":tell", speechOutput);
    },
    "AMAZON.CancelIntent": function () {
        this.emit(":tell", CANCEL_MESSAGE);
    },
    "Unhandled": function () {
        var speechOutput = TRIVIA_UNHANDLED;
        this.emit(":ask", speechOutput, speechOutput);
    },
	
    "SessionEndedRequest": function () {
        console.log("Session ended in trivia state: " + this.event.request.reason);
    }
});

var triviaStateHandlers = Alexa.CreateStateHandler(GAME_STATES.TRIVIA, {
	
	
	
	"TriviaIntent": function() {
		this.emit(':tell',"trivia selected");
	},
    "AMAZON.StartOverIntent": function () {
        this.handler.state = GAME_STATES.START;
        this.emitWithState("StartGame", false);
    },
    "AMAZON.HelpIntent": function () {
        var speechOutput = HELP_MESSAGE;
        var reprompt = HELP_REPROMPT;
        this.emit(':ask', speechOutput, reprompt);
    },
    "AMAZON.StopIntent": function () {
        this.handler.state = GAME_STATES.HELP;
        var speechOutput = STOP_MESSAGE;
        this.emit(":ask", speechOutput, speechOutput);
    },
    "AMAZON.CancelIntent": function () {
        this.emit(":tell", CANCEL_MESSAGE);
    },
    "Unhandled": function () {
        var speechOutput = TRIVIA_UNHANDLED;
        this.emit(":ask", speechOutput, speechOutput);
    },
    "SessionEndedRequest": function () {
        console.log("Session ended in trivia state: " + this.event.request.reason);
    }
});

var clueStateHandlers = Alexa.CreateStateHandler(GAME_STATES.CLUE, {
	
	
	"ClueIntent": function() {
		this.emit(':tell',"clue selected");
	},
    "AMAZON.StartOverIntent": function () {
        this.handler.state = GAME_STATES.START;
        this.emitWithState("StartGame", false);
    },

    "AMAZON.HelpIntent": function () {
        var speechOutput = HELP_MESSAGE;
        var reprompt = HELP_REPROMPT;
        this.emit(':ask', speechOutput, reprompt);
    },
    "AMAZON.StopIntent": function () {
        this.handler.state = GAME_STATES.HELP;
        var speechOutput = STOP_MESSAGE;
        this.emit(":ask", speechOutput, speechOutput);
    },
    "AMAZON.CancelIntent": function () {
        this.emit(":tell", CANCEL_MESSAGE);
    },
    "Unhandled": function () {
        var speechOutput = TRIVIA_UNHANDLED;
        this.emit(":ask", speechOutput, speechOutput);
    },
    "SessionEndedRequest": function () {
        console.log("Session ended in trivia state: " + this.event.request.reason);
    }
});

function moreRoomInfo() {
		var room = this.attributes.oldtraffroom;
		var factArr = facts.manchester;
	
		if(room=="trophy room"){
			 factArr = facts.trophyroom;
		}
		else if(room=="stadium"){
			factArr = facts.stadium;
		}
		else if(room=="players lounge"){
			factArr = facts.playerslounge;
		}
		else if(room=="jersey room"){
			factArr = facts.jerseyroom;
		}
		else{factArr = facts.manchester;}
		var factIndex = Math.floor(Math.random() * factArr.length);
        var randomFact = factArr[factIndex];
        var speechOutput = GET_FACT_MESSAGE + randomFact;
		speechOutput+="Do you want to learn more?";
        this.emit(':askWithCard', speechOutput , "Say yes if you would like to learn more." , SKILL_NAME, randomFact);
}
