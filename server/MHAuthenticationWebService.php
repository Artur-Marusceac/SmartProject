<?
// class for web service client
class MHAuthenticationWebService{
    var $host;
    var $service_uri;
    function MHAuthenticationWebService($host='w3.bgu.ac.il',
                                        $service_uri='/BguAuthWebService/AuthenticationProvider.asmx?WSDL'){
        $this->host = $host;
        $this->service_uri = $service_uri;
        $this->debug = true;
        //$this->debug = false;
    }
    
    function validateUser($username,$password){
       $client = new SoapClient('https://'.$this->host.$this->service_uri,
                          array('trace'=>true));
       $check = false;                  
       try{
          $req = new RequestObject($username,$password);
          $res = $client->__soapCall('validateUser', array($req));
          
          $check = $res->validateUserResult;
        } catch (Exception $e) {
        }
        return $check;
    }

    function validateUser_OLD($username,$password){
        if($username == '' || $password == '') return false;
        $request_data =
'<soap:Envelope xmlns:xsi="http://www.w3.org/2003/05/XMLSchema-instance"
                xmlns:xsd="http://www.w3.org/2003/05/XMLSchema"
                xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <validateUser xmlns="http://bgu-cmsdeploy.bgu.ac.il/">
      <uname>'.htmlspecialchars($username).'</uname>
      <pwd>'.htmlspecialchars($password).'</pwd>
    </validateUser>
  </soap:Body>
</soap:Envelope>';
        $res = $this->call($request_data,'validateUser');
        //print "ValidateUser returned: ".$res."<br>";
        return $res['validateUserResponse']['validateUserResult']['#text']=='true';
    }

 function validateUserWithDetails($username,$password,$id,$department){
        if($username == '' || $password == '' || $id == '' || $department == '') return false;
        $request_data = 
'<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
<soap:Body>
    <validateUserWithDetails xmlns="http://bgu-cmsdeploy.bgu.ac.il/">
    <uname>'.htmlspecialchars($username).'</uname>
    <pwd>'.htmlspecialchars($password).'</pwd>
    <id>'.htmlspecialchars($id).'</id>
    <department>'.htmlspecialchars($department).'</department>
  </validateUserWithDetails>
</soap:Body>
</soap:Envelope>';
        $res = $this->call($request_data,'validateUserWithDetails');
        
        return $res['validateUserWithDetailsResponse']['validateUserWithDetailsResult']['DATA']['#attributes']['state']=='true';
        
    }
    
    function dom2array($node) {
        $res = array();
        if($node->nodeType == XML_TEXT_NODE){
            $res = $node->nodeValue;
        }
        else{
            if($node->hasAttributes()){
                $attributes = $node->attributes;
                if(!is_null($attributes)){
                    $res['#attributes'] = array();
                    foreach ($attributes as $index=>$attr) {
                        $res['#attributes'][$attr->name] = $attr->value;
                    }
                }
            }
            if($node->hasChildNodes()){
                $children = $node->childNodes;
                for($i=0;$i<$children->length;$i++){
                    $child = $children->item($i);
                    $res[$child->nodeName] = $this->dom2array($child);
                }
            }
        }
        return $res;
    }

    function call($request_data,$soap_action){
        // IIS WS hack
        $request_data .= "\r\n";
        $fp = fsockopen("ssl://".$this->host,443,$errno,$errstr);
        if (!$fp) {
            echo "$errstr ($errno)<br/>\n";
            return null;
        }
        
        fputs($fp,"POST ".$this->service_uri."  HTTP/1.1\r\n");
        fputs($fp,"Host:  w3.bgu.ac.il\r\n");
        fputs($fp,"Content-Type: text/xml; charset=utf-8\r\n");
        fputs($fp,"Content-Length: ".strlen($request_data)."\r\n");
        fputs($fp,"SOAPAction: \"http://bgu-cmsdeploy.bgu.ac.il/$soap_action\"\r\n");
        fputs($fp,"\r\n\r\n");
        
        fwrite($fp,$request_data);
        
        $response_data = '';
        while($d=@fread($fp,4096)){ 
            $response_data .= $d;
        }

        
        fclose($fp);
        
        if($this->debug){
            print "<hr/>";
            print "<pre>".htmlspecialchars($request_data)."</pre>";
            print "<hr/>";
            print "<pre>".htmlspecialchars($response_data)."</pre>";
            print "<hr/>";
        }

        
        $response_data = str_replace("\r","",$response_data);
        $header_start=false;
        $xml_start = false;
        $xml = '';
        foreach(preg_split("/\n/",$response_data) as $line){
            if(preg_match('/^HTTP\/1\.1 200 OK$/i',$line)){
                $header_start = true;
                $xml_start = false;
                $xml = '';
            }
            else if($header_start && $line==""){
                $xml_start = true;
            }
            else if($xml_start){
                $xml .= $line;
            }
        }
        $doc = new DOMDocument();
        $doc->loadXML($xml);
        $res = $this->dom2array($doc);
        
        return $res['soap:Envelope']['soap:Body'];
    }
}

class RequestObject {
  var $uname;
  var $pwd;
  function __construct($u,$p){
    $this->uname = $u;
    $this->pwd = $p;
  }
}

?>
