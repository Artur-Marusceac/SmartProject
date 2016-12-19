/*jslint browser:true, devel:true, white:true, vars:true */
/*jshint scripturl:true*/
/*globals $:false */

window.onload= function() {

    var year_list = document.getElementById("year_list");
    if (year_list !== null) {
        var start_year = 2005;
        var end_year = 2018;
        for (var i = start_year; i >= start_year && i <= end_year; i++) {
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

                json_response = xhr.responseText;
                var result = JSON.parse(json_response);
                for(var i=0; i<result.length;i++)
                {
                    var advisersListItem=document.createElement("option");
                    advisersListItem.textContent=result[i].first_name+" "+result[i].last_name;
                    advisers_list.appendChild(advisersListItem);
                    advisersListItem.setAttribute("value",result[i].first_name+" "+result[i].last_name);
                }
            }
        };
        xhr.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_advisers_list", false);
        xhr.send();
    }
    var myTableDiv=document.getElementById("search_table");
    if(myTableDiv!==null) {
        var xhr_search = new XMLHttpRequest();
        var json_res="";
        xhr_search.onreadystatechange = function(){
            if(xhr_search.readyState == 4 && xhr_search.status==200 ){
                json_res = xhr_search.responseText;
                var result = JSON.parse(json_res);
                CreateSearchTable(result);
            }
        };
        xhr_search.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_search_results", false);
        xhr_search.send();
    }

    var project_info = document.getElementById("project_info_container");
    if (project_info!==null)
        get_project_info();

    var welcome_user_div = window.document.getElementById("welcome_user");
    if (welcome_user_div!==null)
    {
        var user_full_name = getFullName();
        var p = window.document.createElement("p");
        p.innerText = "Welcome " + user_full_name;
        welcome_user_div.appendChild(p);
    }
    
     var my_project_info=document.getElementById("Fourth_Year_Project_Info");
    if (my_project_info!==null)
        get_my_project_info();
};

function PicturesFromDir(){
    var xhr = new XMLHttpRequest();
    var year = document.getElementById("year_list").value;
    var dir = year;
    var j=0;
    var content=document.getElementById("box");
    var json_response="";
            xhr.onreadystatechange = function(){
                  if(xhr.readyState == 4 && xhr.status==200 ){
                    json_response = xhr.responseText;
                    var result = JSON.parse(json_response);
         
                          for (var i = 0; i < result.length; i++) {

                            var td = document.createElement('a');
                            td.setAttribute("href","/Data/Conference/"+dir+'/'+result[i]) ;
                            td.setAttribute("class","scale-hover show-gallery") ;
                            var td2 = document.createElement('img');
                           
                            
                            td2.setAttribute("class","preload-image responsive-image");
                              //td2.setAttribute("src","/Data/Conference/"+dir+'/'+result[i]) ;
                              td2.setAttribute("data-original","/Data/Conference/"+dir+'/'+result[i]) ;
                             td2.setAttribute("alt","img");
                            
                            td.appendChild(td2);
                            content.appendChild(td);

                            }
                      //Preload Image

                      $(function() {
                          $(".preload-image").lazyload({
                              threshold : 100,
                              effect : "fadeIn",
                              container: $("#page-content-scroll")
                          });
                      });

                      $(".gallery a, .show-gallery").swipebox();
                  }
               };
               xhr.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_pictures&dir=" + dir.toString() , false);
                while (content.firstChild) {
                    content.removeChild(content.firstChild);
                    }
               xhr.send(dir);
               
 
}

function set_project_id(project_id)
{
    var json_response="";
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status==200 ){

            json_response = xhr.responseText;
            var result = JSON.parse(json_response);
            if (result.toString() == "OK")
                location.href="Project_Info.html";
        }
    };
    xhr.open("POST", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=set_project_id_for_project_info&project_id="+project_id.toString(), false);
    xhr.send();
}


function get_project_info()
{
    var xhr_project_info = new XMLHttpRequest();
    var json_response="";
    xhr_project_info.onreadystatechange = function(){
        if(xhr_project_info.readyState == 4 && xhr_project_info.status==200 ){

            json_response = xhr_project_info.responseText;
            var result = JSON.parse(json_response);
            if (result)
            {
                var adviser_text = document.getElementById("adviser_p");
                 var adviser_array = result[1];
                for (var j=0; j< adviser_array.length;j++) {
                    adviser_text.appendChild(document.createTextNode(adviser_array[j]));
                    adviser_text.appendChild(document.createElement("br"));
                }
                var student_text = document.getElementById("student_p");
                var student_array = result[0];
                for (var i=0;i<student_array.length;i++)
                {
                    student_text.appendChild(document.createTextNode(student_array[i][0]));
                    student_text.appendChild(document.createElement("br"));
                    /*var mail = "mailto:"+student_array[i][1]+"?subject=New Mail&body=Mail text body";
                    var mlink = document.createElement('a');
                    mlink.setAttribute('href', mail);
                    mlink.innerText="mail to: "+student_array[i][0];
                    td.appendChild(mlink);
                    td.appendChild(document.createElement("br"));*/
                }

            }
            var status_element = window.document.getElementById("status_p");
            var status_project = result[2][0].STATUSDESC;
            var project_name = result[3].PROJECTNAMEENG;
            var project_name_element = window.document.getElementById("project_name");
            var span = document.createElement("span");
            span.setAttribute("class","highlighted bg-blue-dark color-white");
            span.innerText="Project Status:";
            status_element.appendChild(span);
            status_element.appendChild(document.createTextNode(status_project));
            project_name_element.innerText = "Information for project: "+project_name;
        }
    };
    xhr_project_info.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_project_info", false);
    xhr_project_info.send();

}

