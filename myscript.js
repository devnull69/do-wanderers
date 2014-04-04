var urlBundesliga = 'http://baseball-deutschland.de/spielplane-und-tabellen/spielplan-1-baseball-bundesliga-nord/';
var urlBundesligaTab = 'http://baseball-deutschland.de/spielplane-und-tabellen/tabelle-1-baseball-bundesliga-nord/';
var urlRegionalliga = 'http://www.baseball-softball.de/bundesligen/baseball-regionalligen/spielplan-rl-nordwest';
var urlRegionalligaTab = 'http://www.baseball-softball.de/bundesligen/baseball-regionalligen/tabellen-regional-liga';
var urlLandesliga = 'http://www.bsvnrw.de/index.php?option=com_content&view=article&id=1905&Itemid=363';
var urlSoftball = 'http://www.bsvnrw.de/index.php?option=com_content&view=article&id=1918&Itemid=377';
var urlJunioren = 'http://www.bsvnrw.de/index.php?option=com_content&view=article&id=1922&Itemid=382';
var urlJugend = 'http://www.bsvnrw.de/index.php?option=com_content&view=article&id=1925&Itemid=385';
var urlSchueler = 'http://www.bsvnrw.de/index.php?option=com_content&view=article&id=1928&Itemid=388';
var urlTeeball = 'http://www.bsvnrw.de/index.php?option=com_content&view=article&id=1929&Itemid=389';

var urlGamechanger = 'http://www.gamechanger.io/search?q=Dortmund&t=teams';

var currentDate = '';

var today = new Date();
var heuteJahr = today.getFullYear();
var heuteMonat = today.getMonth();
var heuteTag = today.getDate();
today = new Date(heuteJahr, heuteMonat, heuteTag);

var teams = [
   ["Test", "test"],
   ["Solingen", "solingen"],
   ["Bonn", "bonn"],
   ["Paderborn", "paderborn"],
   ["HSV", "HSV"],
   ["Dohren", "dohren"],
   ["Berlin", "berlin"],
   ["Cologne", "cologne"],
   ["Holzwickede", "holzwickede"],
   ["Verl", "verl"],
   ["Woodlarks", "lueneburg"],
   ["gsen Farmers", "haenigsen"],
   ["Witten", "witten"],
   ["Minden", "minden"],
   ["Lippstadt", "lippstadt"],
   ["Senators", "duesseldorf"],
   ["Duisburg", "duisburg"],
   ["Berserker", "buende"],
   ["Wuppertal", "wuppertal"],
   ["ster Cardinals", "muenster"],
   ["Hagen", "hagen"],
   ["Bochum", "bochum"],
   ["Werl", "werl"],
   ["Herne", "herne"],
   ["Sly", "slydogs"],
   ["Marl Miners", "miners"],
   ["Ratingen", "ratingen"],
   ["Wanderers", "wanderers_logo_80"]
];

$.mobile.page.prototype.options.backBtnText = "Zurück";

function getLogo(team) {
   for(i=0; i<teams.length; i++) {
      if(team.indexOf(teams[i][0]) != -1)
         result = teams[i][1];
   }
   return result;
}

function getTeamLogo(team1, team2) {
   var theTeam = team1;
   var result = '';
   if(team2.indexOf("Wanderers") == -1) {
      theTeam = team2;
   }

   return getLogo(theTeam);
}

function getBothTeamLogos(team1, team2) {
   var result = [];
   result.push(getLogo(team1));
   result.push(getLogo(team2));
   return result;
}

function replaceMonth(dateString) {
	var months = [" Januar ", " Februar ", " März ", " April ", " Mai ", " Juni ", " Juli ", " August ", " September ", " Oktober ", " November ", " Dezember "];
	for(i=0; i<months.length; i++) {
		if(dateString.indexOf(months[i]) != -1) {
			var monthNumber = i+1;
			monthNumber = (monthNumber<10?'0':'') + monthNumber.toString() + '.';
			var myReplaceRegex = new RegExp(months[i]);
			dateString = dateString.replace(myReplaceRegex, monthNumber);
		}
	}
	return dateString;
}

