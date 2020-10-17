$(() => {
  $('#login').on('click', () => {
    $.ajax({
      method: "POST",
      url: "/login"
    })
  });
});