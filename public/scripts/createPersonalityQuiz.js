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
    <select id='selectedOutcome'>



    </select>
    `

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

  const outcomeDropdown = outcomes => {
    for (let outcome of outcomes) {
      $('#selectedOutcome').append(`<option class='pointer' required='required' value='${outcome}'><%= category %></option>`);
    }
  };

  $('#submitOutcomes').on('click', function() {
    $('.outcomes').css({display: 'none'});
    $('.newPersonalityQuestion').slideDown(800);
    let serialized = $('#newPersonalityForm').serialize()
    let list = serialized.split('outcome');
    const outcomes = [];
    for (string of list) {
      if (Number.isInteger(Number(string[0]))) {
        let newString = string.substring(2);
        let trimmed = newString.split('&');
        outcomes.push(trimmed[0]);
      }
    }
  });

  $('#addPersonalityQuestion').on('click', function() {
    $('.newPersonalityQuestion').css({display: 'none'});
    const question = addPersonalityQuestion();
    $('.newQuizContainer').append(question);
    $('#questionCount').val(questionCount);
  });

});
