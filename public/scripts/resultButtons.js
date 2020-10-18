const share = function(quiz) {
  const url = document.createElement("input");
  document.body.appendChild(url);
  let link = document.URL;
  if (quiz) link = link.split('/').slice(0, -2).join('/')
  url.value = link;
  url.select();
  url.setSelectionRange(0, url.value.length);
  document.execCommand('copy');
  document.body.removeChild(url);
  if (!$('#saved').length) {
    const div = document.createElement('div');
    div.id = 'saved';
    div.textContent = "Link saved to clipboard";
    document.body.appendChild(div);
    setTimeout(() => document.body.removeChild(div), 1000);
  }
}

const takeQuiz = function() {
  url = document.URL;
  $(location).attr('href',url.split('/').slice(0, -2).join('/'))
}

$(document).ready(function() {
  $("#share-result").click(() => share(false));
  $("#share-quiz").click(() => share(true));
  $("#take-quiz").click(takeQuiz);
});
