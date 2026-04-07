/*
	Strata by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var $window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		settings = {

			// Parallax background effect?
				parallax: true,

			// Parallax factor (lower = more intense, higher = less intense).
				parallaxFactor: 20

		};

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1800px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ],
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch?
		if (browser.mobile) {

			// Turn on touch mode.
				$body.addClass('is-touch');

			// Height fix (mostly for iOS).
				window.setTimeout(function() {
					$window.scrollTop($window.scrollTop() + 1);
				}, 0);

		}

	// Footer.
		breakpoints.on('<=medium', function() {
			$footer.insertAfter($main);
		});

		breakpoints.on('>medium', function() {
			$footer.appendTo($header);
		});

	// Section nav: move into header on mobile, back to main on desktop.
		breakpoints.on('<=medium', function() {
			$('.section-nav').appendTo($header);
		});

		breakpoints.on('>medium', function() {
			$main.prepend($('.section-nav'));
		});

	// Header.

		// Parallax background.

			// Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
				if (browser.name == 'ie'
				||	browser.mobile)
					settings.parallax = false;

			if (settings.parallax) {

				breakpoints.on('<=medium', function() {

					$window.off('scroll.strata_parallax');
					$header.css('background-position', '');

				});

				breakpoints.on('>medium', function() {

					$header.css('background-position', 'left 0px');

					$window.on('scroll.strata_parallax', function() {
						$header.css('background-position', 'left ' + (-1 * (parseInt($window.scrollTop()) / settings.parallaxFactor)) + 'px');
					});

				});

				$window.on('load', function() {
					$window.triggerHandler('scroll');
				});

			}

	// Main Sections: Two.

		// Lightbox gallery.
			$window.on('load', function() {

				$('#two').poptrox({
					caption: function($a) { return $a.next('h3').text(); },
					overlayColor: '#2c2c2c',
					overlayOpacity: 0.85,
					popupCloserText: '',
					popupLoaderText: '',
					selector: '.work-item a.image',
					usePopupCaption: true,
					usePopupDefaultStyling: false,
					usePopupEasyClose: false,
					usePopupNav: true,
					windowMargin: (breakpoints.active('<=small') ? 0 : 50)
				});

			});

	// Bubble nav scroll state — hoisted so click handler and updateBubbleSizes share it.
		var bubbleActiveSectionId = null;
		var bubbleScrollAnimating = false;
		var bubbleAnimSource = null;
		var bubbleAnimDest = null;
		var bubbleAnimId = 0; // incremented each click; prevents stale completions

		var bubbleSections = [
			{ id: 'one',     $el: $('#one') },
			{ id: 'Two',     $el: $('#Two') },
			{ id: 'contact', $el: $('#contact') }
		];

	// Shared scroll offset: stop this many px above the section top so heading has breathing room.
		var scrollOffset = 60;

	// Smooth scroll for section nav links.
		$('.section-nav a').on('click', function(e) {
			e.preventDefault();
			var $target = $($(this).attr('href'));
			if (!$target.length) return;

			var startY = window.pageYOffset;
			var endY = Math.max(0, $target.offset().top - scrollOffset);
			var distance = endY - startY;
			var duration = 1200;
			var startTime = null;

			function easeOutQuint(t) { return 1 - Math.pow(1 - t, 5); }

			function step(timestamp) {
				if (!startTime) startTime = timestamp;
				var progress = Math.min((timestamp - startTime) / duration, 1);
				window.scrollTo(0, startY + distance * easeOutQuint(progress));
				if (progress < 1) requestAnimationFrame(step);
			}

			requestAnimationFrame(step);
		});

	// Smooth scroll for bubble nav links (ease-out quint: fast start, slow finish).
		$('.bubble-link').on('click', function(e) {
			e.preventDefault();
			var $target = $($(this).attr('href'));
			if (!$target.length) return;

			// Compute source fresh from current scroll position — never rely on stale state.
			var cst = window.pageYOffset;
			var cwh = window.innerHeight;
			var cth = cst + cwh * 0.45;
			var src = null;
			for (var j = bubbleSections.length - 1; j >= 0; j--) {
				if (bubbleSections[j].$el.length && bubbleSections[j].$el.offset().top <= cth) {
					src = bubbleSections[j].id;
					break;
				}
			}
			bubbleAnimSource = src;
			bubbleAnimDest   = $(this).attr('href').replace('#', '');
			bubbleScrollAnimating = true;
			bubbleAnimId++;
			var myId = bubbleAnimId;

			var startY = window.pageYOffset;
			var endY = Math.max(0, $target.offset().top - scrollOffset);
			var distance = endY - startY;
			var duration = 1200;
			var startTime = null;

			function easeOutQuint(t) {
				return 1 - Math.pow(1 - t, 5);
			}

			function step(timestamp) {
				if (!startTime) startTime = timestamp;
				var progress = Math.min((timestamp - startTime) / duration, 1);
				window.scrollTo(0, startY + distance * easeOutQuint(progress));
				if (progress < 1) {
					requestAnimationFrame(step);
				} else if (myId === bubbleAnimId) {
					// Only the most recent animation clears the flag.
					bubbleScrollAnimating = false;
					bubbleActiveSectionId = bubbleAnimDest;
					updateBubbleSizes(); // sync spy immediately so manual scroll works right away
				}
			}

			requestAnimationFrame(step);
		});

	// Floating bubble nav: scale bubbles by section top proximity.
		function updateBubbleSizes() {
			var scrollTop = $window.scrollTop();
			var windowHeight = $window.height();
			var maxDist = windowHeight;
			var threshold = scrollTop + windowHeight * 0.45;

			if (bubbleScrollAnimating) {
				// During a click-scroll: only toggle between source and destination.
				var destEl = $('#' + bubbleAnimDest);
				if (destEl.length && destEl.offset().top <= threshold) {
					bubbleActiveSectionId = bubbleAnimDest;
				} else {
					bubbleActiveSectionId = bubbleAnimSource;
				}
			} else {
				// Normal scroll spy.
				bubbleActiveSectionId = null;
				for (var i = bubbleSections.length - 1; i >= 0; i--) {
					if (bubbleSections[i].$el.length && bubbleSections[i].$el.offset().top <= threshold) {
						bubbleActiveSectionId = bubbleSections[i].id;
						break;
					}
				}
			}

			$('.bubble-link').each(function() {
				var href = $(this).attr('href');
				var sectionId = href.replace('#', '');
				var $target = $(href);
				if (!$target.length) return;

				// During a click-scroll, freeze scale on intermediate bubbles.
				if (bubbleScrollAnimating && sectionId !== bubbleAnimSource && sectionId !== bubbleAnimDest) {
					$(this).toggleClass('active', false);
					return;
				}

				var sectionTop = $target.offset().top;
				var dist = Math.abs(scrollTop - sectionTop);
				var normalized = Math.min(dist / maxDist, 1);

				var scale = 1.4 - (normalized * 0.5);
				$(this).css('transform', 'scale(' + scale + ')');
				$(this).toggleClass('active', sectionId === bubbleActiveSectionId);
			});
		}

		$window.on('scroll', updateBubbleSizes);
		$window.on('load', updateBubbleSizes);

})(jQuery);