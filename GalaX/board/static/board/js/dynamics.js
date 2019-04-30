// external JS: masonry.pkgd.js
// Main grid sheet (html element):
var $grid = $('.grid').masonry({
 itemSelector: '.grid-item',
});

/** General ------------------------------------------------------------------------- */
/** Hover styled control bar */
$('.grid-content').mouseover( function () {
 $( this ).find('.card-hide').css('visibility','visible');
 $( this ).find('.card-hide').css('opacity', 1);
});
$('.grid-content').mouseout( function () {
 $( this ).find('.card-hide').css('visibility','hidden');
 $( this ).find('.card-hide').css('opacity', 0);
});


$('.grid-expand').on( 'click', function() {
 // change size of item via class
 var $grid_content = $( this ).parents('.grid-content');
 $grid_content.find('.event-usual-hide').toggleClass('grid-dynamic-show');
 // horizontal strech
 $grid_content.parent().toggleClass('col-md-6 col-sm-8 col-xs-12');
 // trigger layout
 $grid.masonry();
});



/** Event card ---------------------------------------------------------------------- */
/** Expansion */
$('.grid-expand.event-card').on( 'click', function() {
 var $grid_content = $( this ).parents('.grid-content');
 $grid_content.find('.event-content-hide').toggleClass('grid-dynamic-show');
 $grid_content.find('.grid-comment-hide').toggleClass('grid-dynamic-show');
});

/** Comment */
$('.grid-comment-hide').on( 'click', function() {
 // change size of item via class
 var $grid_content = $( this ).parent().parent('.grid-content');
 $grid_content.find('.event-comment-hide').toggleClass('grid-dynamic-show');
 $grid_content.find('.grid-comment-control-hide').toggleClass('grid-dynamic-show');
 // trigger layout
 $grid.masonry();
});


// /** Comment resize */
// $('.event-comment-content').onresize(
//  ()=>{$grid.masonry();alert('this');}
// )


/** Function card ---------------------------------------------------------------------- */
/** Expand */ 
$('.grid-expand-function').on( 'click', function() {
 // change size of item via class
 var $grid_content = $( this ).parents('.grid-content');
 $grid_content.find('.event-usual-hide').toggleClass('grid-dynamic-show');
 // trigger layout
 $grid.masonry();
});





export {$grid};