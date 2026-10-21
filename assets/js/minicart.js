/* ==================================================================
   Handicraft — minicart.js
   Cart drawer (front-end only). [data-minicart-open] opens it,
   [data-minicart-close], the backdrop or Esc closes it.
   Quantity +/- and remove update the subtotal, the free-shipping
   meter and the cart count in the header.
   ================================================================== */
(function ($) {
    'use strict';

    const FREE_SHIPPING = 2999;
    const money = (n) => `$${n.toLocaleString('en-US')}`;

    $(function () {
        const $cart = $('.hc-minicart');
        if (!$cart.length) return;

        let $trigger = $();

        const update = () => {
            const $items = $cart.find('[data-price]');
            let subtotal = 0;

            $items.each(function () {
                const $item = $(this);
                const qty = parseInt($item.find('[data-minicart-qty]').text(), 10);
                const line = qty * $item.data('price');
                $item.find('.hc-minicart-price').text(money(line));
                subtotal += line;
            });

            const count = $items.length;
            const left = Math.max(0, FREE_SHIPPING - subtotal);

            $cart.find('[data-minicart-count]').text(`${count} ${count === 1 ? 'item' : 'items'}`);
            $cart.find('[data-minicart-subtotal]').text(money(subtotal));
            $cart.find('[data-minicart-ship]').html(left
                ? `You're <strong>${money(left)}</strong> away from free shipping.`
                : '<strong>You\'ve unlocked free shipping!</strong>');
            $cart.find('.hc-minicart-ship-bar span').css('transform', `scaleX(${Math.min(1, subtotal / FREE_SHIPPING)})`);
            $cart.toggleClass('is-empty', !count);

            $('[data-minicart-open]').attr('aria-label', `Cart, ${count} items`)
                .find('.hc-header-count').text(count);
        };

        const open = (e) => {
            e.preventDefault();
            $trigger = $(e.currentTarget);
            $cart.addClass('is-open').attr('aria-hidden', 'false');
            $('body').css('overflow', 'hidden');
            setTimeout(() => $cart.find('.hc-minicart-close').trigger('focus'), 450);
        };

        const close = () => {
            if (!$cart.hasClass('is-open')) return;
            $cart.removeClass('is-open').attr('aria-hidden', 'true');
            $('body').css('overflow', '');
            $trigger.trigger('focus');
        };

        $('[data-minicart-open]').on('click', open);
        $cart.on('click', '[data-minicart-close]', close);
        $(document).on('keydown', (e) => { if (e.key === 'Escape') close(); });

        $cart.on('click', '[data-minicart-step]', function () {
            const $qty = $(this).siblings('[data-minicart-qty]');
            const qty = Math.max(1, parseInt($qty.text(), 10) + $(this).data('minicart-step'));
            $qty.text(qty);
            update();
        });

        $cart.on('click', '.hc-minicart-remove', function () {
            $(this).closest('li').remove();
            update();
        });

        update();
    });
})(jQuery);
