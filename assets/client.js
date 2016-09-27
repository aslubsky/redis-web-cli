$(function () {
    $('.play-btn').remove();
    $('code.res').remove();
    $('.play-code').each(function () {
        var code = $('code', $(this).parent());
        code.addClass('src');
        $(this).append('<code class="res"><\/code><div title="Запустить код" class="play-btn"><\/div>');
    });
    $('.play-btn').on('click', function () {
        var el = $(this);
        el.addClass('spinner');
        var pre = $(this).parent();
        var code = $('code.src', pre);
        var cmd = $.trim(code.text());

        $.get('https://murmuring-meadow-73077.herokuapp.com/api?cmd=' + cmd).then(function (res) {
            if (res.code == "OK") {
                if (res.data.length == undefined) {
                    res.data = JSON.stringify(res.data);
                }
                $('code.res', pre).text(res.data).css('display', 'inline-block');
            } else {
                $('code.res', pre).text(JSON.stringify(res)).addClass('error').css('display', 'inline-block');
            }
            el.removeClass('spinner');
        });
    });
});