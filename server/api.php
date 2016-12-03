


<?php   
 
function get_pictures($dir){
   $images = glob('/var/www/html/Data/Conference/2011//*.{jpeg,gif,png}', GLOB_BRACE);
    return $images;
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


$possible_url = array("get_user_list", "get_user","is_user_exist","bgu_login","get_advisers_list","get_pictures");

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
        $value = get_pictures();
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
  }
}

exit(json_encode($value));

?>
