const signupAttempt = function(event) {
  event.preventDefault();
  const name = event.target.elements.name.value;
  const email = event.target.elements.email.value;
  const password = event.target.elements.password.value;
  const confirmPassword = event.target.elements.confirmPassword.value;

  if (password !== confirmPassword) {
    $('#error').empty();
    $('#error').append(`<p>⚠️ Passwords do not match ⚠️</p>`);
    return;
  }

  $.ajax({
    method: "POST",
    url: "/signup",
    data: { name, email, password }
  }).then((res) => {
    url = document.URL;
    $(location).attr('href',url.split('/').slice(0, -2).join('/'))
  }).catch(({responseText}) => {
    $('#error').empty();
    $('#error').append(`<p>⚠️ ${responseText} ⚠️</p>`);
  });
}

jQuery(function() {
  $("#signup").on('submit', signupAttempt);
});
