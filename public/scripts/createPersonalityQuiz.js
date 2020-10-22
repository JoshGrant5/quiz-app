$(() => {
  // Outcome count: Starts at 1 since we already have 1 outcome in viewport at start
  let outcomeCount = 1;
  // Question count: Starts at 0 since there is nothing in the viewport to start
  let questionCount = 0;
  // Array for storing all given outcomes
  let outcomes = [];
  let photos;

  // Display Personality Template
  if (document.location.pathname == "/quiz/create/personality") {
    $('#newPersonalityForm').slideDown(600);
    outcomes = [];
  }

  const addOutcome = () => {
    return `
    <div class='outcomes'>
      <section>
        <div class='singleLine'>
          <label>Outcome ${outcomeCount}:</label>
          <input type='text' id='outcome${outcomeCount}' class='outcome' name='outcome${outcomeCount}' required='required' autocomplete='off'>
        </div>
        <div class='singleLine'>
          <label>Description:</label>
          <input type='text' name='description${outcomeCount}' autocomplete='off'>
        </div>
        <div class='singleLine'>
          <label>Photo URL:</label>
          <input type='url' name='photo${outcomeCount}' class='photoURL${outcomeCount}'>
        </div>
      </section>
      <div class='outcomePhoto'>
        <img src='/assets/temp-photo.jpg'>
      </div>
    </div>
  `;
  };

  const addPersonalityQuestion = () => {
    questionCount++;
    return `
    <div class='newQuestion newPersonalityQuestion'>
      <div class='question'>
        <label>Question:</label>
        <input type='text' name='question${questionCount}' required='required' autocomplete='off'>
        <button type="button" class="deleteQuestion btn btn-outline-danger" id='deleteQuestion${questionCount}'>X</button>
      </div>
      <h3>Answers:</h3>
        <div class='singleLine'>
          <label>A)</label>
          <input type='text' class='answerP' name='a${questionCount}' required='required' autocomplete='off'>
          <select class='custom-select selectedOutcome' name='a${questionCount}_pointer' required='required'></select>
        </div>
        <div class='singleLine'>
          <label>B)</label>
          <input type='text' class='answerP' name='b${questionCount}' required='required' autocomplete='off'>
          <select class='custom-select selectedOutcome' name='b${questionCount}_pointer' required='required'></select>
        </div>
        <div class='singleLine'>
          <label>C)</label>
          <input type='text' class='answerP' name='c${questionCount}' required='required' autocomplete='off'>
          <select class='custom-select selectedOutcome' name='c${questionCount}_pointer' required='required'></select>
        </div>
        <div class='singleLine'>
          <label>D)</label>
          <input type='text' class='answerP' name='d${questionCount}' required='required' autocomplete='off'>
          <select class='custom-select selectedOutcome' name='d${questionCount}_pointer' required='required'></select>
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

  // Change color of public/private button based on choice
  $('.listed').on('click', function() {
    $(this).css({backgroundColor:'blue'});
    $(this).siblings().css({backgroundColor:'lightblue'});
  })

  // Autofill img container with user input
  $('.photoURL1').on('input', function() {
    $(this).parent().parent().next().children('img').attr('src', $(this).val());
  });

  // Select the entire input field on click
  $('.photoURL1').on('click', function() {
    $(this).select();
  })

  // New outcome container is displayed for user to fill
  $('#addOutcome').on('click', function() {
    outcomeCount++;
    const outcome = addOutcome()
    $('.outcomes').css({display: 'none'});
    $('.newQuizContainer').append(outcome);
    $('#outcomeCount').val(outcomeCount);

    // Create listener for the next outcome img to fill on input
    $(`.photoURL${outcomeCount}`).on('input', function() {
      $(this).parent().parent().next().children('img').attr('src', $(this).val());
    })
    // Create listener for next click of url input field to select all
    $(`.photoURL${outcomeCount}`).on('click', function() {
      $(this).select();
    })
  });

  // All outcome containers are hidden and the question container is shown
  $('#submitOutcomes').on('click', function() {
    $('.outcomes').css({display: 'none'});
    $('.newPersonalityQuestion').slideDown(800);
    $('#addOutcome').css({display: 'none'});
    $('#submitOutcomes').css({display: 'none'});
    $('#addPersonalityQuestion').css({display:'block'});
    $('#reviewPersonalityQuiz').css({display:'block'});
    $('.outcomeHeader').children().text('Select an outcome that each answer points to:');

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
    $('.newPersonalityQuestion').animate({width:'0px', opacity: '0'}, 'slow');
    $('.newPersonalityQuestion').animate({width:'70vw', opacity: '1'}, 'slow');
    outcomeDropdown(outcomes);
    $('#questionCount').val(questionCount);
  });

  // All outcomes and questions are shown for user to review
  $('#reviewPersonalityQuiz').on('click', function() {
    $('.outcomes').slideDown(800);
    $('.newPersonalityQuestion').slideDown(800);
    $('#createPersonalityQuiz').css({display: 'inline'});
    $('html, body').animate({scrollTop:0}, 1200);
    const category = $('#personalityCategory').find(":selected").text();
    $('#pCategoryInput').val(category);
    $('.deleteQuestion').css({visibility: 'visible'});

    $('.deleteQuestion').on('click', function() {
      $(this).parent().parent().animate({width: '0px', opacity: '0'}, 'slow')
        $(this).parent().parent().slideUp(600, function() {
          $(this).remove();
        })
    });
  });


});
