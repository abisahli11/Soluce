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
        initDhtmlx();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        $('#frm').submit(function() {
            searchItem(search.value);      
            return false;
        });
    }
};

var myLayout;
var myForm;
var mygrid;
var mywin,w1;
var myCarousel;


function initDhtmlx() {

    myLayout = new dhtmlXLayoutObject({
        parent: document.body,  
        pattern: "2E"           
    });
    
    formStructure = [
        {type: "input", name: "search", label: ""},
        {type:"newcolumn"},
        {type:"button", name:"btgo", width:80, value:"GO"} 
    ];
    myForm = myLayout.cells("a").attachForm(formStructure);
    myLayout.cells("a").hideHeader();
    myLayout.cells("a").setHeight(60);
    
    myForm.attachEvent("onButtonClick", function(id){
        searchItem (myForm.getItemValue("search"));
    });
    
    mygrid = myLayout.cells("b").attachGrid();
    myLayout.cells("b").hideHeader();
    mygrid.setImagePath("../imgs/");
    mygrid.setHeader("Mot,Taille");
    mygrid.setInitWidthsP("80,20");
    mygrid.setColAlign("left,center");
    mygrid.setColTypes("ro,ron");
    mygrid.setColSorting("str,int");
    mygrid.attachEvent("onRowSelect",doOnRowSelected);
    mygrid.init();
}

function searchItem(item) {

    item= item.replace(' ','*');
    mygrid.clearAll();

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

            $('*#resultatWiki').remove();
            $(response).find('*#resultatWiki').clone().hide().appendTo('body');
            $("span[class^='color']").remove();
            $('*#resultatWiki').find('tbody > tr td').each(function() {
                nom = $(this).text();
                nom = nom.trim();
                lg = nom.length;
                addLigne(nom,lg);
            });
            $('#resultatWiki').remove();
            $('#resultat').remove();
            $(response).find('#resultat').clone().hide().appendTo('body');
            $('#resultat').find('tbody > tr td').each(function() {
                nom= $(this).text();
                nom = nom.trim();
                lg = nom.length;
                addLigne(nom,lg);
            });
    });
}

function addLigne(c1,c2) {
    var ids=mygrid.findCell(c1,0);
    if (!ids.length) {
        var newId = mygrid.uid();
        mygrid.addRow(newId,[c1,c2]);
    }
}

function doOnRowSelected(id){
    mywin = new dhtmlXWindows({
        image_path:"../imgs/"
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
        searchImage(mygrid.cellById(id, 0).getValue());
    });
    searchDefinition(mygrid.cellById(id, 0).getValue());
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

    mygrid.clearAll();
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
                html = "<div style='position: relative; left: 0px; top: 0px; overflow: hidden; width: 100%; height: 100%;'>";
                html = html + "<img src='"+url+"' border='0' style='width: 100%; height: 100%;'></div>";
                //alert(html);
                //myCarousel.cells(id).attachHTMLString(html);
                myCarousel.cells(id).attachURL(url);
            });
    }); 
}

