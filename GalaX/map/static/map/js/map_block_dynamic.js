$(document).ready(
    function() {
        $("#map_block_dynamic").change(
            function() {
                if (this.checked) {
                    $(".map_block_dynamic_fade").css({'opacity':0, 'visibility': 'hidden'});
                    $(".map_block_dynamic").hide();
                    $("#left_blocks").removeClass('col-md-9');
                    $("#left_blocks").addClass('col-md-12');
                    $("#right_blocks").removeClass('col-md-3');
                    $("#right_blocks").addClass('col-md-0');
                } else {
                    $(".map_block_dynamic_fade").css({'opacity':1, 'visibility': 'visible'})
                    $(".map_block_dynamic").show();
                    $("#left_blocks").removeClass('col-md-12');
                    $("#left_blocks").addClass('col-md-9');
                    $("#right_blocks").removeClass('col-md-0');
                    $("#right_blocks").addClass('col-md-3');
                }
            }
        )
    }
)