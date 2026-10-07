<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="{{ asset('js/theme.js') }}"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://unpkg.com/aos@next/dist/aos.js"></script>
    <link rel="stylesheet" href="{{ asset('css/modern-theme.css') }}">
    <link href="{{ asset('css/sweetAlert2.min.css') }}" rel="stylesheet" />
    <title>Lazy Eye Vision Therapy</title>
    <style>
      body{
        -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
      }
          /* .webdevanim1{
            margin-top: 15rem;
            position: relative;
            transform: translateX(-100px);
            opacity: 0;
            transition: 1s all ease;
        } */

        /* .webdevanim1.active{
            transform: translateY(0);
            opacity: 1;
        } */
        .cont-cont{
            font-size: 3rem;
            /* margin-top: 15rem; */
            text-align: center;
            /* margin-left: 5rem; */
        }
        .c_head1{
            font-size: 5rem;
            padding: 5rem;
        }
        div.swal2-modal{
            font-size:1.4rem!important;
        }
        /* .webdevanim1{
          position: relative;
          animation: mymovewebdev 1.5s;
          animation-fill-mode: forwards;
          }
          @keyframes mymovewebdev {
            from {top: -100rem;}
            to {top: 5rem;}
          } */

          .webdevanim2{
            position: relative;
            animation: mymovewebdev2 1.5s;
            animation-fill-mode: forwards;
        }
        @keyframes mymovewebdev2 {
          from {right: -20rem;}
          to {right: 0rem;}
        }
    </style>
</head>
<body>
<section id="app"></section>    
<script>
    
    function webdevanim1() {
  var reveals = document.querySelectorAll(".webdevanim1");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 80;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}


function webdevanim2() {
    var reveals = document.querySelectorAll(".webdevanim2");

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 80;

        if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add("active");
        } else {
        reveals[i].classList.remove("active");
        }
    }
    }

function scrollToTop() {
                window.scrollTo(0, 0);
            }
window.addEventListener("scroll", webdevanim1);
window.addEventListener("scroll", webdevanim2);
</script>
<script src="{{asset('js/sweetAlert2.min.js')}}"></script>
<script src="{{asset('js/app.js')}}"></script>
<script src="{{asset('js/frontendScript.js')}}"></script>
</body>
</html>