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
        formStructure = [
            {type:"settings",position:"label-top"},
            {type: "fieldset",name:"calculator", list:[
                {type: "input", name: 'item', label: 'Def.:', position: 'label-left'},
                {type:"newcolumn"},
                {type:"button", name:"search", width:50,offsetTop:2, value:"Go"} 
            ]}
        ];
        var myForm = new dhtmlXForm("form_container",formStructure);
        myForm.attachEvent("onButtonClick", function(name){searchItem(myForm.getItemValue("item"))});
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
            var myList;
            myList = new dhtmlXList({
                container:"data_container",
                type:{
                    template:"html->template_container",
                }
            });
            $('#resultatWiki').remove();
            $(response).find('#resultatWiki').clone().hide().appendTo('body');
            $("span[class^='color']").remove();
            var res = "";
            $('#resultatWiki').find('tbody > tr td').each(function() {
                nom = $(this).text();
                nom = nom.trim();
                lg = nom.length;
                res += nom+"<br>";
                myList.add({
                    name: nom,
                    taille: lg
                    },0)
            });
            $('#resultatWiki').remove();
            $("span[class^='color']").remove();
            $('#resultatWiki').find('tbody > tr td').each(function() {
                nom= $(this).text();
                nom = nom.trim();
                lg = nom.length;
                res += nom+"<br>";
                myList.add({
                    name: nom,
                    taille: lg
                    },0)
            });
            myList.sort("#name#",tri1); 
            console.log("res="+res);
            
            $('#entete').delegate("thead > tr", "click", function(e){
                 if (e.target.innerHTML == 'SOLUTION') {
                    tri1 = ( tri1 == 'asc' ? 'desc' : 'asc');
                    myList.sort("#name#",tri1); 
                 } else {
                    tri2 = ( tri2 == 'asc' ? 'desc' : 'asc');
                    myList.sort("#taille#",tri2);
                 }
            });
            
            
    });
}
