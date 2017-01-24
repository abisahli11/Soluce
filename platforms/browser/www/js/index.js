/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //dhtmlxInit();
    }
};

var mywin,w1;
var myCarousel;
var tNom=[];
var tLg=[];

function searchItem(item) {
    item= item.replace(' ','*');
    //mygrid.clearAll();
    
    $.ajaxPrefilter( function (options) {
      if (options.crossDomain && jQuery.support.cors) {
        var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
        options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
        //options.url = "http://cors.corsproxy.io/url=" + options.url;
      }
    });
    tNom=[];
    tLg=[];
    $("#tabres tbody").remove();
    $.get(
        'https://www.fsolver.fr/?champ='+item,
        function (response) {
            //alert(response);
    
            $('*#resultatWiki').remove();
            $(response).find('*#resultatWiki').clone().hide().appendTo('body');
            $("span[class^='color']").remove();
            $('*#resultatWiki').find('tbody > tr td').each(function() {
                nom = $(this).text().trim();
                if (tNom.indexOf(nom) === -1) {
                    tNom.push(nom);
                    tLg.push(nom.length);
                }
            });
            $('#resultatWiki').remove();
            $('#resultat').remove();
            $(response).find('#resultat').clone().hide().appendTo('body');
            $('#resultat').find('tbody > tr td').each(function() {
                nom = $(this).text().trim();
                if (tNom.indexOf(nom) === -1) {
                    tNom.push(nom);
                    tLg.push(nom.length);
                }
            });
            afficheTableau();
            $(document).on("click","td.rows", function(e){
                dico(e.target.innerHTML);
            });
    });
    
}

function afficheTableau() {
    //alert ("tableau nb = "+tNom.length);
    for (i=0; i<tNom.length; i++) { 
        $("#tabres").append('<tr><td class="rows">'+tNom[i]+'</td><td style="text-align:center;">'+tLg[i]+'</td></tr>');
    }

}

function tri(item) {
    if (item == 1) {
        var array = tNom.slice();
    } else {
        var array = tLg.slice();
    }
    
    for (i=0; i<array.length; i++) { 
        for (j=i+1; j<array.length-1; j++) {
            if (array[j]<array[i]) {
                inter = array[i];
                array[i]=array[j];
                array[j]=inter;
                nom = tNom[i];
                tNom[i]=tNom[j];
                tNom[j]=nom;
                nb = tLg[i];
                tLg[i]=tLg[j];
                tLg[j]=nb;
                }
            }
        }
    $("#tabres tbody").remove();
    afficheTableau();
}

function dico(nom){ alert(nom);
    mywin = new dhtmlXWindows({
        image_path:"codebase/imgs/"
    });
    mywin.createWindow({
        id:"w1",
        caption:"Definition",
        modal:true,
        left:20,
        top:30,
        width:300,
        height:300,
    });
    mywin.window("w1").button("park").hide();
    mywin.window("w1").button("minmax").hide();
    mywin.window("w1").button("help").show();
    mywin.window("w1").maximize();
    mywin.window("w1").denyResize();
    mywin.window("w1").button("help").attachEvent("onClick", function(){
        myCarousel =  mywin.window("w1").attachCarousel();
        searchImage(nom);
    });
    searchDefinition(nom);
}

function searchDefinition(item) {

    //mygrid.clearAll();

    $.ajaxPrefilter( function (options) {
      if (options.crossDomain && jQuery.support.cors) {
        var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
        options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
        //options.url = "http://cors.corsproxy.io/url=" + options.url;
      }
    });
    
    $.get(
        'http://fr.01reference.com/definition/'+item,
        function (response) {
            //alert(response);
            var html='<div style="width:100%;height:100%;overflow:auto;">';
            html = html + $(response).find('div > .definitions').html();
            /*$(response).find('div > .definitions').each(function() {
                html = html + $(this).html();
            });
            html = html + '</div>';
            //alert(html);*/
            mywin.window("w1").attachHTMLString(html);
    });
}

function searchImage(item) {

    var html="";
    var id;
    var url;
    //alert(item);
    
    $.ajaxPrefilter( function (options) {
      if (options.crossDomain && jQuery.support.cors) {
        var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
        options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
        //options.url = "http://cors.corsproxy.io/url=" + options.url;
      }
    });
    $.get(
        'https://lite.qwant.com/?q='+item+'&t=images&size=small/',
        function (response) {
            //alert(response);
            $(response).find('.imgs').each (function (index) {
                id = myCarousel.addCell();
                url = "http://"+$(this).attr("src");
                //html = "<div style='position: relative; left: 0px; top: 0px; overflow: hidden; width: 100%; height: 100%;'>";
                //html = html + "<img src='"+url+"' border='0' style='width: 100%; height: 100%;'></div>";
                //alert(html);
                //myCarousel.cells(id).attachHTMLString(html);
                myCarousel.cells(id).attachURL(url);
            });
    }); 
}


