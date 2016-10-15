$(function () {
    $('.play-btn').on('click', function () {
        var el = $(this).parent();
        $('code.res', el).css('display', 'inline-block');
    });
});
