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
  let button = '';
  if (quiz) button = document.getElementById("share-quiz");
  else button = document.getElementById("share-result");
  button.innerHTML = "Link copied";
  setTimeout(() => {
    if (quiz) button.innerHTML = "Share Quiz";
    else button.innerHTML = "Share Result";
  }, 1000);
};

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
};

// Retake the quiz, redirecting to quiz page
const takeQuiz = function() {
  url = document.URL;
  $(location).attr('href',url.split('/').slice(0, -2).join('/'))
};

// Adjusts the rating based on the star clicked
const stars = function(num) {
  const stars = [$("#star1"), $("#star2"), $("#star3"), $("#star4"), $("#star5")];
  for (let i = 0; i < stars.length; i++) {
    if (i < num) {
      stars[i].addClass("checked")
    }
    else {
      stars[i].removeClass("checked")
    }
  }
  let url = document.URL;
  url = url.split('/').slice(0, -2).join('/')
  url += '/rating';
  let star = {stars: document.querySelectorAll('.fa-star.checked').length}
  $.ajax({
    method: "POST",
    url: url,
    data: star,
  });
};

// Toggles the favourite status of the quiz
const heart = function() {
  const heart = $("#heart");
  heart.toggleClass("checked");
  let url = document.URL;
  url = url.split('/').slice(0, -2).join('/')
  url += '/favourite';
  if (!heart.hasClass("checked")) url += '/delete';
  $.ajax({
    method: "POST",
    url: url,
  });
};

jQuery(function() {
  $("#share-result").on('click',() => share(false));
  $("#share-quiz").on('click',() => share(true));
  $("#take-quiz").on('click',takeQuiz);
  $("#facebook").on('click',() => shareSocial(true));
  $("#twitter").on('click',() => shareSocial(false));
  $("#star1").on('click',() => stars(1));
  $("#star2").on('click',() => stars(2));
  $("#star3").on('click',() => stars(3));
  $("#star4").on('click',() => stars(4));
  $("#star5").on('click',() => stars(5));
  $("#heart").on('click',heart);
});
