/**
* jspsych-typing
* Adapted from Josh de Leeuw jspsych-multi-stim-multi-response
*
* plugin for displaying a set of stimuli and collecting a set of responses
* via the keyboard
*
* documentation: docs.jspsych.org
*
**/

(function($) {
	jsPsych["img-typing"] = (function() {

		var plugin = {};

		plugin.create = function(params) {
			// Each stimulus is stored in trials array data structure
			var trials = new Array(params.img_paths.length);

			for (var i = 0; i < trials.length; i++) {
			
				trials[i] = {};
				trials[i].stimuli = params.img_names[i];
				trials[i].img_path = params.img_paths[i];
				// Key to press to validate the multi-keyboard press response
				trials[i].validresp = params.validresp;
								
				// Timing parameters
				trials[i].timing_stim = params.timing_stim || -1; 
				trials[i].timing_response = params.timing_response || -1; // if -1, then wait for response forever
				
				// Optional parameters
				trials[i].is_html = (typeof params.is_html === 'undefined') ? true : params.is_html;
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
			
			// display stimulus
			if (!trial.is_html) {
				display_element.append($('<img>', {
					src: trial.img_path,
					width: '200px',
					id: 'jspsych-typing-stimulus'
				}));
			} else {
				display_element.append($('<div>', {
					html: trial.stimuli,
					id: 'jspsych-typing-stimulus'
				}));
			}

			//show prompt if there is one
			if (trial.prompt !== "") {
				display_element.append(trial.prompt);
			}
			
			// array for response times 
			var responseTimes = [];
			var responseTypingTimes = [];
			// array for response keys 
			var responseKeys = [];

			// array for response keys (char form)
			var responseChars = "";

			var responseValidity = 0;
			
			// Initialize response div
			display_element.append($('<input>', {
					type: 'text',
					size: '10',
					//value: 'blabla',
					id: 'jspsych-typing-response'
				}));
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
                    
                //display_element.html(''); // clear the display

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

			// hide image if timing is set
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
