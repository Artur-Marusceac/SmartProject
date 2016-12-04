


<?php


$root = "/var/www/html/zf";

//error_reporting(E_ALL | E_STRICT);
ini_set('display_errors', 0);

set_include_path('.' .  PATH_SEPARATOR . $root.'/library'
    // . PATH_SEPARATOR . '/opt/ZF/library'
    . PATH_SEPARATOR . $root.'/public'
    . PATH_SEPARATOR . '/opt/ZF/extras/library'
    . PATH_SEPARATOR . '/opt/'
    . PATH_SEPARATOR . get_include_path());

include "Zend/Loader.php";
Zend_Loader::registerAutoload();

//load configuration

$configLink = new Zend_Config_Ini($root.'/config/configDBLink.ini', 'general');
$config = new Zend_Config_Ini($root.'/config/config.ini', 'general');
$registry = Zend_Registry::getInstance();
$registry->set('config', $config);


$yearsData = new Zend_Config_Ini('/var/www/html/yearsData.ini','yearsData',array('allowModifications' => true));
$registry->set('yearsData',$yearsData);

//setup database
$dbLink = Zend_Db::factory('oracle',$configLink->db);
$db = Zend_Db::factory('Mysqli', $config->db);
Zend_Db_Table::setDefaultAdapter($db);
//$registry->set('db', $db);
Zend_Registry::set('db', $db);
Zend_Registry::set('dbLink',$dbLink);

$db->query("SET NAMES 'utf8'");





function search_project($year,$student_name,$adviser,$project_name)
{
                $db=Zend_Registry::get('db');
                $select = $db->select()

                             ->from('PROJECTSUGGESTIONS',
                                     array('PROJECTID', 'PROJECTNAMEENG',  'PROJECTNAMEHEB', 'SUBMITEDBY',/*'COMPANYID',*/ 'TAKEN'))
                ;
                $order = 'PROJECTSUGGESTIONS.PROJECTID';

                return $year;
                
                if ($year){
                    $where_year = "PROJECTSUGGESTIONS.PROJECTID like '%$year%'";
                    $select->where($where_year);
                }else{
                    //search for all years - display search resalts in descending order
                    $order = $order.' DESC';
                }
                if ($project_name){

                    $words_list = explode(" ",  $project_name);
                    foreach ($words_list as $word){
                        /* search is case insensetive - option 'i' in REGEXP_LIKE */
                            $select->where( "PROJECTNAMEENG LIKE '%$word%'"); /* Bind variable */
                    }
                }
                 $select->joinLeft('ADVISERSUGGESTIONS',
                                   'PROJECTSUGGESTIONS.PROJECTID = ADVISERSUGGESTIONS.PROJECTID',
                                   array('ADVISERID', 'ADVISERNUMBER'))
                            //->where('ADVISERSUGGESTIONS.ADVISERNUMBER = 1')
                 ;
                
                if ($adviser){
													$select_adviser_id = $this->db->select()
														->from('USERS',	array('USERID'))
														->where('USERNAME = ?', $adviser);
													$adviserid = $this->db->fetchRow($select_adviser_id);
                          $select->where('ADVISERSUGGESTIONS.ADVISERID = ?', $adviserid);

                }
                else{//Important: to prevent multiple same rows in case when adviser wasn't selected
                     $select->where('ADVISERSUGGESTIONS.ADVISERNUMBER = 1');
                }
                 if ($student_name){

                    $select->joinInner('STUDENTS_DATA',
                                       'PROJECTSUGGESTIONS.PROJECTID = STUDENTS_DATA.PROJECTID',
                                       array('USERFULLNAMEENG'))
                    ;
                    $names_list = explode(" ",  $student_name);
                    //Zend_Debug::dump($names_list , 'names_list ', true);
                    foreach ($names_list as $name){
                            $select->where( "USERFULLNAMEENG LIKE '%$name%' ",  $name);
                    }
                }
                $select->order($order);
                $projects = $db->fetchAll($select);
                $advisers_names = $db->fetchPairs("SELECT   CONCAT(IFNULL(PROJECTID, ''),'_',IFNULL(ADVISERNUMBER, '')), USERFULLNAMEENG  FROM ADVISERSUGGESTIONS_DATA ");
                $students_names =  $db->fetchPairs("SELECT USERFULLNAMEENG, PROJECTID FROM STUDENTSPROJECTS_DATA");
                
                return $select;
            }
    


