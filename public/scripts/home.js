$(() => {
  $("#login").on("click", () => {
    $.ajax({
      method: "POST",
      url: "/login"
    })
  });

  $("#logout").on("click", () => {
    $.ajax({
      method: "POST",
      url: "/logout"
    })
  })
});