<?php
$db_connect = mysql_connect("localhost","dowanderers","kowino%33") or die ("Konnte keine Verbindung zur Datenbank herstellen");
mysql_select_db("dowanderers",$db_connect);
mysql_query("SET NAMES utf8");

$beitraege_query = "Select title, introtext from jos_content where state=1 and mobil=1 order by id desc";
$beitraege = mysql_query($beitraege_query,$db_connect);
if(mysql_num_rows($beitraege) == 0) {
   echo "<li class=\"longtext\">\n";
   echo "<p><strong>Leider gibt es derzeit keine aktuellen Neuigkeiten</strong></p>\n";
   echo "</li>\n";
}
while ($beitrag = mysql_fetch_array($beitraege)) {
   echo "<li class=\"longtext\">\n";
   echo "<h3 class=\"ui-li-heading\">" . $beitrag["title"] . "</h3>\n";
   echo $beitrag["introtext"] . "\n";
   echo "</li>\n";
}

?>