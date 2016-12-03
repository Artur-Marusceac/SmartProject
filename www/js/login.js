
document.getElementById("loadingImg").style.visibility= "hidden";

function validate3(){
    var xhr = new XMLHttpRequest();
    var username = document.getElementById("login_username").value;
    var password = document.getElementById("login_password").value;
    var json_response="";
    document.getElementById("loadingImg").style.visibility="visible";
            xhr.onreadystatechange = function(){
                  if(xhr.readyState == 4 && xhr.status==200 ){
                    
                    var ajaxDisplay = document.getElementById('ajaxDiv');
                    json_response = xhr.responseText;
                    var result = JSON.parse(json_response);
                //   ajaxDisplay.innerHTML = result.validateUserResult;
                //    ajaxDisplay.innerHTML = json_response;
                      document.getElementById("loadingImg").style.visibility= "hidden";
                    if(result.validateUserResult===true) location.href="Third.html"; 
                    
                  }
               };
               xhr.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=bgu_login&username=" + username.toString() +"&password=" +password.toString(), false);
               xhr.send(username,password); 
               
}