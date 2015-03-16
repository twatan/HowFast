/**
 * jspsych-single-stim
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: https://github.com/jodeleeuw/jsPsych/wiki/jspsych-single-stim
 *
 **/

(function($) {
	jsPsych["stroop"] = (function() {

		var plugin = {};

		plugin.create = function(params) {

			var trials = new Array(params.stimuli.word.length);
			for (var i = 0; i < trials.length; i++) {
				trials[i] = {};
				trials[i].word = params.stimuli.word[i];
				trials[i].color = params.stimuli.color[i];
				trials[i].congruent = params.stimuli.congruent[i];
				trials[i].choices = params.choices;
				// option to show image for fixed time interval, ignoring key responses
				//      true = trial will immediately advance when response is recorded
				//      false = image will keep displaying after response
				trials[i].continue_after_response = true;
				// timing parameters
				trials[i].timing_stim = params.timing_stim || -1; // if -1, then show indefinitely
				trials[i].timing_response = params.timing_response || -1; // if -1, then wait for response forever
			}
			return trials;
		};



		plugin.trial = function(display_element, trial) {

			// if any trial variables are functions
			// this evaluates the function and replaces
			// it with the output of the function
			trial = jsPsych.pluginAPI.normalizeTrialVariables(trial);

			// this array holds handlers from setTimeout calls
			// that need to be cleared if the trial ends early
			var setTimeoutHandlers = [];
			var idtrial = ['jspsych-stroop-' + trial.color];
			// display stimulus
			display_element.append($('<div>', {
					html: trial.word,
					id: idtrial
				}));
			
			// store response
			var response = {rt: -1, key: -1};

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
					"rt": response.rt,
					"stimulus": trial.word,
					"color": trial.color,
					"congruent": trial.congruent,
					"key_press": response.key,
					"key_char": response.charKey,
					"valid": response.valid
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
				
				// only record the first response
				if(response.key == -1){
					response = info;
					response.charKey = String.fromCharCode(info.key);
					if (String.fromCharCode(info.key)=== trial.color[0].toUpperCase()){
						response.valid = 1;
						}else{
						response.valid = 0;
					};
				}

				if (trial.continue_after_response) {
					end_trial();
				} 
			};


			// start the response listener
			var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse(after_response, trial.choices);

			// hide image if timing is set
			if (trial.timing_stim > 0) {
				var t1 = setTimeout(function() {
					$(['#'+idtrial]).css('visibility', 'hidden');
				}, trial.timing_stim);
				setTimeoutHandlers.push(t1);
			}

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
