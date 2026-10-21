/* ==================================================================
   Handicraft — main.js
   Each feature is a small init function. Plugins are optional:
   every init checks that its element / library exists first.
   ================================================================== */
(function ($) {
    'use strict';

    const $win = $(window);

    /* ---------- Preloader ---------- */
    function initPreloader() {
        $win.on('load', () => $('.hc-preloader').addClass('is-hidden'));
    }

    /* ---------- Sticky header ----------
       Only the main row stays pinned: the header's sticky `top` is set to
       minus the announcement bar's height (see layout/_header.scss). */
    function initStickyHeader() {
        const $header = $('.hc-header');
        if (!$header.length) return;

        const $topbar = $header.find('.hc-topbar');
        let offset = 0;

        const measure = () => {
            offset = $topbar.length ? $topbar.outerHeight() : 0;
            $header[0].style.setProperty('--hc-header-offset', `${offset}px`);
        };

        const onScroll = () => $header.toggleClass('is-sticky', $win.scrollTop() > offset);

        measure();
        $win.on('load resize', () => { measure(); onScroll(); });
        $win.on('scroll', onScroll);
    }

    /* ---------- Offcanvas + mobile menu ---------- */
    function initOffcanvas() {
        const $panel = $('.hc-offcanvas');
        const $overlay = $('.hc-overlay');
        if (!$panel.length) return;

        // reuse the desktop menu so links are written only once
        $('.hc-menu').clone().removeClass('hc-menu').appendTo('.hc-mobile-menu');

        const toggle = (open) => $panel.add($overlay).toggleClass('is-open', open);

        $('[data-offcanvas-open]').on('click', () => toggle(true));
        $('[data-offcanvas-close], .hc-overlay').on('click', () => toggle(false));
    }

    /* ---------- data-background="img/..." ---------- */
    function initDataBackground() {
        $('[data-background]').each(function () {
            $(this).css('background-image', `url(${$(this).data('background')})`);
        });
    }

    /* ---------- Back to top ---------- */
    function initBackToTop() {
        const $btn = $('.hc-back-to-top');
        if (!$btn.length) return;

        $win.on('scroll', () => $btn.toggleClass('is-visible', $win.scrollTop() > 400));
        $btn.on('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    /* ---------- Swiper sliders ---------- */
    function initSliders() {
        if (typeof Swiper === 'undefined') return;

        // Best sellers: arrows on desktop, dots on mobile.
        // rewind (not loop) so it works with any number of slides.
        $('.hc-bestsellers-slider').each(function () {
            const $wrap = $(this);
            new Swiper($wrap.find('.swiper')[0], {
                slidesPerView: 2,
                spaceBetween: 16,
                rewind: true,
                navigation: {
                    prevEl: $wrap.find('.hc-bestsellers-nav--prev')[0],
                    nextEl: $wrap.find('.hc-bestsellers-nav--next')[0],
                },
                pagination: { el: $wrap.find('.swiper-pagination')[0], clickable: true },
                breakpoints: {
                    768:  { slidesPerView: 3, spaceBetween: 20 },
                    992:  { slidesPerView: 4, spaceBetween: 24 },
                    1400: { slidesPerView: 6, spaceBetween: 24 },
                },
            });
        });

        // Customer reviews (home page)
        $('.hc-testimonials-slider').each(function () {
            const $wrap = $(this);
            new Swiper($wrap.find('.swiper')[0], {
                slidesPerView: 1,
                spaceBetween: 20,
                loop: true,
                grabCursor: true,
                speed: 700,
                autoplay: { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true },
                pagination: { el: $wrap.find('.swiper-pagination')[0], clickable: true },
                breakpoints: {
                    768:  { slidesPerView: 2, spaceBetween: 24 },
                    1200: { slidesPerView: 3, spaceBetween: 30 },
                },
            });
        });

        // Related products (product details page)
        $('.hc-related-slider').each(function () {
            const $wrap = $(this);
            new Swiper($wrap.find('.swiper')[0], {
                slidesPerView: 1,
                spaceBetween: 16,
                rewind: true,
                navigation: {
                    prevEl: $wrap.find('.hc-bestsellers-nav--prev')[0],
                    nextEl: $wrap.find('.hc-bestsellers-nav--next')[0],
                },
                pagination: { el: $wrap.find('.swiper-pagination')[0], clickable: true },
                breakpoints: {
                    576:  { slidesPerView: 2 },
                    992:  { slidesPerView: 3, spaceBetween: 24 },
                    1200: { slidesPerView: 4, spaceBetween: 24 },
                },
            });
        });
    }

    /* ---------- Product details: gallery + colour / size options ---------- */
    function initProductDetails() {
        let mainSlider = null;

        if (typeof Swiper !== 'undefined' && $('.hc-pd-main').length) {
            const thumbs = new Swiper('.hc-pd-thumbs .swiper', {
                slidesPerView: 4,
                spaceBetween: 12,
                watchSlidesProgress: true,
            });
            mainSlider = new Swiper('.hc-pd-main .swiper', {
                rewind: true,
                navigation: { prevEl: '.hc-pd-nav--prev', nextEl: '.hc-pd-nav--next' },
                thumbs: { swiper: thumbs },
            });
        }

        // one active button per group; its data-value is shown next to the label.
        // colour swatches also jump the gallery to their photo (data-slide)
        const $opts = $('[data-pd-options]');
        const defaults = $opts.find('[data-option-group] .active').toArray();

        const select = ($btn) => {
            const $group = $btn.closest('[data-option-group]');
            $group.find('button').removeClass('active').attr('aria-pressed', 'false');
            $btn.addClass('active').attr('aria-pressed', 'true');
            $group.find('[data-option-value]').text($btn.data('value'));
            if (mainSlider && $btn.data('slide') !== undefined) mainSlider.slideTo($btn.data('slide'));
        };

        $opts.on('click', '[data-option-group] button', function () { select($(this)); });
        $opts.on('click', '[data-option-clear]', () => defaults.forEach((btn) => select($(btn))));
    }

    /* ---------- Magnific popup (image / video) ---------- */
    function initPopups() {
        if (!$.fn.magnificPopup) return;

        $('.popup-image').magnificPopup({ type: 'image', gallery: { enabled: true } });
        $('.popup-video').magnificPopup({ type: 'iframe' });
    }

    /* ---------- Isotope filter (shop / gallery) ---------- */
    // tabs and grid are paired by the same data-filter-group="name"
    function initFilter() {
        if (!$.fn.isotope) return;

        $('.hc-filter-grid').each(function () {
            const $grid = $(this);
            const group = $grid.data('filter-group');
            const $btns = $(`[data-filter-group="${group}"] .hc-filter-btn`);
            const startFilter = $btns.filter('.active').data('filter') || '*';

            $grid.imagesLoaded(() => {
                $grid.isotope({ itemSelector: '.hc-filter-item', layoutMode: 'fitRows', filter: startFilter });
            });

            $btns.on('click', function () {
                $(this).addClass('active').siblings().removeClass('active');
                $grid.isotope({ filter: $(this).data('filter') });
            });
        });
    }

    /* ---------- Wishlist heart toggle ---------- */
    function initWishlist() {
        $(document).on('click', '.hc-product-wishlist', function () {
            const active = $(this).toggleClass('is-active').hasClass('is-active');
            $(this).attr('aria-pressed', active)
                .find('i').toggleClass('fal fas');   // Font Awesome 5: light ↔ solid
        });
    }

    /* ---------- Newsletter (front-end only) ----------
       No backend yet: stop the page reload and show a thank-you line.
       Replace with an AJAX call to your mail service later. */
    function initNewsletter() {
        $('[data-newsletter]').on('submit', function (e) {
            e.preventDefault();
            const $form = $(this);
            $form.next('.hc-footer-newsletter-msg').remove();
            $form.after('<p class="hc-footer-newsletter-msg">Thank you for subscribing!</p>');
            this.reset();
        });
    }

    /* ---------- Quantity +/- (cart rows, product page) ---------- */
    function initQty() {
        $(document).on('click', '.hc-cart-qty [data-qty]', function () {
            const $input = $(this).siblings('input');
            const qty = (parseInt($input.val(), 10) || 1) + $(this).data('qty');
            $input.val(Math.max(1, qty)).trigger('change');
        });

        // typed values: blank, 0 or negative fall back to 1
        $(document).on('change', '.hc-cart-qty input', function () {
            const qty = parseInt(this.value, 10);
            if (!(qty >= 1)) this.value = 1;
        });
    }

    /* ---------- Cart (front-end only) ----------
       Quantity +/-, remove and clear update the row subtotals and the
       order summary. Prices come from data-price on each row. */
    function initCart() {
        const $cart = $('[data-cart]');
        if (!$cart.length) return;

        const TAX_RATE = 0.05;
        const DISCOUNT = 100;
        const money = (n) => `$${n.toLocaleString('en-US')}`;

        const update = () => {
            let items = 0;
            let subtotal = 0;

            $cart.find('.hc-cart-item').each(function () {
                const $row = $(this);
                const $input = $row.find('.hc-cart-qty input');
                const qty = Math.max(1, parseInt($input.val(), 10) || 1);
                const lineTotal = qty * $row.data('price');

                $input.val(qty);
                $row.find('.hc-cart-subtotal').text(money(lineTotal));
                items += qty;
                subtotal += lineTotal;
            });

            const taxes = Math.round(subtotal * TAX_RATE);
            const discount = subtotal ? DISCOUNT : 0;

            $cart.find('[data-summary="items"]').text(items);
            $cart.find('[data-summary="subtotal"]').text(money(subtotal));
            $cart.find('[data-summary="taxes"]').text(money(taxes));
            $cart.find('[data-summary="discount"]').text(`-${money(discount)}`);
            $cart.find('[data-summary="total"]').text(money(subtotal + taxes - discount));
            $cart.toggleClass('is-empty', !items);
        };

        $cart.on('change', '.hc-cart-qty input', update);
        $cart.on('click', '.hc-cart-remove', function () {
            $(this).closest('.hc-cart-item').remove();
            update();
        });
        $cart.on('click', '[data-cart-clear]', () => {
            $cart.find('.hc-cart-item').remove();
            update();
        });
        $cart.on('submit', '[data-coupon]', (e) => e.preventDefault());   // no coupon backend yet

        update();
    }

    /* ---------- WOW scroll animations ---------- */
    function initWow() {
        if (typeof WOW === 'undefined') return;
        new WOW({ mobile: false }).init();
    }

    /* ---------- Boot ---------- */
    initPreloader();
    $(function () {
        initStickyHeader();
        initOffcanvas();
        initDataBackground();
        initBackToTop();
        initSliders();
        initProductDetails();
        initPopups();
        initFilter();
        initWishlist();
        initNewsletter();
        initQty();
        initCart();
        initWow();
    });
})(jQuery);
