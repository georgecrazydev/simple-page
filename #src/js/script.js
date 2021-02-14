@@include('libs.js')

$('.header-burger').on('click', function(){
    $('.header-burger').toggleClass('active');
});


$(".hero-image-slider, .blog-slider").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 800,
    fade: true,
    autoplay: true,
    arrows: false,
    dots: true
});

/* accordion */
$("[data-collapse]").on("click", function(event) {
    event.preventDefault();

    var $this = $(this),
        blockId = $this.data('collapse');

    $this.toggleClass("faq-accordion__item--active");
});
