


<?php

session_start();
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


    if ($year!="All"){
        $where_year = "PROJECTSUGGESTIONS.PROJECTID like '%$year%'";
        $select->where($where_year);
    }else{
        //search for all years - display search resalts in descending order
        $order = $order.' DESC';
    }
    if ($project_name!=""){

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

    if ($adviser!="All"){
        $adviser_split = explode('_',$adviser);
        $select_adviser_id = $db->select()
            ->from('USERS',	array('USERID'))
            ->where('USERFIRSTNAMEENG = ?', $adviser_split[0])
            ->where('USERLASTNAMEENG = ?', $adviser_split[1]);
        $adviserid = $db->fetchRow($select_adviser_id);
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
    $results = array();
    foreach (array_keys($projects) as $key) {
        $proj_id = $projects[$key]["PROJECTID"];
        $proj_name = $projects[$key]["PROJECTNAMEENG"];
        $adviser_name =  $advisers_names[$proj_id."_1"];
        if ($advisers_names[$proj_id."_2"])
            $adviser_name=$adviser_name.",".$advisers_names[$proj_id."_2"];
        $student_name = array_keys($students_names,$proj_id);
        array_push($results,array($proj_id,$proj_name,$adviser_name,$student_name));
    }
    $_SESSION["search_results"] = $results;
    if ($results)
        return true;
    else
        return false;
}

function get_search_results()
{
    if ($_SESSION["search_results"])
        return $_SESSION["search_results"];
}

function get_project_info_by_user_id($student_id)
{
    $db = Zend_Registry::get('db');
    $select=$db->select() ->from('STUDENTS_DATA',
        array('TAKENPROJECTID', 'PROJECTID', 'STATUS'))
        ->where('STUDENTS_DATA.USERID = ?', $student_id);
    $ids = $db->fetchRow($select);
    $proj_id = $ids["PROJECTID"];
    $taken_proj_id = $ids["TAKENPROJECTID"];

    $students = getProjectStudents($proj_id);
    $advisors = getProjectAdvisers($proj_id);
    $status = getProjectStatus($proj_id);
    $abstract = getUpdatedAbstract($proj_id);
    $proj_name = getProjectName($proj_id);
    $adviser_res = array();
    $student_res = array();
    foreach (array_keys($advisors) as $key) {
        array_push($adviser_res,$advisors[$key]["USERFULLNAMEENG"]);
    }
    foreach (array_keys($students) as $key) {
        array_push($student_res,array($students[$key]["USERFULLNAMEENG"],$students[$key]["EMAIL"]));
    }
    $results = array ($student_res,$adviser_res,$status,$proj_name,$abstract);
    return $results;
}

function get_project_info_by_project_id($project_id)
{
    $students = getProjectStudents($project_id);
    $advisors = getProjectAdvisers($project_id);
    $proj_name = getProjectName($project_id);
    $abstract = getSuggAbstract($project_id);
    $adviser_res = array();
    $student_res = array();
    foreach (array_keys($advisors) as $key) {
        array_push($adviser_res,$advisors[$key]["USERFULLNAMEENG"]);
    }
    foreach (array_keys($students) as $key) {
        array_push($student_res,array($students[$key]["USERFULLNAMEENG"],$students[$key]["EMAIL"]));
    }
    $results = array ($student_res,$adviser_res,$proj_name,$abstract);
    return $results;
}

function getSuggAbstract($project_id)
{
    $db = Zend_Registry::get('db');
    $select = $db->select()->from('PROJECTSUGGESTIONS', array('ABSTRACTENG','ABSTRACTHEB'))
        ->where('PROJECTID = ?', $project_id)
    ;
    $data = $db->fetchRow($select);
    return $data;
}

function getUpdatedAbstract($project_id){
    $db = Zend_Registry::get('db');
    $select = $db->select()->from('ABSTRACTUPDATE', array('ABSTRACTENG','ABSTRACTHEB'))
        ->where('PROJECTID = ?', $project_id)
    ;
    $data = $db->fetchRow($select);
    return $data;
}

function getProjectName($projectId)
{
    $db = Zend_Registry::get('db');
    $select=$db->select() ->from('PROJECTSUGGESTIONS',
        array('PROJECTNAMEENG'))
        ->where('PROJECTSUGGESTIONS.PROJECTID = ?', $projectId);
    $name= $db->fetchRow($select);
    return $name;
}

function getProjectStudents($projectId){
    $db = Zend_Registry::get('db');
    $select=$db->select()
        ->from('STUDENTS_DATA',
            array('USERID', 'USERFULLNAMEENG', 'EMAIL', 'TAKENPROJECTID'))
        ->where('STUDENTS_DATA.PROJECTID = ?', $projectId);

    $students = $db->fetchAll($select);
    return $students;
}

function getProjectAdvisers($projectId){
    $db = Zend_Registry::get('db');
    $select = $db->select()
        ->from('ADVISERSUGGESTIONS_DATA',
            array('ADVISERID','ADVISERNUMBER', 'USERFULLNAMEENG', 'EMAIL'))
        -> where('ADVISERSUGGESTIONS_DATA.PROJECTID = ?', $projectId)
    ;
    $advisers = $db->fetchAll($select);
    return $advisers;
}

function getProjectStatus($projectId)
{
    $db = Zend_Registry::get('db');

    $select = $db->select()
        ->from('PROJECTS',
            array('STATUS'))
        -> where('PROJECTS.PROJECTID= ?', $projectId);

    $status = $db->fetchAll($select);

    $select = $db->select()
        ->from('PROJECTSTATUS',
            array('STATUSDESC'))
        -> where('PROJECTSTATUS.STATUSID= ?', $status);
    $status_name = $db->fetchAll($select);
    return $status_name;
}

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

function bgu_login_session_id($username,$password)
{
    session_start();
    $r=session_id();
    
    $client = new SoapClient("https://w3.bgu.ac.il/BguAuthWebService/AuthenticationProvider.asmx?WSDL");
    $params = array(
    "uname" => $username, "pwd" => $password,
     );
    $check =$client->__soapCall("validateUser", array($params));
    
    // need to verify if check is true or false
    
    /* now registering a session for an authenticated user */
    $_SESSION['username']=$username;

/* now displaying the session id..... */

    // echo "the session id id: ".$r;
    // echo " and the session has been registered for: ".$_SESSION['username'];


/* now destroying the session id */

/*    if(isset($_SESSION['username']))
    {
        $_SESSION=array();
        unset($_SESSION);
        session_destroy();
        echo "session destroyed...";
    }  
 */
}

function getPersonAcademicYear($personId){
    $dbLink = Zend_Registry::get('dbLink');
    $data = $dbLink->fetchAll("SELECT * FROM EE_PERSON_DEPS WHERE TRIM(PERSON_ID) = '$personId'");
    return $data;
}

function getPersonId($personLogin){
    $dbLink = Zend_Registry::get('dbLink');
    $row = $dbLink->fetchRow("SELECT * FROM EE_ARCHI_LOGIN WHERE LOGIN = '$personLogin'");
    return $row;
}

function getUserType($user_id)
{
    $db = Zend_Registry::get('db');
    $select=$db->select() ->from('USERS_VIEW',
        array('USERTYPE'))
        ->where('USERS_VIEW.USERID = ?', $user_id);
    $user_type= $db->fetchRow($select);
    return $user_type;
}

function bgu_login($username,$password)
{
    session_start();
    $client = new SoapClient("https://w3.bgu.ac.il/BguAuthWebService/AuthenticationProvider.asmx?WSDL");
   // var_dump($client->__getFunctions());
    $params = array(
    "uname" => $username,
        "pwd" => $password,
     );
    $check =$client->__soapCall("validateUser", array($params));
    $array = json_decode(json_encode($check), True);
    $res = $array["validateUserResult"];
    if ($res) {
        $resultId = getPersonId($username);
        $id = $resultId['PERSON_ID'];
        //get the academic year
        $resultYears=getPersonAcademicYear($id);
        $academic_year = -1;
        for($i = 0;$i<count($resultYears);$i++) {
            if($resultYears[$i]['ACADEMIC_YEAR'] != null && $academic_year <= $resultYears[$i]['ACADEMIC_YEAR']) {
                $academic_year= $resultYears[$i]['ACADEMIC_YEAR'];
            }
        }
        $user_type = getUserType($id);
        $user_info = array($username,$id,$academic_year,$user_type);
        $_SESSION['user_info'] = $user_info;
        }
    return $check;
    
}

function get_user_name($user_id)
{
    $db = Zend_Registry::get('db');
    $select=$db->select() ->from('USERS',
        array('USERFIRSTNAMEENG','USERLASTNAMEENG'))
        ->where('USERID = ?', $user_id);
    $username= $db->fetchRow($select);
    return $username;
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

function getAllProjectLog($projectId){
    $db = Zend_Registry::get('db');
    $select = $db->select()->from('LOGS')
        ->where('PROJECTID=?', $projectId)
        ->order('STAMP ASC');
    return $this->fetchAll($select);
}

function getStudentGrades($studentId){
    /*
    $db = Zend_Registry::get('db');
    $select = $db->select()->from('GRADES',
        array('GRADE','GRADEDATE'))
        ->where('STUDENTID=?', $studentId)
        ->order('GRADETYPE ASC');
    $select->joinLeft('GRADETYPES',
        'GRADETYPES.GRADETYPE = GRADES.GRADETYPE',
        array('GRADENAMEENG'));
    $grades = $db->fetchAll($select);

    return $grades;*/
    $sql = "SELECT GRADES.GRADE,GRADETYPES.GRADENAMEENG FROM GRADES, GRADETYPES WHERE GRADES.GRADETYPE=GRADETYPES.GRADETYPE AND GRADES.STUDENTID=".$studentId;
    $conn = get_connection();
    $result = $conn->query($sql);
    $grades= array();
    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            $grade = array("status" => $row["GRADENAMEENG"], "grade" => $row["GRADE"]);
            array_push($grades,$grade);
        }
    }
    json_encode($grades);
    return $grades;
}



