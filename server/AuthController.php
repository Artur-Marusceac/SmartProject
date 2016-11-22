
<?php

echo "<script type='text/javascript' src='../htdocs_new/script/menu_style.js'></script>";

class AuthController extends Zend_Controller_Action
{
    protected $_url;
    function init(){
        $this->_url = '/htdocs_new/';
    }

    public function indexAction(){
        //$data = Zend_Auth::getInstance()->getStorage()->read();
        $storage=new Zend_Auth_Storage_Session();
        $userInfo = $storage->read();
        if (!$userInfo){
            header('location: /htdocs_new/index.php');
            // $this->_redirect('auth/login');
        }
        $this->view->title = "User's Home Page";
        $this->view->username = $userInfo->USERNAME;
        $this->view->user_firstname = $userInfo->USERFIRSTNAMEENG;
        $this->view->user_lastname = $userInfo->USERLASTNAMEENG;
        $this->view->user_email = $userInfo->EMAIL;
        $this->view->user_role = $userInfo->ROLE;
        //Zend_Debug::dump($userInfo, 'userInfo',true);


    }

    public function homeAction(){
            /* TODO: rewrite this !*/
            $storage=new Zend_Auth_Storage_Session();
            $userInfo = $storage->read();
            if (!$userInfo){
                $this->_redirect('auth/login');
                //header('location: /htdocs_new/index.php');
            }
             $homepage = 'auth/index';
                    switch ($userInfo->USERTYPE){
                        case 2: //administrator
                                $role = "admin";
                                $homepage =  "auth/administrator";
                                break;
                        case  8: //Company adviser
                                $role = 'adviser';
                                $homepage = 'adviser/project/view';
                                break;
                        case 16: //Faculty Member
                                $role = "adviser";
                                $homepage = "adviser/project/view";
                                break; 
                        case 32:  //Student
                                $role = "student";
                                $homepage = 'student/project/info';
                                break;
                        case 40: case 48 : //student + company adviser/FM
                                $role = 'adviser';
                                $homepage = 'adviser/project/view';
                                break;
                        case 64://graduated student
                                $role = "student";
                                $homepage = 'student/project/info';
                                break;
                        case 128: //SA
                        case 136: //SA + Company adviser
                        case 144: //Adviser : FM + SA
                                $role = "adviser";
                                $homepage = "adviser/project/view";
                                break;
                        case 146:  //Adviser + Admin
                                $role = "superviser";
                                $homepage = "superviser/project/handle/year";
                                break;
                        default:
                                $role = 'guest';
                                break;
                    }
                    $userInfo->ROLE = $role;
                    $storage->write($userInfo);

                    $this->_redirect($homepage);    //home
     }

   public function switchroleAction(){
            /* TODO: rewrite this !*/
            $storage=new Zend_Auth_Storage_Session();
            $userInfo = $storage->read();
            if (!$userInfo){
                header('location: /htdocs_new/index.php');
                //$this->_redirect('auth/login');
            }
            // Zend_Debug::dump($userInfo);
            if ($userInfo->USERTYPE == 146){ //only for superviser
                $role = $userInfo->ROLE;
                //Zend_Debug::dump($role);
                if ($role=='superviser'){
                    $role = 'adviser';
                    $homepage = "adviser/project/view";
                }else {
                     $role = "superviser";
                     $homepage = "superviser/project/handle/year";
                }
             $userInfo->ROLE = $role;
             //$storage->clear();
             $storage->write($userInfo);
             $userInfo = $storage->read();
             $this->_redirect($homepage);    //home
        }
     }


