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

window.onload = function()
{
    var year_list = document.getElementById("year_list");
    var start_year = 2010;
    var end_year = 2018;
    for(var i = start_year; i >= start_year && i <= end_year; i++)
    {
        var newYearListItem = document.createElement("option");
        newYearListItem.textContent = i.toString();
        year_list.appendChild(newYearListItem);
        newYearListItem.setAttribute("value",i.toString());
    }
};


function get_advisers()
{
    
    var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                  if(xhr.readyState == 4 && xhr.status==200 ){
                    
                    var ajaxDisplay = document.getElementById('ajaxDiv');
                    var result = xhr.responseText;
                    ajaxDisplay.innerHTML = result;
                    for(var i=0; i<result.length;i++)  
                    {
                        var advisersListItem=document.createElement("option");
                         advisersListItem.textContent=result[i].first_name+" "+result[i].last_name;
                         advisers_list.appendChild(advisersListItem);
                         advisersListItem.setAttribute("value",result.last_name);
                  }
               }
               xhr.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_advisers_list", false);
               xhr.send();
};
}




function validate3(){
    var xhr = new XMLHttpRequest();
    var username = document.getElementById("login_username").value;
    var password = document.getElementById("login_password").value;
    var json_response=""; 
            xhr.onreadystatechange = function(){
                  if(xhr.readyState == 4 && xhr.status==200 ){
                    
                    var ajaxDisplay = document.getElementById('ajaxDiv');
                    json_response = xhr.responseText;
                    var result = JSON.parse(json_response);
                   ajaxDisplay.innerHTML = result.validateUserResult;
                //    ajaxDisplay.innerHTML = json_response;
                    if(result.validateUserResult===true) location.href="Third.html"; 
                    
                  }
               };
               xhr.open("GET", "http://localhost/smartprojects/server/api.php?action=bgu_login&username=" + username.toString() +"&password=" +password.toString(), false);
               xhr.send(username,password); 
               
}