function replaceMonthEN(dateString) {
	var months = [" January ", " February ", " March ", " April ", " May ", " June ", " July ", " August ", " September ", " October ", " November ", " December "];
	for(i=0; i<months.length; i++) {
		if(dateString.indexOf(months[i]) != -1) {
			var monthNumber = i+1;
			monthNumber = (monthNumber<10?'0':'') + monthNumber.toString() + '.';
			var myReplaceRegex = new RegExp(months[i]);
			dateString = dateString.replace(myReplaceRegex, monthNumber);
		}
	}
	return dateString;
}

function gamechanger_refresh(theHREF) {
   $.get('../phpproxy/proxy.php', 'url=' + encodeURIComponent(theHREF), function (data) {
      erg1 = $(data).find('#section_header .scoreboardGrid .leftCol .score').text();
      erg2 = $(data).find('#section_header .scoreboardGrid .rightCol .score').text();
      mystatus = $(data).find('#top_or_bottom').text();
      if(mystatus == "") mystatus = $(data).find('#gamestreamHeaderData > span').eq(0).text();
      $('#gamechanger_result').text(erg2 + " : " + erg1 + " (" + mystatus + ")");
      $('#gc_refresh').attr('src', 'refresh.gif');
   });
}

function setup_gamechanger(gc_id) {
   theHREF = 'http://www.gamechanger.io/game-' + gc_id + '/plays';
   $('#bundesliga_next').append('<p><strong><a id="gamechanger_result" href="' + theHREF + '" target="_blank">LIVE</a></strong> <img id="gc_refresh" src="refresh.gif" /></p>');
   gamechanger_refresh(theHREF + '?' + (new Date()).getTime());
   $('#gc_refresh').click(function() {
      $(this).attr("src", "refresh_anim.gif");
      setTimeout(function() {gamechanger_refresh(theHREF + '?' + (new Date()).getTime());}, 10);
   });
}

