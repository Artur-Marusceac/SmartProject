<?php

function get_connection(){
    $conn = NULL;
    $servername = "localhost";
    $username = "root";
    $password = "";
    $database = "test";

    $conn = mysqli_connect($servername, $username, $password, $database);

    if (mysqli_connect_errno()) {
        die('Not connected : ' . mysql_error());
    }else{
        //echo "connected to mysql  ";
    }
    
    return $conn;
}

require_once("MHAuthenticationWebService.php");
function bgu_login($username,$password)
{
    $ws = new MHAuthenticationWebService(); 
    $check = $ws->validateUser($data['USERNAME'],$data['PASSWORD']);
    return $check;
}


function get_user_by_id($id)
{
  $user_info = array();

  // make a call in db.
  switch ($id){
    case 1:
      $user_info = array("first_name" => "Marc", "last_name" => "Simon", "age" => 21); // let's say first_name, last_name, age
      break;
    case 2:
      $user_info = array("first_name" => "Frederic", "last_name" => "Zannetie", "age" => 24);
      break;
    case 3:
      $user_info = array("first_name" => "Laure", "last_name" => "Carbonnel", "age" => 45);
      break;
  }

  return $user_info;
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

$possible_url = array("get_user_list", "get_user","is_user_exist","bgu_login");

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
    
      case "is_user_exist":
          $value = is_user_exist($_GET["username"],$_GET["id"]);
          break;    
      case "bgu_login":
          $value = bgu_login($_GET["username"],$_GET["password"]);
          break;
  }
}

exit(json_encode($value));

?>