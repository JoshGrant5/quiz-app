$(document).ready(function() {
  const $filterBtns = $(".quiz-filter button");

  $(".quiz-filter button").click(function(e) {
    const $button = $(this);
    $("#container").empty();
    let partial
    $.ajax({
      method: "GET",
      url: `/api/partial/${$button.attr("name")}`,
    })
      .then(res => {
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
