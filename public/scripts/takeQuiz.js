//Returns true or false based on if all questions have been answered
const allAnswered = function(form) {
  return form.querySelectorAll('input[type="radio"]:checked').length === form.querySelectorAll('.question').length;
}

$(document).ready(function() {
  const form = document.forms.quiz;
  const submitTop = form.querySelector('#submit-top');
  const submitBottom = form.querySelector('#submit-bottom');
  const prev = form.querySelector('#prev');
  const next = form.querySelector('#next');
  const review = form.querySelector('#review');
  let count = 1;
  submitTop.disabled = !allAnswered(form);
  submitBottom.disabled = !allAnswered(form);
  prev.disabled = true;
  $('.question').css({display: 'none'});
  $('#question1').css({display: 'block'});

  // If an answer is selected, check if all answers are selected and enable submit buttons
  $('form').click((event) => {
    if (event.target.type && event.target.type === 'radio') {
      submitTop.disabled = !allAnswered(form);
      submitBottom.disabled = !allAnswered(form);
    }
  });

  // Go to previous question
  $('#prev').click(() => {
    next.disabled = false;
    $(`#question${count}`).css({display: 'none'});
    count--;
    $(`#question${count}`).css({display: 'block'});
    if (count === 1) prev.disabled = true;
  });

  // Go to next question
  $('#next').click(() => {
    prev.disabled = false;
    $(`#question${count}`).css({display: 'none'});
    count++;
    $(`#question${count}`).css({display: 'block'});
    if (count === form.querySelectorAll('.question').length) next.disabled = true;
  });

  // Show all questions
  $('#review').click(() => {
    $('.question').css({display: 'block'});
    next.disabled = true;
    prev.disabled = true;
    review.disabled = true;
    next.style.display = 'none';
    prev.style.display = 'none';
    review.style.display = 'none';
  });
});
