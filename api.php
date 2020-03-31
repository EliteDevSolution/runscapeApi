<?php 

 require "vendor/autoload.php";

class DataGrabber
{
	
	public static function grab($keyword)
	{
		ini_set('default_socket_timeout', 900);	
		$keyword = trim($keyword);
		// $keyword = str_replace(' ', '+', $keyword);
		// var_dump($keyword);exit;
		
		$results = array();		
		$index = 0;
		
		$url = "https://oldschool.runescape.wiki/w/Exchange:" . $keyword;

		$ua = \Campo\UserAgent::random([
		    'os_type' => ['Windows', 'OS X'],
		    'device_type' => 'Desktop'

		]);

		$options  = [
			'http' => [
				'method'     =>"GET",
				'user_agent' =>  $ua,
			],
			'ssl' => [
				"verify_peer"      => FALSE,
				"verify_peer_name" => FALSE,
			],
			'https'=> [
        		"timeout" => 120000]];		
		
		$context  = stream_context_create($options);
		
		$response = file_get_contents($url, FALSE, $context,0,9000);
		$response = html_entity_decode($response);
		$highval = @explode('GEPrice', $response)[1];
		$highval = @explode("<", $highval)[0];
		$highval = str_replace('>', '', trim($highval));				
		$highval = str_replace(',', '', trim($highval));
		return $results;
	}

	public static function getitemdata()
	{
		$url = "https://runenation.org/osgrab/itemdb.json";
	    $curl = curl_init($url);
	    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
	    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
	    //execute the session
	    $curl_response = curl_exec($curl);
	    //finish off the session
	    curl_close($curl);
	    return json_decode($curl_response, true);
	}

	public static function getcurval($id, $keyword)
	{
		ini_set('default_socket_timeout', 900);	
		$url = "http://services.runescape.com/m=itemdb_oldschool/api/catalogue/detail.json?item=".$id;
	    $curl = curl_init($url);
	    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($curl, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.0; en-US; rv:1.7.12) Gecko/20050915 Firefox/1.0.7");
        if (!empty($config['POST'])) {
            curl_setopt($curl, CURLOPT_POST, 1);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $config['POST']);
        }
        if (!empty($config['bearer'])) {
            curl_setopt($curl, CURLOPT_HTTPHEADER, array(
                'Authorization: Bearer ' . $config['bearer']
            ));
        }
	    //execute the session
	    $curl_response = curl_exec($curl);
	    //finish off the session
	    curl_close($curl);
	    $curval = json_decode($curl_response, true);
		$curval = strval($curval['item']['current']['price']); 
		$curval = str_replace(',', '', trim($curval));
	    if(strpos($curval,'k'))
	    {
	    	$curval = str_replace('k', '', $curval);
	    	$curval = $curval * 1000;
	    } else if(strpos($curval,'m'))
	    {
	    	$curval = str_replace('m', '', $curval);
	    	$curval = $curval * 1000000;
	    }
	    var_dump($curval);
		$keyword = trim($keyword);
		// $keyword = str_replace(' ', '+', $keyword);
		// var_dump($keyword);exit;
		
		$results = array();		
		$index = 0;
		$url = "https://oldschool.runescape.wiki/api.php?action=parse&format=json&page=" . $keyword;

		$ua = \Campo\UserAgent::random([
		    'os_type' => ['Windows', 'OS X'],
		    'device_type' => 'Desktop'

		]);

		$options  = [
			'http' => [
				'method'     =>"GET",
				'user_agent' =>  $ua,
			],
			'ssl' => [
				"verify_peer"      => FALSE,
				"verify_peer_name" => FALSE,
			],
			'https'=> [
        		"timeout" => 1200]];		
		
		$context  = stream_context_create($options);
		
		$response = file_get_contents($url, FALSE, $context,50,5000);
		$response = html_entity_decode($response);
		$exchange = explode("data-val-each", $response);
		//var_dump($exchange);exit;
		$exchange = @substr($exchange[1], 3,30);
		$exchange = @explode('\\', $exchange)[0];
		$highval = @explode('coin', $response)[1];
		$highval = @explode(">", $highval)[count(@explode(">", $highval))-1];
		$highval = str_replace(',', '', trim($highval));
		var_dump($exchange);
		var_dump($highval);
		exit;
		return $results;
	}

	public static function getrealval($id)
	{
		ini_set('default_socket_timeout', 12000);	
		$url = "http://services.runescape.com/m=itemdb_oldschool/api/catalogue/detail.json?item=".$id;
	    $curl = curl_init($url);
	    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($curl, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.0; en-US; rv:1.7.12) Gecko/20050915 Firefox/1.0.7");
        if (!empty($config['POST'])) {
            curl_setopt($curl, CURLOPT_POST, 1);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $config['POST']);
        }
        if (!empty($config['bearer'])) {
            curl_setopt($curl, CURLOPT_HTTPHEADER, array(
                'Authorization: Bearer ' . $config['bearer']
            ));
        }
	    //execute the session
	    $curl_response = curl_exec($curl);
	    //finish off the session
	    curl_close($curl);
	    $curval = json_decode($curl_response, true);
		$curval = strval($curval['item']['current']['price']); 
		$curval = str_replace(',', '', trim($curval));
	    if(strpos($curval,'k'))
	    {
	    	$curval = str_replace('k', '', $curval);
	    	$curval = $curval * 1000;
	    } else if(strpos($curval,'m'))
	    {
	    	$curval = str_replace('m', '', $curval);
	    	$curval = $curval * 1000000;
	    } else if(strpos($curval,'b'))
        {
            $curval = str_replace('b', '', $curval);
            $curval = $curval * 1000000000;
        }
		return $curval;
	}
}

function is_url_exist($url){
	    $ch = curl_init($url);    
	    curl_setopt($ch,CURLOPT_RETURNTRANSFER,TRUE);
	    if($code == 200){
	       $status = true;
	    }else{
	      $status = false;
	    }
	    curl_close($ch);
	   return json_encode($status);
}
?>