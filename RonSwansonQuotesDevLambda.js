var http = require('http');

exports.handler = (event, context) => {

  try {

    if (event.session.new) {
      // New Session
      console.log("NEW SESSION");
    }

    switch (event.request.type) {

      case "LaunchRequest":
        // Launch Request
        console.log(`LAUNCH REQUEST`);
        context.succeed(
          buildResponse(
            buildSpeechletResponse("Welcome to Ron Swanson Quotes. Say 'Tell a quote'", false),
            {}
          )
        )
        break;

      case "IntentRequest":
        // Intent Req uest
        console.log(`INTENT REQUEST`);
        
        var endpoint = "http://ron-swanson-quotes.herokuapp.com/v2/quotes"
        var body = "";
        
        switch (event.request.intent.name) {
            
        case "GetQuote":
        
        http.get(endpoint, (response) => {
            response.on('data', (chunk) => {body += chunk})
            response.on('end', () => {
                var data = JSON.parse(body);
                var swansonQuote = data[0];
                context.succeed(
                    buildResponse(
                        buildSpeechletResponse(`${swansonQuote}`, false),
                        {}
                    )
                )
            })
        })
        break;
        
        default:
            throw "Invalid intent"
        }
        break;
        
      case "SessionEndedRequest":
        // Session Ended Request
        console.log(`SESSION ENDED REQUEST`);
        break;

      default:
        context.fail(`INVALID REQUEST TYPE: ${event.request.type}`);

    }

  } catch(error) { context.fail(`Exception: ${error}`) }

};


// --------------- Helpers that build all of the responses -----------------------

buildSpeechletResponse = (output, shouldEndSession) => {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        shouldEndSession: shouldEndSession
    };
}

buildResponse = (speechletResponse, sessionAttributes) => {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse
    };
}
