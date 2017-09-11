function ajaxChimpCallback(a) {
    if ("success" === a.result) {
        $(".beta-request-result").show(); 
        $(".beta-request-form").hide(); 
        $(".beta-request-title").hide();
        $.featherlight.current().close();
    }
    else
    {
        a.msg.indexOf("already subscribed") >= 0 ? ($(".beta-request-form").hide(), $(".beta-request-title").hide(), $(".beta-request-already-subscribed").show()) : $(".beta-request-error").show(), $(".beta-request-btn").html("Invite me")
    }
};
function contactLightbox()
{
    var configuration = ({
        afterOpen: function(event)
        {
            $('body').toggleClass('body-open-modal');
            setContactTabindex();
            sendContactMessage();
        },
        afterClose: function(event)
        {
            $('body').toggleClass('body-open-modal');
        }
    });
    $('body').on('click', '.open-contact-form', function(event)
    {
        event.preventDefault();
        $.featherlight('#contactLightbox', configuration);
    });
}
function setContactTabindex()
{
    var $form = $('.featherlight-content form.sendingContactMessage');
    $form.find('input[name=from_name]').focus().attr('tabindex', 1);
    $form.find('input[name=from_email]').attr('tabindex', 2);
    $form.find('textarea[name=message]').attr('tabindex', 3);
}
function setBetaTabIndex()
{
    var $form = $('.beta-request-form');
    $form.find('.first-name').focus().attr('tabindex', 1);
    $form.find('.email').attr('tabindex', 2);
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
        brand: "<a href='/'><img src=\"https://dlczmkt02tnnw.cloudfront.net/trado-promo/assets/img/cropped.png\" height=\"100\"></a>"
    });
}
function betaLightbox()
{
    $(".beta-request-form").ajaxChimp({
        url: "https://tomdallimore.us9.list-manage.com/subscribe/post?u=b141eef8b30b7dc5813bd752a&amp;id=95c7eadbb9",
        callback: ajaxChimpCallback
    }); 
    $(".beta-request-form").submit(function() {
        ga("send", "event", "invite", "request");
        $(".beta-request-btn").html("<i class='fa fa-spinner fa-spin'></i>"); 
        $(".beta-request-error").hide(); 
        $(".beta-request-already-subscribed").hide();
    });
    if (!readCookie('tradoPopup'))
    {
        var configuration = ({
            afterOpen: function(event)
            {
                $('body').toggleClass('body-open-modal');
                setBetaTabIndex();
                sendContactMessage();
            },
            afterClose: function(event)
            {
                $('body').toggleClass('body-open-modal');
            }
        });
        setTimeout( function()
        {
            $.featherlight('#newsletterLightbox', configuration);
            createCookie('tradoPopup','1',1);
        }, 3000);
    }
}
$(document).ready(function() {

    contactLightbox();
    betaLightbox();
    scrollingNavbar();

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

// cookies
function createCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}