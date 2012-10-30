$(document).ready(function() {

        
    var send_rest_request = function(href, args, on_complete_handler) {
        args['time'] = Date.now() / 1000.0;
        $.ajax({
            url: href,
            context: document.body,
            data: args
        }).done(function(data) {
            data = jQuery.parseJSON(data);
            // console.log(href+" done.");
            if (data)
                // console.log(data);
            if(on_complete_handler)
                on_complete_handler(data);
        });
    };

    $('a.ajax').click(function(e) {
        e.preventDefault();
        send_rest_request($(this).attr('href'), {});
    });

    $('a.keycode').click(function(e) {
        var keycode = $('#keycode').val();
        e.preventDefault();
        send_rest_request($(this).attr('href'), {code: keycode});
    });

    $('a.set-mouse-input-range').click(function(e) {
        e.preventDefault();
        send_rest_request($(this).attr('href'), {x_min: 0, y_min: 0, x_max: $('#mouse-input').width(), y_max: $('#mouse-input').height() });
    });

    $('#mouse-input').mousemove(function(e) {
        e.preventDefault();
        send_rest_request('/mouse/motion', {x: e.pageX - $(this).offset().left, y:e.pageY - $(this).offset().top});
        return false;
    }).mousedown(function(e) {
        e.preventDefault();
        send_rest_request('/mouse/press', {x: e.pageX - $(this).offset().left, y:e.pageY - $(this).offset().top, button: e.which});
        return false;
    }).mouseup(function(e) {
        e.preventDefault();
        send_rest_request('/mouse/release', {x: e.pageX - $(this).offset().left, y:e.pageY - $(this).offset().top, button: e.which});
        return false;
    }).bind('contextmenu', function(e) {
           // do stuff here instead of normal context menu
           return false;
    });

    var last_touch_x, last_touch_y;

    // touch events:
    $('#mouse-input').bind('touchmove', function(e) {
        e.preventDefault();
        var touch = e.originalEvent.touches[0];
        last_touch_y = touch.pageY;
        last_touch_x = touch.pageX;
        send_rest_request('/mouse/motion', {x: touch.pageX, y:touch.pageY, button: 1});
    }).bind('touchstart', function(e) {
        e.preventDefault();
        var touch = e.originalEvent.touches[0];
        last_touch_y = touch.pageY;
        last_touch_x = touch.pageX;
        send_rest_request('/mouse/press', {x: touch.pageX, y:touch.pageY, button: 1});
    }).bind('touchend', function(e) {
        e.preventDefault();
        
        send_rest_request('/mouse/release', {x: last_touch_x, y:last_touch_y, button: 1});
    });

    send_rest_request('/mouse/set_input_range', {x_min: 0, y_min: 0, x_max: $('#mouse-input').width(), y_max: $('#mouse-input').height() });
});