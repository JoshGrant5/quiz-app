$(() => {
  // Outcome count: Starts at 1 since we already have 1 outcome in viewport at start
  let outcomeCount = 1;
  // Question count: Starts at 1 since we already have 1 question in viewport at start
  let questionCount = 1;

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
        <button type="button" class="deleteQuestion btn btn-outline-danger" id='deleteQ${questionCount}'>X</button>
      </div>
      <div class='question'>
        <input type='text' name='question${questionCount}' required='required'>
      </div>
      <h3>Answers:</h3>
      <div class='answers' data-toggle="buttons">
        <div class='singleLine'>
          <label>A)</label>
          <input type='text' name='a${questionCount}' required='required'>
          <input type='hidden' id='pointer' name='category'>
          <select class='selectedOutcome'></select>
        </div>
        <div class='singleLine'>
          <label>B)</label>
          <input type='text' name='b${questionCount}' required='required'>
          <input type='hidden' id='pointer' name='category'>
          <select class='selectedOutcome'></select>
        </div>
        <div class='singleLine'>
          <label>C)</label>
          <input type='text' name='c${questionCount}' required='required'>
          <input type='hidden' id='pointer' name='category'>
          <select class='selectedOutcome'></select>
        </div>
        <div class='singleLine'>
          <label>D)</label>
          <input type='text' name='d${questionCount}' required='required'>
          <input type='hidden' id='pointer' name='category'>
          <select class='selectedOutcome'></select>
        </div>
      </div>
    </div>
    `;
  };

  const outcomeDropdown = outcomes => {
    for (let outcome of outcomes) {
      $('.selectedOutcome').append(`<option class='pointer' required='required' value='${outcome}'>${outcome}></option>`);
    }
  };

  $('#selectTrivia').on('click', function() {
    $('#newTriviaForm').slideDown(800);
    $('.quizType').css({display: 'none'});
  });

  $('#selectPersonality').on('click', function() {
    $('#newPersonalityForm').slideDown(800);
    $('.quizType').css({display: 'none'});
  })

  $('#addOutcome').on('click', function() {
    $('.outcomes').css({display: 'none'});
    const outcome = addOutcome();
    $('.newQuizContainer').append(outcome);
    $('#outcomeCount').val(outcomeCount);
  });

  const outcomes = [];

  $('#submitOutcomes').on('click', function() {
    $('.outcomes').css({display: 'none'});
    $('.newPersonalityQuestion').slideDown(800);
    let serialized = $('#newPersonalityForm').serialize()
    let list = serialized.split('outcome');

    for (string of list) {
      if (Number.isInteger(Number(string[0]))) {
        let newString = string.substring(2);
        let trimmed = newString.split('&');
        outcomes.push(trimmed[0]);
      }
    }
    outcomeDropdown(outcomes);
  });

  $('#addPersonalityQuestion').on('click', function() {
    $('.newPersonalityQuestion').css({display: 'none'});
    outcomeDropdown(outcomes);
    const question = addPersonalityQuestion();
    $('.newQuizContainer').append(question);
    $('#questionCount').val(questionCount);
  });

});
