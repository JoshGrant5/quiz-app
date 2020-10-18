const allAnswered = function() {
  const form = document.forms.quiz;
  return form.querySelectorAll('input[type="radio"]:checked').length === form.querySelectorAll('.question').length;
}

$(document).ready(function() {
  const form = document.forms.quiz;
  const button = form.querySelector('button');
  button.disabled = !allAnswered();

  $('form').click((event) => {
    if (event.target.type && event.target.type === 'radio') {
      button.disabled = !allAnswered();
    }
  });
});
