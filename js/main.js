$(document).ready(function () {

    function processData(raw) {
        var rawLines = raw.split(/\r\n|\n/);
        var headers = rawLines[0].split(',');
        var lines = [];
    
        for (var i=1; i<rawLines.length; i++) {
            var data = rawLines[i].split(',');
            if (data.length == headers.length) {
    
                var tarr = {};
                for (var j=0; j<headers.length; j++) {
                    tarr[headers[j]] = data[j];
                }
                lines.push(tarr);
            }
        }

        $(lines).each(function(){
            $('#cities').append('<option data-tokens="'+this.city+'" data-long="'+this.longitude+'" data-lat="'+this.latitude+'" value="'+this.city+'">'+this.city+', '+this.country+'</option>');
        });

        $('#cities').selectpicker();
    }


    function weekDay(dt){

        var weekdays = new Array(7);
        weekdays[0] = "Sun";
        weekdays[1] = "Mon";
        weekdays[2] = "Tue";
        weekdays[3] = "Wed";
        weekdays[4] = "Thu";
        weekdays[5] = "Fri";
        weekdays[6] = "Sat";
        var r = weekdays[dt.getDay()];

        return r;
    }

    function weatherD(weather){

        var display = new Array(7);
        display['clear'] = "Clear";
        display['cloudy'] = "Cloudy";
        display['fog'] = "Foggy";
        display['humid'] = "Humid";
        display['ishower'] = "Isolated SHowers";
        display['lightrain'] = "Light Rain";
        display['lightsnow'] = "Light Snow";
        display['mcloudy'] = "Mostly Cloudy";
        display['oshower'] = "Occasional Showers";
        display['pcloudy'] = "Partly Cloudy";
        display['rain'] = "Rain";
        display['rainsnow'] = "Mixed";
        display['snow'] = "Snow";
        display['tsrain'] = "Thunderstorm";
        display['tstorm'] = "Thunderstorm Possible";
        display['windy'] = "Windy";
        var wthr = display[weather];

        return wthr;
    }

    function cleanData(data){

        const cdata = JSON.parse(data);

        var html = '';

        $(cdata.dataseries).each(function(){

            var cdate = this.date.toString();

            //reformat date
            var initY = cdate.substr(0, 4);
            var initM = parseInt(cdate.substr(4, 2));
            var initD = cdate.substr(6, 2);

            var dt = new Date(initY+'/'+initM+'/'+initD);  

            var day = weekDay(dt);
            var mm = parseInt(dt.getMonth())+1;
            var dd = dt.getDate();

            //temps

            var high = this.temp2m.max+'ºC';
            var low = this.temp2m.min+'ºC';

            //weather

            var wr = this.weather;

            //cleandata

            html = html + '<div class="day-box px-2 py-4 bg-white text-dark"><div class="day d-block text-center h3 mb-2"><span class="d-block h5">'+day+'</span>'+mm+'/'+dd+'</div><div class="weather-img"><img src="/images/icons/'+wr+'.png"><span class="text-center d-block fw-bold text-uppercase wr">'+weatherD(wr)+'</span></div><span class="temp d-block text-center mt-3">High: '+high+'<br>Low: '+low+'</span></div>';

        });

        $('.result-box').html(html);
        

    }


    
    function coords(lat,long){
        

        var dataset = $.get( "http://www.7timer.info/bin/api.pl?lon="+long+"&lat="+lat+"&product=civillight&output=json&tzshift=0", function(data) {
            var dlist = data;
            cleanData(dlist);
            })
            .fail(function() {
                alert( "Error occured. Please contact the systems administrator." );
            });
        
    }
  
    $.ajax({
        type: "GET",
        url: "city_coordinates.csv",
        dataType: "text",
        success: function(data) {processData(data);}
    });


    $('select').on('change', function(e){
        var long = $(this).find("option:selected").data('long');
        var lat = $(this).find("option:selected").data('lat');
        coords(lat,long);

    });
     

});