     public function administratorAction(){
        $storage=new Zend_Auth_Storage_Session();
        $userInfo = $storage->read();
        if (!$userInfo){
              header('location: /htdocs_new/index.php');
        }
        $this->view->title = "Administrator's Home Page";
        $this->view->userid =  $userInfo->USERID;
        $this->view->username = $userInfo->USERNAME;
        $this->view->user_firstname = $userInfo->USERFIRSTNAMEENG;
        $this->view->user_lastname = $userInfo->USERLASTNAMEENG;
        $this->view->user_email = $userInfo->EMAIL;
        $this->view->user_role = $userInfo->ROLE;
        //Zend_Debug::dump($userInfo, 'userInfo',true);



    }

    public function graduatedAction(){
        $storage=new Zend_Auth_Storage_Session();
        $userInfo = $storage->read();
        if (!$userInfo){
             header('location: /htdocs_new/index.php');
        }
        $this->view->title = "Graduated Student's Home Page";
        $this->view->userid =  $userInfo->USERID;
        $this->view->username = $userInfo->USERNAME;
        $this->view->user_firstname = $userInfo->USERFIRSTNAMEENG;
        $this->view->user_lastname = $userInfo->USERLASTNAMEENG;
        $this->view->user_email = $userInfo->EMAIL;
        $this->view->user_role = $userInfo->ROLE;
        //Zend_Debug::dump($userInfo, 'userInfo',true);
        $StatusList = array('PDR', 'Preliminary', 'Progress', 'Poster', 'Presentation', 'Final');
        //fetch grades : grades pair: graid type -> grade;
        $grades = new Grades();
        $select = $grades->select()
                                //->from ('GRADES', array('GRADETYPE', 'GRADE', 'STUDENTID'))
                                ->where( 'STUDENTID = ?', $userInfo->USERID);
        $studentGrades = $grades->fetchAll($select);
        // Zend_Debug::dump( $studentGrades , 'Grades' ,true);
        //$Sql="select GRADETYPE, GRADE from Grades Where StudentId = '$StudentId'";
        $this->view->statusList = $StatusList;
        $this->view->grades =  $studentGrades;


    }
/*    public function switchUser($newUsername){
        $storage=new Zend_Auth_Storage_Session();
        $curUserInfo = $storage->read();
        if (!$curUserInfo){
             return $this->_redirect('auth/login');
        }
        $curUsername     =  $curUserInfo->USERNAME;
        $permitUsers = array('tami', 'yehus','hugo', 'michalg', 'ritapi');
        if (in_array($curUsername, $permitUsers)) {
            $storage->clear();
            $users = new UsersView();
            $auth = Zend_Auth::getInstance();
            $authAdapter =new Zend_Auth_Adapter_DbTable($users->getAdapter(),'USERS_VIEW');
            $authAdapter->setIdentityColumn('USERNAME')
                        ->setCredentialColumn('USERNAME');

            $authAdapter->setIdentity($newUsername)
                        ->setCredential($newUsername);
            $result = $auth->authenticate($authAdapter);
            if ($result->isValid()){
                        $userInfo = $authAdapter->getResultRowObject( /*null, 'PASSWORD'* );
                        // Zend_Debug::dump($userInfo, 'userInfo',true);
                        $role = 'guest';
                        $homepage = 'auth/index';
                        switch ($userInfo->USERTYPE){
                        case 2: //administrator
                                $role = 'admin';
                                $homepage =  'auth/administrator';

                                break;
                        case  8:  $role = 'adviser';
                                  $homepage = 'adviser/project/view';
                                   break;

                        case 16: //Faculty Member

                                 $role = 'adviser';
                                 $homepage = 'adviser/project/view';
                                    break;
                        case 32:  //Student
                                $role = 'student';
                                $homepage = 'student/project/info';
                                //$this->_helper->redirector ('index', 'index', 'student');
                                break;
                        case 64:  //Graduated
                                $role = 'graduated';
                                 $homepage = 'auth/graduated';
                                break;

                        case 128:
                        case 136:
                        case 144:  //Adviser : FM + SA
                                $role = 'adviser';
                                $homepage = 'adviser/project/view';
                                break;
                        case 146:  //Adviser + Admin
                                $role = 'superviser';
                                $homepage = 'superviser/project/view/year';
                                break;

                        default:
                                $role = 'guest';
                                break;
                        }
                        $userInfo->ROLE = $role;
                        $storage->write($userInfo);
                        //update login info for the user
                        $tblUsers =new Users();
                        $tblUsers->updateLoginInfo($userInfo->USERNAME);
                        $this->_redirect($homepage);    //home
                } //result valid
          }//user permitted to perform this action:

         $this->_redirect('auth/home');
    }
*/

