<?php
//The stream url for obtain icecast metadata
$audio_streaming_player_stream_url = $_POST['audio_streaming_player_stream_url'];
//Result, false if the file does not contain metadata, otherwise will contain the stream information
$result = false;
$icy_metaint = -1;
$needle = 'StreamTitle=';
$ua = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36';
$opts = array(
  'http' => array(
    'method' => 'GET',
    'header' => 'Icy-MetaData: 1',
    'user_agent' => $ua
  )
);
$default = stream_context_set_default($opts);
//Open the stream
$stream = fopen($audio_streaming_player_stream_url, 'r');

//Ask it the file contains metadata
if ($stream && ($meta_data = stream_get_meta_data($stream)) && isset($meta_data['wrapper_data'])) {
  foreach ($meta_data['wrapper_data'] as $header) {
    if (strpos(strtolower($header), 'icy-metaint') !== false) {
      $tmp = explode(":", $header);
      $icy_metaint = trim($tmp[1]);
      break;
    }
  }
}
if ($icy_metaint != -1) {
  $buffer = stream_get_contents($stream, 300, $icy_metaint);
  //get information from the stream url
  if (strpos($buffer, $needle) !== false) {
    $title = explode($needle, $buffer);
    $title = trim($title[1]);
    $result = substr($title, 1, strpos($title, ';') - 2);
    $result = substr($title, 1, strpos($title, ';') - 2);
    
    if(strlen($result)>39){
      $result=  substr($result,0,39);
    }
  }
}
//Close the stream
if ($stream)
  fclose($stream);
//Show the result
echo $result;
