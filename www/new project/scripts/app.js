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

    var year_list = document.getElementById("year_suggestion");
    if (year_list !== null) {
        var start_year = 2017;
        var end_year = 2020;
        for (var i = start_year; i >= start_year && i <= end_year; i++) {
            var newYearListItem = document.createElement("option");
            newYearListItem.textContent = i.toString();
            year_list.appendChild(newYearListItem);
            newYearListItem.setAttribute("value", i.toString());
        }
    }

    var adviser_name_sugg = document.getElementById("Senior_Adviser_Name");
    if (adviser_name_sugg!==null)
    {
        var xhr = new XMLHttpRequest();
        var json_response="";
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status==200 ){

                json_response = xhr.responseText;
                var result = JSON.parse(json_response);
                var user_full_name = result.USERLASTNAMEENG+" "+result.USERFIRSTNAMEENG;
                adviser_name_sugg.value =  result.USERID;
            }
        };
        xhr.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_user_name", false);
        xhr.send();
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
                    advisersListItem.setAttribute("value",result[i].first_name+"_"+result[i].last_name);
                    advisers_list.appendChild(advisersListItem);
                }
            }
        };
        xhr.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_advisers_list", false);
        xhr.send();
    }

    var advisers_list = document.getElementById("second_advisers_list");
    var advisers_list2 = document.getElementById("second_advisers_list2");
    if(advisers_list!==null || advisers_list2!==null)
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
                    advisersListItem.textContent=result[i].FULLNAME;
                    advisersListItem.setAttribute("value",result[i].USERID);
                    advisers_list.appendChild(advisersListItem);
                    if (advisers_list2!==null)
                    {
                        var advisersListItem=document.createElement("option");
                        advisersListItem.textContent=result[i].FULLNAME;
                        advisersListItem.setAttribute("value",result[i].USERID);
                        advisers_list2.appendChild(advisersListItem);
                    }
                }
            }
        };
        xhr.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_second_advisers_list", false);
        xhr.send();
    }


    var company_list=document.getElementById("company_list");
    if(company_list!==null)
    {
        var xhr = new XMLHttpRequest();
        var json_response="";
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status==200 ){

                json_response = xhr.responseText;
                var result = JSON.parse(json_response);
                for(var i=0; i<result.length;i++)
                {
                    var companyItem=document.createElement("option");
                    var company_name = result[i].COMPANYNAMEENG;
                    companyItem.textContent=company_name;
                    companyItem.setAttribute("value",company_name);
                    company_list.appendChild(companyItem);
                }
            }
        };
        xhr.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_companies", false);
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
        var xhr = new XMLHttpRequest();
        var json_response="";
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status==200 ){

                json_response = xhr.responseText;
                var result = JSON.parse(json_response);
                var user_full_name = result.USERFIRSTNAMEENG+" "+result.USERLASTNAMEENG;
                var h = window.document.createElement("h4");
                h.innerText = "Welcome " + user_full_name+"!";
                welcome_user_div.appendChild(h);
            }
        };
        xhr.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_user_name", false);
        xhr.send();
    }
    
     var my_project_info=document.getElementById("Fourth_Year_Project_Info");
    if (my_project_info!==null) {
        get_my_project_info();
        createGradesTable();
        createLogTable();
        createSubmissionDatesTable();
    }

    
    var session_registration=document.getElementById("Session_Registration");
    if(session_registration!==null)
        get_session_registration_info();

    var messages = document.getElementById("Messages");
    if(messages!==null)
        get_messages();

    var user_info = window.document.getElementById("user_info");
    if (user_info!==null)
    {
        get_user_info();
    }
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
                if (student_array) {
                    for (var i = 0; i < student_array.length; i++) {
                        student_text.appendChild(document.createTextNode(student_array[i][0]));
                        student_text.appendChild(document.createElement("br"));
                    }
                }
                var project_name = result[2].PROJECTNAMEENG;
                var abstract = result[3].ABSTRACTHEB;
                var project_name_element = window.document.getElementById("project_name");
                project_name_element.innerText = project_name;
                var abstract_element = window.document.getElementById("abstract_p");
                abstract_element.innerText = abstract;
            }
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
            var project_name_element = window.document.getElementById("Project_Name");
            var span = document.createElement("span");
            var abstract_element = window.document.getElementById("Project_Abstract");
            if (result[4])
                abstract_element.innerText=result[4].ABSTRACTENG;
            span.setAttribute("class","highlighted bg-orange-dark color-white");
            span.innerText="Project Status:";
            status_element.appendChild(span);
            status_element.appendChild(document.createTextNode(status_project));
            project_name_element.innerText = project_name;
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

