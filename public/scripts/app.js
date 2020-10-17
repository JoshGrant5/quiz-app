$(() => {
  $.ajax({
    method: "GET",
    url: "/user"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });;
});
