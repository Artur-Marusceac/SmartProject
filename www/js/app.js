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
    if (year_list!==null)
    {
        var start_year = 2005;
        var end_year = 2018;
        for(var i = start_year; i >= start_year && i <= end_year; i++) {
            var newYearListItem = document.createElement("option");
            newYearListItem.textContent = i.toString();
            year_list.appendChild(newYearListItem);
            newYearListItem.setAttribute("value", i.toString());
        }
    }

    var advisers_list = document.getElementById("advisers_list");
    if(advisers_list!==null)
    {
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
    }
    var myTableDiv=document.getElementById("search_table");
    if(myTableDiv!==null) {
        xhr = new XMLHttpRequest();
        json_response="";
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status==200 ){
                json_response = xhr.responseText;
                var result = JSON.parse(json_response);
                CreateSearchTable(result);
            }
        };
        xhr.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_search_results", false);
        xhr.send();
    }
};


var info_page = true; //if true from user_id, else(false) from project_id

function CreateSearchTable(db_result)
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
    
    for (var i=0; i<db_result.length; i++){
       tr = document.createElement('TR');
       tableBody.appendChild(tr);
       
       for (var j=0; j<4; j++){
           td = document.createElement('TD');
           if (j==3)
               if (db_result[i][j][0] && db_result[i][j][1] )
                   td.appendChild(document.createTextNode(db_result[i][j][0]+","+db_result[i][j][1]));
               else if (db_result[i][j][0])
                   td.appendChild(document.createTextNode(db_result[i][j][0]));
               else
                    td.appendChild(document.createTextNode(""));
           else
               td.appendChild(document.createTextNode(db_result[i][j]));
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
                            img.setAttribute("src","/Data/Conference/"+dir+'/'+result[i]);
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
               xhr.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_pictures&dir=" + dir.toString() , false);
                while (box.firstChild) {
                    box.removeChild(box.firstChild);
                        }
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
            if (result.toString() == "true")
                location.href="Search_Results.html";
        }
    };
    xhr_search.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=search_project&year=" + year.toString() +"&student_name=" +student_name.toString()+"&adviser=" +adviser.toString()+"&project_name=" +project_name.toString(), false);
    xhr_search.send(year,student_name,adviser,project_name);
}



function get_project_info()
{
    var id = window.document.getElementById("info_id").value;
    var xhr_project_info = new XMLHttpRequest();
    var json_response="";
    xhr_project_info.onreadystatechange = function(){
        if(xhr_project_info.readyState == 4 && xhr_project_info.status==200 ){

            json_response = xhr_project_info.responseText;
            var result = JSON.parse(json_response);
            if (result)
            {

                var myTableDiv=document.getElementById("info_table");
                var table = document.createElement('TABLE');
                var tableBody = document.createElement('TBODY');

                table.appendChild(tableBody);

                var tr = document.createElement('TR');
                tableBody.appendChild(tr);
                var td = document.createElement('TD');
                td.appendChild(document.createTextNode("Advisers" ));
                tr.appendChild(td);
                td = document.createElement('TD');
                td.appendChild(document.createTextNode("Students"));
                tr.appendChild(td);
                td = document.createElement('TD');
                td.appendChild(document.createTextNode("Email"));
                tr.appendChild(td);
                tr = document.createElement('TR');
                tableBody.appendChild(tr);
                td = document.createElement('TD');
                var adviser_array = result[1];
                for (var j=0; j< adviser_array.length;j++) {
                    td.appendChild(document.createTextNode(adviser_array[j]));
                    td.appendChild(document.createElement("br"));
                }
                tr.appendChild(td);
                var student_array = result[0];
                td = document.createElement('TD');
                for (var i=0;i<student_array.length;i++)
                {
                    td.appendChild(document.createTextNode(student_array[i][0]));
                    td.appendChild(document.createElement("br"));
                }
                tr.appendChild(td);
                td = document.createElement('TD');
                for (var i=0;i<student_array.length;i++)
                {
                    var mail = "mailto:"+student_array[i][1]+"?subject=New Mail&body=Mail text body";
                    var mlink = document.createElement('a');
                    mlink.setAttribute('href', mail);
                    mlink.innerText="mail to: "+student_array[i][0];
                    td.appendChild(mlink);
                    td.appendChild(document.createElement("br"));
                }
                tr.appendChild(td);
            }
            myTableDiv.appendChild(table);
            var status_element = window.document.getElementById("status_project");
            var status_project = result[2];
            status_element.innerText = "Project Status: "+status_project;
            }
    };
    if (info_page) {
        xhr_project_info.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_project_by_user_id&user_id=" + id.toString(), false);
        xhr_project_info.send(id);
    }
    else
    {
        xhr_project_info.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_project_by_project_id&project_id=" + id.toString(), false);
        //xhr_project_info.send(project_id);
    }
}