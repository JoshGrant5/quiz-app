// Share the link to either the quiz or specific result
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

// Share the result to either Facebook or Twitter
const shareSocial = function(fb) {
  let url = "";
  if (fb) {
    url += "https://www.facebook.com/sharer/sharer.php?u=";
    if (fb && document.URL.includes('localhost')) url += "example.com";
    else url += document.URL;
  }
  else {
    url += "http://twitter.com/share?text=Check%20out%20the%20quiz%20I%20just%20took&url=";
    url += document.URL;
    url += "&hashtags=quiz,beatme";
  }
  window.open(url);
}

// Retake the quiz, redirecting to quiz page
const takeQuiz = function() {
  url = document.URL;
  $(location).attr('href',url.split('/').slice(0, -2).join('/'))
}

$(document).ready(function() {
  $("#share-result").click(() => share(false));
  $("#share-quiz").click(() => share(true));
  $("#take-quiz").click(takeQuiz);
  $("#facebook").click(() => shareSocial(true));
  $("#twitter").click(() => shareSocial(false));
});
