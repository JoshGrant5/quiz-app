//Returns true or false based on if all questions have been answered
const allAnswered = function(form) {
  return form.querySelectorAll('input[type="radio"]:checked').length === form.querySelectorAll('.question').length;
};

jQuery(function() {
  const form = document.forms.quiz;
  const submitTop = form.querySelector('#submit-top');
  const submitBottom = form.querySelector('#submit-bottom');
  const prev = form.querySelector('#prev');
  const next = form.querySelector('#next');
  const review = form.querySelector('#review');
  let count = 1;
  submitTop.disabled = !allAnswered(form);
  submitBottom.disabled = !allAnswered(form);
  submitBottom.style.display = 'none';
  prev.disabled = true;
  if (form.querySelectorAll('.question').length === 1) {
    next.disabled = true;
    prev.disabled = true;
    review.disabled = true;
    next.style.display = 'none';
    prev.style.display = 'none';
    review.style.display = 'none';
  }
  if (form.querySelectorAll('.question').length < 1) {
    next.disabled = true;
    prev.disabled = true;
    review.disabled = true;
    submitTop.disabled = true;
  }
  $('.question').css({display: 'none'});
  $('#question1').css({display: 'block'});

  // If an answer is selected, check if all answers are selected and enable submit buttons
  $('form').on('click',(event) => {
    if (event.target.type && event.target.type === 'radio') {
      submitTop.disabled = !allAnswered(form);
      submitBottom.disabled = !allAnswered(form);
    }
  });

  // Activate "button" on click (radio button hidden insde checkmark button)
  $('.check').on('click', function() {
    const classList = $(this).attr('class').split(' ');
    let question;
    classList.forEach(function(item) {
      if (item.includes('question')) question = item;
    });
    $(`.check.${question}`).removeClass('active');
    $(this).addClass('active');
  })

  // Go to previous question
  $('#prev').on('click',() => {
    next.disabled = false;
    $(`#question${count}`).fadeOut(600, function() {
      count--;
      $(`#question${count}`).css({display: 'block', width: '0'});
      $(`#question${count}`).animate({width:'auto', opacity: '1'}, 'slow');
      if (count === 1) prev.disabled = true;
    });
  });

  // Go to next question
  $('#next').on('click',() => {
    prev.disabled = false;
    $(`#question${count}`).fadeOut(600, function() {
      count++;
      $(`#question${count}`).css({display: 'block', width: '0'});
      $(`#question${count}`).animate({width:'auto', opacity: '1'}, 'slow');
      if (count === form.querySelectorAll('.question').length) next.disabled = true;
    });
  });

  // Show all questions
  $('#review').on('click', () => {
    $('.question').css({display:'none', width:'auto'});
    $('.question').slideDown(800);
    next.disabled = true;
    prev.disabled = true;
    review.disabled = true;
    next.style.display = 'none';
    prev.style.display = 'none';
    review.style.display = 'none';
    submitBottom.style.display = 'block';
  });
});