    public function loginthirdyearAction() {
        $this->setThirdYear('300331758');
    }

    private function setThirdYear($id) {
        $eePersonsDeps = new EePersonDeps();
	    $eeArchLogin = new EeArchiLogin();
        $resultYears = $eePersonsDeps->getPersonAcademicYear($id);
        $resultYear = -1;
        for($i = 0;$i<count($resultYears);$i++) {
            if($resultYears[$i]['ACADEMIC_YEAR'] != null && $resultYear <= $resultYears[$i]['ACADEMIC_YEAR']) {
                $resultYear = $resultYears[$i]['ACADEMIC_YEAR'];
            }
        }
        $eePersons = new EePersons();

        $personInfo = $eePersons->getPersonInfo($id);
        $users = new UsersView();
        $exists = $users->userExists($id);//201587946
        if($resultYear >= 3 && !$exists) {
            $eeArchLogin->getPersonLogin($id);
            $auth = Zend_Auth::getInstance();
            $authAdapter =new Zend_Auth_Adapter_DbTable($eeArchLogin->getAdapter(),'EE_ARCHI_LOGIN');
            $authAdapter->setIdentityColumn('PERSON_ID')
            ->setCredentialColumn('PERSON_ID');
            $authAdapter->setIdentity($id)
            ->setCredential($id);
            $result = $auth->authenticate($authAdapter);
            if ($result->isValid()){
                $storage = new Zend_Auth_Storage_Session();
                $userInfo = $authAdapter->getResultRowObject( );
                $userInfo->ROLE = "thirdYear";
                $userInfo->EMAIL = trim($personInfo['EMAIL']);
                $userInfo->FIRST_NAME = trim($personInfo['FIRST_NAME']);
                $userInfo->FAMILY_NAME= trim($personInfo['FAMILY_NAME']);

                $storage->write($userInfo);
                header('location:/ThirdYear.php');
                exit();
            }
            return true;
        }
        else {
            if($resultYear != -1 && $resultYear < 3) {
                $errorMessage = 'User academic year is less then third year';
                $url =  $this->_url ."?errMsg=$errorMessage";
                $this->getResponse()->setRedirect($url, $code = 302);
            }
        }
        
        return false;
    }


