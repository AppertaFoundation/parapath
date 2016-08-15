//Script for Paracetamol Pathway


//called from datepicker5 change, shows time elapsed since ingestion
function updateClock ( ) {

var oddate = $( "#datepicker5" ).datetimepicker('getDate');
var dateNow = new Date();

var seconds = Math.floor(((dateNow)-oddate)/1000);
var minutes = Math.floor(seconds/60);
var hours = Math.floor(minutes/60);
var days = Math.floor(hours/24);

var mins=minutes;
if (minutes>1440){mins=1440};
var ml=(98/1440)*mins;

hours = hours-(days*24);
minutes = minutes-(days*24*60)-(hours*60);
seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);

//add time to timeline
$("#timemarker").css('margin-left', ml+'%');
$("#clock").html(hours+(days*24)+":"+minutes+":"+seconds); 

//change order of pathway if 8hrs have elapsed since ingestion
if (hours>7){
	$("#dosage").insertAfter("#Timeline");
	 
}
	else{
	$("#dosage").insertAfter("#plasmalevel");
}
} 



$(function () {
	
	//Clear previous input values on load

    $('input').each(function() { 
        $(this).val(''); 
    }); 


//create the chart
chart = new Highcharts.Chart({ chart: { renderTo: 'container', type: 'spline'}, 
//add labels and format the chart
            title: {
                text: 'paracetamol Pathway',
                x: -20 //center
            },
            subtitle: {
                text: 'paracetamol Pathway',
                x: -20
            },
            xAxis: {
                categories: ['0hr', '1hr', '2hr', '3hr', '4hr', '5hr', '6hr',
                    '7hr', '8hr', '9hr', '10hr', '11hr', '12hr', '13hr', '14hr', '15hr', '16hr',]
            },
            yAxis: {
                title: {
                    text: 'Plasma-paracetamol Concentration (mg/litre)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: 'mg/l'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
//add the 4 hr 100 treatment line
            series: [{
                name: 'Treatment Line',
                data: [null, null, null, null, 100, 84, 71, 59, 50, 42, 35, 30, 25, 21, 18, 15, 12]
            },
//add empty data series for paracetamol plasma level
{
                name: 'Plasma Line',
                data: []
            }]
        });
    });
    
	
	
	
//calculate the 3 doseages (dose 1,2,3) and rates (r 1,2,3) required based on the inputte weight (w)
function calculatedose ()
{
var w=$("#w1").val()
//maximum weight of 110kg (dosage is at its maximum for Su's of 110kg and above)
if (w>110){w=110};
//Double volume of saline if su is over 40kg
var mf=1
if (w>40){mf=2}
var ICvol1=100*mf
var ICvol2=250*mf
var ICvol3=500*mf
;
//calculate dose and infusion rates
dose1=w*0.75
r1=dose1+ICvol1
rate1=Math.round(r1)
 
dose2=w*0.25
r2=(dose2+ICvol2)/4
rate2=Math.round(r2)
 
dose3=w*0.5
r3=(dose3+ICvol3)/16
rate3=Math.round(r3)
 
// add drip bag images of the correct volume to the dosage tables
$("#firstbag").attr('src','Images/DripBag'+ICvol1+'.png')
$("#secondbag").attr('src','Images/DripBag'+ICvol2+'.png')
$("#thirdbag").attr('src','Images/DripBag'+ICvol3+'.png')
 
//populate dosage tables with volumes and rates
//clear any previous dosage calculations
$(".outputbox").empty()

//add the first infusion dosage and image to the table
$("#fbt1").append(dose1+"ml of Acetylcysteine (each ampule=200mg/ml)<br>");
//add the first infusion carrier for the infusion and image to the table
$("#fbt2").append("In: "+ICvol1+"mls of 5% Glucose (or 0.9% Sodium Chloride)<br>")
//add the first infusion rate to the table
$("#fbt3").append("Infusion Rate: "+rate1+"ml per hour (Duration: 1 Hour)<br>");
//add the second infusion dosage and image to the table
$("#sbt1").append(dose2+"ml of Acetylcysteine (each ampule=200mg/ml)<br>");
//add the second infusion carrier for the infusion and image to the table
$("#sbt2").append("In: "+ICvol2+" mls of 5% Glucose (or 0.9% Sodium Chloride)<br>")
//add the second infusion rate to the table
$("#sbt3").append("Infusion Rate: "+rate2+"ml per hour (Duration: 4 Hours)<br>");
//add the third infusion dosage and image to the table
$("#tbt1").append(dose3+"ml of Acetylcysteine (each ampule=200mg/ml)<br>");
//add the third infusion carrier for the infusion and image to the table
$("#tbt2").append("In: "+ICvol3+" mls of 5% Glucose (or 0.9% Sodium Chloride)<br>")
//add the third infusion rate to the table
$("#tbt3").append("Infusion Rate: "+rate3+"ml per hour (Duration: 16 Hours)<br>");
//make output box visible by drawing borders
$(".box").css({"border":"4px solid lightgrey", "border-radius":"10px", "visibility":"visible",  "height":"auto"});
}



//calculate and plot plasma level
function calculate100 ()
{
//set variables required for half life calulation
var hrs= $("#time").val()
hrs=parseInt(hrs); 
var mins= $("#timemins").val()
mins=parseInt(mins); 
var t
var pc=$("#plasma_concentration").val()
var k=Math.log(2);
var e1=Math.exp(1);
b = 200
h = 4
if(mins>0){ t=hrs+(mins/60)}else{t=hrs; mins=0};

//Calculate the threshold for treatment at the hrs after ingestion entered (time)
e=Math.log(b)-(t*k/h)
e=Math.pow(e1,e)
e=Math.round(e)

//add indication to treat or not to box2
$("#box2").empty();
if (t>4)
{
if (pc>e)
{
$("#box2").append("At "+hrs+" hrs and "+mins+" mins the threshold for treatment is above "+e+"mg/l - therfore treatment is indicated" );
}
else
{
$("#box2").append("At "+hrs+" hrs and "+mins+" mins the threshold for treatment is above "+e+"mg/l - therfore treatment is not indicated" );
}
}
else
{
$("#box2").append("At under 4 hrs Paracteamol Plasma levels are not reliable enough to determine treatment" );
}
//make output box visible by drawing borders
$("#box2").css({"border":"4px solid lightgrey", "border-radius":"10px"});

//caculate and show the actual plasma level line
//create array to hold paracetamol levels
d = new Array(16)

//calculate plasma concentration at 1 hr
e=Math.log(pc/2)+(t*k/h)
e=Math.pow(e1,e)
e=Math.round(e)
pc = e;
pc=parseInt(pc); 

//calculate plasma concentration from 1hr to 16hrs
for (i = 1; i < 17; i++) 
{
e=Math.log(pc*2)-(i*k/h)
e=Math.pow(e1,e)
e=Math.round(e)

//push plasma concentration into array
d[i] = e;
d[i]=parseInt(d[i]); 
}

//add plasma concentration array as a line on the chart
chart.series[1].update({data:[0, d[1],d[2],d[3],d[4],d[5],d[6],d[7],d[8],d[9],d[10],d[11],d[12],d[13],d[14],d[15],d[16]]}); 

//add demographic details to the chart
var name=$("#name").val();
var dob=$("#dob").val();
var nhsno=$("#nhsno").val();
var date=$("#datepicker").val();
var Tstring=(name+"  ( NHS No: "+nhsno+" )  Date: "+date)

//redraw the chart
chart.redraw();
chart.setTitle({text: [Tstring]});
}



$(function() {
	
//datepicker for referrals on
$( ".datepicker6" ).datetimepicker({ dateFormat: 'dd-MM-yy',} );	
$( ".datepicker6" ).hide();
$(".reflabel").hide();
//datepicker function for date of form box
$( "#datepicker" ).datetimepicker({ dateFormat: 'dd-MM-yy',} );
//datepicker function for date of birth box
$( "#datepicker1" ).datetimepicker({ dateFormat: 'dd-MM-yy', changeYear:true, changeMonth:true, yearRange: "-140", maxDate: '0' });
//datepicker function for discontinued infusion box
$( "#datepicker2" ).datetimepicker( { dateFormat: 'dd-MM-yy',});
//datepicker for complete infusion box
$( "#datepicker3" ).datetimepicker({ dateFormat: 'dd-MM-yy',} );
//datepicker for completed blood tests box
$( "#datepicker4" ).datetimepicker({ dateFormat: 'dd-MM-yy',} );
//datepicker for time of ingestion
$( "#datepicker5" ).datetimepicker({ dateFormat: 'dd-MM-yy',
  onSelect: function() {
   setInterval('updateClock()', 1000);
  }
  
});


 $(".referalradio").click(function(event) {
        var rad=(event.target.id);
		if(rad=="intentionalod")
		{$(".datepicker6").hide();
		 $("#liasonpsych").show()
		 $(".reflabel").hide();
		 $("label[for='liasonpsych']").show()
		 }
		 
		 else{
		 $(".datepicker6").show();
		 $("#liasonpsych").hide();
		 $(".reflabel").show();
		 $("label[for='liasonpsych']").hide()
		 }
    });



//function to center div called in jquery
jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}



var element
//add date to blood tests when checked
$(".bloodtests tr td:nth-child(2)") .click(function(){
element = $(this);
$("#completebloodtestbox").css({ "visibility":"visible"});
$( "#completebloodtestbox" ).center();
} );


//close hide bloodtestdate form
$(" #completebloodtestclose").click(function(){
$("#completebloodtestbox").css({ "visibility":"hidden"});
});


//ok bloodtest form
$(" #completebloodtestok").click(function(){
$(element).html($("#datepicker4").val());
if (element.attr("id") == "plasma") { 
//calculate time between ingestion and plasma level
var oddate = $( "#datepicker5" ).datetimepicker('getDate');
var plasmadate = $("#datepicker4").datetimepicker('getDate');

var seconds = Math.floor(((plasmadate)-oddate)/1000);
var minutes = Math.floor(seconds/60);
var hours = Math.floor(minutes/60);
minutes = minutes-(hours*60);

$("#time").val(hours);
$("#timemins").val(minutes);

};
$("#completebloodtestbox").css({ "visibility":"hidden"}) 
});


//make discontinuation form show
$(" .discontboxes").click(function(){
element = $(this);
$("#discontinuedbox").css({ "visibility":"visible"});
$( "#discontinuedbox" ).center();
});


//close hide discontinuation form
$(" #discontclose").click(function(){
$("#discontinuedbox").css({ "visibility":"hidden"});
});


//ok discontinuation form
$(" #discontok").click(function(){
$(element).parent().next().html($("#discontreason").val());
$(element).parent().next().next().html($("#datepicker2").val());
$("#discontinuedbox").css({ "visibility":"hidden"}) 
});


//make completiontion form show
var element
$(" .compboxes").click(function(){
element = $(this);
$("#completebox").css({ "visibility":"visible"});
$( "#completebox" ).center();
});


//close hide completion form
$(" #completeclose").click(function(){
$("#completebox").css({ "visibility":"hidden"});
});


//ok completion form
$(" #completeok").click(function(){
$(element).parent().next().html("Completed");
$(element).parent().next().next().html($("#datepicker3").val());
$("#completebox").css({ "visibility":"hidden"}) 
});




//add slider for weight
    $( "#weightslider" ).slider({
      value:0,
      min: 0,
      max: 200,
      step: 1,
      slide: function( event, ui ) {
        $( "#w1" ).val( ui.value );
//add value to slider handle
$(".wsidecar").remove();
$('#weightslider .ui-slider-handle').append('<span class="wsidecar">'+ui.value+'</span>');
calculatedose();
      }
    });
	
//add scale to weightslider
$( "#weightslider" ).append('<div class = "firstmarker">0</div>');
for (i=10;i<200;i+=10)
{$( "#weightslider" ).append('<span class="marker">'+i+'</span>')};

	
	
	
//add slider for plasma level
    $( "#plasmaslider" ).slider({
      value:0,
      min: 0,
      max: 500,
      step: 1,
      slide: function( event, ui ) {
        $( "#plasma_concentration" ).val( ui.value );
//add value to slider handle
$(".pcsidecar").remove();
$('#plasmaslider .ui-slider-handle').append('<span class="pcsidecar">'+ui.value+'</span>');
//fire the chart update function on slider shange
calculate100()
      }
    });	
	
//add scale to plasmaslider
$( "#plasmaslider" ).append('<div class = "firstmarker">0</div>');
for (i=25;i<500;i+=25)
{$( "#plasmaslider" ).append('<span class="pmarker">'+i+'</span>')};
  });


//Script End
