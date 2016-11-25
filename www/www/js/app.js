
function validate(){
    var username = document.getElementById("login_username").value;
    var password = document.getElementById("login_password").value;
    if ( username == "111" && password == "222"){
        alert ("Login successfully");
        window.location = "success.html"; // Redirecting to other page.
    return false;
    }
    else{
        attempt --;// Decrementing by one.
        alert("Loginn failed");

    }
}



function validate3(){
    var xhr = new XMLHttpRequest();
    var username = document.getElementById("login_username").value;
    var password = document.getElementById("login_password").value;
      
            xhr.onreadystatechange = function(){
                  if(xhr.readyState == 4 && xhr.status==200 ){
                    
                    var ajaxDisplay = document.getElementById('ajaxDiv');
                    ajaxDisplay.innerHTML = xhr.responseText;
                  }
               }
               //queryString +=  "&wpm=" + wpm + "&sex=" + sex;
               xhr.open("GET", "http://localhost/smartprojects/server/api.php?action=bgu_login&username=" + username.toString() +"&password=" +password.toString(), false);
               xhr.send(username,password); 
}