    public function bguloginAction() {

        $ws = new MHAuthenticationWebService();
        $users = new UsersView();
        $form = new LoginForm();
        //$this->view->form = $form;
        
        if ($this->getRequest()->isPost()){
            if($form->isValid($_POST)){
                $data = $form->getValues();
                //Zend_Debug::dump($data);
                //--------- validate user here !!! ----------------------------
                
                $check = $ws->validateUser($data['USERNAME'],$data['PASSWORD']);
                
                //-------------------------------------------------------------
                //Zend_Debug::dump( $check);
                //$permitUsers = array('tami', 'yehus','hugo', 'michalg', 'ritapi');
                if ($check /* && in_array($data['USERNAME'], $permitUsers)*/ ){
                    //third year user
                    $eeLogin = new EeArchiLogin();
                    $resultId = $eeLogin->getPersonId($data['USERNAME']);
                    $id = $resultId['PERSON_ID'];

                    if(!empty($id))
                        $test = $this->setThirdYear($id); //test : '33456468' 201587946 301675443

                    
                    $auth = Zend_Auth::getInstance();
                    $authAdapter =new Zend_Auth_Adapter_DbTable($users->getAdapter(),'USERS_VIEW');
                    $authAdapter->setIdentityColumn('USERNAME')
                                ->setCredentialColumn('USERNAME');
                   /* $authAdapter->setIdentity($data['USERNAME2'])
                                ->setCredential($data['USERNAME2']);
                    */
                    $authAdapter->setIdentity($data['USERNAME'])
                                ->setCredential($data['USERNAME']);
                    $result = $auth->authenticate($authAdapter);
                    if ($result->isValid()){
                        $storage = new Zend_Auth_Storage_Session();
                        $userInfo = $authAdapter->getResultRowObject( /*null, 'PASSWORD'*/ );
                        // Zend_Debug::dump($userInfo, 'userInfo',true);
                        $role = 'guest';
                        $homepage = 'auth/index';

                        switch ($userInfo->USERTYPE){
                        case 2: //administrator
                                $role = 'admin';
                                $homepage =  'auth/administrator';
                                break;
                        case 4:
                            $role = 'wareHouse';
                            $homepage = 'index/warehouse';
                            break;
                        case  8: //Company adviser
                                $role = 'adviser';
                                $homepage = 'adviser/project/view';
                                break;
                        case 16: //Faculty Member
                                $role = 'adviser';
                                $homepage = 'adviser/project/view';
                                break;
                        case 32:  //Student
                                $role = 'student';
                                $homepage = 'student/project/info';
                                //$this->_helper->redirector ('index', 'index', 'student');
                                break;
                        case 40: case 48 : //student + company adviser/FM
                                $role = 'adviser';
                                $homepage = 'adviser/project/view';
                                break;
                        case 64:  //Graduated
                                $role = 'graduated';
                                $homepage = 'auth/graduated';
                                break;
                        case 128: //SA
                        case 136: //SA + Company adviser
                        case 144: //Adviser : FM + SA
                                $role = 'adviser';
                                $homepage = 'adviser/project/view';
                                break;
                        case 146:  //Adviser + Admin
                                $role = 'superviser';
                                $homepage = "superviser/project/handle/year";
                            /*$role = 'wareHouse';
                            $homepage = 'index/warehouse';*/
                                break;
                        default:
                                $role = 'guest';
                                break;
                        }
                        if ($userInfo->USERTYPE){ //student - find project id
                            $studentId = $userInfo->USERID;
                            $vStudentsData = new StudentsData();
                            $row = $vStudentsData-> getProjectData($studentId);
                            if ($row){ //student project data exists
                                $suggestionId    = $row->PROJECTID;
                                $takenProjectId  = $row->TAKENPROJECTID;
                                $userInfo->SUGGESTIONID   = $suggestionId;
                                $userInfo->TAKENPROJECTID = $takenProjectId;
                            }
                        }
                        $userInfo->ROLE = $role;
                        $storage->write($userInfo);
                        //update login info for the user
                        $tblUsers =new Users();
                        $tblUsers->updateLoginInfo($userInfo->USERNAME);
                        $this->_redirect($homepage);    //home
                    }else{// the user is not in USER table
                         $errorMessage ="The user doesn't exist in the database.";
                    }
                }else{//
                        // WS authentication failed
                        $errorMessage = "Invalid username or password.";
                }
            }else{
                //form is not valid;
                //Zend_Debug::dump($form, 'form');
                 $errorMessage = "Invalid form";
            }
        }else{//not POST!!!
               //we were redirected from invalid login
               $errorMessage = '';
        }
        if (isset($errorMessage)){
            //$this->view->errorMessage = $errMsg;
            //$errorMessage ='Authentication failed';
            $errorMessage = 'Login Failed!'; //changed for msg to fit to left menu panel
            $url =  $this->_url ."?errMsg=$errorMessage";
            $this->getResponse()->setRedirect($url, $code = 302);
            //header( 'Location: /htdocs_new/?errMsg='.$errorMessage);
        }
    }



