function ajaxChimpCallback(a) {
    "success" === a.result ? ($(".beta-request-result").show(), $(".beta-request-form").hide(), $(".beta-request-title").hide()) : (a.msg.indexOf("already subscribed") >= 0 ? ($(".beta-request-form").hide(), $(".beta-request-title").hide(), $(".beta-request-already-subscribed").show()) : $(".beta-request-error").show(), $(".beta-request-btn").html("Invite me"))
};
function sendContactMessage() 
{
    // var myform = $("form#sendingContactMessage");
    $('body').on('submit', 'form#sendingContactMessage', function(event){
    // myform.submit(function(event){
        event.preventDefault();

        // Change to your service ID, or keep using the default service
        var myform = $(this),
            service_id = "default_service",
            template_id = "trado_contact_message",
            params = myform.serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});


      myform.find("button").text("Sending...");
      emailjs.send(service_id,template_id,params)
        .then(function(){ 
            alert("Sent!");
            myform.find("button").text("Send");
        }, function(err) {
            alert("Send email failed!\r\n Response:\n " + JSON.stringify(err));
            myform.find("button").text("Send");
        });
      return false;
    });
}
$(document).ready(function() {

    sendContactMessage();

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
    $('#menu').slicknav({
        label: "",
        brand: "<img src=\"http://cdn0.trado.io/trado-promo/assets/img/cropped.png\" height=\"100\">"
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
    additionalMarginTop: 30
});