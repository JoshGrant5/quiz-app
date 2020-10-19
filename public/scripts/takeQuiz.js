const allAnswered = function(form) {
  return form.querySelectorAll('input[type="radio"]:checked').length === form.querySelectorAll('.question').length;
}

$(document).ready(function() {
  const form = document.forms.quiz;
  const submitTop = form.querySelector('#submit-top');
  const submitBottom = form.querySelector('#submit-bottom');
  const prev = form.querySelector('#prev');
  const next = form.querySelector('#next');
  let count = 1;
  submitTop.disabled = !allAnswered(form);
  submitBottom.disabled = !allAnswered(form);
  prev.disabled = true;
  $('.question').css({display: 'none'});
  $('#question1').css({display: 'block'});

  $('form').click((event) => {
    if (event.target.type && event.target.type === 'radio') {
      submitTop.disabled = !allAnswered(form);
      submitBottom.disabled = !allAnswered(form);
    }
  });

  $('#prev').click(() => {
    next.disabled = false;
    $(`#question${count}`).css({display: 'none'});
    count--;
    $(`#question${count}`).css({display: 'block'});
    if (count === 1) prev.disabled = true;
  });

  $('#next').click(() => {
    prev.disabled = false;
    $(`#question${count}`).css({display: 'none'});
    count++;
    $(`#question${count}`).css({display: 'block'});
    if (count === form.querySelectorAll('.question').length) next.disabled = true;
  });

  $('#review').click(() => {
    $('.question').css({display: 'block'});
    next.disabled = true;
    prev.disabled = true;
    next.style.display = 'none';
    prev.style.display = 'none';
  });
});