    public function loginAction() {
       $errorMessage = "Not Authorized";
       $errorMessage = "Please Log In";
       $url =  $this->_url ."?errMsg=$errorMessage";
       $this->getResponse()->setRedirect($url, $code = 302);

       //header('location: /htdocs_new/index.php');
       /*
        $users = new UsersView();
        $form = new LoginForm();
        $this->view->form = $form;

        if ($this->getRequest()->isPost()){

            if($form->isValid($_POST)){

                $data = $form->getValues();
                $auth = Zend_Auth::getInstance();

                $authAdapter =
                    new Zend_Auth_Adapter_DbTable($users->getAdapter(),'USERS_VIEW');

                $authAdapter->setIdentityColumn('USERNAME')
                            ->setCredentialColumn('USERNAME');
                $authAdapter->setIdentity($data['USERNAME'])
                             ->setCredential($data['USERNAME']);
                $result = $auth->authenticate($authAdapter);
                //here is my code
                //var_dump($result);
                if ($result->isValid()){
                    $storage = new Zend_Auth_Storage_Session();
                    //var_dump($storage);

                    //$storage->write($authAdapter->getResultRowObject(null, 'PASSWORD'));
                    $userInfo = $authAdapter->getResultRowObject( /*null, 'PASSWORD'// );
                    //$storage->write($userInfo);
                    $Role = 'Guest';
                    $homepage = 'auth/index';
                    switch ($userInfo->USERTYPE){
                        case 2: //administrator
                                $Role = "Administrator";
                                $homepage =  "auth/administrator";

                                break;
                        case 16: //Faculty Member

                                 $Role = "Faculty Member";
                                 $homepage = "adviser/index";
                                    break;
                        case 32:  //Student
                                $Role = "Student";
                                 $homepage = 'auth/student';
                                break;
                        case 144:  //Adviser
                                $Role = "Adviser";
                                $homepage = "adviser/index";
                                break;
                         case 146:  //Adviser + Admin
                                $Role = "Superviser";
                                $homepage = "adviser/index";
                                break;

                        default:
                                $Role = 'Undefined';
                                break;
                    }
                    $userInfo->ROLE = $Role;
                    $storage->write($userInfo);
                    //echo "Redirecting to home";

                    $this->_redirect($homepage);    //home
                }else{
                      //authentication failed
                     $this->view->errorMessage =  "Invalid username or password. Please try again.";
                    header('location: /htdocs_new/index.php');
                }
            }else{
                //form is not valid;
                 $this->view->errorMessage =
                              "Form data isn't valid.  Please try again.";
                header('location: /htdocs_new/index.php');
            }
        }else{
               //we were redirected from invalid login
               // echo "Problem with authentication: try to login again.<br>";
               // header('location: /htdocs_new/index.php');
                $this->getResponse()->setRedirect($this->_url, $code = 302);

        }
       */
    }
   /*
    public function signupAction() {
        $users = new UsersView();
        $form = new RegistrationForm();
        $this->view->form=$form;
        if($this->getRequest()->isPost()){
            if($form->isValid($_POST)){
                $data = $form->getValues();
                if($data['PASSWORD'] != $data['confirmPassword']){
                    $this->view->errorMessage =
                        "Password and confirm password don\'t match.";
                    return;
                }
                if($users->checkUnique($data['USERNAME'])){
                    $this->view->errorMessage =
                        "Name already taken. Please choose another one.";
                    return;
                }
                unset($data['confirmPassword']);
                $users->insert($data);
                $this->_redirect('auth/login');
            }
        }
    }
*/
    public function logoutAction() {
        $storage = new Zend_Auth_Storage_Session();
        $storage->clear();
        $this->getResponse()->setRedirect($this->_url, $code = 302);

        header('location: /htdocs_new/index.php');
        //work only in FF:
        // echo "<meta http-equiv=refresh content=\"0;  URL=javascript:window.open('/project_site/htdocs_new','_top') \">";
    }
}

?>

