$(() => {
  // Question count: Starts at 1 since we already have 1 question in viewport at start
  let count = 1;

  const addTemplate = () => {
    count++;
    return `
    <div class='newQuestion'>
        <h2>Question ${count}:</h2>
        <input type='text' name='question${count}' required='required'>
        <label>A)</label>
        <input type='text' name='a${count}' required='required'>
        <input type='radio' name='correct${count}' required='required' value='1'>
        <label>B)</label>
        <input type='text' name='b${count}' required='required'>
        <input type='radio' name='correct${count}' value='2'>
        <label>C)</label>
        <input type='text' name='c${count}' required='required'>
        <input type='radio' name='correct${count}' value='3'>
        <label>D)</label>
        <input type='text' name='d${count}' required='required'>
        <input type='radio' name='correct${count}' value='4'>
      </div>
    `
  };

  $('#addNewQuestion').on('click', function() {
    $('.newQuestion').css({display: 'none'});
    const question = addTemplate();
    $('.newQuizContainer').append(question);
    $('#count').val(count);
  });

  $('#reviewQuiz').on('click', function() {
    $('.newQuestion').slideDown(600);
    $('#createQuizButton').css({visibility: 'visible'});
  });

  `
  <header>
    <h1><%= quiz.title %></h1>
    <% if(quiz.photo) { %>
      <img src='<%= quiz.photo %>' height=100 width=168>
    <% } %>
  </header>

  <body>
    <form method='POST' action='/quiz/<%= quiz.url %>'>
      <div id='questions'>
        <% questions.forEach((question, index) => { %>
          <div id='question<%= question.id %>' class='question'>
            <h4>Question <%= index + 1 %></h4>
            <p><%= question.question%></p>
            <% question.answers.forEach((answer) => { %>
              <div id='answer<%= answer.id %>text' class='answer'>
                <input type='radio' id='answer<%= answer.id %>' name='<%= question.id %>' value='<%= answer.id %>'>
                <label for='answer<%= answer.id %>'><%= answer.answer%></label>
              </div>
            <% }); %>
          </div>
        <% }); %>
      </div>
      </br>
      <button type='submit'>Submit Answers</button>
    </form>
  </body>
  `

});