function createGradesTable()
{
    var xhr_grades_info = new XMLHttpRequest();
    var json_response="";
    xhr_grades_info.onreadystatechange = function(){
        if(xhr_grades_info.readyState == 4 && xhr_grades_info.status==200 ){
            json_response = xhr_grades_info.responseText;
            var grades = JSON.parse(json_response);
            var grade_table = window.document.getElementById("grades");
            var tr = document.createElement('TR');
            var td = document.createElement('TD');
            td.setAttribute("class","table-title");
            td.innerText="Status";
            tr.appendChild(td);
            grade_table.appendChild(tr);
            td = document.createElement('TD');
            td.setAttribute("class","table-title");
            td.innerText="Grade";
            tr.appendChild(td);
            grade_table.appendChild(tr);
            for (var i=0; i<grades.length; i++){
                tr = document.createElement('TR');
                if(i%2===0) tr.setAttribute("class","even");
                td = document.createElement('TD');
                td.setAttribute("class","table-sub-title");
                td.innerText=grades[i].status;
                tr.appendChild(td);
                grade_table.appendChild(tr);
                td = document.createElement('TD');
                td.setAttribute("class","table-sub-title");
                td.innerText=grades[i].grade;
                tr.appendChild(td);
                grade_table.appendChild(tr);
            }
        }
    };
    xhr_grades_info.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_student_grades", false);
    xhr_grades_info.send();
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


function get_session_registration_info()
{
    var session_registration=document.getElementById("Session_Registration");
    var xhr_project_info = new XMLHttpRequest();
    var json_response="";
    xhr_project_info.onreadystatechange = function(){
        if(xhr_project_info.readyState == 4 && xhr_project_info.status==200 ){
            json_response = xhr_project_info.responseText;
            var result = JSON.parse(json_response);
            if (result)
            {
                for (var j=0; j<result.length;j++)
                {
                    var session = window.document.createElement("button");
                    session.setAttribute("class","accordion");
                    var div= document.createElement("div")
                    div.setAttribute("class","panel");

                    session.innerText = result[j].HEAD + " " + result[j].START_TIME+"-"+result[j].END_TIME;
                    var p = window.document.createElement("p");
                    p.innerHTML =  result[j].HEAD + "<br> Building: "+result[j].BUILDING+" Room: "+result[j].ROOM + "<br> <i>"+result[j].START_TIME+"-"+result[j].END_TIME +"</i><br>"+"Remaining Seats: "+result[j].SEATS;
                    div.appendChild(p);
                    /*var register_button = window.document.createElement("button");
                    register_button.setAttribute("onClick","session_register()");
                    div.appendChild(register_button);*/
                    /*var div= document.createElement("div");
                    div.setAttribute("class","portfolio-item");
                    var header=document.createElement("h4");
                    header.innerText=result[j].HEAD;
                    div.appendChild(header);
                    var emLocation=document.createElement("em");
                    emLocation.innerText="Building: "+result[j].BUILDING+" Room: "+result[j].ROOM;
                    div.appendChild(emLocation);
                    div.appendChild(document.createElement("br"));
                    var emTime=document.createElement("em");
                    emTime.innerText=result[j].START_TIME+"-"+result[j].END_TIME;
                    div.appendChild(emTime);
                    var pCounter=document.createElement("h4");
                    pCounter.innerText="Remaining Seats: "+result[j].SEATS;
                    div.appendChild(pCounter);
                    var vButton=document.createElement("a");//TODO: add onclick!
                    vButton.setAttribute("class","user-item-icon-1 bg-green-dark scale-hover");
                    vButton.setAttribute("id",result[j].ID);
                    var ivButton=document.createElement("i");
                    ivButton.setAttribute("class","fa fa-check");
                    vButton.appendChild(ivButton);
                    var xButton=document.createElement("a");
                    xButton.setAttribute("class","user-item-icon-2 bg-red-dark scale-hover");
                    xButton.setAttribute("id",result[j].ID);
                    var ixButton=document.createElement("i");
                    ixButton.setAttribute("class","fa fa-time");
                    xButton.appendChild(ixButton);
                    if(result[j].SEATS>0) {
                        div.appendChild(vButton);
                    }
                    div.appendChild(xButton);
                               */
                    session_registration.appendChild(session);
                    session_registration.appendChild(div);
                }

            }
         
        }
    };
    xhr_project_info.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_conference_sessions", false);
    xhr_project_info.send();

}


function createLogTable()
{
    var xhr_log_info = new XMLHttpRequest();
    var json_response="";
    xhr_log_info.onreadystatechange = function(){
        if(xhr_log_info.readyState == 4 && xhr_log_info.status==200 ){
            json_response = xhr_log_info.responseText;
            var logs = JSON.parse(json_response);
            var log_table = window.document.getElementById("log");
            var tr = document.createElement('TR');
            var td = document.createElement('TD');
            td.setAttribute("class","table-title");
            td.innerText="Date";
            tr.appendChild(td);
            log_table.appendChild(tr);
            td = document.createElement('TD');
            td.setAttribute("class","table-title");
            td.innerText="Name";
            tr.appendChild(td);
            log_table.appendChild(tr);
            td = document.createElement('TD');
            td.setAttribute("class","table-title");
            td.innerText="Action";
            tr.appendChild(td);
            log_table.appendChild(tr);
            for (var i=0; i<logs.length; i++){
                tr = document.createElement('TR');
                if(i%2===0) tr.setAttribute("class","even");
                td = document.createElement('TD');
                td.setAttribute("class","table-sub-title");
                td.innerText=logs[i].TIMEDATE;
                tr.appendChild(td);
                log_table.appendChild(tr);
                td = document.createElement('TD');
                td.setAttribute("class","table-sub-title");
                td.innerText=logs[i].USERNAME;
                tr.appendChild(td);
                log_table.appendChild(tr);
                td = document.createElement('TD');
                td.setAttribute("class","table-sub-title");
                td.innerText=logs[i].ACTION;
                tr.appendChild(td);
                log_table.appendChild(tr);
            }
        }
    };
    xhr_log_info.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_project_log", false);
    xhr_log_info.send();
}


function createSubmissionDatesTable()
{
    var xhr_dates_info = new XMLHttpRequest();
    var json_response="";
    xhr_dates_info.onreadystatechange = function(){
        if(xhr_dates_info.readyState == 4 && xhr_dates_info.status==200 ){
            json_response = xhr_dates_info.responseText;
            var dates = JSON.parse(json_response);
            var pdr_sub = window.document.getElementById("pdr_sub");
            pdr_sub.innerText = dates.pdr_sub;
            var pdr_ret = window.document.getElementById("pdr_ret");
            pdr_ret.innerText = dates.pdr_ret;
            var pdr_cor = window.document.getElementById("pdr_cor");
            pdr_cor.innerText = dates.pdr_cor_sub;
            var pdr_cor_ret = window.document.getElementById("pdr_cor_ret");
            pdr_cor_ret.innerText = dates.pdr_cor_ret;
            var pre_sub = window.document.getElementById("pre_sub");
            pre_sub.innerText = dates.pre_sub;
            var pre_ret = window.document.getElementById("pre_ret");
            pre_ret.innerText = dates.pre_ret;
            var pre_cor = window.document.getElementById("pre_cor");
            pre_cor.innerText = dates.pre_cor_sub;
            var pre_cor_ret = window.document.getElementById("pre_cor_ret");
            pre_cor_ret.innerText = dates.pdr_cor_ret;
            var prog_sub = window.document.getElementById("prog_sub");
            prog_sub.innerText = dates.pro_sub;
            var prog_ret = window.document.getElementById("prog_ret");
            prog_ret.innerText = dates.pro_ret;
            var prog_cor = window.document.getElementById("prog_cor");
            prog_cor.innerText = dates.pro_cor_sub;
            var prog_cor_ret = window.document.getElementById("prog_cor_ret");
            prog_cor_ret.innerText = dates.pro_cor_ret;
            var prog2_sub = window.document.getElementById("prog2_sub");
            prog2_sub.innerText = dates.pro_2_sub;
            var prog2_ret = window.document.getElementById("prog2_ret");
            prog2_ret.innerText = dates.pro_2_ret;
            var prog2_cor = window.document.getElementById("prog2_cor");
            prog2_cor.innerText = dates.pro_cor_2_sub;
            var prog2_cor_ret = window.document.getElementById("prog2_cor_ret");
            prog2_cor_ret.innerText = dates.pro_cor_2_ret;
            var poster = window.document.getElementById("poster");
            poster.innerText = dates.poster;
            var presentation = window.document.getElementById("presentation");
            presentation.innerText = dates.presentation;
            var final_sub = window.document.getElementById("final_sub");
            final_sub.innerText = dates.fin_sub;
            var final_ret = window.document.getElementById("final_ret");
            final_ret.innerText = dates.fin_ret;
            var final_cor = window.document.getElementById("final_cor");
            final_cor.innerText = dates.fin_cor_sub;
            var final_cor_ret = window.document.getElementById("final_cor_ret");
            final_cor_ret.innerText = dates.fin_cor_ret;
        }
    };
    xhr_dates_info.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_project_dates", false);
    xhr_dates_info.send();
}


function get_messages()
{
    var messages=document.getElementById("Messages");
    var xhr_messages = new XMLHttpRequest();
    var json_response="";
    xhr_messages.onreadystatechange = function(){
        if(xhr_messages.readyState == 4 && xhr_messages.status==200 ){
            json_response = xhr_messages.responseText;
            var result = JSON.parse(json_response);
            if (result)
            {
                for (var j=0; j<result.length;j++)
                {
                    var div= window.document.createElement("div");
                    div.setAttribute("class","activity-item one-half-responsive");
                    var iElement = window.document.createElement("i");
                    iElement.setAttribute("class","fa fa-info bg-blue-dark activity-item-icon");
                    div.appendChild(iElement);
                    var header=window.document.createElement("h5");
                    header.innerText=result[j].TITLE;
                    div.appendChild(header);
                    var emTime=window.document.createElement("em");
                    emTime.innerText=result[j].TIMEDATE;
                    div.appendChild(emTime);
                    var content=window.document.createElement("p");
                    content.setAttribute("class","half-bottom");
                    content.innerText=result[j].CONTENT;
                    div.appendChild(content);
                    div.appendChild(window.document.createElement("br"));
                    if (result[j].LINK)
                    {
                        var prefix_link = "/zf/public/data/Messages/";
                        var link = window.document.createElement("a");
                        link.setAttribute("href",prefix_link+result[j].LINK);
                        link.innerText = "download";
                        div.appendChild(link);
                    }
                    div.appendChild(window.document.createElement("hr"));
                    div.appendChild(window.document.createElement("br"));
                    messages.appendChild(div);
                }
            }

        }
    };
    xhr_messages.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_messages", false);
    xhr_messages.send();
}


function submitProjectSuggestion() {
    var isValidForm = true;
    var year = window.document.getElementById("year_suggestion").value;
    if (year === "") {
        isValidForm = false;
        window.document.getElementById("year_suggestion").style.borderColor="red";
    }
    var project_name_heb = window.document.getElementById("Project_Name_Heb").value;
    if (project_name_heb === "") {
        isValidForm = false;
        window.document.getElementById("Project_Name_Heb").style.borderColor="red";
    }
    var project_name_eng = window.document.getElementById("Project_Name_Eng").value;
    if (project_name_eng === "") {
        isValidForm = false;
        window.document.getElementById("Project_Name_Eng").style.borderColor="red";
    }
    var senior_adviser = window.document.getElementById("Senior_Adviser_Name").value;
    if (senior_adviser === "") {
        isValidForm = false;
        window.document.getElementById("Senior_Adviser_Name").style.borderColor="red";
    }
    var second_adviser = window.document.getElementById("second_advisers_list").value;
    var third_adviser = window.document.getElementById("second_advisers_list2").value;
    var abstract_heb = window.document.getElementById("abstract_heb").value;
    if (abstract_heb === "") {
        isValidForm = false;
        window.document.getElementById("abstract_heb").style.borderColor="red";
    }
    var abstract_eng = window.document.getElementById("abstract_eng").value;
    if (abstract_eng === "") {
        isValidForm = false;
        window.document.getElementById("abstract_eng").style.borderColor="red";
    }
    var company = window.document.getElementById("company_list").value;
    var keywords = window.document.getElementById("keywords").value;
    if (keywords === "") {
        isValidForm = false;
        window.document.getElementById("keywords").style.borderColor="red";
    }
    if (!isValidForm) {
        alert("one of the fields is missing");
    }
    else
    {
        var json_response="";
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status==200 ){

                json_response = xhr.responseText;
                var result = JSON.parse(json_response);
                if (result.toString() == "OK")
                    alert("Suggested Project Successfully!");
            }
        };
        xhr.open("POST", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=suggest_project&year="+year.toString()+"&project_name_heb="+project_name_heb.toString()+"&project_name_eng="+project_name_eng.toString()+"&senior_adviser="+senior_adviser.toString()+"&second_adviser="+second_adviser.toString()+"&third_adviser="+third_adviser.toString()+"&abstract_heb="+abstract_heb.toString()+"&abstract_eng="+abstract_eng.toString()+"&company="+company.toString()+"&keywords="+keywords.toString(), false);
        xhr.send(year,project_name_heb,project_name_eng,senior_adviser,second_adviser,third_adviser,abstract_heb,abstract_eng,company,keywords);
    }
}


