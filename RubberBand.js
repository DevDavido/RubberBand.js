/**
* RubberBand
* Version: 1.0
* http://thrivingkings.com/read/RubberBand-Easily-add-the-iOS-style-pull-to-refresh-functionality-to-any-page
*/

;(function(window, undefined) {

	// RubberBand, the object
	var RubberBand = function(cb) {
		
		// for down scope uses of this object
		var $me = this;
		
		this.config = {
			pullText: 'Pull to Refresh',
			loadText: 'Loading...'
		};
		
		// variables to be used throughout that are set on init (don't edit)
		this.variables = {
			callback: null,
			calling: false,
			elementHeight: null,
			maxHeight: null,
			originalTop: null,
			scrolling: null,
			closing: null,
			inplay: false,
			$RBe: null,
			images: true,
                        $body: null
		};
		
		// Initialize function
		// sets all variables
		this.init = function(cb) {
			
			$me.variables.$body = $('body');
                        
			// if the element doesn't exist, create it
			if (!$('#rubberband').size()) {
				
				$me.variables.$body.prepend($('<div id="rubberband">')
                                                   .append($('<div class="band">')
                                                   .append($('<h3 class="text">'))));
				$me.variables.images = false;
			}
			
			// set all necessary variables
			$me.variables.$RBe = $('#rubberband');
			$me.variables.$RBe.find('.band .text').html($me.config.pullText);
                        
			$me.variables.callback = cb;
                        
			$me.variables.elementHeight = parseFloat($me.variables.$RBe.css('top').replace(/px/, '')); // this needs to be an integer
			$me.variables.maxHeight = Math.abs($me.variables.elementHeight); // swap to positive
			$me.variables.originalTop = $me.variables.elementHeight;
			
			// Bind to the scrolling of the window
			$(window).scrollTop(1).on('scroll touchmove', $me.RB);
		};
		
		// The actual RubberBand function
		this.RB = function() {
			
			// clear the timeout on any scroll
			$me.variables.scrolling = window.clearTimeout($me.variables.scrolling);
			
			// only do something if they're at the top of the page
			if ($(window).scrollTop() <= 0) {
			
				$me.variables.inplay = true;
				
				var diff;
			
				if ($me.variables.elementHeight < 0) {
					
					// tension control for more of a natural feel
					if ($me.variables.elementHeight >= -10) {
						diff = 3;
					} else if ($me.variables.elementHeight >= -20) {
						diff = 4;
					} else if ($me.variables.elementHeight >= -50) {
						diff = 5;
					} else {
						diff = 6;
					}
					
					// determine values and set css rules
					$me.variables.elementHeight = $me.variables.elementHeight + diff;
					$me.variables.$RBe.css('top', $me.variables.elementHeight + 'px');
					$me.variables.$body.css('padding-top', ($me.variables.maxHeight + $me.variables.elementHeight) + 'px');
					
					// this allows the user to continue to scroll
					$(window).scrollTop(1);
				
				// when the very top has been reached, "refresh"
				} else if ($me.variables.elementHeight >= 0) {
					
					// no more scrolling for now
					$(window).unbind('scroll');
					
					// set CSS to avoid "over-scrolling"
					$me.variables.$RBe.css('top', '0');
				
					$me.variables.$body.css('padding-top', $me.variables.maxHeight + 'px');
					$me.variables.scrolling = window.clearTimeout($me.variables.scrolling);
					$me.variables.$RBe.find('.band .text').html($me.config.loadText);
					
					// switch images, if they exist
					if ($me.variables.images) {
						$me.variables.$RBe.find('.band .load').show();
						$me.variables.$RBe.find('.band .arrow').hide();
					}
					
					// fire the callback, or "on refresh" function
					if ($me.variables.callback) {
						if (!$me.variables.calling) {
							$me.variables.callback($me);
							$me.variables.calling = true;
						}
					// otherwise just close it
					} else {
						$me.close();
					}
					
				}
			}
		
			// if they're not scrolling, the band is showing, and it isn't already closing-- close it
			if (!$me.variables.closing && $me.variables.inplay && $me.variables.elementHeight < 0) {
				$me.variables.scrolling = window.setTimeout(function() {
					$me.close();
				}, 200);
			}
		};
		
		// Close function
		// animates the band to the original closed state
		this.close = function() {
			
			// fire both animations
			$me.variables.$RBe.animate({ top: $me.variables.originalTop }, 200);
			
			// reset after the animation has completed
			$me.variables.$body.animate({ paddingTop: 0 }, 200, function() { 
			
				//$(window).scrollTop(1); 
			
				$(window).on('scroll touchmove', $me.RB); 
			
				$me.variables.elementHeight = $me.variables.originalTop;
				$me.variables.inplay = false;
				$me.variables.calling = false;
				$me.variables.closing = window.clearTimeout($me.variables.closing);
				
				// reset action text
				$me.variables.$RBe.find('.band .text').html($me.config.pullText);
				
				if ($me.variables.images) {
					$me.variables.$RBe.find('.band .load').hide();
					$me.variables.$RBe.find('.band .arrow').show();
				}
			});

		};
                
                // Remove function
                this.remove = function() {
                    $(window).off('scroll touchmove');
                    $me.variables.$body.finish();
                    
                    delete $me;
                };
		
		// Runtime
		this.init(cb);
	};
	
	// set the variable to be accessed
	window.RubberBand = RubberBand;
}(window));
