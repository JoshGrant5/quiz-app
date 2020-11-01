const loginAttempt = function(event) {
  event.preventDefault();
  const email = event.target.elements.email.value;
  const password = event.target.elements.password.value;

  $.ajax({
    method: "POST",
    url: "/login",
    data: { email, password }
  }).then((res) => {
    url = document.URL;
    $(location).attr('href',url.split('/').slice(0, -1).join('/'))
  }).catch(({responseText}) => {
    $('#error').empty();
    $('#error').append(`<p>⚠️ ${responseText} ⚠️</p>`);
  });
}

jQuery(function() {
  $("#login").on('submit', loginAttempt);
});
