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
        $('#frm').submit(function() {
            $("#myTable tbody tr").remove();
            searchItem(search.value);      
            return false;
        });
    }
};

function searchItem(item) {

    item= item.replace(' ','*');
    
    var tri1 = 'asc';
    var tri2 = 'desc';
    
    $.ajaxPrefilter( function (options) {
      if (options.crossDomain && jQuery.support.cors) {
        var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
        options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
        //options.url = "http://cors.corsproxy.io/url=" + options.url;
      }
    });
    
    $.get(
        'http://www.fsolver.fr/?champ='+item,
        function (response) {
            //alert(response);
            $('#resultatWiki').remove();
            $(response).find('#resultatWiki').clone().hide().appendTo('body');
            $("span[class^='color']").remove();
            var res = "";
            $('#resultatWiki').find('tbody > tr td').each(function() {
                nom = $(this).text();
                nom = nom.trim();
                lg = nom.length;
                addLigne(nom,lg);
            });
            $('#resultatWiki').remove();
            $("span[class^='color']").remove();
            $('#resultatWiki').find('tbody > tr td').each(function() {
                nom= $(this).text();
                nom = nom.trim();
                lg = nom.length;
                addLigne(nom,lg);
            });
    });
}

function addLigne(c1,c2) {

    var tableau = document.getElementById("myTable");
    
    var ligne = tableau.insertRow(-1);
    
    var colonne1 = ligne.insertCell(0);
    colonne1.innerHTML += c1;
    
    var colonne2 = ligne.insertCell(1);
    colonne2.innerHTML += c2;
    
}
