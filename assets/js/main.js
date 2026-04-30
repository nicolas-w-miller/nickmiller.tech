/*
	Strata by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var $window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$main = $('#main');

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

	// ── Sticky Nav ──────────────────────────────────────────────
		var $stickyNav  = $('#sticky-nav');
		var $navLinks   = $('.nav-links a');
		var $hamburger  = $('.nav-hamburger');
		var $mobileMenu = $('.nav-mobile-menu');
		var heroHeight  = 0;

		function getHeroHeight() {
			heroHeight = $header.outerHeight() || window.innerHeight;
		}
		getHeroHeight();
		$window.on('resize', getHeroHeight);

		$window.on('scroll.stickynav', function() {
			var scrollY = window.pageYOffset;

			if (scrollY > heroHeight * 0.6) {
				$stickyNav.addClass('is-visible');
			} else {
				$stickyNav.removeClass('is-visible menu-open');
				$mobileMenu.attr('aria-hidden', 'true');
				$hamburger.attr('aria-expanded', 'false');
			}

			var sections = [
				{ id: 'one',     $el: $('#one') },
				{ id: 'Two',     $el: $('#Two') },
				{ id: 'contact', $el: $('#contact') }
			];
			var activeId  = null;
			var threshold = scrollY + 120;

			for (var si = sections.length - 1; si >= 0; si--) {
				if (sections[si].$el.length && sections[si].$el.offset().top <= threshold) {
					activeId = sections[si].id;
					break;
				}
			}

			$navLinks.each(function() {
				$(this).toggleClass('active', $(this).attr('href').replace('#', '') === activeId);
			});
		});

	// ── Hamburger toggle ─────────────────────────────────────────
		$hamburger.on('click', function() {
			var isOpen = $stickyNav.hasClass('menu-open');
			$stickyNav.toggleClass('menu-open');
			$hamburger.attr('aria-expanded', isOpen ? 'false' : 'true');
			$mobileMenu.attr('aria-hidden', isOpen ? 'true' : 'false');
		});

	// ── Smooth scroll ─────────────────────────────────────────────
		function smoothScrollTo(targetId) {
			var $target = $(targetId);
			if (!$target.length) return;
			var offset    = 70;
			var startY    = window.pageYOffset;
			var endY      = Math.max(0, $target.offset().top - offset);
			var distance  = endY - startY;
			var duration  = 900;
			var startTime = null;

			function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

			function step(ts) {
				if (!startTime) startTime = ts;
				var progress = Math.min((ts - startTime) / duration, 1);
				window.scrollTo(0, startY + distance * easeOutQuart(progress));
				if (progress < 1) requestAnimationFrame(step);
			}

			requestAnimationFrame(step);
		}

		$('#sticky-nav a[href^="#"]').on('click', function(e) {
			e.preventDefault();
			var href = $(this).attr('href');
			$stickyNav.removeClass('menu-open');
			$mobileMenu.attr('aria-hidden', 'true');
			$hamburger.attr('aria-expanded', 'false');
			smoothScrollTo(href);
		});

		$('.btn-primary-hero').on('click', function(e) {
			e.preventDefault();
			smoothScrollTo($(this).attr('href'));
		});

	// ── Scroll Reveal ─────────────────────────────────────────────
		function initScrollReveal() {
			$('.section-header').addClass('reveal');
			$('section#one .row > article, section#Two .row > article').addClass('reveal reveal-stagger');

			var $revealEls = $('.reveal');

			function checkReveal() {
				var winBottom = window.pageYOffset + window.innerHeight;
				$revealEls.each(function() {
					if (!$(this).hasClass('is-revealed') && winBottom > $(this).offset().top + 60) {
						$(this).addClass('is-revealed');
					}
				});
			}

			$window.on('scroll.reveal', checkReveal);
			checkReveal();
		}

		$window.on('load', initScrollReveal);


})(jQuery);
