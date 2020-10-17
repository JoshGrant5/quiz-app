$(() => {

  const addTemplate = () => {

    return `
    <div class='newQuestion'>
      <h2>Question:</h2>
      <input type='text' name='question'>
      <label>A)</label>
      <input type='text' name='answer1'>
      <input type="radio" name="correct" value="true">
      <!-- <input type='hidden' name='test' value='Answer1'> -->
      <label>B)</label>
      <input type='text' name='answer2'>
      <input type="radio" name="correct" value="true">
      <label>C)</label>
      <input type='text' name='answer3'>
      <input type="radio" name="correct" value="true">
      <label>D)</label>
      <input type='text' name='answer4'>
      <input type="radio" name="correct" value="true">
    </div>
    `
  };

  $('.addNewQuestion').on('click', function() {
    const question = addTemplate();
    $('.newQuizContainer').append(question);
  });

});
