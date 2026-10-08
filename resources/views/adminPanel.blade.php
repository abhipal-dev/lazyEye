        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="csrf-token" content="{{ csrf_token() }}" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
            <title>Lazy Eye : Admin Panel</title>
            <script src="{{ asset('js/theme.js') }}"></script>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
            <link href="{{ asset('css/adminStyle.css') }}" rel="stylesheet" />
            <link href="{{ asset('css/modern-theme.css') }}" rel="stylesheet" />
            <link href="css/sweetAlert2.min.css" rel="stylesheet" />

            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
            <style>
                 body{
        -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
      }
            </style>
            
        </head>
        <body>
        <section id="admin" data-id="{{$user_id}}" data-role="{{$user_type ?? 'admin'}}"></section>  
        <script src="{{asset('js/app.js')}}"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js" crossorigin="anonymous"></script>
            <!-- <script src="assets/demo/chart-area-demo.js"></script> -->
            <!-- <script src="assets/demo/chart-bar-demo.js"></script> -->
        <script src="{{asset('js/adminScript.js')}}"></script>
<script src="{{asset('js/sweetAlert2.min.js')}}"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment-with-locales.min.js" integrity="sha512-42PE0rd+wZ2hNXftlM78BSehIGzezNeQuzihiBCvUEB3CVxHvsShF86wBWwQORNxNINlBPuq7rG4WWhNiTVHFg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

        </body>
        </html>