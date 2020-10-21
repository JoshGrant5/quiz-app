$(document).ready(function() {
  const $filterBtns = $(".quiz-filter button");

  $(".quiz-filter button").click(function(e) {
    const $button = $(this);
    let partial
    $.ajax({
      method: "GET",
      url: `/api/partial/${$button.attr("name")}`,
    })
      .then(res => {
        $("#container").empty();
        partial = res;
        $("#container").append(partial)

        $filterBtns.each(function() {
          if($(this).hasClass("btn-primary")) {
            $(this).removeClass("btn-primary").addClass("btn-outline-primary");
          }
        });

        $button.addClass("btn-primary");
      });
  });
});
