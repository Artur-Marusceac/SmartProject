/*jslint browser:true, devel:true, white:true, vars:true */


function validate(){
    var username = document.getElementById("login_username").value;
    var password = document.getElementById("login_password").value;
    if ( username == "111" && password == "222"){
        alert ("Login successfully");
        window.location = "success.html"; // Redirecting to other page.
    return false;
    }
    else{
        window.alert("Login failed");

    }
}

function validate2(){
    var xhr = new XMLHttpRequest();
    var username = document.getElementById("login_username").value;
    var id = document.getElementById("login_password").value;
    var json_response="";

    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status==200 ){

            var ajaxDisplay = document.getElementById('ajaxDiv');
            json_response = xhr.responseText;
            ajaxDisplay.innerHTML = json_response;
        }
    };
    //queryString +=  "&wpm=" + wpm + "&sex=" + sex;
    xhr.open("GET", "http://localhost/trunk/server/api.php?action=is_user_exist&username=" + username.toString() +"&id=" +id.toString(), false);
    xhr.send(username,id);

    var result = JSON.parse(json_response);
    var id_res = eval('(' + result + ')');
    
    if (id_res.id == "1")
    {
        location.href="screen/third.html";
        //location.href="third";
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
               };
               //queryString +=  "&wpm=" + wpm + "&sex=" + sex;
               xhr.open("GET", "http://localhost/smartprojects/server/api.php?action=bgu_login&username=" + username.toString() +"&password=" +password.toString(), false);
               xhr.send(username,password); 
}