<?php 
    //Cron Processing... Super It Soultion Team

    require "vendor/autoload.php";
    require "config.php";
    
    $curtime = gmdate('Y-m-d h:i:s');  // This is fine for your purpose
    var_dump('Start_Time: '.$curtime);
    ini_set('default_socket_timeout', 120000000);
    //Serch updated item 
    $query = "Select count(*) cnt from all_items where status = 0 order by name";
    $result = mysqli_query($conn, $query);
    $row = mysqli_fetch_assoc($result);
    $cnt = intval($row['cnt']);
    //Round replay
    if($cnt == 0)
    {
        $reloadQuery = "UPDATE all_items SET status = 0";
        $result = mysqli_query($conn, $reloadQuery);
    }
    //
    $query = "Select *, (high_alch-exchange) as profit from all_items where status = 0 order by profit desc limit 0,200";
    $result = mysqli_query($conn, $query);
    $html = "";
    $index = 0;
    while($row = mysqli_fetch_assoc($result))
    {
        //Initialize Data
        $id = $row['id'];
        $keyword = $row['name'];

        
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
        		"timeout" => 1200000000]];		
		
		$context  = stream_context_create($options);
		
		$response = file_get_contents($url, FALSE, $context,0,9000);
		$response = html_entity_decode($response);
		$exchange = @explode('GEPrice', $response)[1];
		$exchange = @explode("<", $exchange)[0];
		$exchange = str_replace('>', '', trim($exchange));				
        $exchange = str_replace(',', '', trim($exchange));
        $exchange = str_replace('"', '', trim($exchange));
        $curtime = gmdate('Y-m-d h:i:s');  // This is fine for your purpose
        $finalQuery = "UPDATE all_items SET exchange='$exchange',status=1,updatetime='$curtime' WHERE id=$id";
        var_dump($finalQuery);
        mysqli_query($conn, $finalQuery);
    }
    $curtime = gmdate('Y-m-d h:i:s');  // This is fine for your purpose
    var_dump('Last_Time: '.$curtime);
