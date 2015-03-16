/**
* jspsych-wd-typing
* Adapted from Josh de Leeuw plugin : jspsych-multi-stim-multi-response
*
* Copy of word. 
* A set of words is displayed. For each word, the typing keys & RTs are 
* collected, until a special key is being pressed by the participant.
* The consistency between the displayed word and the subject's response is
* checking.
*
* Plugin parameters :
* stimuli : the set of words (character arrays)
* validresp : key code to press to submit the response 
*            [default: 13, which corresponds to the Enter key]
* timing_stim : maximum duration of word presentation if the confirm key is not pressed (s) 
*            [default: infinite]
* timing_response : maximum duration to wait for the participant answer 
*            [default: infinite]
* 
* Output data :
* for each word, the typing key codes and key chars, the timing of each key and the 
* response consistency (1 : same word typing by the participant, 0 otherwise) 
*
* documentation: docs.jspsych.org
*
**/

(function($) {
	jsPsych["wd-typing"] = (function() {

		var plugin = {};

		plugin.create = function(params) {
			// Each stimulus is stored in trials array data structure
			var trials = new Array(params.stimuli.length);

			for (var i = 0; i < trials.length; i++) {			
				trials[i] = {};
				// Word to display (as html element)
				trials[i].stimuli = params.stimuli[i];

				// Key code to press to confirm the multi-keyboard typing response
				// Only one key is allowed.
				var valkey = (typeof params.validresp === 'undefined') ? 13 : params.validresp;
				// Replace it if it is not a number
				if (typeof valkey == 'string') {
					if (valkey.length===1){
						valkey = valkey.charCodeAt(valkey);
					}else{
						valkey = 13;
					}
				};				
				trials[i].validresp = valkey;
				
				// Timing parameters
				trials[i].timing_stim = params.timing_stim || -1; 
				trials[i].timing_response = params.timing_response || -1; // if -1, then wait for response forever
				
				// Optional parameters 
				trials[i].prompt = (typeof params.prompt === 'undefined') ? "" : params.prompt;
			}
			return trials;
		};

		plugin.trial = function(display_element, trial) {

			// Function to evaluate trial variables if any of them are functions
			// and replace it with the output of the function
			trial = jsPsych.pluginAPI.normalizeTrialVariables(trial);

			// this array holds handlers from setTimeout calls
			// that need to be cleared if the trial ends early
			var setTimeoutHandlers = [];
			
			// Display stimulus - Limited to an html div element
			display_element.append($('<div>', {
				html: trial.stimuli,
				id: 'jspsych-typing-stimulus'
			}));


			// Show prompt if there is one
			if (trial.prompt !== "") {
				display_element.append(trial.prompt);
			}
			
			// Array for response times 
			var responseTimes = []; 		// Timing from the stimulus presentation
			var responseTypingTimes = []; 	// Timing from the first typing letter
			
			// Array for response keys 
			var responseKeys = []; 		// JS numeric code
			var responseChars = ""; 	// Equivalent char form

			// Array for response validity
			var responseValidity = 0;
			
			// Initialize response input element
			display_element.append($('<input>', {
					type: 'text',
					size: '10',
					id: 'jspsych-typing-response'
				}));
			
			// Give the focus to this input area			
			$('#jspsych-typing-response').focus();	
			
			// function to end trial when it is time
			var end_trial = function() {

				// kill any remaining setTimeout handlers
				for (var i = 0; i < setTimeoutHandlers.length; i++) {
					clearTimeout(setTimeoutHandlers[i]);
				}

				// kill keyboard listeners
				jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);

				// gather the data to store for the trial
				var trial_data = {
					"stimulus": trial.stimuli,
					"key_press": JSON.stringify(responseKeys),
					"key_char": responseChars,
					"rt": JSON.stringify(responseTimes),
					"typt": JSON.stringify(responseTypingTimes),
					"valid": responseValidity,
				};
	
				jsPsych.data.write($.extend({}, trial_data, trial.data));

				// clear the display
				display_element.html('');

				// move on to the next trial
				if (trial.timing_post_trial > 0) {
					setTimeout(function() {
						jsPsych.finishTrial();
					}, trial.timing_post_trial);
				} else {
					jsPsych.finishTrial();
				}
			};

			// function to handle responses by the subject		
			var after_response = function(info) {
                // Store responses keys and RTs until confirm key is not pressed    
                if (info.key !== trial.validresp){
					responseTimes.push(info.rt);
					var nt = responseTimes.length;
					
					if (nt === 1){
						responseTypingTimes.push(0);
					}else{
						responseTypingTimes.push(info.rt - responseTimes[nt-2])
					};
					responseKeys.push(info.key);
					responseChars = responseChars + String.fromCharCode(info.key).toLowerCase();
					
				}else{
					if(responseTimes.length === 0){
						responseTimes = -1;
						responseTypingTimes = -1;
					}else{ // Check for validity
						if (responseChars == trial.stimuli.toLowerCase()){
							responseValidity = 1;
						};
					}
					end_trial();
				};
                
            };

			// hide word if timing is set
			if (trial.timing_stim > 0) {
				var t1 = setTimeout(function() {
					$('#jspsych-typing-stimulus').css('visibility', 'hidden');
				}, trial.timing_stim);
				setTimeoutHandlers.push(t1);
			}
			
			// start the response listener
			var valideresp = [];
			var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse(after_response, valideresp, "date", true);

			// end trial if time limit is set
			if (trial.timing_response > 0) {
				var t2 = setTimeout(function() {
					end_trial();
				}, trial.timing_response);
				setTimeoutHandlers.push(t2);
			}
		};
		
		return plugin;
	})();
})(jQuery);
