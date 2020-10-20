$(() => {
  // Outcome count: Starts at 1 since we already have 1 outcome in viewport at start
  let outcomeCount = 1;
  // Question count: Starts at 0 since there is nothing in the viewport to start
  let questionCount = 0;
  // Array for storing all given outcomes
  let outcomes = [];

  const addOutcome = () => {
    outcomeCount++;
    return `
    <div class='outcomes'>
      <label>Outcome ${outcomeCount} Title:</label>
      <input type='text' id='outcome${outcomeCount}' class='outcome' name='outcome${outcomeCount}' required='required'>
      <label>Photo URL:</label>
      <input type='url' id='photo${outcomeCount}' name='photo${outcomeCount}' required='required'>
      <label>Description:</label>
      <input type='text' name='description${outcomeCount}'>
    </div>
    `;
  };

  const addPersonalityQuestion = () => {
    questionCount++;
    return `
    <div class='newPersonalityQuestion'>
      <div>
        <h2>Question ${questionCount}:</h2>
        <button type="button" class="deleteQuestion btn btn-outline-danger" id='deleteQuestion${questionCount}'>X</button>
      </div>
      <div class='question'>
        <input type='text' name='question${questionCount}' required='required'>
      </div>
      <h3>Answers:</h3>
        <div class='singleLine'>
          <label>A)</label>
          <input type='text' name='a${questionCount}' required='required'>
          <select class='selectedOutcome' name='a${questionCount}_pointer' required='required'></select>
        </div>
        <div class='singleLine'>
          <label>B)</label>
          <input type='text' name='b${questionCount}' required='required'>
          <select class='selectedOutcome' name='b${questionCount}_pointer' required='required'></select>
        </div>
        <div class='singleLine'>
          <label>C)</label>
          <input type='text' name='c${questionCount}' required='required'>
          <select class='selectedOutcome' name='c${questionCount}_pointer' required='required'></select>
        </div>
        <div class='singleLine'>
          <label>D)</label>
          <input type='text' name='d${questionCount}' required='required'>
          <select class='selectedOutcome' name='d${questionCount}_pointer' required='required'></select>
        </div>
    </div>
    `;
  };

  // Generate the outcome dropdown based on the items in the outcomes array
  const outcomeDropdown = outcomes => {
    for (let outcome of outcomes) {
      $('.selectedOutcome').append(`<option class='pointer' required='required'>${outcome}</option>`);
    }
  };

  // Personality template is shown instead of the trivia template
  $('#selectPersonality').on('click', function() {
    $('#newPersonalityForm').slideDown(800);
    $('.quizType').css({display: 'none'});
    outcomes = [];
  })

  // New outcome container is displayed for user to fill
  $('#addOutcome').on('click', function() {
    $('.outcomes').css({display: 'none'});
    const outcome = addOutcome();
    $('.newQuizContainer').append(outcome);
    $('#outcomeCount').val(outcomeCount);
  });

  // All outcome containers are hidden and the question container is shown
  $('#submitOutcomes').on('click', function() {
    $('.outcomes').css({display: 'none'});
    $('.newPersonalityQuestion').slideDown(800);
    $('#addOutcome').css({display: 'none'});
    $('#submitOutcomes').css({display: 'none'});
    $('#addPersonalityQuestion').css({visibility: 'visible'});
    $('#reviewPersonalityQuiz').css({visibility: 'visible'});

    /* Without the form submitting, the outcome inputs are stored in the outcome array */
    let serialized = $('.outcome').serialize() // receive all outcome inputs as a serialized string
    let list = serialized.split('='); // split the string into an array
    let trimmed = list.splice(outcomeCount) // the first x number of items in array are the input names (not values), so splice at that index
    for (let item of trimmed) {
      let outcome = item.split('&') // split each item into another array to completely serparate the values
      outcomes.push(decodeURIComponent(outcome[0])) // the first item in the new array is the value we are looking for
    }

    const question = addPersonalityQuestion();
    $('.newQuizContainer').append(question);
    outcomeDropdown(outcomes);
  });

  // Previous question is hidden and replaced by new container
  $('#addPersonalityQuestion').on('click', function() {
    $('.newPersonalityQuestion').css({display: 'none'});
    const question = addPersonalityQuestion();
    $('.newQuizContainer').append(question);
    outcomeDropdown(outcomes);
    $('#questionCount').val(questionCount);
  });

  // All outcomes and questions are shown for user to review
  $('#reviewPersonalityQuiz').on('click', function() {
    $('.outcomes').slideDown(800);
    $('.newPersonalityQuestion').slideDown(800);
    $('#addOutcome').slideDown(800);
    $('#createPersonalityQuiz').css({visibility: 'visible'});
    $('html, body').animate({scrollTop:200}, 1500);
    const category = $('#personalityCategory').find(":selected").text();
    $('#pCategoryInput').val(category);
    $('.deleteQuestion').css({visibility: 'visible'});

    for (let i = 1; i <= questionCount; i++) {
      $('.deleteQuestion').on('click', function() {
        $(this).parent().parent().remove();
      });
    }
  });

});