function getErgebnisseBSV(data, liga) {
   var $html = $(data).find('.spielplan');
   // wertlosen Content ausschalten
   $html.find('thead').remove();
   $html.find('tr.even_row, tr.odd_row').each(function() {
      var myTD = $(this).find('td');
      myTD.eq(1).append('<br/>' + myTD.eq(2).html());
   });
   $html.find('td').each(function() {
      if($(this).text().indexOf("Wanderers") != -1) {
         $(this).parent().addClass("wanderers");
      }
   });
   var foundNext = false;
   lastGame = '<p><strong>Noch kein Spiel in dieser Saison</strong></p>';
   nextGame = '<p><strong>Reguläre Saison ist beendet</strong></p>';
   lastDate = new Date(1970, 0, 1);
   $html.find('tr.wanderers').each(function() {
      var $myTD = $(this).find('td');
      var gameDateStr = $myTD.eq(1).text().match(/(\d{2}\.\d{2}\.\d{2})/)[1];
      var gameYear = Number(gameDateStr.substring(6)) + 2000;
      var gameMonth = Number(gameDateStr.substring(3, 5))-1;
      var gameDay = Number(gameDateStr.substring(0, 2));
      var gameDate = new Date(gameYear, gameMonth, gameDay);
      if(gameDate < today) {
         if(gameDate.toString() == lastDate.toString()) {
            var ersterTeil = lastGame.substring(0, lastGame.length-9);
            var zweiterTeil = lastGame.substring(lastGame.length-9, lastGame.length);
            lastGame = ersterTeil + " / " + $myTD.eq(5).text() + ' : ' + $myTD.eq(7).text() + zweiterTeil;
         } else {
            if($myTD.eq(5).text() != "-") {
               lastGame = '<p><strong>' + $myTD.eq(3).text() + '</strong></p>';
               lastGame += '<p><strong>' + $myTD.eq(4).text() + '</strong></p>';
               lastGame += '<p class="ui-li-aside logomove"><h1>' + $myTD.eq(5).text() + ' : ' + $myTD.eq(7).text() + '</h1></p>';
               lastDate = gameDate;
            }
         }
      } else {
         if(!foundNext) {
            var Wo = '';
            if($myTD.eq(3).text().indexOf("Wanderers") != -1) Wo = ' im Hoeschpark';
            nextGame = '<p><strong>' + $myTD.eq(3).text() + '</strong></p>';
            nextGame += '<p><strong>' + $myTD.eq(4).text() + '</strong></p>';
            nextGame += '<p>' + $myTD.eq(1).html() + Wo + '</p>';

            nextGame += '<p class="ui-li-aside logomove"><img src="teams/' + getTeamLogo($myTD.eq(3).text(), $myTD.eq(4).text()) + '.png" /></p>';

            foundNext = true;
         }
      }
   });
   $('#' + liga.toLowerCase() + '_last').append(lastGame);
   $('#' + liga.toLowerCase() + '_next').append(nextGame);
   nextGame = '<li><h3 class="ui-li-heading">' + liga + '</h3>' + nextGame + '</li>';
   $comingup.append(nextGame);
   
   // in Listview überführen
   allLI = '';
   $html.find('tr').each(function() {
      var $TD = $(this).find('td');
      var team1 = $TD.eq(3).text();
      var team2 = $TD.eq(4).text();
      var logos = getBothTeamLogos(team1, team2);
      var theTheme = '';
      if($(this).hasClass("wanderers"))
         theTheme = ' data-theme="d"'
      if($TD.eq(5).text().indexOf("-") != -1) {
         allLI += '<li' + theTheme + '><img src="teams/' + logos[0] + '.png"/><p><strong>' + team1 + '</strong></p><p><strong>' + team2 + '</strong></p><p>' + $TD.eq(1).html() + '</p><p class="ui-li-aside"><img src="teams/' + logos[1] + '.png"/></p></li>';
      } else {
         allLI += '<li' + theTheme + '><img src="teams/' + logos[0] + '.png"/><p><strong>' + team1 + '</strong></p><p><strong>' + team2 + '</strong></p><h3>' + $TD.eq(5).html() + ' : ' + $TD.eq(7).html() + '</h3><p class="ui-li-aside"><img src="teams/' + logos[1] + '.png"/></p></li>';
      }
   });
   $('#' + liga.toLowerCase() + 'listview').append(allLI);
   
   $('#' + liga.toLowerCase() + 'content').append('<p class="whitetext">Quelle: BSV NRW</p>');
}

function getTabelleBSV(data, liga) {
   var $html = $(data).find('.ligatabelle');
   // in Listview überführen
   var allLI = '';
   $html.find('tr').each(function(index) {
      if(index>0) {
         var $TD = $(this).find('td');
         var team = $TD.eq(0).text();
         var siege = $TD.eq(1).text();
         var niederlagen = $TD.eq(2).text();
         var pct = $TD.eq(3).text();
         var gb = $TD.eq(4).text();
         var logo = getLogo(team);
         var theTheme = '';
         if(team.indexOf("Wanderers") != -1)
            theTheme = ' data-theme="d"'
         allLI += '<li' + theTheme + '><img src="teams/' + logo + '.png"/><h3 class="ui-li-heading">' + index + '. ' + team + '</h3><p class="smaller">Siege: ' + siege + ' / Niederlagen: ' + niederlagen + ' / pct: ' + pct + '</p><p class="smaller">GB: ' + gb + '</p></li>';
      }
   });
   $('#' + liga + 'tablistview').append(allLI);
   $('#' + liga + 'tabcontent').append('<p class="whitetext">Quelle: BSV NRW</p>');
}

