// DialogTriggerJS
// Copyright (c) 2016-2017 Shahzad Malik
// MIT License
//
// Triggers a callback to pop up a dialog (or do anything else) with the specified trigger options.
//
// "trigger" can be one of the following:
//    'exitIntent': Call 'callback' when a user intends to exit (such as moving cursor off page or coming back to the top)
//    'target': Call 'callback' when a user reaches a particular target element (set 'target' to the name of the element, such as '#mytarget')
//    'scrollDown': Call 'callback' when a user scrolls down by a certain percent from when the object is instantiated (set 'percentDown' to the percentage 0-100)
//    'scrollUp': Call 'callback' when a user scrolls up by a certain percent from when the object is instantiated (set 'percentUp' to the percentage 0-100)
//    'timeout': Call 'callback' after a certain number of milliseconds have elapsed (set 'timeout' to the desired milliseconds)
//
// Examples:
// Setting up individual triggers:
//    var dt = new DialogTrigger(triggerNagPopup, { trigger: 'timeout', timeout: 5000 });
//    var dt = new DialogTrigger(triggerNagPopup, { trigger: 'target', target: '#all' });
//    var dt = new DialogTrigger(triggerNagPopup, { trigger: 'scrollDown', percentDown: 50 });
//    var dt = new DialogTrigger(triggerNagPopup, { trigger: 'exitIntent' });
//
// Triggers can also be chained for a sequence of behaviors (such as scroll down by 50%, then exit):
//    var dtPercent = new DialogTrigger(function() {
//       var dtExit = new DialogTrigger(triggerNagPopup, { trigger: 'exitIntent' });
//    }, { trigger: 'scrollDown', percentDown: 50 });
function DialogTrigger(callback, options) {
	// Becomes this.options
	var defaults = {
		trigger	: 'timeout',
		target	: '',
		timeout	: 0,
		percentDown : 50, // Used for 'percent' to define a down scroll threshold of significance (based on page height)
		percentUp : 10, // Used for 'percent' to define a threshold of upward scroll after down threshold is reached
		scrollInterval: 1000 // Frequency (in ms) to check for scroll changes (to avoid bogging the UI)
	}
	
	this.complete = false; // Let's us know if the popup has been triggered
	
	this.callback = callback;
	this.timer = null;
	this.interval = null;
	
	this.options = jQuery.extend(defaults, options);
	
	this.init = function() {
		if(this.options.trigger == 'exitIntent' || this.options.trigger == 'exit_intent') {
			var parentThis = this;
			
			jQuery(document).on('mouseleave', function(e) {
				//console.log(e.clientX + ',' + e.clientY); // IE returns negative values on all sides
				
				if(!parentThis.complete && e.clientY < 0) { // Check if the cursor went above the top of the browser window
					parentThis.callback();
					parentThis.complete = true;
					jQuery(document).off('mouseleave');
				}
			});

		} else if(this.options.trigger == 'target') {
			if(this.options.target !== '') {
				// Make sure the target exists
				if(jQuery(this.options.target).length == 0) {
					this.complete = true;
				} else {
					var targetScroll = jQuery(this.options.target).offset().top;
					
					var parentThis = this;
					
					// Only check the scroll position every few seconds, to avoid bogging the UI
					this.interval = setInterval(function() {
						if(jQuery(window).scrollTop() >= targetScroll) {
							clearInterval(parentThis.interval);
							parentThis.interval = null;
							
							if(!parentThis.complete) {
								parentThis.callback();
								parentThis.complete = true;
							}
						}
					}, this.options.scrollInterval);
				}
			}
			
		} else if(this.options.trigger == 'scrollDown') {
			// Let the user scroll down by some significant amount
			var scrollStart = jQuery(window).scrollTop();
			var pageHeight = jQuery(document).height();
			
			var parentThis = this;
			
			if(pageHeight > 0) {
				// Only check the scroll position every few seconds, to avoid bogging the UI
				this.interval = setInterval(function() {
					var scrollAmount = jQuery(window).scrollTop() - scrollStart;
					if(scrollAmount < 0) {
						scrollAmount = 0;
						scrollStart = jQuery(window).scrollTop();
					}
					var downScrollPercent = parseFloat(scrollAmount) / parseFloat(pageHeight);
					
					if(downScrollPercent > parseFloat(parentThis.options.percentDown) / 100) {
						clearInterval(parentThis.interval);
						parentThis.interval = null;
						
						if(!parentThis.complete) {
							parentThis.callback();
							parentThis.complete = true;
						}
					}
					
				}, this.options.scrollInterval);
			}
			
		} else if(this.options.trigger == 'scrollUp') {
			// Let the user scroll down by some significant amount
			var scrollStart = jQuery(window).scrollTop();
			var pageHeight = jQuery(document).height();
			
			var parentThis = this;
			
			if(pageHeight > 0) {
				// Only check the scroll position every few seconds, to avoid bogging the UI
				this.interval = setInterval(function() {
					var scrollAmount = scrollStart - jQuery(window).scrollTop();
					if(scrollAmount < 0) {
						scrollAmount = 0;
						scrollStart = jQuery(window).scrollTop();
					}
					var upScrollPercent = parseFloat(scrollAmount) / parseFloat(pageHeight);
					
					if(upScrollPercent > parseFloat(parentThis.options.percentUp) / 100) {
						clearInterval(parentThis.interval);
						parentThis.interval = null;
						
						if(!parentThis.complete) {
							parentThis.callback();
							parentThis.complete = true;
						}
					}
					
				}, this.options.scrollInterval);
			}
			
		} else if(this.options.trigger == 'timeout') {
			this.timer = setTimeout(this.callback, this.options.timeout);
		}
		
    };
	
	this.cancel = function() {
		if(this.timer !== null) {
			clearTimeout(this.timer);
			this.timer = null;
		}
		
		if(this.interval !== null) {
			clearInterval(this.interval);
			this.interval = null;
		}
		
		this.complete = true;
	}

    this.init();
}
