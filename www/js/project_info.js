/**
 * Created by Alon on 14/12/2016.
 */

var proj_id;
function set_project_id(project_id)
{
    proj_id=project_id;
    info_page=false;
    location.href="Project_Info.html";
}

function get_project_info() {
    var id = window.document.getElementById("info_id").value;
    var xhr_project_info = new XMLHttpRequest();
    var json_response = "";
    xhr_project_info.onreadystatechange = function () {
        if (xhr_project_info.readyState == 4 && xhr_project_info.status == 200) {

            json_response = xhr_project_info.responseText;
            var result = JSON.parse(json_response);
            if (result) {

                var myTableDiv = document.getElementById("info_table");
                var table = document.createElement('TABLE');
                var tableBody = document.createElement('TBODY');

                table.appendChild(tableBody);

                var tr = document.createElement('TR');
                tableBody.appendChild(tr);
                var td = document.createElement('TD');
                td.appendChild(document.createTextNode("Advisers"));
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
                for (var j = 0; j < adviser_array.length; j++) {
                    td.appendChild(document.createTextNode(adviser_array[j]));
                    td.appendChild(document.createElement("br"));
                }
                tr.appendChild(td);
                var student_array = result[0];
                td = document.createElement('TD');
                for (var i = 0; i < student_array.length; i++) {
                    td.appendChild(document.createTextNode(student_array[i][0]));
                    td.appendChild(document.createElement("br"));
                }
                tr.appendChild(td);
                td = document.createElement('TD');
                for (var i = 0; i < student_array.length; i++) {
                    var mail = "mailto:" + student_array[i][1] + "?subject=New Mail&body=Mail text body";
                    var mlink = document.createElement('a');
                    mlink.setAttribute('href', mail);
                    mlink.innerText = "mail to: " + student_array[i][0];
                    td.appendChild(mlink);
                    td.appendChild(document.createElement("br"));
                }
                tr.appendChild(td);
            }
            myTableDiv.appendChild(table);
            var status_element = window.document.getElementById("status_project");
            var status_project = result[2][0]["STATUSDESC"];
            status_element.innerText = "Project Status: " + status_project;
        }
    };
    if (info_page) { //TODO: when the session id will be implemented, take it from there in the php and send it as an argument. the request will not send argument
        xhr_project_info.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_project_by_user_id&user_id=" + id.toString(), false);
        xhr_project_info.send(id);
    }
    else {  //TODO: set global param for project_id and change it when click
        xhr_project_info.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_project_by_project_id&project_id=" + proj_id.toString(), false);
        xhr_project_info.send(proj_id);
        info_page = true;
    }
}

window.onload= function()
{
    get_project_info();
}