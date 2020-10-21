$(() => {
  // Question count: Starts at 1 since we already have 1 question in viewport at start
  let count = 1;

  const addTriviaQuestion = () => {
    count++;
    return `
    <div class='newQuestion'>
      <div class='question'>
        <label>Question ${count}:</label>
        <input type='text' name='question${count}' required='required' autocomplete='off'>
        <button type="button" class="deleteQuestion btn btn-outline-danger" id='deleteQuestion${count}'>X</button>
      </div>
      <h3>Answers:</h3>
      <div class='answers' data-toggle="buttons">
        <div class='singleLine'>
          <label>A)</label>
          <input type='text' name='a${count}' required='required' autocomplete='off'>
          <label class='check btn btn-outline-success'>
            <input type='radio' class='correct' name='correct${count}' autocomplete='off' required='required' value='1'><i class="gg-check"></i>
          </label>
        </div>
        <div class='singleLine'>
          <label>B)</label>
          <input type='text' name='b${count}' required='required' autocomplete='off'>
          <label class='check btn btn-outline-success'>
            <input type='radio' class='correct' name='correct${count}' value='2'><i class="gg-check"></i>
           </label>
        </div>
        <div class='singleLine'>
          <label>C)</label>
          <input type='text' name='c${count}' required='required' autocomplete='off'>
          <label class='check btn btn-outline-success'>
            <input type='radio' class='correct' name='correct${count}' value='3'><i class="gg-check"></i>
          </label>
        </div>
        <div class='singleLine'>
          <label>D)</label>
          <input type='text' name='d${count}' required='required' autocomplete='off'>
          <label class='check btn btn-outline-success'>
            <input type='radio' class='correct' name='correct${count}' value='4'><i class="gg-check"></i>
          </label>
        </div>
      </div>
    </div>
    `;
  };

  // Display trivia template
  if (document.location.pathname == "/quiz/create/trivia") {
    $('#newTriviaForm').slideDown(600);
  }

  // Hide previous question container and replace with a new one
  $('#addNewQuestion').on('click', function() {
    $('.newQuestion').css({display: 'none'});
    const question = addTriviaQuestion();
    $('.newQuizContainer').append(question);
    $('#count').val(count);
  });

  // Show all previously hidden questions to review
  $('#reviewQuiz').on('click', function() {
    $('.newQuestion').slideDown(800);
    $('#createQuizButton').css({visibility: 'visible'});
    $('html, body').animate({scrollTop:200}, 1500);
    const category = $('#triviaCategory').find(":selected").text();
    $('#tCategoryInput').val(category);
    $('.deleteQuestion').css({visibility: 'visible'});
    // Once review button is clicked and we know the number of questions, activate each delete button
    for (let i = 1; i <= count; i++) {
      $(`#deleteQuestion${i}`).on('click', function() {
        $(`#deleteQuestion${i}`).parent().parent().remove();
      });
    }
  });

  // Show image as soon as user inputs a URL
  $('.thumbnail').on('input', function() {
    $('.quizPhoto').attr('src', $(this).val());
  })

  // Select the entire input field on click
  $('.thumbnail').on('click', function() {
    $(this).select();
  })

});
