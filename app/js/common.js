;
$(document).ready(function () {
    $(function () {
        var slider = '.ui-slider-handle';
        var range = $("#slider-range");
        $("#slider-range").slider({
            range: true,
            values: [17, 67],
            create: function (event, ui) {
                console.log(event)
            },
            slide: function (event, ui) {
                $(slider).first().attr("data-min", range.slider("values", 0));
                $(slider).last().attr("data-max", range.slider("values", 1));
            }
        });
        $(slider).first().attr("data-min", range.slider("values", 0));
        $(slider).last().attr("data-max", range.slider("values", 1));

    });
});
