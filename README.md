# MUExpedition

An Alexa Skill using which users can play a game of treasure hunt at the Old Trafford Museum.
Alexa first delivers information about Museum spots by recognizing the user's location, asks the
users questions related to what she just delivered and gives them a clue to the next spot in the Museum.

Tools used:
Alexa Skills kit (ASK) : Being used by designers and developers to build engaging skills, it is a
collection of self-service APIs, tools, documentation, and code samples that makes it fast and
easy to add skills to Alexa.
AWS Lambda : AWS Lambda ,one of the services provided by Amazon helps in running code
without provisioning or managing servers. Lambda can be used to run code for virtually any type
of application or backend service.

IntentSchema.json defines the intents(an action that fulfills a user’s spoken request) the skill requires.
SampleUtterances_en_US.txt contains the utterances(A set of likely spoken phrases mapped to the intents) the user may utter.
index.js includes the main Node.js code that contains the logic behind the skill.
facts.js contains the information of different rooms of the museum.

Steps
1. Setting up the skill on the Amazon Developer portal.
2. Configuration
   Creating a Lambda function that interprets the appropriate interaction and provides the conversation back to the user. 
   This is done on the AWS console and it is where the actual Node.js code resides.
3. Connection between the Voice User Interface and Lambda Function
4. Testing the Skill on the Amazon Developer portal.

Website url :http://manchesterunitedexpedition.000webhostapp.com/