function get_conference_sessions()
{
    $db = Zend_Registry::get('db');
    $select=$db->select() ->from('CONFERENCE_SESSIONS',
        array('ID','HEAD','BUILDING','ROOM','START_TIME','END_TIME','SEATS','TYPE'));
    $sessions= $db->fetchAll($select);
    return $sessions;
}

$possible_url = array("get_user_list","get_session_data" ,"get_user","is_user_exist","bgu_login","get_advisers_list","get_pictures","search_project", "get_search_results","get_project_by_user_id","get_project_info","get_user_name","get_conference_sessions","get_student_grades","get_project_log");

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
      case "get_session_data":
          $value = $_SESSION['user_info'];
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
      case "get_project_by_user_id":
          $value = get_project_info_by_user_id($_SESSION['user_info'][1]);
          break;
      case "get_conference_sessions":
          $value = get_conference_sessions();
          break;
      case "get_project_log":
          $value = getAllProjectLog($_SESSION['user_info'][1]);
          break;
      case "get_project_info":
          if ($_SESSION["proj_id_for_proj_info"]!="") {
              $value = get_project_info_by_project_id($_SESSION["proj_id_for_proj_info"]);
          }
          break;
      case "get_user_name":
          $value = get_user_name($_SESSION['user_info'][1]);
          break;
      case "get_student_grades":
          $value = getStudentGrades($_SESSION['user_info'][1]);
          break;
      case "get_advisers_list":
          $value = get_advisers_list();
          break;
     case "search_project":
          $value = search_project($_GET["year"],$_GET["student_name"],$_GET["adviser"],$_GET["project_name"]);
          break;
      case "get_search_results":
          $value = get_search_results();
          break;
  }
}
$possible_post_actions = array("set_project_id_for_project_info");
if (isset($_REQUEST["action"]) && in_array($_REQUEST["action"], $possible_post_actions))
    switch ($_REQUEST["action"])
    {
        case "set_project_id_for_project_info":
            $_SESSION["proj_id_for_proj_info"] = $_REQUEST["project_id"];
            if ($_SESSION["proj_id_for_proj_info"]!="")
                $value="OK";
            break;
    }




exit(json_encode($value));

?>
