/*
  script.js — jQuery interactions for nav, reveal animations, toggles, slider, and form demo
  --------------------------------------------------------------------------------------- */
$(function () {
  // 1) Active nav link based on current path
  const path = window.location.pathname.split('/').pop() || 'index.html';
  $('#primary-menu a').each(function () {
    const href = $(this).attr('href');
    if (href === path) $(this).addClass('active');
  });

  // 2) Mobile menu toggle
  $('.menu-toggle').on('click', function () {
    const expanded = $(this).attr('aria-expanded') === 'true' || false;
    $(this).attr('aria-expanded', !expanded);
    $('#primary-menu').toggleClass('open');
  });

  // Close menu on link click (mobile)
  $('#primary-menu a').on('click', function () {
    $('#primary-menu').removeClass('open');
    $('.menu-toggle').attr('aria-expanded', 'false');
  });

  // 3) Reveal on scroll (simple viewport check)
  const reveal = function () {
    $('.reveal').each(function () {
      const rect = this.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) $(this).addClass('visible');
    });
  };
  reveal();
  $(window).on('scroll resize', reveal);

  // 4) About page: Show/Hide (Read more)
  $('#toggleMore').on('click', function () {
    const more = $('.more-text');
    const isHidden = more.attr('hidden') !== undefined;
    if (isHidden) {
      more.removeAttr('hidden');
      $(this).text('Show less').attr('aria-expanded', 'true');
    } else {
      more.attr('hidden', true);
      $(this).text('Read more').attr('aria-expanded', 'false');
    }
  });

  // 5) Projects slider — lightweight jQuery carousel
  const $slider = $('.slider');
  if ($slider.length) {
    const $track = $slider.find('.slides');
    const $slides = $slider.find('.slide');
    const total = $slides.length;
    let index = 0; // current slide

    // Create dots
    const $dots = $slider.find('.dots');
    for (let i = 0; i < total; i++) {
      const $b = $('<button>').attr({ 'aria-label': `Go to slide ${i + 1}`, 'data-idx': i });
      if (i === 0) $b.addClass('active');
      $dots.append($b);
    }

    const goTo = (i) => {
      index = (i + total) % total; // wrap around
      const offset = -index * 100;
      $track.css('transform', `translateX(${offset}%)`);
      $dots.find('button').removeClass('active').eq(index).addClass('active');
    };

    // Prev/Next
    $slider.find('.prev').on('click', () => goTo(index - 1));
    $slider.find('.next').on('click', () => goTo(index + 1));

    // Dot nav
    $dots.on('click', 'button', function () { goTo(parseInt($(this).data('idx'))); });

    // Auto-play
    let timer = setInterval(() => goTo(index + 1), 4000);
    $slider.on('mouseenter focusin', () => clearInterval(timer));
    $slider.on('mouseleave focusout', () => { timer = setInterval(() => goTo(index + 1), 4000); });
  }

  // 6) Contact form (client-side demo validation)
  $('#contactForm').on('submit', function (e) {
    if (!$(this).length) return; // safety
    e.preventDefault();

    let ok = true;
    const name = $('#name').val().trim();
    const email = $('#email').val().trim();
    const message = $('#message').val().trim();

    // Reset errors
    $('.error').text('');

    if (name.length < 2) {
      ok = false; $('#nameError').text('Please enter your name.');
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      ok = false; $('#emailError').text('Enter a valid email address.');
    }
    if (message.length < 10) {
      ok = false; $('#messageError').text('Message should be at least 10 characters.');
    }

    if (ok) {
      $('#formSuccess').removeAttr('hidden');
      this.reset();
      // Optional: send via your backend/service here.
    }
  });

  // 7) Footer year
  $('#year').text(new Date().getFullYear());
});
