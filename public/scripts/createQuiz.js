$(() => {
  // Question count: Starts at 1 since we already have 1 question in viewport at start
  let count = 1;

  const addTemplate = () => {
    count++;
    return `
    <div class='newQuestion'>
        <h2>Question ${count}:</h2>
        <input type='text' name='question${count}'>
        <label>A)</label>
        <input type='text' name='a${count}'>
        <input type='radio' name='correct${count}' value='1'>
        <label>B)</label>
        <input type='text' name='b${count}'>
        <input type='radio' name='correct${count}' value='2'>
        <label>C)</label>
        <input type='text' name='c${count}'>
        <input type='radio' name='correct${count}' value='3'>
        <label>D)</label>
        <input type='text' name='d${count}'>
        <input type='radio' name='correct${count}' value='4'>
      </div>
    `
  };

  $('.addNewQuestion').on('click', function() {
    $('.newQuestion').css({display: 'none'});
    const question = addTemplate();
    $('.newQuizContainer').append(question);
    $('#count').val(count);
  });

});
