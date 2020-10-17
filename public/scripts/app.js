const shareResult = function() {
  const url = document.createElement("input");
  document.body.appendChild(url);
  url.setAttribute("id", "url");
  document.getElementById("url").value = document.URL;
  url.select();
  url.setSelectionRange(0, url.value.length);
  document.execCommand('copy');
  document.body.removeChild(url);
  if (!$('#saved').length) {
    const div = document.createElement('div');
    div.id = 'saved';
    const body = document.querySelector('body');
    div.textContent = "Website saved to clipboard";
    body.appendChild(div);
  }
}

const shareQuiz = function() {
  const url = document.createElement("input");
  document.body.appendChild(url);
  url.setAttribute("id", "url");
  let quiz = document.URL;
  quiz = quiz.split('/').slice(0, -2).join('/')
  document.getElementById("url").value = quiz;
  url.select();
  url.setSelectionRange(0, url.value.length);
  document.execCommand('copy');
  document.body.removeChild(url);
  if (!$('#saved').length) {
    const div = document.createElement('div');
    div.id = 'saved';
    const body = document.querySelector('body');
    div.textContent = "Website saved to clipboard";
    body.appendChild(div);
  }
}

$(document).ready(function() {
  $("#share-result").click(shareResult);

  $("#share-quiz").click(shareQuiz);
});
