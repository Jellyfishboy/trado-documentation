function ajaxChimpCallback(a) {
    "success" === a.result ? ($(".beta-request-result").show(), $(".beta-request-form").hide(), $(".beta-request-title").hide()) : (a.msg.indexOf("already subscribed") >= 0 ? ($(".beta-request-form").hide(), $(".beta-request-title").hide(), $(".beta-request-already-subscribed").show()) : $(".beta-request-error").show(), $(".beta-request-btn").html("Invite me"))
};
function featherlightConfig()
{
    var configuration = ({
        afterOpen: function(event)
        {
            $('body').toggleClass('body-open-modal');
            setModalTabindex();
            sendContactMessage();
        },
        afterClose: function(event)
        {
            $('body').toggleClass('body-open-modal');
        }
    })
    $('body').on('click', '.open-contact-form', function(event)
    {
        event.preventDefault();
        $.featherlight('#contactLightbox', configuration);
    });
}
function setModalTabindex()
{
    var $form = $('.featherlight-content form.sendingContactMessage');
    $form.find('input[name=from_name]').focus().attr('tabindex', 1);
    $form.find('input[name=from_email]').attr('tabindex', 2);
    $form.find('textarea[name=message]').attr('tabindex', 3);

}
function sendContactMessage() 
{
    $('.featherlight-content form.sendingContactMessage').validate({
        rules: {
            from_name: "required",
            from_email: {
                required: true,
                email: true
            },
            message: "required"
        },  
        messages: {
            from_name: "Please enter your name",
            from_email: "Please enter a valid email address",
            message: "Please enter a message."
        },
        submitHandler: function(form, event) {
            event.preventDefault();

            var $form = $('.featherlight-content form.sendingContactMessage'),
                service_id = "default_service",
                template_id = "trado_contact_message",
                currentModal = $.featherlight.current();
                params = $form.serializeArray().reduce(function(obj, item) {
                    obj[item.name] = item.value;
                    return obj;
                }, {});

            $form.find('input').prop('disabled', true);
            $form.find('textarea').prop('disabled', true);
            $form.find("button").text("Sending...");
            $('#errors, #success').html('');

            emailjs.send(service_id,template_id,params)
                .then(function(){ 
                    $form.find('#success').html('<p>Message has been sent. We will get back to you within 24 hours.</p>');
                    setTimeout(function(){ 
                        currentModal.close();
                        $form.find('input').prop('disabled', false);
                        $form.find('textarea').prop('disabled', false);
                        $form.find("button").text("Send"); 
                    }, 5000);
                }, function(err) {
                    $form.find('input').prop('disabled', false);
                    $form.find('textarea').prop('disabled', false);
                    $form.find("#errors").html('<p>' + JSON.parse(err.text).service_error + '</p>');
                    $form.find("button").text("Send");
                });
        }
    });
}
function scrollingNavbar() 
{
    $(window).on('scroll', function() {
        var y_scroll_pos = window.pageYOffset;
        var scroll_pos_test = 150;             // set to whatever you want it to be

        if(y_scroll_pos > scroll_pos_test) 
        {
            $('header.scrolling').fadeIn();
            $('#home-layout .slicknav_menu').addClass('home-scrolling');
        }
        else
        {
            $('header.scrolling').stop().fadeOut();
            $('#home-layout .slicknav_menu').removeClass('home-scrolling');
        }
    });
    $('.menu').slicknav({
        label: "",
        brand: "<a href='/'><img src=\"http://cdn0.trado.io/trado-promo/assets/img/cropped.png\" height=\"100\"></a>"
    });
}
$(document).ready(function() {

    featherlightConfig();
    scrollingNavbar();

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
    }else{
        bouncefix.add('html');
    }
    $('[data-ga="true"]').click(function()
    {
        var dataCategory    = $(this).attr('data-event-category'),
            dataAction      = $(this).attr('data-event-action');
        if(dataCategory == '' || dataAction == '')
        {
            return false;
        }
        else
        {
            ga("send", "event", dataCategory, dataAction);
        }
    });
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
$('#documentation .content, #documentation .sidebar').theiaStickySidebar(
{
    additionalMarginTop: 120
});