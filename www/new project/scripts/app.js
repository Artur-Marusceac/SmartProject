/*jslint browser:true, devel:true, white:true, vars:true */

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
}

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
                           
                            
                            td2.setAttribute("class","responsive-image");
                              td2.setAttribute("src","/Data/Conference/"+dir+'/'+result[i]) ;
                              //td2.setAttribute("data-original","/Data/Conference/"+dir+'/'+result[i]) ;
                             td2.setAttribute("alt","img");
                            
                            td.appendChild(td2);
                            content.appendChild(td);

                            }
                      $(".gallery a, .show-gallery").swipebox();
                  }
               };
               xhr.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_pictures&dir=" + dir.toString() , false);
                while (content.firstChild) {
                    content.removeChild(content.firstChild);
                    }
               xhr.send(dir);
               
 
}
                    