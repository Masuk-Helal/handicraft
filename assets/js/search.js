/* ==================================================================
   Handicraft — search.js
   Slide-down search panel. [data-search-open] opens it,
   [data-search-close], the backdrop or Esc closes it.
   ================================================================== */
(function ($) {
    'use strict';

    $(function () {
        const $search = $('.hc-search');
        if (!$search.length) return;

        const $input = $search.find('input[type="search"]');
        let $trigger = $();

        const open = (e) => {
            e.preventDefault();
            $trigger = $(e.currentTarget);
            $search.addClass('is-open').attr('aria-hidden', 'false');
            $('body').css('overflow', 'hidden');
            // focus once the panel has slid in
            setTimeout(() => $input.trigger('focus'), 450);
        };

        const close = () => {
            if (!$search.hasClass('is-open')) return;
            $search.removeClass('is-open').attr('aria-hidden', 'true');
            $('body').css('overflow', '');
            $trigger.trigger('focus');
        };

        $('[data-search-open]').on('click', open);
        $search.on('click', '[data-search-close]', close);
        $(document).on('keydown', (e) => { if (e.key === 'Escape') close(); });
    });
})(jQuery);
