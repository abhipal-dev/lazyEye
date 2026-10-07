<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="csrf-token" content="{{ csrf_token() }}" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lazy Eye : User Panel</title>
  <script src="{{ asset('js/theme.js') }}"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/simple-datatables@latest/dist/style.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
  <link href="{{ asset('css/adminStyle.css') }}" rel="stylesheet" />
  <link href="{{ asset('css/modern-theme.css') }}" rel="stylesheet" />
  <link href="css/sweetAlert2.min.css" rel="stylesheet" />
  
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment-with-locales.min.js"></script>   


<style>
   body {
      color: var(--text-main);
      text-align: left;
      background-color: var(--bg-body);
      -webkit-user-select: none; /* Safari */
      -ms-user-select: none; /* IE 10 and IE 11 */
      user-select: none; /* Standard syntax */
   }


    .game-card {
      box-shadow: 0 0.2rem 0.6rem 0 rgba(0, 0, 0, .1), 0 0.5rem 0.6rem 0 rgba(0, 0, 0, .06);
    }

    .game-card {
      height: 12rem;
      position: relative;
      display: flex;
      flex-direction: column;
      min-width: 0;
      word-wrap: break-word;
      background-color: #fff;
      background-clip: border-box;
      border: 0 solid rgba(0, 0, 0, .125);
      border-radius: .25rem;
      box-shadow: .5rem .5rem 1.0rem #c3c3c3,
        -.5rem -.5rem 1.0rem #fdfdfd;
    }

    .game-card-body {
      flex: 1 1 auto;
      min-height: 1rem;
      padding: 1rem;
    }

   .gutters-sm {
      margin-right: -0.8rem;
      margin-left: -0.8rem;
    }

    .gutters-sm>.col,
    .gutters-sm>[class*=col-] {
      padding-right: 0.8rem;
      padding-left: 0.8rem;
    }

    .mb-3,
    .my-3 {
      margin-bottom: 1rem !important;
    }

    .bg-gray-300 {
      background-color: #e2e8f0;
    }

    .h-100 {
      height: 100% !important;
    }

    .shadow-none {
      box-shadow: none !important;
    }

    /* .game-card {
     
      background-color: #FCF7FF;
      border: none;
      position: relative;
      margin: 1rem;
      font-family: inherit;
      border-radius: 1rem;
      box-shadow: .5rem .5rem 1.0rem #c3c3c3,
        -.5rem -.5rem 1.0rem #fdfdfd;
    } */

    .game-card-row {
      margin-top: 2rem;
    }

    .game-card span {
      font-weight: 600;
      color: black;
      text-align: center;
      display: block;
      padding: 1rem;
      font-size: 1.3rem;
    }



    div.game-card button {
      background-color: #eee;
      display: block;
      font-weight: 600;
      margin: auto;

      border: none;
      padding: 0.6rem;
      font-size: 1rem;
      width: 8rem;
      border-radius: 1rem;
      color: black;
      box-shadow: 0 0.4rem #dfd9d9;
      cursor: pointer;
    }


    div.game-card button:active {
      color: white;
      box-shadow: 0 0.2rem #dfd9d9;
      transform: translateY(0.2rem);
    }


    div.game-card button:hover:not(:disabled) {
      background: lightcoral;
      color: white;
      text-shadow: 0 0.1rem #bcb4b4;
    }

    div.game-card button:disabled {
      cursor: auto;
      color: grey;
    } 

    .react-calendar-heatmap rect::before {
  content: attr(data-tip);
  position: absolute;
  top: 1.5em;
  font-size: 0.9em;
  padding: 1px 5px;
  display: none;
  color: white;
  background: rgba(0, 0, 0, 0.75);
  border-radius: 4px;
  transition: opacity 0.1s ease-out;
  z-index: 99;
  text-align: left;
}

.react-calendar-heatmap rect:hover::before {
  display: inline-block !important;
}

.activitylog-date-color-1{
      background-color:#0f03!important;
}
.activitylog-date-color-2{
      background-color:#00ff0045!important
}
.activitylog-date-color-3{
      background-color:#00ff005c!important
}
.activitylog-date-color-4{
      background-color:#00ff0078!important;
}
.activitylog-date-color-5{
      background-color:#00ff0087!important;
}
.activitylog-date-color-6{
      background-color:#00ff009c!important;
    }
.activitylog-date-color-7{
      background-color:#00ff00b2!important;
}
.activitylog-date-color-8{
      background-color:#0f0c!important
}
.activitylog-date-color-9{
      background-color:#00ff00e8!important;
}
.activitylog-date-color-10{
      background-color:#00ff00!important
}

    /* / ---------------Dashboard---------------- / */
  </style>
 
</head>

<body>
  <section id="user" data-id="{{$user_id}}" data-type="{{$user_type ?? ''}}"></section>


  <script src="{{asset('js/app.js')}}"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js" crossorigin="anonymous"></script>
  <script src="{{asset('js/userScript.js')}}"></script>
  <script src="{{asset('js/sweetAlert2.min.js')}}"></script>

  

</body>

</html>