/*function search_project($year,$student_name,$adviser,$project_name)
{

    $sql = "SELECT sug.PROJECTID, sug.PROJECTNAMEENG,dat.USERFULLNAMEENG FROM PROJECTSUGGESTIONS sug,STUDENTS_DATA dat,USERS usr, ADVISERSUGGESTIONS ad WHERE sug.PROJECTID = dat.PROJECTID AND ad.PROJECTID=sug.PROJECTID AND ";

    if ($adviser!="All")
    {
        $name = explode(" ", $adviser);
        $sql = $sql . "ad.ADVISERID=usr.USERID AND usr.USERFIRSTNAMEENG='".$name[0]."' AND usr.USERLASTNAMEENG='".$name[1]."' OR (" ;
    }
    if ($year!="All")
        $sql= $sql."sug.PROJECTID like '%".$year."%' OR ";
    if ($project_name!="") {
        $words_list = explode(" ", $project_name);
        $project_sql="";
        foreach ($words_list as $word) {
            if ($project_sql!="")
                $project_sql= $project_sql. "OR sug.PROJECTNAMEENG LIKE '%".$word."%' ";
            else
                $project_sql= $project_sql. "sug.PROJECTNAMEENG LIKE '%".$word."%' ";
        }
        $project_sql= $project_sql. " OR ";
        $sql = $sql. $project_sql;
    }
    if ($student_name!="")
    {
        $sql = $sql. "dat.USERFULLNAMEENG LIKE '%".$student_name."%'";
    }
    $sql = $sql.')';
    $conn = get_connection();
    $search_result=array();
    $result = $conn->query($sql);
    $adviser_sql = "SELECT USERS.USERFIRSTNAMEENG,USERS.USERLASTNAMEENG FROM USERS,ADVISERSUGGESTIONS WHERE USERS.USERID =ADVISERSUGGESTIONS.ADVISERID AND ADVISERSUGGESTIONS.PROJECTID=";
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $adviser_sql=$adviser_sql."'".$row["projectid"]."'";
            $adviser_result = $conn->query($sql);
            while($row_adviser = $adviser_result->fetch_assoc()) {
                $search_res_row = array("id"=>$row["projectid"],"name" => $row["projectnameeng"],"user_name"=>$row["userfullnameeng"],"adviser"=>$row_adviser["userfirstnameeng"].$row_adviser["userlastnameeng"]);
                array_push($search_result,$search_res_row);
            }
        }
    }
    return json_encode($search_result);
}*/


function get_pictures($dir){
    
    // image extensions
$extensions = array('jpg', 'jpeg', 'png', 'gif', 'bmp');

// init result
$result = array();
    
// directory to scan
    $dirTest= '/var/www/html/Data/Conference/'.$dir.'/';
$directory = new DirectoryIterator('/var/www/html/Data/Conference/'.$dir.'/');
//$directory = new DirectoryIterator('/var/www/html/Data/Conference/2008/');
// iterate
foreach ($directory as $fileinfo) {
    // must be a file
    if ($fileinfo->isFile()) {
        // file extension
        $extension = strtolower(pathinfo($fileinfo->getFilename(), PATHINFO_EXTENSION));
        // check if extension match
        if (in_array($extension, $extensions)) {
            // add to result
            $result[] = $fileinfo->getFilename();
        }
    }
}
// print result
    
   return $result;
   //return json_encode(array($dirTest,$dir));
}

function get_connection(){
    $conn = NULL;
    $servername = "localhost";
    $username = "root";
    $password = "smart2016";
    $database = "PROJECTS";

    $conn = mysqli_connect($servername, $username, $password, $database);

    if (mysqli_connect_errno()) {
        die('Not connected : ' . mysql_error());
    }else{
        //echo "connected to mysql  ";
    }
    
    return $conn;
}


function bgu_login($username,$password)
{

    $client = new SoapClient("https://w3.bgu.ac.il/BguAuthWebService/AuthenticationProvider.asmx?WSDL");
   // var_dump($client->__getFunctions());
    $params = array(
    "uname" => $username,
        "pwd" => $password,
     );
    $check =$client->__soapCall("validateUser", array($params));
    return $check;
    
}

function get_user_list()
{
  $sql = "SELECT id, first_name, last_name, age FROM users";
   $conn = get_connection();
   $result = $conn->query($sql);    
    $user_list = array();
    if ($result->num_rows > 0) {
    // output data of each row
        while($row = $result->fetch_assoc()) {
            $curr_user = array("id" => $row["id"], "name" => $row["first_name"]);
            array_push($user_list,$curr_user);
        }

   }   

 json_encode($user_list);  
 return $user_list;

}

function is_user_exist($username, $id)
{
    $sql = "Select id FROM users WHERE id = '" .$id ."' and first_name= '". $username ."'";
    $conn = get_connection();
    $result = $conn->query($sql);  
    if ($result->num_rows > 0) {
         while($row = $result->fetch_assoc()) {
            return json_encode(array("id" => $row["id"]));
         }
    }
}


function get_advisers_list()
{
    $sql = "SELECT `USERFIRSTNAMEENG`,`USERLASTNAMEENG` FROM `USERS` WHERE `USERTYPE`>=128";
    $conn = get_connection();
    $result = $conn->query($sql);
    $advisers_list = array();
    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            $adviser = array("first_name" => $row["USERFIRSTNAMEENG"], "last_name" => $row["USERLASTNAMEENG"]);
            array_push($advisers_list,$adviser);
        }
    }
    json_encode($advisers_list);
    return $advisers_list;

}


$possible_url = array("get_user_list", "get_user","is_user_exist","bgu_login","get_advisers_list","get_pictures","search_project");

$value = "An error has occurred";

if (isset($_GET["action"]) && in_array($_GET["action"], $possible_url))
{
  switch ($_GET["action"])
    {
      case "get_user_list":
        $value = get_user_list();
        break;
      case "get_user":
        if (isset($_GET["id"]))
          $value = get_user_by_id($_GET["id"]);
          else
          $value = "Missing argument";
        break;
     case "get_pictures":
        $value = get_pictures($_GET["dir"]);
        break;
      case "is_user_exist":
          $value = is_user_exist($_GET["username"],$_GET["id"]);
          break;    
      case "bgu_login":
          $value = bgu_login($_GET["username"],$_GET["password"]);
          break;
      case "get_advisers_list":
          $value = get_advisers_list();
          break;
    case "search_project":
          $value = search_project($_GET["year"],$_GET["student_name"],$_GET["adviser"],$_GET["project_name"]);
          break;
  }
}

exit(json_encode($value));

?>
