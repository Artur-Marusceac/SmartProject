
function validate_login(){
    var xhr = new XMLHttpRequest();
    var username = document.getElementById("login_username").value;
    var password = document.getElementById("login_password").value;
    var json_response="";
            xhr.onreadystatechange = function(){
                  if(xhr.readyState == 4 && xhr.status==200 ){

                    json_response = xhr.responseText;
                    var result = JSON.parse(json_response);
                    if(result.validateUserResult===true) location.href="Fourth.html";
                  }
               };
               xhr.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=bgu_login&username=" + username.toString() +"&password=" +password.toString(), false);
               xhr.send(username,password); 
               
}