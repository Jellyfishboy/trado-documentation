$(document).ready(function()
{
    $('.beta-request-form').ajaxChimp({
        url: "http://tomdallimore.us9.list-manage.com/subscribe/post?u=b141eef8b30b7dc5813bd752a&amp;id=95c7eadbb9",
        callback: ajaxChimpCallback
      });
      $('.beta-request-form').submit(function() {
        ga('send', 'event', 'invite', 'request');
        $('.beta-request-btn').html('<i class=\'fa fa-spinner fa-spin\'></i>');
        $('.beta-request-error').hide();
        $('.beta-request-already-subscribed').hide();
      });
      $('.first-name').first().focus();
});
function ajaxChimpCallback (resp) {
    if (resp.result === 'success') {
        $('.beta-request-result').show();
        $('.beta-request-form').hide();
        $('.beta-request-title').hide();
    } else {
        if(resp.msg.indexOf('already subscribed') >= 0) {
            $('.beta-request-form').hide();
            $('.beta-request-title').hide();
            $('.beta-request-already-subscribed').show();
        } else {
            $('.beta-request-error').show(); 
        }
    $('.beta-request-btn').html('Invite me');
    }
}
jQuery.fn.capitalize = function() {
  $(this).each(function(i,e) {
    $(e).keyup(function(event) {
      var box = event.target;
      var txt = $(this).val();
      var start = box.selectionStart;
      var end = box.selectionEnd;
      $(this).val(txt.replace(/^(.)|(\s|\-)(.)/g, function($1) {
          return $1.toUpperCase();
      }));
      box.setSelectionRange(start, end);
    });
  });
 return this;
}
$('.first-name').capitalize();