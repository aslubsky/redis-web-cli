$(function () {
    $('.play-btn').remove();
    $('.play-code').each(function () {
        $(this).append('<div title="Запустить код" class="play-btn"></div>');
    });
    $('code.res').css('display', 'none');
    $('.play-btn').on('click', function () {
        var el = $(this).parent();
        $('code.res', el).css('display', 'inline-block');
    });
});
