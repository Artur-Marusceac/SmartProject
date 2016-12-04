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


window.onload= function()
{

    var year_list = document.getElementById("year_list");
    var start_year = 2005;
    var end_year = 2018;
    for(var i = start_year; i >= start_year && i <= end_year; i++) {
        var newYearListItem = document.createElement("option");
        newYearListItem.textContent = i.toString();
        year_list.appendChild(newYearListItem);
        newYearListItem.setAttribute("value", i.toString());
    }


    var advisers_list = document.getElementById("advisers_list");
    var xhr = new XMLHttpRequest();
    var json_response=""; 
            xhr.onreadystatechange = function(){
                  if(xhr.readyState == 4 && xhr.status==200 ){
                    
                    var ajaxDisplay = document.getElementById('ajaxDiv');
                    json_response = xhr.responseText;
                    var result = JSON.parse(json_response);
                    ajaxDisplay.innerHTML = result;
                    for(var i=0; i<result.length;i++)  
                    {
                        var advisersListItem=document.createElement("option");
                         advisersListItem.textContent=result[i].first_name+" "+result[i].last_name;
                         advisers_list.appendChild(advisersListItem);
                         advisersListItem.setAttribute("value",result[i].last_name);
                  }
               }
            };
               xhr.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_advisers_list", false);
               xhr.send();
};

function CreateSearchTable()
{
       var myTableDiv=document.getElementById("search_table");
    var table = document.createElement('TABLE');
    var tableBody = document.createElement('TBODY');
    
    table.appendChild(tableBody);
      
   var tr = document.createElement('TR');
    tableBody.appendChild(tr); 
       var td = document.createElement('TD');
           td.appendChild(document.createTextNode("Project ID" ));
           tr.appendChild(td);
        td = document.createElement('TD');
           td.appendChild(document.createTextNode("Project Name"));
           tr.appendChild(td);
        td = document.createElement('TD');
           td.appendChild(document.createTextNode("Advisers"));
           tr.appendChild(td);
        td = document.createElement('TD');
           td.appendChild(document.createTextNode("Students"));
           tr.appendChild(td);
    
    for (var i=1; i<3; i++){
       tr = document.createElement('TR');
       tableBody.appendChild(tr);
       
       for (var j=0; j<4; j++){
           td = document.createElement('TD');
           td.appendChild(document.createTextNode("Cell " + i + "," + j));
           tr.appendChild(td);
       }
    }
    myTableDiv.appendChild(table);

}

function PicturesFromDir(){
    var xhr = new XMLHttpRequest();
    var year = document.getElementById("year_list").value;
    var dir = year;
    var j=0;
    var box=document.getElementById("box");
    var json_response="";
            xhr.onreadystatechange = function(){
                  if(xhr.readyState == 4 && xhr.status==200 ){
                    json_response = xhr.responseText;
                    var result = JSON.parse(json_response);
                      
     
                          for (var i = 0; i < result.length; i++) {
                            var td = document.createElement('div');
                             td.setAttribute("class","row no-collapse 50% uniform") ;
                              for(j=0 ; j<3 ; j++)
                            {
                            var td2 = document.createElement('div');
                            td2.setAttribute("class","4u") ;
                            var span = document.createElement('span');
                            span.setAttribute("class","image fit") ;
                            var img = document.createElement('img');
                            img.setAttribute("src",dir+result[i]);
                            img.setAttribute("alt","");
                            span.appendChild(img);
                            td2.appendChild(span);
                            td.appendChild(td2);
                            i++;
                            }
                            box.appendChild(td);
                          
                            
                            
                          }
                //   ajaxDisplay.innerHTML = result.validateUserResult;
                //    ajaxDisplay.innerHTML = json_response;
                  }
               };
               xhr.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_pictures&dir=" + dir , false);
               xhr.send(dir);
               
 
}
                      
                      
function search_command()
{
    var year = window.document.getElementById("year_list").value;
    var student_name =window.document.getElementById("student_name").value;
    var adviser =window.document.getElementById("advisers_list").value;
    var project_name =window.document.getElementById("project_name").value;


    var xhr_search = new XMLHttpRequest();
    var json_response="";
    xhr_search.onreadystatechange = function(){
        if(xhr_search.readyState == 4 && xhr_search.status==200 ){

            json_response = xhr_search.responseText;
            var result = JSON.parse(json_response);
        }
    };
    xhr_search.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=search_project&year=" + year.toString() +"&student_name=" +student_name.toString()+"&adviser=" +adviser.toString()+"&project_name=" +project_name.toString(), false);
    xhr_search.send();
}