function get_user_info()
{
    var info_name = window.document.getElementById("info_name");
    var info_title = window.document.getElementById("info_title");
    var info_phone = window.document.getElementById("info_phone");
    var info_mail = window.document.getElementById("info_mail");
    var info_address = window.document.getElementById("info_address");
    var info_id = window.document.getElementById("info_id");
    var info_image = window.document.getElementById("info_image");
    var info_resume = window.document.getElementById("info_resume");
    var info_grades = window.document.getElementById("info_grades");
    var json_response="";
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status==200 ){

            json_response = xhr.responseText;
            var result = JSON.parse(json_response);
            if (result)
            {
                info_name.innerText = result.NAME.USERLASTNAMEENG+" " +result.NAME.USERFIRSTNAMEENG;
                var id=result.NAME.USERID;
                info_id.innerText = "ID: "+id;
                if (result.TITLE)
                    info_title.innerText = result.TITLE;
                info_address.innerHTML = "<i class='fa fa-location-arrow'></i>"+result.ADDRESS;
                info_mail.innerHTML = "<i class='fa fa-envelope'></i>"+result.EMAIL;
                info_phone.innerHTML ="<i class='fa fa-phone'></i>"+result.PHONE;
                info_image.setAttribute("data-original","/StudentsResumeAndGrades/"+id+'/'+result.IMAGE);

                //Preload Image

                $(function() {
                    $(".preload-image").lazyload({
                        threshold : 100,
                        effect : "fadeIn",
                        container: $("#page-content-scroll")
                    });
                });
                //href on projects.ee.bgu.ac.il: Data/Students_Photos/2017/id.jpg
                info_resume.setAttribute("href","/StudentsResumeAndGrades/"+id+'/'+"resume.pdf");
                info_resume.innerText = "Resume";
                info_grades.setAttribute("href","/StudentsResumeAndGrades/"+id+'/'+"grades.pdf");
                info_grades.innerText = "Grades";
            }
        }
    };
    xhr.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_my_info", false);
    xhr.send();
}