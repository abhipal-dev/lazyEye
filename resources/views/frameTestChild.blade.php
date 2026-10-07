<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css">
<!-- jQuery library -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>

<!-- Latest compiled JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>


<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css">
<link rel="stylesheet" href="../css/app.css "></link>
    <title>Lazy Eye</title>
</head>
<body >
<!-- <section id="app"></section>     -->
<input type="text" id="messageText" />
<button id="sendMessage">Send Message to Parent</button>
<script>
  var button = document.querySelector("#sendMessage");
  button.addEventListener("click", function () {
    var message = document.querySelector("#messageText").value;
    // Send `message` to the parent using the postMessage method on the window.parent reference.
    window.parent.postMessage(message, "*");
  });
</script>
<script src="{{asset('js/app.js')}}"></script>
<script src="{{asset('js/frontendScript.js')}}"></script>
</body>
</html>