$(document).ready(function() {
   $.ajaxSetup({
      beforeSend: function(xhr) {
         xhr.setRequestHeader('Accept-Encoding', 'identity');
      }
   });
   
   // NEWS
   $.get('news.php', function(data) {
      $newslistview = $('#newslistview');
      $newslistview.html(data);
      $newslistview.find('img').each(function() {
         var $this = $(this);
         $this[0].width = "290";
         var src = $this[0].src;
         src = "/" + src.substring(src.indexOf("images"));
         $this.attr("src", src);
         $this.css({
            "float": "left",
            "margin-right": "5px",
            "margin-bottom": "5px"
         });
      });
      $newslistview.find('a').each(function() {
         $(this).replaceWith($(this).text());
      });
   });
   
   // INHALTE
   
   // Coming Up Sektion vorbelegen
   $comingup = $('#cominguplistview');
   
   $.get('../phpproxy/proxy.php', 'url=' + encodeURIComponent(urlBundesliga), function (data) {
      var $html = $(data).find('.baseball-schedule');
		// wertlosen Content ausschalten
      $html.find('tr').each(function() {
         var myTD = $(this).find('td');
         if(myTD.length == 5) {
            // nur Spalten verstecken, Datum einsetzen
            myTD.eq(0).html(currentDate + '<br/>' + myTD.eq(0).html());
        } else {
            // Datum merken
            // Ganze Zeile löschen
            currentDate = replaceMonthEN($(this).find('th').html());
            //console.log(currentDate);
            $(this).remove();
        }
      });
      $html.find('td').each(function() {
         if($(this).text().indexOf("Wanderers") != -1) {
            $(this).parent().addClass("wanderers");
         }
      });
      var foundNext = false;
      var lastGame = '<p><strong>Noch kein Spiel in dieser Saison</strong></p>';
      var nextGame = '<p><strong>Reguläre Saison ist beendet</strong></p>';
      var lastDate = new Date(1970, 0, 1);
      var nextMatchID = '';
      var gamechangerID = '';
      $html.find('tr.wanderers').each(function(index) {
         var $myTD = $(this).find('td');
         var gameDateStr = $myTD.eq(0).text().match(/(\d{2}\.\d{2}\.\d{4})/)[1];
         var gameYear = Number(gameDateStr.substring(6));
         var gameMonth = Number(gameDateStr.substring(3, 5))-1;
         var gameDay = Number(gameDateStr.substring(0, 2));
         var gameDate = new Date(gameYear, gameMonth, gameDay);
         if(gameDate < today) {
            if(gameDate.toString() == lastDate.toString()) {
               var ersterTeil = lastGame.substring(0, lastGame.length-9);
               var zweiterTeil = lastGame.substring(lastGame.length-9, lastGame.length);
               lastGame = ersterTeil + " / " + $myTD.eq(4).text() + zweiterTeil;
            } else {
               lastGame = '<p><strong>' + $myTD.eq(2).text() + '</strong></p>';
               lastGame += '<p><strong>' + $myTD.eq(3).text() + '</strong></p>';
               lastGame += '<p class="ui-li-aside logomove"><h1>' + $myTD.eq(4).text() + '</h1></p>';
               lastDate = gameDate;
            }
         } else {
            if(!foundNext) {
               var Wo = '';
               if($myTD.eq(2).text().indexOf("Wanderers") != -1) Wo = ' im Hoeschpark';
               nextMatchID = $myTD.eq(1).find('a').eq(0).text();
               nextGame = '<p><strong>' + $myTD.eq(2).text() + '</strong></p>';
               nextGame += '<p><strong>' + $myTD.eq(3).text() + '</strong></p>';
               nextGame += '<p>' + $myTD.eq(0).html() + Wo + '</p>';

               nextGame += '<p class="ui-li-aside logomove"><img src="teams/' + getTeamLogo($myTD.eq(2).text(), $myTD.eq(3).text()) + '.png" /></p>';

               foundNext = true;
               lastDate = gameDate;
            }
         }
      });
      
      $('#bundesliga_last').append(lastGame);
      $('#bundesliga_next').append(nextGame);
      nextGame = '<li><h3 class="ui-li-heading">1. Bundesliga</h3>' + nextGame + '</li>';
      $comingup.append(nextGame);

      var foundCurrent = false;
      // Aktuelles Gamechanger-Spiel?
      $.get('../phpproxy/proxy.php', 'url=' + encodeURIComponent(urlGamechanger), function (data) {
         $teams = $(data).find('#teamResults > ul > li');
         $teams.each(function() {
            var teamname = $(this).find('h1').text();
            var season = $(this).find('div.line').text();
            var isLive = $(this).find('div.resultGrid');
            if(teamname.indexOf('Wanderers') != -1 && season.indexOf('2013') != -1) {
               isLive.find('a').each(function() {
                  if($(this).text().indexOf('LIVE') != -1) {
                     foundCurrent=true;
                     gamechangerID = $(this).attr('href').match(/game\-(.*)\/plays/)[1];
                     localStorage[nextMatchID] = gamechangerID;
                     setup_gamechanger(gamechangerID);
                  }
               });
            }
         });
         // kein aktuelles Spiel, aber ein gespeichertes?
         if(!foundCurrent && lastDate.toString() == today.toString() && localStorage[nextMatchID]) {
            gamechangerID = localStorage[nextMatchID];
            setup_gamechanger(gamechangerID);
         }
      });
      
      // in Listview überführen
      var allLI = '';
      $html.find('tr').each(function() {
         var $TD = $(this).find('td');
         var team1 = $TD.eq(2).text();
         var team2 = $TD.eq(3).text();
         var logos = getBothTeamLogos(team1, team2);
         var theTheme = '';
         if($(this).hasClass("wanderers"))
            theTheme = ' data-theme="d"'
         if($TD.eq(4).text() == "") {
            allLI += '<li' + theTheme + '><img src="teams/' + logos[0] + '.png"/><p><strong>' + team1 + '</strong></p><p><strong>' + team2 + '</strong></p><p>' + $TD.eq(0).html() + '</p><p class="ui-li-aside"><img src="teams/' + logos[1] + '.png"/></p></li>';
         } else {
            allLI += '<li' + theTheme + '><img src="teams/' + logos[0] + '.png"/><p><strong>' + team1 + '</strong></p><p><strong>' + team2 + '</strong></p><h3>' + $TD.eq(4).html() + '</h3><p class="ui-li-aside"><img src="teams/' + logos[1] + '.png"/></p></li>';
         }
      });
      $('#bundesligalistview').append(allLI);
      
      $('#bundesligacontent').append('<p class="whitetext">Quelle: DBV</p>');
   }, 'html');
   $.get('../phpproxy/proxy.php', 'url=' + encodeURIComponent(urlBundesligaTab), function(data) {
      $html = $(data).find('.baseball-standing');
      $html.each(function(index) {
         if(index==0) {
            // in Listview überführen
            allLI = '';
            $(this).find('tr').each(function(index) {
               if(index>0) {
                  var $TD = $(this).find('td');
                  var team = $TD.eq(1).text();
                  var siege = $TD.eq(2).text();
                  var niederlagen = $TD.eq(3).text();
                  var pct = $TD.eq(4).text();
                  var gb = $TD.eq(5).text();
                  var logo = getLogo(team);
                  var theTheme = '';
                  if(team.indexOf("Wanderers") != -1)
                     theTheme = ' data-theme="d"'
                  allLI += '<li' + theTheme + '><img src="teams/' + logo + '.png"/><h3 class="ui-li-heading">' + index + '. ' + team + '</h3><p class="smaller">Siege: ' + siege + ' / Niederlagen: ' + niederlagen + ' / pct: ' + pct + '</p><p class="smaller">GB: ' + gb + '</p></li>';
               }
            });
            $('#bundesligatablistview').append(allLI);
         }
      });
      $('#bundesligatabcontent').append('<p class="whitetext">Quelle: DBV</p>');
   }, 'html');
   $.get('../phpproxy/proxy.php', 'url=' + encodeURIComponent(urlRegionalliga), function (data) {
      var $html = $(data).find('.baseball-schedule');
		// wertlosen Content ausschalten
      $html.find('tr').each(function() {
         var myTD = $(this).find('td');
         if(myTD.length == 5) {
            // nur Spalten verstecken, Datum einsetzen
            myTD.eq(0).html(currentDate + '<br/>' + myTD.eq(0).html());
        } else {
            // Datum merken
            // Ganze Zeile löschen
            currentDate = replaceMonth($(this).find('th').html());
            $(this).remove();
        }
      });
      $html.find('td').each(function() {
         if($(this).text().indexOf("Wanderers") != -1) {
            $(this).parent().addClass("wanderers");
         }
      });
      foundNext = false;
      lastGame = '<p><strong>Noch kein Spiel in dieser Saison</strong></p>';
      nextGame = '<p><strong>Reguläre Saison ist beendet</strong></p>';
      lastDate = new Date(1970, 0, 1);
      $html.find('tr.wanderers').each(function(index) {
         var $myTD = $(this).find('td');
         var gameDateStr = $myTD.eq(0).text().match(/(\d{2}\.\d{2}\.\d{4})/)[1];
         var gameYear = Number(gameDateStr.substring(6));
         var gameMonth = Number(gameDateStr.substring(3, 5))-1;
         var gameDay = Number(gameDateStr.substring(0, 2));
         var gameDate = new Date(gameYear, gameMonth, gameDay);
         //console.log($myTD.eq(2).text() + " - " + $myTD.eq(3).text() + ": " + gameDate.toString() + "/" + today.toString() + " = " + (gameDate<today));
         if(gameDate < today) {
            if(gameDate.toString() == lastDate.toString()) {
               var ersterTeil = lastGame.substring(0, lastGame.length-9);
               var zweiterTeil = lastGame.substring(lastGame.length-9, lastGame.length);
               lastGame = ersterTeil + " / " + $myTD.eq(4).text() + zweiterTeil;
            } else {
               lastGame = '<p><strong>' + $myTD.eq(2).text() + '</strong></p>';
               lastGame += '<p><strong>' + $myTD.eq(3).text() + '</strong></p>';
               lastGame += '<p class="ui-li-aside logomove"><h1>' + $myTD.eq(4).text() + '</h1></p>';
               lastDate = gameDate;
            }
         } else {
            if(!foundNext) {
               var Wo = '';
               if($myTD.eq(2).text().indexOf("Wanderers") != -1) Wo = ' im Hoeschpark';
               nextGame = '<p><strong>' + $myTD.eq(2).text() + '</strong></p>';
               nextGame += '<p><strong>' + $myTD.eq(3).text() + '</strong></p>';
               nextGame += '<p>' + $myTD.eq(0).html() + Wo + '</p>';

               nextGame += '<p class="ui-li-aside logomove"><img src="teams/' + getTeamLogo($myTD.eq(2).text(), $myTD.eq(3).text()) + '.png" /></p>';

               foundNext = true;
            }
         }
      });
      $('#regionalliga_last').append(lastGame);
      $('#regionalliga_next').append(nextGame);
      nextGame = '<li><h3 class="ui-li-heading">Regionalliga</h3>' + nextGame + '</li>';
      $comingup.append(nextGame);
      // $('#bundesligacontent').append($html);     
      
      // in Listview überführen
      allLI = '';
      $html.find('tr').each(function() {
         var $TD = $(this).find('td');
         var team1 = $TD.eq(2).text();
         var team2 = $TD.eq(3).text();
         var logos = getBothTeamLogos(team1, team2);
         var theTheme = '';
         if($(this).hasClass("wanderers"))
            theTheme = ' data-theme="d"'
         if($TD.eq(4).text() == "") {
            allLI += '<li' + theTheme + '><img src="teams/' + logos[0] + '.png"/><p><strong>' + team1 + '</strong></p><p><strong>' + team2 + '</strong></p><p>' + $TD.eq(0).html() + '</p><p class="ui-li-aside"><img src="teams/' + logos[1] + '.png"/></p></li>';
         } else {
            allLI += '<li' + theTheme + '><img src="teams/' + logos[0] + '.png"/><p><strong>' + team1 + '</strong></p><p><strong>' + team2 + '</strong></p><h3>' + $TD.eq(4).html() + '</h3><p class="ui-li-aside"><img src="teams/' + logos[1] + '.png"/></p></li>';
         }
      });
      $('#regionalligalistview').append(allLI);
      
      $('#regionalligacontent').append('<p class="whitetext">Quelle: DBV</p>');
   }, 'html');
   $.get('../phpproxy/proxy.php', 'url=' + encodeURIComponent(urlRegionalligaTab), function(data) {
      $html = $(data).find('.baseball-standing');
      $html.each(function(index) {
         if(index==1) {
            // in Listview überführen
            allLI = '';
            $(this).find('tr').each(function(index) {
               if(index>0) {
                  var $TD = $(this).find('td');
                  var team = $TD.eq(1).text();
                  var siege = $TD.eq(2).text();
                  var niederlagen = $TD.eq(3).text();
                  var pct = $TD.eq(4).text();
                  var gb = $TD.eq(5).text();
                  var logo = getLogo(team);
                  var theTheme = '';
                  if(team.indexOf("Wanderers") != -1)
                     theTheme = ' data-theme="d"'
                  allLI += '<li' + theTheme + '><img src="teams/' + logo + '.png"/><h3 class="ui-li-heading">' + index + '. ' + team + '</h3><p class="smaller">Siege: ' + siege + ' / Niederlagen: ' + niederlagen + ' / pct: ' + pct + '</p><p class="smaller">GB: ' + gb + '</p></li>';
               }
            });
            $('#regionalligatablistview').append(allLI);
         }
      });
      $('#regionalligatabcontent').append('<p class="whitetext">Quelle: DBV</p>');
   }, 'html');
   $.get('../phpproxy/proxy.php', 'url=' + encodeURIComponent(urlLandesliga), function (data) {
      getErgebnisseBSV(data, "Landesliga");
   }, 'html');
   $.get('../phpproxy/proxy.php', 'url=' + encodeURIComponent(urlLandesliga), function(data) {
      getTabelleBSV(data, "landesliga");
   }, 'html');
   $.get('../phpproxy/proxy.php', 'url=' + encodeURIComponent(urlSoftball), function (data) {
      getErgebnisseBSV(data, "Softball");
   }, 'html');
   $.get('../phpproxy/proxy.php', 'url=' + encodeURIComponent(urlSoftball), function(data) {
      getTabelleBSV(data, "softball");
   }, 'html');
   $.get('../phpproxy/proxy.php', 'url=' + encodeURIComponent(urlJunioren), function (data) {
      getErgebnisseBSV(data, "Junioren");
   }, 'html');
   $.get('../phpproxy/proxy.php', 'url=' + encodeURIComponent(urlJunioren), function(data) {
      getTabelleBSV(data, "junioren");
   }, 'html');
   $.get('../phpproxy/proxy.php', 'url=' + encodeURIComponent(urlJugend), function (data) {
      getErgebnisseBSV(data, "Jugend");
   }, 'html');
   $.get('../phpproxy/proxy.php', 'url=' + encodeURIComponent(urlJugend), function(data) {
      getTabelleBSV(data, "jugend");
   }, 'html');
   $.get('../phpproxy/proxy.php', 'url=' + encodeURIComponent(urlSchueler), function (data) {
      getErgebnisseBSV(data, "Schueler");
   }, 'html');
   $.get('../phpproxy/proxy.php', 'url=' + encodeURIComponent(urlSchueler), function(data) {
      getTabelleBSV(data, "schueler");
   }, 'html');
   $.get('../phpproxy/proxy.php', 'url=' + encodeURIComponent(urlTeeball), function (data) {
      getErgebnisseBSV(data, "Teeball");
   }, 'html');
   $.get('../phpproxy/proxy.php', 'url=' + encodeURIComponent(urlTeeball), function(data) {
      getTabelleBSV(data, "teeball");
   }, 'html');
});