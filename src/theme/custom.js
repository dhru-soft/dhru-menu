import jQuery from "jquery";

(function ($) {
    let nHtmlNode = document.documentElement,
        nHeader = document.getElementById('top-bar'),

        jWindow = $(window),
        jHeader = $(nHeader),

        bMenuOpen = false,

        animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend'


    function _header() {
        var nMenu = document.getElementById('top-bar__navigation'),
            nMenuToggler = document.getElementById('top-bar__navigation-toggler'),

            jMenu = $(nMenu),
            jMenuToggler = $(nMenuToggler),

            jMenuLink = jMenu.find('li a'),
            jSubmenu = jMenu.find('.submenu'),
            bHeaderSticky = false,
            updatePosition = function () {
                if ((window.pageYOffset || document.documentElement.scrollTop) >= 500) {
                    if (!bHeaderSticky) {
                        jHeader
                            .off(animationEnd)
                            .addClass('is-sticky in')
                            .one(animationEnd, function (e) {
                                jHeader.removeClass('in');
                            });

                        bHeaderSticky = !bHeaderSticky;
                    };
                } else if (bHeaderSticky) {
                    jHeader
                        .addClass('out')
                        .off(animationEnd)
                        .one(animationEnd, function (e) {
                            jHeader.removeClass('is-sticky out');
                        });
                    bHeaderSticky = !bHeaderSticky;
                };
            },
            hideMobileMenu = function () {
                if (window.innerWidth > 1199 && bMenuOpen) {
                    jHeader.removeClass('is-expanded');
                    jMenuToggler.removeClass('is-active');
                    jSubmenu.removeAttr('style');
                    nHtmlNode.style.overflow = '';
                    bMenuOpen = false;
                }
            };


        jMenuToggler.on('touchend click', function (e) {
            e.preventDefault();
            var $this = $(this);
            if (bMenuOpen) {
                $this.removeClass('is-active');
                jHeader.removeClass('is-expanded');
                nHtmlNode.style.overflow = '';
                bMenuOpen = !bMenuOpen;
            } else {
                $this.addClass('is-active');
                jHeader.addClass('is-expanded');
                nHtmlNode.style.overflow = 'hidden';
                bMenuOpen = !bMenuOpen;
            }
            ;
            return false;
        });

        jMenuLink.on('click', function (e) {

            var $this = $(this),
                $parent = $this.parent(),
                bHasSubmenu = $this.next(jSubmenu).length ? true : false;

            if (bMenuOpen && bHasSubmenu) {
                if ($this.next().is(':visible')) {
                    $parent.removeClass('drop_active');
                    $this.next().slideUp('fast');

                } else {
                    $this.closest('ul').find('li').removeClass('drop_active');
                    $this.closest('ul').find('.submenu').slideUp('fast');
                    $parent.addClass('drop_active');
                    $this.next().slideDown('fast');
                };
                return false;
            }
            else{
                if (window.innerWidth < 1199 && bMenuOpen) {
                    jMenuToggler.click();
                }
            };
        });

        jWindow
            .on('scroll', throttle(updatePosition, 100)).scroll()
            .on('resize', debounce(hideMobileMenu, 100));
    };

    $(document).ready(function () {
        _header();
    });

    $.fn.is_on_screen = function () {
        var viewport = {
            top: jWindow.scrollTop(),
            left: jWindow.scrollLeft()
        };
        viewport.right = viewport.left + jWindow.width();
        viewport.bottom = viewport.top + jWindow.height();

        var bounds = this.offset();
        bounds.right = bounds.left + this.outerWidth();
        bounds.bottom = bounds.top + this.outerHeight();

        return (!(viewport.right < bounds.left ||
            viewport.left > bounds.right ||
            viewport.bottom < bounds.top ||
            viewport.top > bounds.bottom
        ));
    };
    function now() {
        return new Date().getTime();
    };
    function throttle(func, wait, options) {
        var timeout, context, args, result;
        var previous = 0;

        if (!options) options = {};

        var later = function later() {
            previous = options.leading === false ? 0 : now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };

        var throttled = function throttled() {
            var at = now();
            if (!previous && options.leading === false) previous = at;
            var remaining = wait - (at - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = at;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };

        throttled.cancel = function () {
            clearTimeout(timeout);
            previous = 0;
            timeout = context = args = null;
        };

        return throttled;
    };
    function debounce(func, wait, immediate) {
        var timeout;

        return function () {
            var context = this,
                args = arguments;

            clearTimeout(timeout);

            timeout = setTimeout(function () {
                timeout = null;

                if (!immediate) func.apply(context, args);
            }, wait);

            if (immediate && !timeout) func.apply(context, args);
        };
    };





}(jQuery));


let isTouchDevice = require('is-touch-device');
let _html = document.documentElement;
_html.className = _html.className.replace("no-js", "js");
_html.classList.add(isTouchDevice() ? "touch" : "no-touch");


