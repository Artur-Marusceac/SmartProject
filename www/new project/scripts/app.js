/*jslint browser:true, devel:true, white:true, vars:true */



function PicturesFromDir(){
    var xhr = new XMLHttpRequest();
    //var year = document.getElementById("year_l    ist").value;
    var year= 2012;
    var dir = year;
    var j=0;
    var content=document.getElementById("box");
    var json_response="";
            xhr.onreadystatechange = function(){
                  if(xhr.readyState == 4 && xhr.status==200 ){
                    json_response = xhr.responseText;
                    var result = JSON.parse(json_response);
         
                          for (var i = 0; i < result.length; i++) {
                            var td = document.createElement('div');
                            td.setAttribute("class","portfolio-item") ;
                              
                            var td2 = document.createElement('a');
                            td2.setAttribute("class","show-gallery") ;
                            td2.setAttribute("href","/Data/Conference/"+dir+'/'+result[i]) ;
                          
        
                            var td3 = document.createElement('img');
                            td3.setAttribute("data-original","/Data/Conference/"+dir+'/'+result[i]) ;
                            td3.setAttribute("alt","img");
                            td3.setAttribute("class","preload-image responsive-image");
                    
                        
                            td2.appendChild(td3);
                            td.appendChild(td2);
                            content.appendChild(td);
                            }
                    
                            
                            
                      
                //   ajaxDisplay.innerHTML = result.validateUserResult;
                //    ajaxDisplay.innerHTML = json_response;
                  }
               };
               //xhr.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_pictures&dir=" + dir.toString() , false);
                xhr.open("GET", "http://smartprojects.ee.bgu.ac.il/zf/test/SmartProject/server/api.php?action=get_pictures&dir=" + 2012 , false);
                while (content.firstChild) {
                    content.removeChild(content.firstChild);
                    }
               xhr.send(dir);
               
 
}
                    