function get_my_project_info()
{
    var xhr_project_info = new XMLHttpRequest();
    var json_response="";
    xhr_project_info.onreadystatechange = function(){
        if(xhr_project_info.readyState == 4 && xhr_project_info.status==200 ){

            json_response = xhr_project_info.responseText;
            var result = JSON.parse(json_response);
            if (result)
            {
                var adviser_text = document.getElementById("Adviser_Name");
                 var adviser_array = result[1];
                for (var j=0; j< adviser_array.length;j++) {
                    adviser_text.appendChild(document.createTextNode(adviser_array[j]));
                    adviser_text.appendChild(document.createElement("br"));
                }
                var student_text = document.getElementById("Students_Name");
                var student_array = result[0];
                for (var i=0;i<student_array.length;i++)
                {
                    student_text.appendChild(document.createTextNode(student_array[i][0]));
                    student_text.appendChild(document.createElement("br"));
                    /*var mail = "mailto:"+student_array[i][1]+"?subject=New Mail&body=Mail text body";
                    var mlink = document.createElement('a');
                    mlink.setAttribute('href', mail);
                    mlink.innerText="mail to: "+student_array[i][0];
                    td.appendChild(mlink);
                    td.appendChild(document.createElement("br"));*/
                }

            }
            var status_element = window.document.getElementById("Project_Status");
            var status_project = result[2][0].STATUSDESC;
            var project_name = result[3].PROJECTNAMEENG;
            var project_name_element = window.document.getElementById("project_name");
            var span = document.createElement("span");
            span.setAttribute("class","highlighted bg-blue-dark color-white");
            span.innerText="Project Status:";
            status_element.appendChild(span);
            status_element.appendChild(document.createTextNode(status_project));
            project_name_element.innerText = "Information for project: "+project_name;
        }
    };
    xhr_project_info.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_project_by_user_id", false);
    xhr_project_info.send();

}

function search_command()
{
    var year = window.document.getElementById("year_list").value;
    var student_name =window.document.getElementById("student_name").value;
    var adviser =window.document.getElementById("advisers_list").value;
    var project_name =window.document.getElementById("project_name").value;
   // var pathArray = window.location.pathname.split( '/' );
   // var redirect= pathArray[pathArray.length-2] ;//TODO: Test For Correct Redirect

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



function CreateSearchTable(db_result)
{
  
    var myTableDiv=document.getElementById("search_table");
    var tr = document.createElement('TR');
    var td = document.createElement('TD');
    td.setAttribute("class","table-title");
    td.innerText="Project ID";
    tr.appendChild(td);
    myTableDiv.appendChild(tr);
    td = document.createElement('TD');
    td.setAttribute("class","table-title");
    td.innerText="Project Name";
    tr.appendChild(td);
    myTableDiv.appendChild(tr);
    td = document.createElement('TD');
    td.setAttribute("class","table-title");
    td.innerText="Advisers";
    tr.appendChild(td);
    myTableDiv.appendChild(tr);
    for (var i=0; i<db_result.length; i++){
       tr = document.createElement('TR');
       if(i%2===0) tr.setAttribute("class","even");
       for (var j=0; j<3; j++){
           td = document.createElement('TD');
               td.setAttribute("class","table-sub-title");
           if (j===0)
           {
               var link = document.createElement("a");
                link.setAttribute('href', "javascript:set_project_id(\""+db_result[i][j]+"\")");
                var linkText = document.createTextNode(db_result[i][j].substring(2));
               link.appendChild(linkText);
                td.appendChild(link);
              // project_id_link.setAttribute('href', "javascript:set_project_id(\""+db_result[i][j]+"\")");
              // td.appendChild(project_id_link);
           }
           else
            td.innerText=db_result[i][j];
            tr.appendChild(td);
            myTableDiv.appendChild(tr);
       }
    }
   
}


function getFullName()
{

    var xhr = new XMLHttpRequest();
    var json_response="";
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status==200 ){

            json_response = xhr.responseText;
            var result = JSON.parse(json_response);
            return result;
        }
    };
    xhr.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_user_name", false);
    xhr.send();

}