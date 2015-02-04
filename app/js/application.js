function ajaxChimpCallback(a) {
    "success" === a.result ? ($(".beta-request-result").show(), $(".beta-request-form").hide(), $(".beta-request-title").hide()) : (a.msg.indexOf("already subscribed") >= 0 ? ($(".beta-request-form").hide(), $(".beta-request-title").hide(), $(".beta-request-already-subscribed").show()) : $(".beta-request-error").show(), $(".beta-request-btn").html("Invite me"))
};
$(document).ready(function() {
    $(".beta-request-form").ajaxChimp({
        url: "http://tomdallimore.us9.list-manage.com/subscribe/post?u=b141eef8b30b7dc5813bd752a&amp;id=95c7eadbb9",
        callback: ajaxChimpCallback
    }); 
    $(".beta-request-form").submit(function() {
        ga("send", "event", "invite", "request");
        $(".beta-request-btn").html("<i class='fa fa-spinner fa-spin'></i>"); 
        $(".beta-request-error").hide(); 
        $(".beta-request-already-subscribed").hide();
    });
    if(!$('html').hasClass('touch'))
    {
        $(".first-name").first().focus();
    };
});
jQuery.fn.capitalize = function() {
    return $(this).each(function(a, b) {
        $(b).keyup(function(a) {
            var b = a.target,
                c = $(this).val(),
                d = b.selectionStart,
                e = b.selectionEnd;
            $(this).val(c.replace(/^(.)|(\s|\-)(.)/g, function(a) {
                return a.toUpperCase()
            })), b.setSelectionRange(d, e)
        })
    }), this
};
$(".first-name").capitalize();