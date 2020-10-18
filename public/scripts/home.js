$(() => {

  // click handler to filter all quizzes based on user selection
  $(".filters button").on("click", (e) => {
    const filter = $(e.target).text();
    $.ajax({
      method: "GET",
      url: "/",
      data: { filter }
    })
  });
});