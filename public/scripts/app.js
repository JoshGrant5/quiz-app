const shareResult = function() {
  const url = document.createElement("input");
  document.body.appendChild(url);
  url.setAttribute("id", "url");
  document.getElementById("url").value = document.URL;
  url.select();
  url.setSelectionRange(0, url.value.length);
  document.execCommand('copy');
  document.body.removeChild(url);
}

const shareQuiz = function() {
  const url = document.createElement("input");
  document.body.appendChild(url);
  url.setAttribute("id", "url");
  let quiz = document.URL;
  quiz = quiz.split('/').slice(0, -2).join('/')
  console.log(quiz);
  document.getElementById("url").value = quiz;
  url.select();
  url.setSelectionRange(0, url.value.length);
  document.execCommand('copy');
  document.body.removeChild(url);
}

$(document).ready(function() {
  $("#share-result").click(shareResult);

  $("#share-quiz").click(shareQuiz);
});
