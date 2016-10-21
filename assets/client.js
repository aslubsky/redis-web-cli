$(function () {
    $('head').append('<link crossorigin="anonymous" href="https://murmuring-meadow-73077.herokuapp.com/assets/client.css" media="all" rel="stylesheet"/>');
    $('.play-btn').remove();
    $('.play-code').each(function () {
        $(this).append('<span title="Запустить код" class="play-btn"></span>');
    });
    $('code.res').css('display', 'none');
    $('.play-btn').on('click', function () {
        var el = $(this).parent();
        $('code.res', el).css('display', 'inline-block');
    });
});
