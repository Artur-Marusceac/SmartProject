$(window).load(function() { 
	$("#status").addClass('hide-status'); // will first fade out the loading animation
	$("#preloader").addClass('hide-preloader'); // will fade out the white DIV that covers the website.
});


$( document ).ready(function() {    
    
    //FastClick
    $(function() {FastClick.attach(document.body);});
    
    //Preload Image

    $(function() {
        $(".preload-image").lazyload({
            threshold : 100,
            effect : "fadeIn",
            container: $("#page-content-scroll")
        });
    });


   //Enable Function to scale sidebar to the same height as content if the perspective sidebar is selected
    function create_sidebar_styles(){
        var sidebar_size = $('#page-content').height() * 0.85;
        $('.sidebar-scroll').css('height', sidebar_size);
        $('.sidebar-scroll').css('top', '50%');
        $('.sidebar-scroll').css('margin-top', -(sidebar_size/2));   
    };
    
    $( window ).resize(function() {
        create_sidebar_styles();
    });
    
    //Sidebar Settings
    
    $('.open-left-sidebar').click(function(){
        $('#page-content').addClass('body-left');
        $('.header-fixed').addClass('hide-header');
        $('.sidebar-left, .sidebar-left-fix').addClass('active-sidebar-box'); 
        $('.sidebar-right, .sidebar-right-fix').removeClass('active-sidebar-box'); 
        $('.sidebar-tap-close').addClass('active-tap-close');
        create_sidebar_styles();
        return false;
    });
    
    $('.open-right-sidebar').click(function(){
        $('#page-content').addClass('body-right');
        $('.header-fixed').addClass('hide-header');
        $('.sidebar-right, .sidebar-right-fix').addClass('active-sidebar-box'); 
        $('.sidebar-left, .sidebar-left-fix').removeClass('active-sidebar-box'); 
        $('.sidebar-tap-close').addClass('active-tap-close');
        create_sidebar_styles();
        return false;
    });
    
    $('.sidebar-tap-close, .close-sidebar').click(function(){
        $('#page-content, .header-fixed, .footer-fixed').removeClass('body-left body-right');
        $('.sidebar-left, .sidebar-right, .sidebar-left-fix, .sidebar-right-fix').removeClass('active-sidebar-box'); 
        $('.sidebar-tap-close').removeClass('active-tap-close'); 
        $('.header-fixed').removeClass('hide-header');
        return false;
    });
    
    //Open / Close Sidebar Submenu
    
    $('.open-submenu').click(function(){           
        var counted_subs = $(this).parent().find('.submenu a').length;
        $(this).parent().find('.submenu').toggleClass('active-submenu-' + counted_subs);
        $(this).toggleClass('active-item');
        $(this).parent().find('.menu-item .fa-plus').toggleClass('rotate-icon');  
        return false;
    });    
    
    if($('.submenu').hasClass('active-submenu')){
        var counted_subs = $('.active-submenu').find('a').length;
        $('.active-submenu').addClass('active-submenu-' + counted_subs);
        $('.active-submenu').parent().find('.menu-item .fa-plus').addClass('rotate-icon');  
    }      
    
    
    //Slider Settings
    setTimeout(function() {
    //because slider has margins and content, a timeout is needed for propper alignment    
    $('.coverpage-slider').owlCarousel({
        loop:true,
        margin:0,
        nav:false,
        items:1
    });
    $('.single-item').owlCarousel({
        autoplay:true,
        autoplayTimeout:4000,
        loop:true,
        margin:10,
        nav:true,
        dots:true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:1
            },
            1000:{
                items:1
            }
        }
    });         

    $('.home-next').click(function() {
        $('.single-item').trigger('next.owl.carousel');
    }); 

    $('.home-prev').click(function() {
        $('.single-item').trigger('prev.owl.carousel');
    });
        
    $('.double-item').owlCarousel({
        autoplay:true,
        autoplayTimeout:4000,
        loop:true,
        margin:10,
        lazyLoad:true,
        nav:false,
        dots:false,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:2
            },
            1000:{
                items:2
            }
        }
    });      
        
    $('.tripple-item').owlCarousel({
        autoplay:true,
        autoplayTimeout:4000,
        loop:true,
        margin:10,
        lazyLoad:true,
        nav:false,
        dots:false,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:3
            },
            1000:{
                items:3
            }
        }
    });       
        
    $('.store-slider, .product-slider').owlCarousel({
            loop:true,
            margin:10,
            nav:false,
            dots:false,
            responsive:{
                0:{
                    items:1
                },
                600:{
                    items:2
                },
                1000:{
                    items:2
                }
            }
        });  
    }, 0.001);
        
                
    //Mobile Style Switches
        
    $('.switch-1').click(function(){$(this).toggleClass('switch-1-on'); return false;});
    $('.switch-2').click(function(){$(this).toggleClass('switch-2-on'); return false;});
    $('.switch-3').click(function(){$(this).toggleClass('switch-3-on'); return false;});
    $('.switch, .switch-icon').click(function(){
        $(this).parent().find('.switch-box-content').slideToggle(250); 
        $(this).parent().find('.switch-box-subtitle').slideToggle(250);
        return false;
    });

    //Classic Toggles
    
    $('.toggle-title').click(function(){
        $(this).parent().find('.toggle-content').slideToggle(250); 
        $(this).find('i').toggleClass('rotate-toggle');
        return false;
    });
    
    //Accordion
    
    $('.accordion').find('.accordion-toggle').click(function(){
        //Expand or collapse this panel
        $(this).next().slideDown(250);
        $('.accordion').find('i').removeClass('rotate-180');
        $(this).find('i').addClass('rotate-180');

        //Hide the other panels
        $(".accordion-content").not($(this).next()).slideUp(250);
    });    
    //Tabs
    
	$('ul.tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');
		$('ul.tabs li').removeClass('active-tab');
		$('.tab-content').slideUp(250);
		$(this).addClass('active-tab');
		$("#"+tab_id).slideToggle(250);
	})
    
    //Notifications
    
    $('.static-notification-close').click(function(){
       $(this).parent().slideUp(250); 
        return false;
    });    
    
    $('.tap-dismiss').click(function(){
       $(this).slideUp(250); 
        return false;
    });
    
    //Detecting Mobiles//
    
    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
     
    if( !isMobile.any() ){
        $('.show-blackberry, .show-ios, .show-windows, .show-android').addClass('disabled');
        $('#page-content-scroll').css('right', '0px');
        $('.show-no-detection').removeClass('disabled');
    }
    
    if(isMobile.Android()) {
        //Status Bar Color for Android
        $('head').append('<meta name="theme-color" content="#000000"> />');
        $('.show-android').removeClass('disabled');
        $('.show-blackberry, .show-ios, .show-windows').addClass('disabled');
        $('#page-content-scroll, .sidebar-scroll').css('right', '0px');
    }
        
    if(isMobile.BlackBerry()) {
        $('.show-blackberry').removeClass('disabled');
        $('.show-android, .show-ios, .show-windows').addClass('disabled');
        $('#page-content-scroll, .sidebar-scroll').css('right', '0px');
    }
        
    if(isMobile.iOS()) {
        $('.show-ios').removeClass('disabled');
        $('.show-blackberry, .show-android, .show-windows').addClass('disabled');
        $('#page-content-scroll, .sidebar-scroll').css('right', '0px');
    }
        
    if(isMobile.Windows()) {
        $('.show-windows').removeClass('disabled');
        $('.show-blackberry, .show-ios, .show-android').addClass('disabled');
        $('#page-content-scroll, .sidebar-scroll').css('right', '0px');
    }
    
    //Galleries
    
	$(".gallery a, .show-gallery").swipebox();
    
    var screen_widths = $(window).width();
    if( screen_widths < 768){ 
        $('.gallery-justified').justifiedGallery({
            rowHeight : 80,
            maxRowHeight : 370,
            margins : 5,
            fixedHeight:false
        });
    };

    if( screen_widths > 768){
        $('.gallery-justified').justifiedGallery({
            rowHeight : 150,
            maxRowHeight : 370,
            margins : 5,
            fixedHeight:false
        });
    };
       
    //Adaptive Folios
    
    $('.adaptive-one').click(function(){
        $('.portfolio-switch').removeClass('active-adaptive');
        $(this).addClass('active-adaptive');
        $('.portfolio-adaptive').removeClass('portfolio-adaptive-two portfolio-adaptive-three');
        $('.portfolio-adaptive').addClass('portfolio-adaptive-one');
        return false;
    });    
    
    $('.adaptive-two').click(function(){
        $('.portfolio-switch').removeClass('active-adaptive');
        $(this).addClass('active-adaptive');
        $('.portfolio-adaptive').removeClass('portfolio-adaptive-one portfolio-adaptive-three');
        $('.portfolio-adaptive').addClass('portfolio-adaptive-two'); 
        return false;
    });    
    
    $('.adaptive-three').click(function(){
        $('.portfolio-switch').removeClass('active-adaptive');
        $(this).addClass('active-adaptive');
        $('.portfolio-adaptive').removeClass('portfolio-adaptive-two portfolio-adaptive-one');
        $('.portfolio-adaptive').addClass('portfolio-adaptive-three'); 
        return false;
    });
    
    //Reminders & Checklists & Tasklists
    
    $('.reminder-check-square').click(function(){
       $(this).toggleClass('reminder-check-square-selected'); 
        return false;
    });    
    
    $('.reminder-check-round').click(function(){
       $(this).toggleClass('reminder-check-round-selected'); 
        return false;
    });
    
    $('.checklist-square').click(function(){
       $(this).toggleClass('checklist-square-selected');
        return false;
    });    
    
    $('.checklist-round').click(function(){
       $(this).toggleClass('checklist-round-selected');
        return false;
    });
    
    $('.tasklist-incomplete').click(function(){
       $(this).removeClass('tasklist-incomplete'); 
       $(this).addClass('tasklist-completed'); 
        return false;
    });    
    
    $('.tasklist-item').click(function(){
       $(this).toggleClass('tasklist-completed'); 
        return false;
    });
    
    //SiteMap
    
    $('.sitemap-box a').hover(
        function(){$(this).find('i').addClass('scale-hover');}, 
        function(){$(this).find('i').removeClass('scale-hover');}
    );
    
    //Fullscreen Map
    
    
    $('.map-text, .overlay').click(function(){
       $('.map-text, .map-fullscreen .overlay').addClass('hide-map'); 
       $('.deactivate-map').removeClass('hide-map'); 
    });   
    
    $('.deactivate-map').click(function(){
       $('.map-text, .map-fullscreen .overlay').removeClass('hide-map'); 
       $('.deactivate-map').addClass('hide-map'); 
    });
    
    //Show Back To Home When Scrolling
        
    $('#page-content-scroll').on('scroll', function () {
        var total_scroll_height = $('#page-content-scroll')[0].scrollHeight
        var inside_header = ($(this).scrollTop() <= 150);
        var passed_header = ($(this).scrollTop() >= 0); //250
        var footer_reached = ($(this).scrollTop() >= (total_scroll_height - ($(window).height() +100 )));
        
        if (inside_header == true) {
            $('.back-to-top-badge').removeClass('back-to-top-badge-visible');
        } else if (passed_header == true)  {
            $('.back-to-top-badge').addClass('back-to-top-badge-visible');
        } 
        if (footer_reached == true){            
            //$('.back-to-top-badge').removeClass('back-to-top-badge-visible');
        }
    });
    
    //Back to top Badge
    
    $('.back-to-top-badge, .back-to-top').click(function (e) {
        e.preventDefault();
        $('#page-content-scroll').animate({
            scrollTop: 0
        }, 250);
    });          
                 
    //Set inputs to today's date by adding class set-day
    
    var set_input_now = new Date();
    var set_input_month = (set_input_now.getMonth() + 1);               
    var set_input_day = set_input_now.getDate();
    if(set_input_month < 10) 
        set_input_month = "0" + set_input_month;
    if(set_input_day < 10) 
        set_input_day = "0" + set_input_day;
    var set_input_today = set_input_now.getFullYear() + '-' + set_input_month + '-' + set_input_day;
    $('.set-today').val(set_input_today);
        
    
    //Portfolios and Gallerties
    
    $('.adaptive-one').click(function(){
        $('.portfolio-switch').removeClass('active-adaptive');
        $(this).addClass('active-adaptive');
        $('.portfolio-adaptive').removeClass('portfolio-adaptive-two portfolio-adaptive-three');
        $('.portfolio-adaptive').addClass('portfolio-adaptive-one');
        return false;
    });    
    
    $('.adaptive-two').click(function(){
        $('.portfolio-switch').removeClass('active-adaptive');
        $(this).addClass('active-adaptive');
        $('.portfolio-adaptive').removeClass('portfolio-adaptive-one portfolio-adaptive-three');
        $('.portfolio-adaptive').addClass('portfolio-adaptive-two'); 
        return false;
    });    
    
    $('.adaptive-three').click(function(){
        $('.portfolio-switch').removeClass('active-adaptive');
        $(this).addClass('active-adaptive');
        $('.portfolio-adaptive').removeClass('portfolio-adaptive-two portfolio-adaptive-one');
        $('.portfolio-adaptive').addClass('portfolio-adaptive-three'); 
        return false;
    });
    
    //Wide Portfolio
    
    $('.show-wide-text').click(function(){
        $(this).parent().find('.wide-text').slideToggle(200); 
        return false;
    });
    
    $('.portfolio-close').click(function(){
       $(this).parent().parent().find('.wide-text').slideToggle(200);
        return false;
    });
    
    //Bottom Share Fly-up
    
    
    $('body').append('<div class="share-bottom-tap-close"></div>');

    
    $('.show-share-bottom, .show-share-box').click(function(){
        $('.share-bottom-tap-close').addClass('share-bottom-tap-close-active');
        $('.share-bottom').toggleClass('active-share-bottom'); 
        return false;
    });    
    
    $('.close-share-bottom, .share-bottom-tap-close').click(function(){
       $('.share-bottom-tap-close').removeClass('share-bottom-tap-close-active');
       $('.share-bottom').removeClass('active-share-bottom'); 
        return false;
    });
            
    //Filterable Gallery
    
    var selectedClass = "";
    $(".filter-category").click(function(){
        $('.portfolio-filter-categories a').removeClass('selected-filter');
        $(this).addClass('selected-filter');
        selectedClass = $(this).attr("data-rel");
        $(".portfolio-filter-wrapper").slideDown(250);
        $(".portfolio-filter-wrapper div").not("."+selectedClass).delay(100).slideUp(250);
        setTimeout(function() {
            $("."+selectedClass).slideDown(250);
            $(".portfolio-filter-wrapper").slideDown(250);
        }, 0);
    });
    
    //Resizable Elements

    function slider_dots(){
        var dots_width = (-($('.owl-dots').width()/2));
        $('.coverpage-news .owl-dots, .coverpage-slider .owl-dots').css('position', 'absolute');
        $('.coverpage-news .owl-dots, .coverpage-slider .owl-dots').css('left', '50%');
        $('.coverpage-news .owl-dots, .coverpage-slider .owl-dots').css('margin-left', dots_width);   
    }      
    slider_dots();
    
    if($('body').hasClass('has-cover')){
       
        var screen_height = 0;
        var screen_width = 0;

        var cover_content_height = 0;
        var cover_content_width = 0;
        
        function calculate_covers(){
            var screen_height = $('#page-content').height();
            var screen_width = $('#page-content').width();

            //Settings for Cover Pages
            var cover_content_height = $('.cover-page-content').height()-30;
            var cover_content_width = $('.cover-page-content').width();

            $('.cover-page').css('height', screen_height);
            $('.cover-page').css('width', screen_width);            
            $('.cover-page-content').css('margin-left', (cover_content_width/2)*(-1));
            $('.cover-page-content').css('margin-top', (cover_content_height/2)*(-1));
                    
            
            //Settings for Cover Slider
            var cover_width = $(window).width();
            var cover_height = $(window).height();
            var cover_vertical = -($('.cover-center').height())/2;
            var cover_horizontal = -($('.cover-center').width())/2;

            $('.cover-screen').css('width', cover_width);
            $('.cover-screen').css('height', cover_height);
            $('.cover-screen .overlay').css('width', cover_width);
            $('.cover-screen .overlay').css('height', cover_height);

            $('.cover-center').css('margin-left', cover_horizontal);      
            $('.cover-center').css('margin-top', cover_vertical + 30);     
            $('.cover-left').css('margin-top', cover_vertical);   
            $('.cover-right').css('margin-top', cover_vertical);   
                        
        }
    
        calculate_covers();
        $( window ).resize(function() {
            calculate_covers();
        });
        
        function generate_map(){
            var map_width = $(window).width();
            var map_height = $(window).height();

            $('.map-fullscreen iframe').css('width', map_width);
            $('.map-fullscreen iframe').css('height', map_height);
        };
        generate_map();
        
        //Demo Purposes
        $('.error-page-layout-switch').click(function(){
           $('.cover-page-content').toggleClass('unboxed-layout, boxed-layout'); 
            calculate_covers();
        });
    
    }
    
    //Countdown Timer
    
    $(function() {
        $('.countdown-class').countdown({
            date: "June 7, 2087 15:03:26"
        });
    });
    
    //Copyright Year 

    if ($("#copyright-year")[0]){
        document.getElementById('copyright-year').appendChild(document.createTextNode(new Date().getFullYear()))
    }

    
    //Status Bar
    var options = {
        bg: '#e74c3c',
        // leave target blank for global nanobar
        target: document.getElementById('myDivId'),
        // id for new nanobar
        id: 'mynano'
    };

    var nanobar = new Nanobar( options );

    // move bar
    nanobar.go( 30 ); // size bar 30%

    // Finish progress bar
    nanobar.go(100);











    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

});

