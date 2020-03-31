<?php 
    require "config.php";
    require "api.php";
    
    if(isset($_POST['view']))   //View All Data
    {
        $data_api = new DataGrabber;
        $current_exchange = intval($data_api::getrealval(561));

        $query = "SELECT *, high_alch-exchange-$current_exchange AS profit FROM all_items ORDER BY profit DESC";
        $result = mysqli_query($conn, $query);
        $html = "";
        $index = 0;
        while($row = mysqli_fetch_assoc($result))
        {
            $index ++;
            $item_id = $row['id'];
            $itme_name = $row['name'];
            $high_alch = $row['high_alch'];
            $exchange = $row['exchange'];
            //$time = $row['updatetime'];
            $time = gmdate('Y-m-d h:i:s');  // This is fine for your purpose
            $profit = floatval($high_alch) - floatval($exchange) - $current_exchange;
            $high_alch = number_format(floatval($high_alch));
            $exchange = number_format(floatval($exchange));
            $current_exchange = number_format(floatval($current_exchange));
            $profit = number_format($profit);
            $html .= "<tr>";
            $html .= "<td>$index</td>";
            $html .= "<td>$item_id</td>";
            $html .= "<td>$itme_name</td>";
            $html .= "<td>$high_alch</td>";
            $html .= "<td>$exchange</td>";
            $html .= "<td>$current_exchange</td>";
            $html .= "<td>$profit</td>";
            $html .= "<td>$time</td>";
            $html .= "</tr>";
        }
        echo $html; 
        exit; 
    }
   
?>